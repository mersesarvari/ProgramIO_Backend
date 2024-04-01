import path from "path";
import { v4 as guid } from "uuid";
import sharp from "sharp";
import multer from "multer";

const storage = multer.memoryStorage();

// Middleware to convert uploaded image to WebP format
export const convertToWebP = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const imagename = guid();
  const imagePath = path.join("src/uploads", `${imagename}.webp`);

  // Create a readable stream from the file buffer
  const imageStream = sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 40 })
    .toFile(imagePath, (err, info) => {
      if (err) {
        return next(err);
      }
      req.webpPath = imagePath;
      req.webpName = `${imagename}.webp`;
      next();
    });
};

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check if the uploaded file's MIME type is one of the allowed image types
    if (
      file.mimetype.startsWith("image/") &&
      ["jpg", "jpeg", "png", "svg", "webp"].includes(
        file.originalname.split(".").pop().toLowerCase()
      )
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only JPG, JPEG, PNG, SVG, and WebP images are allowed")); // Reject the file
    }
  },
  limits: {
    fileSize: 3 * 1024 * 1024, // 10 MB (adjust as needed)
  },
});
