import { useState } from "react";

const EXAMPLES = [
  "Mere ko chakkar aa rahe hain, ich bin nicht so gut, gave ORS, come back in 2 hours",
  "Patient ko bukhar hai 103, headache, no medication given yet",
  "Pet dard since last night, keine appetite, gave ORS, follow up in 4 hours",
  "Unko sugar high lag rahi thi, glucose check 240, insulin not given, come back after lunch"
];

export default function NewEntryPage({ onNormalize, loading }) {
  const [text, setText] = useState("");
  const micAvailable = false;

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onNormalize(text);
  }

  return (
    <div className="new-entry-page">
      <form className="new-entry-form" onSubmit={handleSubmit}>
        <textarea
          className="input-area input-area-large"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or dictate what was said. Mixed languages are fine."
          autoFocus
          disabled={loading}
        />

        <div className="input-tools">
          <button
            type="button"
            className="mic-btn"
            disabled={!micAvailable || loading}
            title={micAvailable ? "Start dictation" : "Dictation coming soon"}
          >
            {micAvailable ? "🎤 Dictate" : "🎤 Dictate (soon)"}
          </button>

          <div className="example-row">
            <span className="example-label">Example:</span>
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
        </div>

        <button
          type="submit"
          className="normalize-btn normalize-btn-large"
          disabled={loading || !text.trim()}
        >
          {loading ? "Normalizing…" : "Normalize"}
        </button>
      </form>
    </div>
  );
}
