import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { TempUser } from "../../models/tempUser.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { generateUserID } from "../../utils/generateUserID.js";
import { generateOTP, sendOTP } from "../../utils/generateOTp.js";
import { generateAccessAndRefreshTokens } from "../user.controller.js"
import bcrypt from "bcrypt";

const registerNewUser = asyncHandler(async (req, res) => {

    const { mobileNo } = req.body;

    // Validate mobileNo

    console.log(typeof mobileNo)   ;
    // Check if mobileNo is a number and not a string

    if(  mobileNo === undefined ||
        mobileNo === null){
             return res.status(400).json(new ApiError(400, "Mobile number is Required"));
    }
    if (
      
        typeof mobileNo !== "number" ||
        !Number.isInteger(mobileNo)
    ) {
        return res.status(400).json(new ApiError(400, "Mobile number must be a number"));
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiryMs = parseInt(process.env.OTP_EXPIRY, 10); 
    const otpExpiresAt = new Date(Date.now() + otpExpiryMs);

    let existedUser = await User.findOne({ mobileNo });

    if (existedUser) {
        return res.status(409).json(new ApiError(409, "User already exists"));
    }

    await TempUser.findOneAndDelete({ mobileNo })
    const tempUser = new TempUser({ mobileNo, otpHash, otpExpiresAt });
    
    await tempUser.save();
    await sendOTP(mobileNo, otp);
    
    return res
        .status(201)
        .json(new ApiResponse(200, {}, "OTP sent successfully"));

});

const verifyRegisterOTP = asyncHandler(async (req, res) => {
    const {
        otp,
        profileCreatedBy,
        mobileNo,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        password
    } = req.body;

    if ([profileCreatedBy, otp, mobileNo, firstName, lastName, dateOfBirth, gender, password].some((field) => typeof field === "string" && field.trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const tempUser = await TempUser.findOne({ mobileNo });
    let existedUser = await User.findOne({ mobileNo });

    if (existedUser || !tempUser || !tempUser.otpHash) {
        return res.status(400).json(new ApiError(400, "Invalid request"));
    }

    const isMatch = await bcrypt.compare(otp, tempUser.otpHash);
    if (!isMatch || tempUser.otpExpiresAt < new Date()) {
        return res.status(400).json(new ApiError(400, "Invalid or expired OTP"));
    }

    await TempUser.findByIdAndDelete(tempUser.id);

    const userID = await generateUserID();

    const user = await User.create({
        userID,
        mobileNo,
        mobileNo,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        password,
        profileCreatedBy,
        isRegistrationComplete: false,
        registrationLevel: 1
    });

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown"); 


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id,
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
                { user: createdUser, accessToken, refreshToken },
                "User created successfully",
            ),
        );

})


const userPersonDetailsUpdate = asyncHandler(async (req, res) => {
    const {
        height,
        weight,
        maritalStatus,
        noOfChildrens,
        motherTongue,
        physicalStatus,
        physicalChallengedDetails,
        bodyType,
        languagesKnown,
        citizenship,
        bloodGroup,
        isregistration,
        currentAddress,
        nativePlaceAddress
    } = req.body;

    // Find user by ID
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
    }

    // Update user fields
    Object.assign(user, {
        height,
        weight,
        maritalStatus,
        noOfChildrens,
        motherTongue,
        physicalStatus,
        physicalChallengedDetails,
        bodyType,
        languagesKnown,
        citizenship,
        bloodGroup,
        currentAddress,
        nativePlaceAddress
    });

    if(isregistration){
        user.registrationLevel = 2
    }
    // Save user without validation checks
    
    await user.save({ validateBeforeSave: false });

    console.log("User details updated successfully");
    const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown");   

    return res.status(200).json(new ApiResponse(200,updatedUser, "User details updated successfully"));
});


const updateeducationdetails = asyncHandler(async (req, res) => {
    const {
        highestEducation,
        employedIn,
        occupation,
        organizationName,
        occupationDetails,
        annualIncome,
        isregistration
    } = req.body;

    const user = await User.findById(req.user?._id);


    // Update user fields
    Object.assign(user, {
        highestEducation,
        employedIn,
        occupation,
        organizationName,
        occupationDetails,
        annualIncome,
    });

    if(isregistration){
        user.registrationLevel = 3
    }
    // Save user without validation checks
    await user.save({ validateBeforeSave: false });

    console.log("User details updated successfully");
    const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown"); 

    return res.status(200).json(new ApiResponse(200,updatedUser, "User details updated successfully"));

})

