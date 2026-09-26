const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function normalize(text) {
  const res = await fetch(`${API_BASE}/api/normalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Backend error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function health() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}
