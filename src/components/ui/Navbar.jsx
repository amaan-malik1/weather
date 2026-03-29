import React from "react";

const s = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    background: "rgba(8,12,20,0.9)",
    backdropFilter: "blur(16px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "12px",
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "1.1rem",
    letterSpacing: "-0.02em",
  },
  sub: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--accent)",
    letterSpacing: "0.15em",
  },
  tabs: {
    display: "flex",
    gap: "6px",
    background: "var(--bg-card)",
    borderRadius: 8,
    padding: "4px",
    border: "1px solid var(--border)",
  },
  tab: (active) => ({
    padding: "6px 16px",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: "0.8rem",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#080c14" : "var(--text-secondary)",
    transition: "all 0.2s",
    letterSpacing: "0.02em",
  }),
  loc: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    color: "var(--text-secondary)",
  },
};

export default function Navbar({ page, setPage, location }) {
  return (
    <nav style={s.nav}>
      <div style={s.brand}>
        <div style={s.logo}>🌤</div>
        <div>
          <div style={s.title}>ATMOS CHECKER</div>
          <div style={s.sub}>WEATHER INTELLIGENCE</div>
        </div>
      </div>
      <div style={s.tabs}>
        <button
          style={s.tab(page === "current")}
          onClick={() => setPage("current")}
        >
          Current
        </button>
        <button
          style={s.tab(page === "historical")}
          onClick={() => setPage("historical")}
        >
          Historical
        </button>
      </div>
      <div style={s.loc}>
        <span>📍</span>
        <span>{location?.city || "Unknown"}</span>
      </div>
    </nav>
  );
}
