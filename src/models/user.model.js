import mongoose, {Schema} from "mongoose"
passward
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const uesrSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true,
        trim:true
        
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
        
    },
    fullName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true

    },
    avatar:{
        type:String,
        required:true,

    },
    coverImage:{
        type:String

    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    refreshToken:{
        type:String,
        
    },
    createdAt:{
        type:Date,
        required:true
    },
    updatedAt:{
        type:Date,
        required:true
    },
},{timestamps:true}
)

//it is hook use to the pre function like storing the password
userSchema.pre("save", function(next) {
    if(this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(passward){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.genrateAccesToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCES_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCES_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.genrateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)