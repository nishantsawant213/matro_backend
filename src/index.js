// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at Port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB Connection Failed", err);
})


// (async()=>{
//     try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//     } catch (error) {
//         console.log("Erro Occured : ", error);
//     }
// })()
