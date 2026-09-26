export default function Header({
  page,
  onNavigate,
  onHome,
  sunlight,
  onSunlightToggle
}) {
  return (
    <header className="app-header">
      <button className="logo-btn" onClick={onHome} title="Home">
        FieldLog
      </button>

      <nav className="nav">
        <button
          className={`nav-btn ${page === "new" ? "active" : ""}`}
          onClick={() => onNavigate("new")}
        >
          New Entry
        </button>
        <button
          className={`nav-btn ${page === "history" ? "active" : ""}`}
          onClick={() => onNavigate("history")}
        >
          History
        </button>
        <button
          className="panic-btn"
          onClick={() => onNavigate("panic")}
          title="Panic"
        >
          ⚠ PANIC
        </button>
        <button
          className={`sunlight-toggle ${sunlight ? "sunlight-on" : ""}`}
          onClick={() => onSunlightToggle(!sunlight)}
          title="High contrast for direct sunlight"
        >
          ☀ {sunlight ? "ON" : "OFF"}
        </button>
      </nav>
    </header>
  );
}
