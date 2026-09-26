import { useState } from "react";

export default function HistoryPage({ entries, onClear, onHome }) {
  const [index, setIndex] = useState(0);

  if (!entries || entries.length === 0) {
    return (
      <div className="history-page">
        <div className="empty-note">No entries yet.</div>
        <button className="action-btn" onClick={onHome}>
          Home
        </button>
      </div>
    );
  }

  const safeIndex = Math.min(index, entries.length - 1);
  const entry = entries[safeIndex];

  return (
    <div className="history-page">
      <div className="history-nav">
        <button
          className="nav-arrow"
          onClick={() => setIndex((i) => Math.min(i + 1, entries.length - 1))}
          disabled={safeIndex >= entries.length - 1}
          title="Older"
        >
          ← Older
        </button>
        <span className="history-counter">
          {safeIndex + 1} / {entries.length}
        </span>
        <button
          className="nav-arrow"
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={safeIndex <= 0}
          title="Newer"
        >
          Newer →
        </button>
      </div>

      <div className="history-body">
        <div className="history-time">{entry.timestamp}</div>
        <div className="history-field">
          <div className="field-label">Original Input</div>
          <div className="field-text field-text-quote">{entry.input}</div>
        </div>
        {entry.summary_en && (
          <div className="history-field">
            <div className="field-label">English Summary</div>
            <div className="field-text">{entry.summary_en}</div>
          </div>
        )}
        {entry.approved && (
          <div className="history-approved">✓ Supervisor signed off</div>
        )}
      </div>

      <div className="history-footer">
        <button className="action-btn action-btn-secondary" onClick={onClear}>
          Clear All History
        </button>
        <button className="action-btn" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  );
}
