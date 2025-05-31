import { asyncHandler } from "../utils/asyncHandler.js";
import { Language, } from "../models/language.model.js";
import { Hobby } from "../models/hobby.model.js";
import { EmployeeType } from "../models/employee.model.js";
import { Occupation } from "../models/occupation.model.js";
import { EducationField } from "../models/educationfield.model.js";
import { Location } from "../models/location.model.js";

import {
  profileCreatedByMetaData,
  maritalStatusMetaData,
  physicalStatusMetaData,
  bodyTypeMetaData,
  eatingHabitsMetaData,
  drinkingHabitsMetaData,
  smokingHabitsMetaData,
  familyTypeMetaData,
  familyStatusMetaData,
  bloodGroupMetaData,
  commonAnnualIncomeRangesInIndiaMetaData
} from "../constants.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const metaData1 = asyncHandler(async (req, res) => {
  const metaData = {
    profileCreatedByMetaData,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, metaData, "Meta Data successfully get"));
});

const metaData2 = asyncHandler(async (req, res) => {

    const languages = await Language.find();
    const hobbyies = await Hobby.find();
    const employeeTypes = await EmployeeType.find();
    const occupations = await Occupation.find();
    const educationFields = await EducationField.find();
    const locations = await Location.find();


  const metaData = {
    maritalStatusMetaData,
    physicalStatusMetaData,
    bodyTypeMetaData,
    eatingHabitsMetaData,
    drinkingHabitsMetaData,
    smokingHabitsMetaData,
    familyTypeMetaData,
    familyStatusMetaData,
    bloodGroupMetaData,
    commonAnnualIncomeRangesInIndiaMetaData,
    languages,
    hobbyies ,
    employeeTypes,
    occupations,
    educationFields,
    locations
  };

  return res
    .status(200)
    .json(new ApiResponse(200, metaData, "Meta Data successfully get"));
});
export { metaData1, metaData2 };
