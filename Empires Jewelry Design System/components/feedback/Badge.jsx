import React from "react";
export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { background: "var(--bg-surface-muted)", color: "var(--fg-primary)" },
    gold: { background: "var(--color-gold)", color: "var(--color-ink)" },
    ink: { background: "var(--color-ink)", color: "var(--color-cream)" },
  };
  return React.createElement(
    "span",
    { style: { display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", ...tones[tone] } },
    children
  );
}
