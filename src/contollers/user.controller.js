import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudanary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccesTokenAndRefreshToken= async(userId)=>{
    try{
        const user=findOne(userId)
        const accesToken=generateAccesToken();
        const  refreshToken= generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save( {ValidateBeforeSave:false})
        return {accesToken,refreshToken};

    }catch(error){
        throw new ApiError(500,"some thisng went wrong on genrating refresh and acces token")
    }
}

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
        $or:[{username},{email}]  //check email or usename
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
const loginUser=asyncHandler(async(req,res)=>{
    //logincredential from user req body->data
    // username or email from body
    //serch user mane of body in DB
    //compare psswrd of user and db
     
    //match from database
    //store in token
    //send cookie
    //1
    const {username,email,password}=req.body;
    if(!(username || email)){
        throw new ApiError(400, "username or email is required")
    }
    //2
    const user= await User.findOne({
        $or: [{username},{email}]
    })
    //3
    if(!user){
        throw new ApiError(400, "user does not exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, "inocorect password")
    }
    
    const { accesToken,refreshToken}=await generateAccesTokenAndRefreshToken(user._id)

    const loggedinUser=await User.findById(user._id).
    select("-password -refreshToken")
    
    const option={
        httpOnly:true,
        secure:true
    }
     return res.
     status(200)
     .cookie("accesToken",accessToken, option)
     .cookie("refreshToken",refresToken, option)
     .json(
        new ApiResponse(

            200,
            {
            user:loggedinUser,accesToken, refreshToken
        }, "user logged in succusefully"
     )
    )
    


})
const logedOutUser= asyncHandler(async(req,res) => {
//we use middleware to  find whhich id to be logged out
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refresToken:undefined 
            }
        },
        {
            new:true
        }
    )
    const option={
        httpOnly:true,
        secure:true
    }
    return res.
     status(200)
     .clearCookie("accesToken",accessToken, option)
     .clearCookie("refreshToken",refresToken, option)
     .json(
        new ApiResponse(

            200,
            {},
             "user logout in succusefully"
     )
    )
    
})
export {registerUser, loginUser, logedOutUser}