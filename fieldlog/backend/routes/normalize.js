import { Router } from "express";
import { normalizeText } from "../services/ollama.js";
import { findIdioms } from "../services/idioms.js";

const router = Router();

router.post("/normalize", async (req, res) => {
  const { text } = req.body || {};

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing or empty 'text' field." });
  }

  try {
    const [extraction, idioms] = await Promise.all([
      normalizeText(text),
      findIdioms(text)
    ]);

    res.json({
      input: text,
      ...extraction,
      idioms_matched: idioms,
      idioms_count: idioms.length
    });
  } catch (err) {
    console.error("[normalize] error:", err.message);
    res.status(500).json({
      error: "Normalization failed.",
      detail: err.message
    });
  }
});

export default router;
