import mongoose, { Schema } from "mongoose";

const occupationSchema = new Schema({
    occupation: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }
});

export const Occupation = mongoose.model("Occupation", occupationSchema);
