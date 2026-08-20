import React from "react";
function HomeScreen({ onSelectProduct, onAddToCart, products }) {
  const NS = window.__EJDS_NS__;
  const { Button, ProductCard } = window[NS];
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "section",
      { style: { display: "flex", height: "560px" } },
      React.createElement(
        "div",
        { style: { width: "45%", background: "var(--color-cream)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" } },
        React.createElement("div", { className: "font-display", style: { fontSize: "44px", color: "var(--color-ink)", lineHeight: 1.15 } }, "Elegancia que te acompaña siempre"),
        React.createElement("p", { style: { fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--fg-secondary)", marginTop: "20px", maxWidth: "380px" } }, "Piezas pensadas para elevar tu estilo y convertirse en recuerdos especiales."),
        React.createElement(Button, { variant: "primary", size: "lg", style: { marginTop: "32px", width: "fit-content" }, onClick: () => onSelectProduct && onSelectProduct(products[0]) }, "Explorar colección")
      ),
      React.createElement("img", { src: "../../assets/imagery/hero-necklace-rings.png", style: { width: "55%", height: "100%", objectFit: "cover" } })
    ),
    React.createElement(
      "section",
      { style: { padding: "64px 48px" } },
      React.createElement("div", { className: "font-display", style: { fontSize: "22px", letterSpacing: "0.12em", textAlign: "center", color: "var(--color-ink)", marginBottom: "40px" } }, "COLECCIÓN DESTACADA"),
      React.createElement(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "28px", maxWidth: "1200px", margin: "0 auto" } },
        products.map((p) => React.createElement(ProductCard, { key: p.id, image: p.image, name: p.name, price: p.price, badge: p.badge, onAddToCart: () => onAddToCart(p) }))
      )
    )
  );
}

window.HomeScreen = HomeScreen;
