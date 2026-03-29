import React, { useState } from "react";
import { useLocation } from "./hooks/useLocation";
import Navbar from "./components/ui/Navbar";
import CurrentPage from "./components/pages/CurrentPage";
import HistoricalPage from "./components/pages/HistoricalPage";

export default function App() {
  const { location, loading } = useLocation();
  const [page, setPage] = useState("current");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "16px",
        }}
      >
        <div className="loader" />
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
          }}
        >
          DETECTING LOCATION...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar page={page} setPage={setPage} location={location} />
      <main style={{ flex: 1, padding: "0 16px 40px" }}>
        {page === "current" ? (
          <CurrentPage location={location} />
        ) : (
          <HistoricalPage location={location} />
        )}
      </main>
    </div>
  );
}
