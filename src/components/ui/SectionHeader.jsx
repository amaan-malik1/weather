import React from "react";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              marginTop: "2px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
