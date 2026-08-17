import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary from env variables or default demo account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// @desc    Upload image or video file to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post("/", async (req, res) => {
  try {
    const { file, resource_type = "auto", folder = "portfolio" } = req.body;

    if (!file) {
      return res
        .status(400)
        .json({ message: "No file or image string provided" });
    }

    // Direct Cloudinary upload (supports base64 data URL or remote URL)
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: resource_type, // 'image', 'video', or 'auto'
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({
      message: "Cloudinary Upload Failed: " + (error.message || error),
    });
  }
});

export default router;
