import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true, 
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String, // not required because we can have oauth login
    },
    mobile:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','owner','deliveryBoy', 'ADMIN'], // enum means allowed values
        required:true,
        default: 'user'
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "APPROVED"
    }, 
    resetOtp:{
        type:String,
    },
    isOtpVerified:{
        type:Boolean,
        default:false,
    },
    otpExpires:{
        type:Date,
    },
    location:{
        type:{type:String,enum:['Point'],default:'Point'},
        coordinates:{type:[Number],default:[0,0]}
    }

},{timestamps:true});

userSchema.index({location:'2dsphere'})

const User = mongoose.model('User', userSchema); // create a model named 'User' using userSchema

export default User;