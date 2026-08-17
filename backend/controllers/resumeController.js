import Resume from "../models/Resume.js";
import Profile from "../models/Profile.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to sanitize Cloudinary URL: Convert /image/upload/ to /raw/upload/ for PDFs/docs
const sanitizeResumeUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/raw/upload/");
  }
  return url;
};

// Helper to sync profile resume URL with active resume
const syncProfileResume = async (resumeUrl) => {
  try {
    const cleanUrl = sanitizeResumeUrl(resumeUrl);
    let profile = await Profile.findOne();
    if (profile) {
      profile.resume = cleanUrl;
      await profile.save();
    }
  } catch (err) {
    console.error("Error syncing profile resume:", err);
  }
};

// @desc    Get all uploaded resumes
// @route   GET /api/resumes
// @access  Public / Admin
export const getResumes = async (req, res) => {
  try {
    let resumes = await Resume.find().sort({ createdAt: -1 });

    // Auto-fix any legacy /image/upload/ URLs in DB
    for (const r of resumes) {
      const sanitized = sanitizeResumeUrl(r.fileUrl);
      if (sanitized !== r.fileUrl) {
        r.fileUrl = sanitized;
        await r.save();
        if (r.isActive) {
          await syncProfileResume(sanitized);
        }
      }
    }

    // Seed default resume if table is empty
    if (resumes.length === 0) {
      const profile = await Profile.findOne();
      const defaultUrl = profile?.resume && typeof profile.resume === "string" 
        ? sanitizeResumeUrl(profile.resume)
        : "/Ayushmaan_Ratan_Resume.pdf";

      const seededResume = await Resume.create({
        title: "Ayushmaan_Ratan_Resume.pdf",
        fileUrl: defaultUrl,
        fileType: "application/pdf",
        isActive: true,
      });

      await syncProfileResume(defaultUrl);
      resumes = [seededResume];
    }

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active resume
// @route   GET /api/resumes/active
// @access  Public
export const getActiveResume = async (req, res) => {
  try {
    let activeResume = await Resume.findOne({ isActive: true });
    if (!activeResume) {
      activeResume = await Resume.findOne().sort({ createdAt: -1 });
    }

    if (!activeResume) {
      const profile = await Profile.findOne();
      const defaultUrl = profile?.resume && typeof profile.resume === "string" 
        ? sanitizeResumeUrl(profile.resume) 
        : "/Ayushmaan_Ratan_Resume.pdf";

      activeResume = await Resume.create({
        title: "Ayushmaan_Ratan_Resume.pdf",
        fileUrl: defaultUrl,
        fileType: "application/pdf",
        isActive: true,
      });
      await syncProfileResume(defaultUrl);
    } else {
      // Auto-fix legacy URL if needed
      const sanitized = sanitizeResumeUrl(activeResume.fileUrl);
      if (sanitized !== activeResume.fileUrl) {
        activeResume.fileUrl = sanitized;
        await activeResume.save();
        await syncProfileResume(sanitized);
      }
    }

    res.json(activeResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload new resume
// @route   POST /api/resumes/upload
// @access  Private / Admin
export const uploadResume = async (req, res) => {
  try {
    const { file, title, fileSize, fileType, makeActive = true } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file content provided" });
    }

    let fileUrl = file;
    let publicId = "";

    // Upload to Cloudinary using resource_type: "raw" for document/PDF files
    if (file.startsWith("data:") || file.startsWith("http")) {
      try {
        const uploadRes = await cloudinary.uploader.upload(file, {
          folder: "portfolio/resumes",
          resource_type: "raw", // CRITICAL: Always raw for PDFs/DOCs
          use_filename: true,
        });
        fileUrl = uploadRes.secure_url;
        publicId = uploadRes.public_id;
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to direct URL/data storage:", cloudErr.message);
      }
    }

    fileUrl = sanitizeResumeUrl(fileUrl);

    const count = await Resume.countDocuments();
    const shouldBeActive = makeActive || count === 0;

    if (shouldBeActive) {
      await Resume.updateMany({}, { isActive: false });
    }

    const newResume = await Resume.create({
      title: title || "Ayushmaan_Ratan_Resume.pdf",
      fileUrl,
      publicId,
      fileSize: fileSize || "",
      fileType: fileType || "application/pdf",
      isActive: shouldBeActive,
    });

    if (shouldBeActive) {
      await syncProfileResume(fileUrl);
    }

    res.status(201).json(newResume);
  } catch (error) {
    console.error("Resume Upload Error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
};

// @desc    Set active resume
// @route   PUT /api/resumes/:id/active
// @access  Private / Admin
export const setActiveResume = async (req, res) => {
  try {
    const { id } = req.params;
    const targetResume = await Resume.findById(id);

    if (!targetResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    targetResume.fileUrl = sanitizeResumeUrl(targetResume.fileUrl);

    await Resume.updateMany({}, { isActive: false });
    targetResume.isActive = true;
    await targetResume.save();

    await syncProfileResume(targetResume.fileUrl);

    res.json(targetResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private / Admin
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const wasActive = resume.isActive;

    // Delete from Cloudinary if publicId exists
    if (resume.publicId) {
      try {
        await cloudinary.uploader.destroy(resume.publicId, { resource_type: "raw" });
        await cloudinary.uploader.destroy(resume.publicId, { resource_type: "image" });
      } catch (cloudErr) {
        console.warn("Could not delete from Cloudinary:", cloudErr.message);
      }
    }

    await Resume.findByIdAndDelete(id);

    // If deleted resume was active, set latest remaining resume as active
    if (wasActive) {
      const latestRemaining = await Resume.findOne().sort({ createdAt: -1 });
      if (latestRemaining) {
        latestRemaining.isActive = true;
        latestRemaining.fileUrl = sanitizeResumeUrl(latestRemaining.fileUrl);
        await latestRemaining.save();
        await syncProfileResume(latestRemaining.fileUrl);
      } else {
        await syncProfileResume("/Ayushmaan_Ratan_Resume.pdf");
      }
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download active resume directly (attachment stream or attachment URL)
// @route   GET /api/resumes/download
// @access  Public
export const downloadActiveResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ isActive: true });
    if (!resume) {
      resume = await Resume.findOne().sort({ createdAt: -1 });
    }

    let fileUrl = resume?.fileUrl || "/Ayushmaan_Ratan_Resume.pdf";
    fileUrl = sanitizeResumeUrl(fileUrl);

    if (resume && resume.fileUrl !== fileUrl) {
      resume.fileUrl = fileUrl;
      await resume.save();
      await syncProfileResume(fileUrl);
    }

    const filename = resume?.title || "Ayushmaan_Ratan_Resume.pdf";
    const contentType = resume?.fileType || "application/pdf";

    // If file is remote (Cloudinary or http)
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      let downloadUrl = fileUrl;
      // Add fl_attachment flag to Cloudinary URL to force browser download response
      if (downloadUrl.includes("res.cloudinary.com") && !downloadUrl.includes("fl_attachment")) {
        downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
      }

      try {
        const response = await fetch(downloadUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
          },
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
          res.setHeader("Content-Type", contentType);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
          );
          res.setHeader("Content-Length", buffer.length);
          return res.send(buffer);
        } else {
          console.warn(`Remote fetch returned status ${response.status}, redirecting to downloadUrl`);
        }
      } catch (remoteErr) {
        console.warn("Direct buffer fetch failed, redirecting to downloadUrl:", remoteErr.message);
      }

      // Fallback: redirect browser directly to Cloudinary attachment URL
      return res.redirect(downloadUrl);
    }

    // If fileUrl is base64 data URL
    if (fileUrl.startsWith("data:")) {
      const matches = fileUrl.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const mime = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
        res.setHeader("Content-Type", mime || contentType);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
        );
        res.setHeader("Content-Length", buffer.length);
        return res.send(buffer);
      }
    }

    // Local relative file URL fallback
    res.redirect(fileUrl);
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ message: "Download failed: " + error.message });
  }
};
