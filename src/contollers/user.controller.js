import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudanary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";




const registerUser= asyncHandler(async (req,res)=>{
    //get fetail from fronted
    //validation- not empty
    //chaeck already exist: by username and email
    //check for image and avatar
    //upload on cloudanary
    // create object - create entry in db
    //remove pssswrd and refresh token feild
    //check for use creatiion
    //return res
    //1
    const{fullname,email, username,password}=req.body;
    console.log("email", email);
    // if(fullname==""){
    //     throw new ApiError(400,"full name is empty")
    // }
    if([fullname,email,username,password].some((feild)=>
        feild?.trim()==="")
    ){
        throw new ApiError(400,"All feild is requied")
    }
    //2
    const exisedUser=User.findOne({         //to check user exixted use db to check
        $or:[{username},{email}]
    })
    if(exisedUser){
        throw new ApiError(409,"already exist")
    }
    //3
    //midlleware also add some feild in body
    const avatarlocalPath=req.files?.avatar[0]?.path ;   // get file from multer
    const coverImagelocalPath=req.files?.coverImage[0]?.path ;
    if(!avatarlocalPath){
        throw new ApiError(400,"avatar is required")
    }
    if(!coverImagelocalPath){
        throw new ApiError(400,"coverImage is required")
    } //4
    const avatar=await uploadOnCloudanary(avatarlocalPath)
    const coverImage=await uploadOnCloudanary(coverImagelocalPath)
    if(!avatarlocalPath){
        throw new ApiError(400,"avatar is required")
    }
    if(!coverImagelocalPath){
        throw new ApiError(400,"coverImage is required")
    }
    //5
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        //coverImage:coverImage?.url ||"",  //if cover image is optional
        coverImage:coverImage.url,
        email,
        password,
        username:username.toLowerCase()

    })
    //6
    const createdUser=await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong")

    }
    return res.status(201).json(
        new ApiResponse(200, createdUser,"user registerd succsessfully")
    )



})
export {registerUser}