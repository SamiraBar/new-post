import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadDir = path.resolve(__dirname, "../public/uploads/social");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|svg|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, svg, webp)"));
  }
};

export const uploadSocialIcon = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 },
  fileFilter: fileFilter,
}).single("icon");
