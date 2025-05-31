import mongoose, { Schema } from "mongoose";
import { Language } from "./language.model.js";
import { Hobby } from "./hobby.model.js";
import { EmployeeType } from "./employee.model.js";
import { Occupation } from "./occupation.model.js";
import { EducationField } from "./educationField.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { profileCreatedByMetaData,commonAnnualIncomeRangesInIndiaMetaData,  maritalStatusMetaData, physicalStatusMetaData , bodyTypeMetaData, eatingHabitsMetaData , drinkingHabitsMetaData, smokingHabitsMetaData, familyTypeMetaData, familyStatusMetaData, bloodGroupMetaData} from "../constants.js";
const minMaxPreferenceSchema = new Schema({
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
});


const addressSchema = new Schema({
  address: {
    type: String,
    unique: true,
    lowercase: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});


const educationSchema = new Schema({
  educationField: {
    type: Schema.Types.ObjectId,
    ref: "EducationField",
    required: true,
  },
  educationDetails:{
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  completedYear: {
    type: Number,
    required: true,
  },
});


const userSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      sparse: true,
      lowercase: true,
      trim: true
    },
    isEmailVerified: {
      type: Boolean,
      //required: true,
      default: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    height: {
      type: Number,
    },
    maritalStatus: {
      type: String,
      required: false,
      enum: maritalStatusMetaData,
    },

    noOfChildrens: {
      type: Number,
    },
    motherTongue: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Language",
    },
    physicalStatus: {
      type: String,
      enum: physicalStatusMetaData,
      //required: true
    },
    physicalChallengedDetails: { type: String },
    weight: { type: Number, min: 38 },
    bodyType: {
      type: String,
      enum: bodyTypeMetaData,
    },
    languagesKnown: [
      {
        type: Schema.Types.ObjectId,
        ref: "Language",
      },
    ],
    profileCreatedBy: {
      type: String,
      enum: profileCreatedByMetaData,
      //required: true
    },
    aboutMe: { type: String },
    highestEducation: {
      type: educationSchema,
      //required: true
    },
    employedIn: {
      type: Schema.Types.ObjectId,
      ref: "employeeType",
      //required: true
    },
    occupation: {
      type: Schema.Types.ObjectId,
      ref: "Occupation",
      //required: true
    },
    organizationName: {
      type: String,
    },
    occupationDetails: {
      type: String,
    },
    annualIncome: {
      type: Number,
      // required: true
    },
    citizenship: {
      type: String,
      // required: true,
    },
    currentAddress: {
      type: addressSchema,
      //required: true
    },
    nativePlaceAddress: {
      type: addressSchema,
      //required: true
    },
    workPlaceAddress: {
      type: addressSchema,
      //required: true
    },
    religonsInformation: {
      type: String,
    },
    hobbies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hobby",
      },
    ],
    eatingHabits: {
      type: String,
      // required: true,
      enum: eatingHabitsMetaData,
    },
    drinkingHabits: {
      type: String,
      //required: true,
      enum: drinkingHabitsMetaData,
    },
    smokingHabits: {
      type: String,
      //required: true,
      enum: smokingHabitsMetaData,
    },
    familyType: {
      type: String,
      enum: familyTypeMetaData,
    },
    noOfMembers: {
      type: Number,
    },
    familyStatus: {
      type: String,
      enum: familyStatusMetaData,
    },
    fatherName: {
      type: String,
    },
    fathersOccupation: {
      type: String,
    },
    mothersName: {
      type: String,
    },
    mothersOccupation: {
      type: String,
    },
    familyOrigin: {
      type: String,
    },
    noOfBrothers: {
      type: Number,
    },
    noOfBrothersMarried: {
      type: Number,
    },
    noOfSisters: {
      type: Number,
    },
    noOfSistersMarried: {
      type: Number,
    },
    aboutMyFamily: {
      type: String,
    },
    propertyDetails: {
      type: String,
    },
    aboutPreferedpartner: {
      type: String,
      //required: true
    },
    maritalStatusPreferences: {
      type: [String],
      //required: true,
      enum: maritalStatusMetaData,
    },
    noOfChildrensPreferences: {
      type: minMaxPreferenceSchema,
    },
    agePreferences: {
      type: minMaxPreferenceSchema,
      //required: true
    },
    heightPreferences: {
      type: minMaxPreferenceSchema,
      //required: true
    },
    bodyTypePreferences: [
      {
        type: String,
        enum: bodyTypeMetaData,
      }
    ],
    weightPreferences: {
      type: minMaxPreferenceSchema,
      //required: true
    },
    motherTonguePreferences: [
      {
        type: Schema.Types.ObjectId,
        //required: true,
        ref: "Language",
      },
    ],
    physicalStatusPreferences: {
      type: String,
      enum: physicalStatusMetaData,
    },
    highestEducationPreferences: [
      {
        type: Schema.Types.ObjectId,
        ref: "EducationField",
      },
    ],
    occupationPreferences: [
      {
        type: Schema.Types.ObjectId,
        ref: "Occupation",
      },
    ],
    annualIncomePreferences: {
      type:String,
      enum: commonAnnualIncomeRangesInIndiaMetaData
      
    },
    citizenshipPreferences: [
      {
        type: String,
      },
    ],
    languagesKnownPreferences: [
      {
        type: Schema.Types.ObjectId,
        ref: "Language",
      },
    ],
    canBeNRIPreference: {
      type: Boolean,
    },
    currentCityPreferences: [
      {
        type: String,
      },
    ],
    employedInPreferences: [{
      type: String,
      ref: "employeeType",
      //required: true
    }],
    nativePlaceCityPreferences: [
      {
        type: String,
      },
    ],
    workPlaceCityPreferences: [
      {
        type: String,
      },
    ],
    eatingHabitsPreferences: [
      {
        type: String,
        enum: eatingHabitsMetaData,
      },
    ],
    drinkingHabitsPreferences: {
      type: String,
      enum: drinkingHabitsMetaData,
    },
    smokingHabitsPreferences: {
      type: String,
      //required: true,
      enum: smokingHabitsMetaData,
    },
    isRegistrationComplete: {
      type: Boolean,
    },
    registrationLevel: {
      type: Number
    },
    livingWithFamily: {
      type: Boolean
    },
    livingWithFamilyPreferences: [
      { type: String }
    ],
    bloodGroup: {
      type: String,
      enum: bloodGroupMetaData, // optional, to restrict possible values
      required: false // optional, if blood group is mandatory
    },
    refreshToken: {
      type: String
    },
  },
  { timestamps: true },
);

// Create the User model

// userSchema.plugin()

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next;
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      mobileNo: this.mobileNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
