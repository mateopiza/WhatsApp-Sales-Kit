import React from "react";
export function Tabs({ items = [], active, onChange }) {
  return React.createElement(
    "div",
    { style: { display: "flex", gap: "32px", borderBottom: "1px solid var(--border-subtle)" } },
    items.map((it) =>
      React.createElement(
        "button",
        {
          key: it,
          onClick: () => onChange && onChange(it),
          style: {
            fontFamily: "var(--font-body)", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "12px 0", background: "transparent", cursor: "pointer",
            color: it === active ? "var(--color-ink)" : "var(--fg-muted)",
            borderBottom: it === active ? "2px solid var(--color-ink)" : "2px solid transparent",
            marginBottom: "-1px",
          },
        },
        it
      )
    )
  );
}
