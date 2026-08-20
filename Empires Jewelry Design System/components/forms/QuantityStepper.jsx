import React from "react";
import { IconButton } from "./IconButton.jsx";
import { Icon } from "../core/Icon.jsx";
export function QuantityStepper({ value = 1, onChange, min = 1, max = 99 }) {
  const dec = () => onChange && onChange(Math.max(min, value - 1));
  const inc = () => onChange && onChange(Math.min(max, value + 1));
  return React.createElement(
    "div",
    { style: { display: "inline-flex", alignItems: "center", gap: "16px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-pill)", padding: "6px 8px" } },
    React.createElement(IconButton, { icon: React.createElement(Icon, { name: "minus", size: 14 }), ariaLabel: "Disminuir", size: 28, onClick: dec }),
    React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "14px", minWidth: 16, textAlign: "center" } }, value),
    React.createElement(IconButton, { icon: React.createElement(Icon, { name: "plus", size: 14 }), ariaLabel: "Aumentar", size: 28, onClick: inc })
  );
}
