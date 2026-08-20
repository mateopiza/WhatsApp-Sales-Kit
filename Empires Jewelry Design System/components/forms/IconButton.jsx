import React from "react";
export function IconButton({ icon, size = 40, variant = "ghost", ariaLabel, style, ...rest }) {
  const IconCmp = icon;
  const variants = {
    ghost: { background: "transparent", border: "1px solid transparent", color: "var(--color-ink)" },
    outline: { background: "transparent", border: "1px solid var(--border-strong)", color: "var(--color-ink)" },
    filled: { background: "var(--color-ink)", border: "1px solid var(--color-ink)", color: "var(--color-cream)" },
  };
  return React.createElement(
    "button",
    {
      "aria-label": ariaLabel,
      style: {
        width: size, height: size, borderRadius: "var(--radius-pill)", display: "inline-flex",
        alignItems: "center", justifyContent: "center", cursor: "pointer",
        transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
        ...variants[variant], ...style,
      },
      ...rest,
    },
    IconCmp
  );
}
