import { useEffect, useState } from "react";

export default function PanicPage({ onDismiss }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="panic-page">
      <div className="panic-icon">⚠</div>
      <h1 className="panic-title">HELP IS ON THE WAY</h1>
      <p className="panic-subtitle">
        Stay where you are. Keep this screen visible.
      </p>
      <div className="panic-countdown">
        Dispatching in {countdown > 0 ? countdown : 0}s
      </div>
      <button className="panic-dismiss" onClick={onDismiss}>
        Cancel
      </button>
    </div>
  );
}
