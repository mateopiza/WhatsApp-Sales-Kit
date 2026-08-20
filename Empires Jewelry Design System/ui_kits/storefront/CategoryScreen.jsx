import React from "react";
function CategoryScreen({ products, onSelectProduct, onAddToCart }) {
  const NS = window.__EJDS_NS__;
  const { Tag, ProductCard } = window[NS];
  const [filter, setFilter] = React.useState("Todos");
  const cats = ["Todos", "Anillos", "Collares", "Aretes", "Pulseras"];
  return React.createElement(
    "section",
    { style: { padding: "48px" } },
    React.createElement("div", { className: "font-display", style: { fontSize: "30px", color: "var(--color-ink)", marginBottom: "24px" } }, "Colecciones"),
    React.createElement(
      "div",
      { style: { display: "flex", gap: "10px", marginBottom: "36px" } },
      cats.map((c) => React.createElement(Tag, { key: c, selected: c === filter, onClick: () => setFilter(c) }, c))
    ),
    React.createElement(
      "div",
      { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "28px" } },
      products.map((p) => React.createElement("div", { key: p.id, style: { cursor: "pointer" }, onClick: () => onSelectProduct(p) }, React.createElement(ProductCard, { image: p.image, name: p.name, price: p.price, badge: p.badge, onAddToCart: (e) => { e && e.stopPropagation(); onAddToCart(p); } })))
    )
  );
}

window.CategoryScreen = CategoryScreen;
