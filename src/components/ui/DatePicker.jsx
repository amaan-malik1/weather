import React from "react";
import { todayISO } from "../../utils/helpers";

const inputStyle = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "8px 12px",
  color: "var(--text-primary)",
  fontSize: "0.85rem",
  fontFamily: "var(--font-mono)",
  outline: "none",
  cursor: "pointer",
};

export default function DatePicker({ label, value, onChange, min, max }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {label && (
        <label
          style={{
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max || todayISO()}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}
