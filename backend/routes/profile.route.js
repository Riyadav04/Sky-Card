// src/router/profile.route.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile
} from '../controller/profile.controller.js';
import verifyToken from '../middleware/verifyToken.js'; // adjust path if needed
import upload from '../middleware/upload.js';       // for profilePicture upload

const router = express.Router();

router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, upload.single('profilePic'), updateProfile);
router.delete('/', verifyToken, deleteProfile);

export default router;