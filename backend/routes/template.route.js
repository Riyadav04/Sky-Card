import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Template from '../model/SimpleTemplates.model.js';

const router = express.Router();

// Make sure uploads folder exists
const uploadPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Proper multer storage with file extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .png, .jpg, etc.
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// ✅ POST: Upload Template with extension
router.post('/', upload.single('templateImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const title = req.body.category || "Untitled";

    const template = new Template({ title, imageUrl });
    await template.save();

    res.status(201).json({ success: true, template });

  } catch (err) {
    console.error("Error saving template:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET: Fetch all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
