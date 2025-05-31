import { Counter } from "../models/counter.model.js";

const generateUserID = async () => {
    const prefix = 'BM';
    const counter = await Counter.findOneAndUpdate(
        { name: 'userID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const userID = prefix + counter.seq.toString().padStart(7, '0');
    return userID;
};
export { generateUserID } 
