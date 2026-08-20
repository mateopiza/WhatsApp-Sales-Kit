import React from "react";
const base = {
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "13px",
  border: "1px solid transparent",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  transition: "background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};
const sizes = {
  sm: { padding: "8px 16px", fontSize: "11px" },
  md: { padding: "12px 24px", fontSize: "13px" },
  lg: { padding: "16px 32px", fontSize: "13px" },
};
const variants = {
  primary: { background: "var(--color-ink)", color: "var(--color-cream)", borderColor: "var(--color-ink)" },
  secondary: { background: "transparent", color: "var(--color-ink)", borderColor: "var(--color-ink)" },
  gold: { background: "var(--color-gold)", color: "var(--color-ink)", borderColor: "var(--color-gold)" },
  ghost: { background: "transparent", color: "var(--color-taupe)", borderColor: "transparent" },
};
export function Button({ variant = "primary", size = "md", disabled = false, children, style, ...rest }) {
  const v = variants[variant] || variants.primary;
  return React.createElement(
    "button",
    {
      style: { ...base, ...sizes[size], ...v, opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style },
      disabled,
      ...rest,
    },
    children
  );
}
