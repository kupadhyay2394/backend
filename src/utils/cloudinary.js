import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


cloudinary.config({ 
        cloud_name:process.env.CLOUDINAY_NAME, 
        api_key:process.env.CLOUDINAY_API_KEY, 
        api_secret: process.env.CLOUDINAY_API_SECRET// Click 'View Credentials' below to copy your API secret
});
const uploadOnCloudanary=async(localFilePath)=>{
    try{
        if(!lacalFilePath) return null;
        //upload on cloudanary
        const response = await cloudinary.uploader.upload
        (localFilePath,{
            resource_type:'auto'

        })
    
        //file has been uploded sucusessfullly
        console.log("file uploded on cloudanary",response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath)
            //remove the locally saved file
            return null;
        
    }
}   
export {uploadOnCloudanary};