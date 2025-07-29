import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
     profilePic: {
    type: String,
  },
    jobTitle: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
    resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiration: {
    type: Date,
    default: null
  }
    
});

export const User = mongoose.model("user",userSchema);