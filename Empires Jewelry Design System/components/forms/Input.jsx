import React from "react";
export function Input({ label, placeholder, type = "text", disabled = false, style, ...rest }) {
  return React.createElement(
    "label",
    { style: { display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-body)", ...style } },
    label && React.createElement("span", { style: { fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)" } }, label),
    React.createElement("input", {
      type, placeholder, disabled,
      style: {
        fontFamily: "var(--font-body)", fontSize: "14px", padding: "12px 14px",
        border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)",
        background: disabled ? "var(--bg-surface-muted)" : "var(--bg-surface)", color: "var(--fg-primary)",
        outline: "none", transition: "border-color var(--duration-fast) var(--ease-standard)",
      },
      ...rest,
    })
  );
}
