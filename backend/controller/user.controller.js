import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {sendVerificationMail,sendResetPasswordMail} from "../utility/email.js";
import crypto from "crypto";
import mongoose from "mongoose";
import path from "path";

dotenv.config();

// Register Controller
export const signUpAction = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'user';
    const token = jwt.sign(
      { username, email, password: hashedPassword, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const emailSent = await sendVerificationMail(email, token);
    console.log("EMAIL SENT RESULT:", emailSent);
    if (!emailSent.accepted.length) {
      return res.status(500).json({ msg: "Verification mail failed to send." });
    }
    res.status(200).json({ msg: "Verification email sent! Please verify to complete registration." });
  } catch (err) {
    res.status(500).json({ msg: "Error during registration", error: err.message });
  }
};

// Email Verification Controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, email, password, role } = decoded;
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (!userExists.verified) {
        userExists.verified = true;
        await userExists.save();
        return res.status(200).json({ msg: "Email verified! User is now verified." });
      } else {
        return res.status(400).json({ msg: "User already verified" });
      }
    }
    const newUser = await User.create({
      username,
      email,
      password,
      role,
      verified: true
    });
    res.status(201).json({ msg: "Email verified! User created successfully", });
    // res.redirect('http://localhost:3000/verified-success');

  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token", error: err.message });
  }
};
export const signInAction = async (request, response, next) => {
  try {
    let { email, password } = request.body;
    let user = await User.findOne({ email });
        if (!user)
      return response.status(401).json({ error: "Unauthorized user | Email id not found" });

    if (!user.verified)
      return response.status(401).json({ error: "Not verified user | Verify your account first" });

    let status = bcrypt.compareSync(password, user.password);

    if (!status) {
      return response.status(401).json({ error: "Unauthorized user | Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7h' }
    );

    user.password = undefined; 

    return response.status(200).json({
      message: "Sign In Success",
      token,    
      user
    });
  } catch (err) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
}


export const verifyAccount =async(request,response,next)=>{
    try{
        let {email} =request.body;
        const userinfo = User.updateOne({email},{$set:{verified:true}})
        .then(result=>{
            return response.status(201).json({message:"Account verified",user:userinfo});
        }).catch(err=>{
            return response.status(500).json({error:"Internal server Error"});
        });
    }
    catch(err){
        return response.status(500).json({error:"Internal server Error"});
    }
}
// Password Reset Request 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetToken = otpHash;
    user.resetTokenExpiration = Date.now() + 600000;
    await user.save();
    await sendResetPasswordMail(email, otp);
    res.status(200).json({ msg: "Password reset OTP sent!" });
  } catch (err) {
    res.status(500).json({ msg: "Error during password reset", error: err.message });
  }
};

// OTP Verification 
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.resetToken !== hashedOtp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });
    res.status(200).json({ msg: "OTP verified", resetToken });
  } catch (err) {
    res.status(500).json({ msg: "Error verifying OTP", error: err.message });
  }
};

// New Password Set 
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    console.log(newPassword);
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) return res.status(401).json({ msg: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.status(200).json({ msg: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error resetting password", error: err.message });
  }
};