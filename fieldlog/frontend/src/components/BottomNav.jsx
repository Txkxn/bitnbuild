export default function BottomNav({ page, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-btn ${page === "new" ? "active" : ""}`}
        onClick={() => onNavigate("new")}
      >
        New
      </button>
      <button
        className={`bottom-nav-btn ${page === "record" ? "active" : ""}`}
        onClick={() => onNavigate("record")}
      >
        Record
      </button>
      <button
        className={`bottom-nav-btn ${page === "history" ? "active" : ""}`}
        onClick={() => onNavigate("history")}
      >
        History
      </button>
      <button
        className={`bottom-nav-btn panic-tab ${
          page === "panic" ? "active" : ""
        }`}
        onClick={() => onNavigate("panic")}
      >
        Panic
      </button>
    </nav>
  );
}
