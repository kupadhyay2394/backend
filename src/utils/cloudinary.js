import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINAY_NAME, 
        api_key:process.env.CLOUDINAY_API_KEY, 
        api_secret: process.env.CLOUDINAY_API_SECRET// Click 'View Credentials' below to copy your API secret
    });

    