import React from "react";
export function Checkbox({ label, checked, onChange, style }) {
  return React.createElement(
    "label",
    { style: { display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--fg-primary)", cursor: "pointer", ...style } },
    React.createElement("input", { type: "checkbox", checked, onChange, style: { width: 16, height: 16, accentColor: "var(--color-ink)" } }),
    label
  );
}
