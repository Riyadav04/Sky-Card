import express from 'express';
import { signUpAction, signInAction, verifyEmail,forgotPassword,verifyOtp, resetPassword} from '../controller/user.controller.js';
import { body } from 'express-validator';


const router = express.Router();

router.post("/sign-up",
    body("username","username is required").notEmpty(),
    body("email","email id is required").notEmpty(),
    body("email","invalid email id").isEmail(),signUpAction);
router.post("/sign-in",signInAction);
router.get("/verify",verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
export default router;