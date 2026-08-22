import React from "react";
export function Select({ label, options = [], value, onChange, style }) {
  return React.createElement(
    "label",
    { style: { display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-body)", ...style } },
    label && React.createElement("span", { style: { fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)" } }, label),
    React.createElement(
      "select",
      {
        value, onChange,
        style: {
          fontFamily: "var(--font-body)", fontSize: "14px", padding: "12px 14px",
          border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)",
          background: "var(--bg-surface)", color: "var(--fg-primary)", outline: "none",
        },
      },
      options.map((o) => React.createElement("option", { key: o, value: o }, o))
    )
  );
}
