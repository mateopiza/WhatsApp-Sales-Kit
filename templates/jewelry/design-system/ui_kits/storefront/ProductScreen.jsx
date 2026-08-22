import React from "react";
function ProductScreen({ product, onAddToCart }) {
  const NS = window.__EJDS_NS__;
  const { Button, Select, Tabs, Badge, QuantityStepper } = window[NS];
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("Detalles");
  const tabContent = {
    Detalles: "Pieza elaborada en baño de oro 18k sobre acero quirúrgico, resistente al agua y a la decoloración diaria.",
    Envío: "Envío estándar 3–5 días hábiles en todo el país. Empaque premium incluido en cada pedido.",
    Cuidado: "Evita el contacto con perfumes y agua de mar. Guarda la pieza en su empaque original.",
  };
  return React.createElement(
    "section",
    { style: { display: "flex", gap: "56px", padding: "56px 48px", maxWidth: "1200px", margin: "0 auto" } },
    React.createElement("img", { src: "../../assets/imagery/hero-necklace-rings.png", style: { width: "50%", aspectRatio: "4/5", objectFit: "cover" } }),
    React.createElement(
      "div",
      { style: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" } },
      product.badge && React.createElement(Badge, { tone: "gold" }, product.badge),
      React.createElement("div", { className: "font-display", style: { fontSize: "32px", color: "var(--color-ink)" } }, product.name),
      React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "20px", color: "var(--fg-secondary)" } }, product.price),
      React.createElement(Select, { label: "Talla", options: ["14", "15", "16", "17"] }),
      React.createElement("div", { style: { display: "flex", gap: "16px", alignItems: "center" } },
        React.createElement(QuantityStepper, { value: qty, onChange: setQty }),
        React.createElement(Button, { variant: "primary", size: "lg", onClick: () => onAddToCart(product, qty) }, "Añadir al carrito")
      ),
      React.createElement(Tabs, { items: ["Detalles", "Envío", "Cuidado"], active: tab, onChange: setTab }),
      React.createElement("p", { style: { fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--fg-secondary)", lineHeight: 1.6 } }, tabContent[tab])
    )
  );
}

window.ProductScreen = ProductScreen;
