import express from "express";
import {
  getResumes,
  getActiveResume,
  uploadResume,
  setActiveResume,
  deleteResume,
  downloadActiveResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.get("/", getResumes);
router.get("/active", getActiveResume);
router.get("/download", downloadActiveResume);
router.post("/upload", uploadResume);
router.put("/:id/active", setActiveResume);
router.delete("/:id", deleteResume);

export default router;
