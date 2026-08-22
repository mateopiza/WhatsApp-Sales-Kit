import React from "react";
function Footer() {
  const NS = window.__EJDS_NS__;
  const { Icon } = window[NS];
  const values = [
    ["shield", "Calidad", "Seleccionamos lo mejor para ti."],
    ["shield", "Confianza", "Seguridad en cada compra."],
    ["heart", "Pasión", "Amamos lo que hacemos y se nota."],
    ["diamond", "Exclusividad", "Piezas únicas para personas únicas."],
  ];
  return React.createElement(
    "footer",
    { style: { background: "var(--color-ink)", color: "var(--color-cream)", padding: "56px 48px" } },
    React.createElement(
      "div",
      { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "32px", maxWidth: "1200px", margin: "0 auto" } },
      values.map(([icon, title, body]) =>
        React.createElement(
          "div",
          { key: title, style: { display: "flex", gap: "14px" } },
          React.createElement(Icon, { name: icon, size: 22, color: "var(--color-gold)" }),
          React.createElement(
            "div",
            null,
            React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase" } }, title),
            React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-stone)", marginTop: "4px" } }, body)
          )
        )
      )
    )
  );
}

window.Footer = Footer;
