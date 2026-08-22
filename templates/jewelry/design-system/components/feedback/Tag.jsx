import React from "react";
export function Tag({ children, selected = false, onClick }) {
  return React.createElement(
    "button",
    {
      onClick,
      style: {
        fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase",
        padding: "8px 16px", borderRadius: "var(--radius-pill)", cursor: "pointer",
        border: `1px solid ${selected ? "var(--color-ink)" : "var(--border-subtle)"}`,
        background: selected ? "var(--color-ink)" : "transparent",
        color: selected ? "var(--color-cream)" : "var(--fg-primary)",
        transition: "all var(--duration-fast) var(--ease-standard)",
      },
    },
    children
  );
}
