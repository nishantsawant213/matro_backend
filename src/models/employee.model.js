import mongoose, { Schema } from "mongoose";

const employeeTypeSchema = new Schema({
    employeetype: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }
});

export const EmployeeType = mongoose.model("employeeType", employeeTypeSchema);
