import mongoose, { Schema } from "mongoose";


const tempUserSchema = new Schema({
    mobileNo: { type: Number, required: true, unique: true },
    otpHash: { type: String, required: false },
    otpExpiresAt: { type: Date, required: false },
    // firstName: { type: String, required: false, },
    // lastName: { type: String, required: false, },
    // dateOfBirth: { type: Date, required: false, },
    // gender: {
    //     type: String,
    //     required: false,
    //     enum: ["male", "female"],
    // },
    // password:  {
    //     type: String,
    //     required: true,
    //   },
})

// const tempUserSchema = new mongoose.Schema({

// });

export const TempUser = mongoose.model("TempUser", tempUserSchema);