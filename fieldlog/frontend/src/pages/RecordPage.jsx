function FieldList({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="field-block">
      <div className="field-label">{label}</div>
      <ul className="field-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function FieldText({ label, value, emphasize }) {
  if (!value) return null;
  return (
    <div className={`field-block ${emphasize ? "summary-block" : ""}`}>
      <div className="field-label">{label}</div>
      <div className="field-text">{value}</div>
    </div>
  );
}

export default function RecordPage({ result, approved, onApprove, onNew, onHome }) {
  if (!result) {
    return (
      <div className="record-page">
        <div className="empty-note">No record yet.</div>
        <button className="action-btn" onClick={onNew}>
          Start New Entry
        </button>
      </div>
    );
  }

  return (
    <div className="record-page">
      <div className="record-header">
        <div className="meta-row">
          <span className="meta">Model: {result.model}</span>
          <span className="meta">Duration: {result.duration_ms} ms</span>
          <span className="meta">Idioms: {result.idioms_count}</span>
        </div>
      </div>

      <div className="record-grid">
        <div className="record-column">
          <FieldList label="Symptoms" items={result.symptoms} />
          <FieldList label="Vitals" items={result.vitals} />
          <FieldList label="Medications Given" items={result.medications_given} />
          <FieldText label="Follow-up" value={result.followup} />
        </div>

        <div className="record-column">
          <FieldText
            label="English Summary"
            value={result.summary_en}
            emphasize
          />

          {result.suggested_medication && (
            <div
              className={`suggestion-panel ${
                approved ? "suggestion-approved" : ""
              }`}
            >
              <div className="suggestion-header">
                <span className="suggestion-warning">
                  {approved ? "APPROVED" : "REQUIRES SUPERVISOR SIGN-OFF"}
                </span>
              </div>
              <div className="suggestion-body">
                <div className="suggestion-med">
                  {result.suggested_medication}
                </div>
                <div className="suggestion-reason">
                  {result.suggestion_reason}
                </div>
              </div>
              {!approved ? (
                <button className="approve-btn" onClick={onApprove}>
                  I, the supervisor, approve
                </button>
              ) : (
                <div className="suggestion-approved-note">
                  ✓ Signed off by supervisor
                </div>
              )}
            </div>
          )}

          {result.idioms_matched && result.idioms_matched.length > 0 && (
            <div className="idiom-panel">
              <div className="idiom-header">
                <span className="idiom-badge">{result.idioms_count}</span>
                <span className="idiom-title">
                  {result.idioms_count === 1
                    ? "Idiom recognized"
                    : "Idioms recognized"}
                </span>
              </div>
              <ul className="idiom-list">
                {result.idioms_matched.map((idiom, i) => (
                  <li key={i} className="idiom-item">
                    <div className="idiom-phrase">
                      <span className="idiom-lang">{idiom.lang}</span>"
                      {idiom.matched_text || idiom.phrase}"
                    </div>
                    <div className="idiom-meaning">{idiom.meaning}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="record-footer">
        <button className="action-btn" onClick={onNew}>
          New Entry
        </button>
        <button className="action-btn action-btn-secondary" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  );
}
