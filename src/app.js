import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";



const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))                                           // to take input file of json
app.use(express.urlencoded({extended:true,limit:"16kb"}))                       // to take input from  url
app.use(express.static("publilc"))                                              //to store image file in puclic
app.use(cookieParser())                                                         //to store cokkies at server                    




export {app}