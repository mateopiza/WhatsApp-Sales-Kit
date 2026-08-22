import React from "react";
function Header({ onNav, cartCount = 0, onCartClick }) {
  const NS = window.__EJDS_NS__;
  const { IconButton, Icon } = window[NS];
  return React.createElement(
    "header",
    { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-page)" } },
    React.createElement(
      "nav",
      { style: { display: "flex", gap: "28px" } },
      ["Colecciones", "Anillos", "Collares", "Aretes"].map((n) =>
        React.createElement("a", { key: n, href: "#", onClick: (e) => { e.preventDefault(); onNav && onNav(n); }, style: { fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)", textDecoration: "none" } }, n)
      )
    ),
    React.createElement("a", { href: "#", onClick: (e) => { e.preventDefault(); onNav && onNav("Home"); }, className: "font-display", style: { fontSize: "22px", letterSpacing: "0.2em", color: "var(--color-ink)", textDecoration: "none" } }, "EMPIRES"),
    React.createElement(
      "div",
      { style: { display: "flex", gap: "8px", alignItems: "center" } },
      React.createElement(IconButton, { icon: React.createElement(Icon, { name: "search", size: 18 }), ariaLabel: "Buscar" }),
      React.createElement(IconButton, { icon: React.createElement(Icon, { name: "heart", size: 18 }), ariaLabel: "Favoritos" }),
      React.createElement(
        "div",
        { style: { position: "relative" } },
        React.createElement(IconButton, { icon: React.createElement(Icon, { name: "cart", size: 18 }), ariaLabel: "Carrito", onClick: onCartClick }),
        cartCount > 0 && React.createElement("span", { style: { position: "absolute", top: -2, right: -2, background: "var(--color-gold)", color: "var(--color-ink)", fontSize: "10px", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" } }, cartCount)
      )
    )
  );
}

window.Header = Header;