const updateFamilyDetails = asyncHandler(async (req, res) => {
    const {
        livingWithFamily,
        familyType,
        noOfMembers,
        familyStatus,
        fatherName,
        fathersOccupation,
        mothersName,
        mothersOccupation,
        noOfBrothers,
        noOfBrothersMarried,
        noOfSisters,
        noOfSistersMarried,
        aboutMyFamily,
        propertyDetails,
        isregistration
    } = req.body;

    const user = await User.findById(req.user?._id);


    // Update user fields
    Object.assign(user, {
        livingWithFamily,
        familyType,
        noOfMembers,
        familyStatus,
        fatherName,
        fathersOccupation,
        mothersName,
        mothersOccupation,
        noOfBrothers,
        noOfBrothersMarried,
        noOfSisters,
        noOfSistersMarried,
        aboutMyFamily,
        propertyDetails,
    });

    if(isregistration){
        user.registrationLevel = 4
    }
    // Save user without validation checks
    await user.save({ validateBeforeSave: false });

    console.log("User details updated successfully");
    const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown");   

    return res.status(200).json(new ApiResponse(200,updatedUser, "User details updated successfully"));

})

const updatePreferences = asyncHandler(async (req, res) => {
    const {
        maritalStatusPreferences,
        noOfChildrensPreferences,
        agePreferences,
        heightPreferences,
        bodyTypePreferences,
        motherTonguePreferences,
        physicalStatusPreferences,
        highestEducationPreferences,
        employedInPreferences,
        occupationPreferences,
        annualIncomePreferences,
        currentCityPreferences,
        isregistration
    } = req.body;


    const user = await User.findById(req.user?._id);
    // Update user fields
    Object.assign(user, {
        maritalStatusPreferences,
        noOfChildrensPreferences,
        agePreferences,
        heightPreferences,
        bodyTypePreferences,
        motherTonguePreferences,
        physicalStatusPreferences,
        highestEducationPreferences,
        employedInPreferences,
        occupationPreferences,
        annualIncomePreferences,
        currentCityPreferences,
    });

    if(isregistration){
        user.registrationLevel = 5
    }
    // Save user without validation checks
    await user.save({ validateBeforeSave: false });

    console.log("User details updated successfully");
    const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown");    

    return res.status(200).json(new ApiResponse(200,updatedUser, "User details updated successfully"));

    
})

const updateAdvancePreferences = asyncHandler(async (req, res) => {
    const {
        weightPreferences,
        nativePlaceCityPreferences,
        citizenshipPreferences,
        canBeNRIPreference,
        livingWithFamilyPreferences,
        eatingHabitsPreferences,
        drinkingHabitsPreferences,
        hobbiesPreferences,
        smokingHabitsPreferences,
        isregistration
    } = req.body;
    console.log(password);


    const user = await User.findById(req.user?._id);
    // Update user fields
    Object.assign(user, {
        weightPreferences,
        nativePlaceCityPreferences,
        citizenshipPreferences,
        canBeNRIPreference,
        livingWithFamilyPreferences,
        eatingHabitsPreferences,
        drinkingHabitsPreferences,
        hobbiesPreferences,
        smokingHabitsPreferences,
    });

    if(isregistration){
        user.registrationLevel = 5
    }
    // Save user without validation checks
    await user.save({ validateBeforeSave: false });

    console.log("User details updated successfully");
    const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown");   

    return res.status(200).json(new ApiResponse(200,updatedUser, "User details updated successfully"));

    
})


const updateotherInformation = asyncHandler(async (req, res) => {


    const {
        hobbies,
        eatingHabits,
        drinkingHabits,
        smokingHabits,
        aboutPreferedpartner,
        aboutMe,
        isregistration
    } = req.body;


    const user = await User.findById(req.user?._id);
    // Update user fields
    Object.assign(user, {
        hobbies,
        eatingHabits,
        drinkingHabits,
        smokingHabits,
        aboutPreferedpartner,
        aboutMe,
    });

    if(isregistration){
        user.registrationLevel = 5
    }
    // Save user without validation checks
    await user.save({ validateBeforeSave: false });

    console.log("User details updated successfully");
    const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("motherTongue")
    .populate("employedIn")
    .populate("motherTonguePreferences")
    .populate("highestEducationPreferences")
    .populate("occupationPreferences")
    .populate("employedInPreferences")
    .populate("languagesKnown");   

    return res.status(200).json(new ApiResponse(200,updatedUser, "User details updated successfully"));

    
})


export {
    registerNewUser,
    verifyRegisterOTP,
    userPersonDetailsUpdate,
    updateeducationdetails,
    updateFamilyDetails,
    updatePreferences,
    updateAdvancePreferences,
    updateotherInformation
};

    