import { useState, useEffect } from "react";

// SHA-256 hash of your password (plaintext never stored).
// To generate: open browser console and run:
//   const h = p => crypto.subtle.digest('SHA-256', new TextEncoder().encode(p))
//     .then(b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join(''));
//   h('yourpassword').then(console.log)
const STORED_HASH = "521fd0a303b99ce6e30223b25c54fca3b73e0e6879781571faf284af5469a509";

const SESSION_KEY = "pg_nutrition_ok";

async function sha256(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setChecking(true);
    const hash = await sha256(input);
    if (hash === STORED_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
    setChecking(false);
  }

  if (unlocked) return children;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#0f0f1a",
        border: "0.5px solid #1e1e30",
        borderRadius: 12,
        padding: "2rem 2.5rem",
        width: "100%",
        maxWidth: 340,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Private</p>
          <p style={{ fontSize: 18, fontWeight: 500, color: "#e2e8f0", margin: 0 }}>Nutrition Guide</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            style={{
              background: "#151520",
              border: `0.5px solid ${error ? "#f87171" : "#1e1e30"}`,
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 14,
              color: "#e2e8f0",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          {error && (
            <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>Incorrect password</p>
          )}
        </div>

        <button
          type="submit"
          disabled={checking || !input}
          style={{
            background: checking || !input ? "#1e1e30" : "#818cf8",
            color: checking || !input ? "#64748b" : "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px",
            fontSize: 14,
            fontWeight: 500,
            cursor: checking || !input ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "background 0.15s",
          }}
        >
          {checking ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
