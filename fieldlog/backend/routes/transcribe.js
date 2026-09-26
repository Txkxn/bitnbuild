import { Router } from "express";
import multer from "multer";
import { transcribeAudio } from "../services/whisper.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "no audio file provided" });
  }

  try {
    const result = await transcribeAudio(req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (err) {
    console.error("[transcribe] error:", err.message);
    res.status(500).json({
      error: "Transcription failed",
      detail: err.message
    });
  }
});

export default router;
