import "dotenv/config";
import express from "express";
import cors from "cors";
import normalizeRoute from "./routes/normalize.js";
import transcribeRoute from "./routes/transcribe.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    model: process.env.MODEL_NAME || "qwen2.5:7b",
    ollama_url: process.env.OLLAMA_URL || "http://localhost:11434"
  });
});

app.use("/api", normalizeRoute);
app.use("/api", transcribeRoute);

app.listen(PORT, () => {
  console.log(`FieldLog backend running on http://localhost:${PORT}`);
  console.log(`Ollama URL: ${process.env.OLLAMA_URL || "http://localhost:11434"}`);
  console.log(`Model: ${process.env.MODEL_NAME || "qwen2.5:7b"}`);
});
