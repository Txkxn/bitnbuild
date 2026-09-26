export default function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-grid">
        <button
          className="home-btn home-btn-primary"
          onClick={() => onNavigate("new")}
        >
          <div className="home-btn-title">New Entry</div>
          <div className="home-btn-sub">Capture what was said</div>
        </button>
        <button className="home-btn" onClick={() => onNavigate("history")}>
          <div className="home-btn-title">Log History</div>
          <div className="home-btn-sub">Review past entries</div>
        </button>
        <button
          className="home-btn home-btn-panic"
          onClick={() => onNavigate("panic")}
        >
          <div className="home-btn-title">Panic</div>
          <div className="home-btn-sub">Call for assistance</div>
        </button>
      </div>
      <div className="home-footer">
        <span>Offline · Local LLM · No cloud</span>
      </div>
    </div>
  );
}
