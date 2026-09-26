export default function Header({ sunlight, onSunlightToggle }) {
  return (
    <header className="app-header">
      <span className="logo-btn">FieldLog</span>
      <button
        className={`sunlight-toggle ${sunlight ? "sunlight-on" : ""}`}
        onClick={() => onSunlightToggle(!sunlight)}
        title="High contrast for direct sunlight"
      >
        ☀ {sunlight ? "ON" : "OFF"}
      </button>
    </header>
  );
}
