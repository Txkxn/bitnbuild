import { useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export function useRecorder(onTranscript) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const callbackRef = useRef(onTranscript);
  callbackRef.current = onTranscript;

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size < 1000) {
          setError("Recording was too short. Try again.");
          return;
        }
        setTranscribing(true);
        try {
          const form = new FormData();
          form.append("audio", blob, "recording.webm");
          const res = await fetch(`${API_BASE}/api/transcribe`, {
            method: "POST",
            body: form
          });
          if (!res.ok) {
            const body = await res.text();
            throw new Error(`Transcribe failed ${res.status}: ${body}`);
          }
          const data = await res.json();
          if (callbackRef.current) callbackRef.current(data.text || "");
        } catch (e) {
          setError(e.message);
        } finally {
          setTranscribing(false);
        }
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (e) {
      setError(`Microphone access failed: ${e.message}`);
      setRecording(false);
    }
  }

  function stop() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    setRecording(false);
  }

  return { recording, transcribing, error, start, stop };
}
