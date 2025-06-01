import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { TempUser } from "../models/tempUser.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateUserID } from "../utils/generateUserID.js";
import { generateOTP, sendOTP } from "../utils/generateOtp.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();
    console.log(accessToken, refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access or Refresh Token",
    );
  }
};

const loginSendOTP = asyncHandler(async (req, res) => {
  const { mobileNo } = req.body;

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY));

  let user = await User.findOne({ mobileNo });
  let tmepUser;

  if (!user) {

    return res.status(404).json(new ApiError(404, "User Not Foumd for given number"));


  } else {
    await TempUser.findOneAndDelete({  mobileNo })
    tmepUser = new TempUser({ mobileNo, otpHash, date: otpExpiresAt });
  }

  tmepUser.save();
  await sendOTP(mobileNo, otp);

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Mobile number sent successfully"));
})

const verifyLogin = asyncHandler(async (req, res) => {
  const { mobileNo, otp } = req.body;
  const tempUser = await TempUser.findOne({ mobileNo });
  let user = await User.findOne({ mobileNo });

  if (!user || !tempUser || !tempUser.otpHash) {
    return res.status(400).json(new ApiError(400, "Invalid request"));
  }
  const isMatch = await bcrypt.compare(otp, tempUser.otpHash);
  if (!isMatch || tempUser.otpExpiresAt < new Date()) {
    return res.status(400).json(new ApiError(400, "Invalid or expired OTP"));
  }

  await TempUser.findByIdAndDelete(tempUser.id);

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );

})

const registerUser = asyncHandler(async (req, res) => {
  const {
    password,
    mobileNo,
    email,
    firstName,
    middleName,
    lastName,
    photos,
    dateOfBirth,
    gender,
    height,
    maritalStatus,
    noOfChildrens,
    motherTongue,
    physicalStatus,
    physicalChallengedDetails,
    weight,
    bodyType,
    languagesKnown,
    profileCreatedBy,
    aboutMe,
    highestEducation,
    employedIn,
    occupation,
    organizationName,
    occupationDetails,
    annualIncome,
    citizenship,
    currentAddress,
    nativePlaceAddress,
    religonsInformation,
    hobbies,
    eatingHabits,
    drinkingHabits,
    smokingHabits,
    familyType,
    noOfMembers,
    familyStatus,
    fatherName,
    fathersOccupation,
    mothersName,
    mothersOccupation,
    familyOrigin,
    noOfBrothers,
    noOfBrothersMarried,
    noOfSisters,
    noOfSistersMarried,
    aboutMyFamily,
    propertyDetails,
    aboutPreferedpartner,
    maritalStatusPreferences,
    noOfChildrensPreferences,
    agePreferences,
    heightPreferences,
    weightPreferences,
    motherTonguePreferences,
    physicalStatusPreferences,
    highestEducationPreferences,
    occupationPreferences,
    annualIncomePreferences,
    citizenshipPreferences,
    canBeNRIPreference,
    currentCityPreferences,
    nativePlaceCityPreferences,
    hobbiesPreferences,
    eatingHabitsPreferences,
    drinkingHabitsPreferences,
    smokingHabitsPreferences,
  } = req.body;
  console.log(password);

  if (
    [
      firstName,
      lastName,
      email,
      mobileNo,
      password,
      dateOfBirth,
      gender,
      height,
      maritalStatus,
      noOfChildrens,
      motherTongue,
      physicalStatus,
      physicalChallengedDetails,
      weight,
      bodyType,
      languagesKnown,
      profileCreatedBy,
      aboutMe,
    ].some((field) => typeof field === "string" && field.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({
    $or: [{ mobileNo }, { email }],
  });
  console.log(existedUser);

  if (existedUser) {
    return res.status(409).json(new ApiError(409, "User Already Exists"));
  }

  const userID = await generateUserID();

  const user = await User.create({
    userID,
    firstName,
    middleName,
    lastName,
    email,
    password,
    mobileNo,
    dateOfBirth,
    gender,
    height,
    maritalStatus,
    motherTongue,
    physicalStatus,
    physicalChallengedDetails,
    weight,
    bodyType,
    languagesKnown,
    profileCreatedBy,
    aboutMe,
    highestEducation,
    employedIn,
    occupation,
    occupationDetails,
    annualIncome,
    citizenship,
    currentAddress,
    nativePlaceAddress,
    religonsInformation,
    hobbies,
    drinkingHabits,
    smokingHabits,
    familyType,
    noOfMembers,
    familyStatus,
    fatherName,
    fathersOccupation,
    mothersName,
    mothersOccupation,
    familyOrigin,
    noOfBrothers,
    noOfBrothersMarried,
    noOfSisters,
    noOfSistersMarried,
    aboutMyFamily,
    propertyDetails,
    aboutPreferedpartner,
    maritalStatusPreferences,
    noOfChildrensPreferences,
    agePreferences,
    heightPreferences,
    weightPreferences,
    motherTonguePreferences,
    physicalStatusPreferences,
    highestEducationPreferences,
    occupationPreferences,
    annualIncomePreferences,
    citizenshipPreferences,
    canBeNRIPreference,
    currentCityPreferences,
    nativePlaceCityPreferences,
    hobbiesPreferences,
    eatingHabitsPreferences,
    drinkingHabitsPreferences,
    smokingHabitsPreferences,
  });

  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("languagesKnown");

  if (!createdUser) {
    return res.status(500).json(new ApiError(500, "Something Went Wrong while registrating the user"));
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User regestered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, mobileNo, password } = req.body;

  if (!email && !mobileNo) {
    return res.status(400).json(new ApiError(400, "Email or mobile number is required"));
  }

  const user = await User.findOne({
    $or: [{ email, mobileNo }],
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist"));

  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(404).json(new ApiError(404, "Email or password is incorrect"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, "Invalid old Password"));
  }

  user.password = newPassword;
  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully"));
});

const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "current user fetched Successfully");
});



export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  currentUser,
  loginSendOTP,
  verifyLogin,
  generateAccessAndRefreshTokens
};

