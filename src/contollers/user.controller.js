import { asyncHandler } from "../utils/asynchandler.js";



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

})
export {registerUser}