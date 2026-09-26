import { useState } from "react";
import { useRecorder } from "../hooks/useRecorder.js";

const EXAMPLES = [
  "Mere ko chakkar aa rahe hain, ich bin nicht so gut, gave ORS, come back in 2 hours",
  "Patient ko bukhar hai 103, headache, no medication given yet",
  "Pet dard since last night, keine appetite, gave ORS, follow up in 4 hours",
  "Unko sugar high lag rahi thi, glucose check 240, insulin not given, come back after lunch"
];

export default function NewEntryPage({ onNormalize, loading }) {
  const [text, setText] = useState("");

  const recorder = useRecorder((transcript) => {
    if (!transcript) return;
    setText((prev) => (prev ? prev + " " + transcript : transcript));
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onNormalize(text);
  }

  async function handleMic() {
    if (recorder.recording) recorder.stop();
    else await recorder.start();
  }

  const micDisabled = loading || recorder.transcribing;
  const micLabel = recorder.recording
    ? "Stop Recording"
    : recorder.transcribing
    ? "Transcribing…"
    : "Dictate";

  return (
    <form className="new-entry-page" onSubmit={handleSubmit}>
      <h2 className="page-heading">What happened?</h2>

      <textarea
        className="input-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type what was said. Mixed languages are fine."
        rows={4}
        disabled={loading}
      />

      <div className="mic-row">
        <button
          type="button"
          className={`mic-btn ${recorder.recording ? "mic-recording" : ""}`}
          disabled={micDisabled}
          onClick={handleMic}
        >
          {micLabel}
        </button>
      </div>

      {recorder.error && <div className="mic-error">{recorder.error}</div>}

      <div className="example-row">
        <span className="example-label">Examples</span>
        {EXAMPLES.map((ex, i) => (
          <button
            type="button"
            key={i}
            className="example-btn"
            onClick={() => setText(ex)}
            disabled={loading}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="spacer" />

      <button
        type="submit"
        className="normalize-btn"
        disabled={loading || !text.trim()}
      >
        {loading ? "Working…" : "Normalize"}
      </button>
    </form>
  );
}
