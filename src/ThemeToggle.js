export default function ThemeToggle({ theme, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        background: "transparent",
        border: "0.5px solid var(--border)",
        borderRadius: 8,
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 15,
        lineHeight: 1,
        color: "var(--muted)",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {theme === "dark" ? "☀" : "☽"}
    </button>
  );
}
