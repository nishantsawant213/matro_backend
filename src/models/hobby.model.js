import mongoose, { Schema } from "mongoose";

const hobbySchema = new Schema({
  hobbiecategory: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  hobbie: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

export const Hobby = mongoose.model("Hobbycategories", hobbySchema);
