import mongoose, { Schema } from "mongoose";

const educationFieldSchema = new Schema({
  educationField: {
    type: String,
    required: true,
    unique: false,
    lowercase: true,
  },
});

export const EducationField = mongoose.model(
  "EducationField",
  educationFieldSchema,
);
