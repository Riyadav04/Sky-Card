import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storagePath = path.join(process.cwd(), "uploads");

// Ensure directory exists
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath);
  },
 filename: function (req, file, cb) {
  const ext = path.extname(file.originalname);  // .png, .jpg, etc.
  const name = Date.now() + ext;
  cb(null, name);
}
});

const upload = multer({ storage });

export default upload;