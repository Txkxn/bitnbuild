const WHISPER_URL = process.env.WHISPER_URL || "http://localhost:8081";

export async function transcribeAudio(buffer, mimetype = "audio/webm") {
  const started = Date.now();

  const form = new FormData();
  const blob = new Blob([buffer], { type: mimetype });
  form.append("audio", blob, "audio.webm");

  const response = await fetch(`${WHISPER_URL}/transcribe`, {
    method: "POST",
    body: form
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Whisper error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return {
    ...data,
    duration_ms: Date.now() - started
  };
}
