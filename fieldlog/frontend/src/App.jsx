import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import NewEntryPage from "./pages/NewEntryPage.jsx";
import RecordPage from "./pages/RecordPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import PanicPage from "./pages/PanicPage.jsx";
import { normalize } from "./api.js";

const STORAGE_KEY = "fieldlog_entries";
const SUNLIGHT_KEY = "fieldlog_sunlight";

export default function App() {
  const [page, setPage] = useState("new");
  const [result, setResult] = useState(null);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [sunlight, setSunlight] = useState(() => {
    return localStorage.getItem(SUNLIGHT_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(SUNLIGHT_KEY, String(sunlight));
    document.body.classList.toggle("sunlight", sunlight);
  }, [sunlight]);

  async function handleNormalize(text) {
    setLoading(true);
    setError(null);
    setResult(null);
    setApproved(false);
    try {
      const data = await normalize(text);
      setResult(data);
      setEntries((prev) =>
        [
          {
            timestamp: new Date().toISOString(),
            input: data.input,
            summary_en: data.summary_en,
            data,
            approved: false
          },
          ...prev
        ].slice(0, 100)
      );
      setPage("record");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleApprove() {
    setApproved(true);
    setEntries((prev) =>
      prev.map((e, i) =>
        i === 0 && e.input === result?.input ? { ...e, approved: true } : e
      )
    );
  }

  function handleClearHistory() {
    if (confirm("Clear all log history?")) {
      setEntries([]);
    }
  }

  function navigate(next) {
    setPage(next);
    if (next !== "record") setError(null);
  }

  return (
    <div className="app">
      <Header sunlight={sunlight} onSunlightToggle={setSunlight} />

      <main className="app-body">
        {error && <div className="error-banner">{error}</div>}

        {page === "new" && (
          <NewEntryPage onNormalize={handleNormalize} loading={loading} />
        )}
        {page === "record" && (
          <RecordPage
            result={result}
            approved={approved}
            onApprove={handleApprove}
            onNew={() => navigate("new")}
          />
        )}
        {page === "history" && (
          <HistoryPage
            entries={entries}
            onClear={handleClearHistory}
            onNew={() => navigate("new")}
          />
        )}
        {page === "panic" && <PanicPage onDismiss={() => navigate("new")} />}
      </main>

      {page !== "panic" && <BottomNav page={page} onNavigate={navigate} />}
    </div>
  );
}
