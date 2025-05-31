import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema({
    country: {
        type: String,
        required: true,
        lowercase: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

export const Location = mongoose.model("location", locationSchema);