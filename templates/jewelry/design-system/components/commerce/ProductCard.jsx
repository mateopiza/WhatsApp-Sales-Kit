import React from "react";
import { IconButton } from "../forms/IconButton.jsx";
import { Icon } from "../core/Icon.jsx";
import { Badge } from "../feedback/Badge.jsx";
export function ProductCard({ image, name, price, badge, onAddToCart }) {
  return React.createElement(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-body)" } },
    React.createElement(
      "div",
      { style: { position: "relative", aspectRatio: "4/5", background: "var(--bg-surface-muted)", overflow: "hidden" } },
      image && React.createElement("img", { src: image, alt: name, style: { width: "100%", height: "100%", objectFit: "cover" } }),
      badge && React.createElement("div", { style: { position: "absolute", top: 12, left: 12 } }, React.createElement(Badge, { tone: "gold" }, badge)),
      React.createElement(IconButton, { icon: React.createElement(Icon, { name: "heart", size: 16 }), ariaLabel: "Favorito", variant: "filled", size: 32, style: { position: "absolute", top: 12, right: 12, background: "rgba(245,237,230,0.9)", color: "var(--color-ink)" } })
    ),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
      React.createElement(
        "div",
        null,
        React.createElement("div", { style: { fontSize: "14px", color: "var(--fg-primary)" } }, name),
        React.createElement("div", { style: { fontSize: "13px", color: "var(--fg-secondary)", marginTop: "4px" } }, price)
      ),
      React.createElement(IconButton, { icon: React.createElement(Icon, { name: "cart", size: 16 }), ariaLabel: "Añadir al carrito", variant: "outline", size: 32, onClick: onAddToCart })
    )
  );
}
