import multer from "multer";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); // Specify the directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Initialize Multer
const upload = multer({
  storage,
});

export default upload;
