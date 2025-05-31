import mongoose, { Schema } from "mongoose";

const languageSchema = new Schema({
    language: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
});

export const Language = mongoose.model("Language", languageSchema);


