import dotenv from "dotenv"
import {app} from './app.js'



import connectDB from "./db/index.js";
dotenv.config({
    path:'./.env'
})
connectDB().then(()=>{
    app.on("error",(error)=>{
                    console.log("ERR: ", error);
                     throw error
                 })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`sERVER IS RUNNING ON PORT:${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("Mongo db connention failed! ! !",err);
})







// import express from "express"
// const app= express();

// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/$
//         {DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERR: ", error);
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`APP is listening on port ${process.env.PORT}`);
//         })

//     } catch (error){
//         console.error("Error: ",error)
//         throw error
//     }
// })()