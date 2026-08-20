import React from "react";
export function Card({ children, padding = "24px", style }) {
  return React.createElement(
    "div",
    { style: { background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding, ...style } },
    children
  );
}
