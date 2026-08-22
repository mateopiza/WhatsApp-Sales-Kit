import React from "react";
function CartDrawer({ open, items, onClose, onQtyChange, onCheckout }) {
  const NS = window.__EJDS_NS__;
  const { IconButton, Icon, QuantityStepper, Button } = window[NS];
  const total = items.reduce((s, i) => s + i.qty * i.priceNum, 0);
  return React.createElement(
    React.Fragment,
    null,
    open && React.createElement("div", { onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(58,51,45,0.4)", zIndex: 10 } }),
    React.createElement(
      "aside",
      { style: { position: "fixed", top: 0, right: 0, bottom: 0, width: "400px", background: "var(--bg-page)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform var(--duration-slow) var(--ease-standard)", zIndex: 11, display: "flex", flexDirection: "column", boxShadow: "var(--shadow-lg)" } },
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", borderBottom: "1px solid var(--border-subtle)" } },
        React.createElement("div", { className: "font-display", style: { fontSize: "18px", color: "var(--color-ink)" } }, "Tu carrito"),
        React.createElement(IconButton, { icon: React.createElement(Icon, { name: "close" }), ariaLabel: "Cerrar", onClick: onClose })
      ),
      React.createElement(
        "div",
        { style: { flex: 1, overflow: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" } },
        items.length === 0 && React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--fg-secondary)" } }, "Tu carrito está vacío."),
        items.map((i) =>
          React.createElement(
            "div",
            { key: i.id, style: { display: "flex", gap: "14px" } },
            React.createElement("img", { src: i.image, style: { width: "72px", height: "90px", objectFit: "cover" } }),
            React.createElement(
              "div",
              { style: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" } },
              React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--fg-primary)" } }, i.name),
              React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--fg-secondary)" } }, i.price),
              React.createElement(QuantityStepper, { value: i.qty, onChange: (v) => onQtyChange(i.id, v) })
            )
          )
        )
      ),
      items.length > 0 && React.createElement(
        "div",
        { style: { padding: "24px", borderTop: "1px solid var(--border-subtle)" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "14px", marginBottom: "16px" } },
          React.createElement("span", null, "Total"),
          React.createElement("span", null, "$" + total.toLocaleString("es-CO"))
        ),
        React.createElement(Button, { variant: "primary", size: "lg", style: { width: "100%" }, onClick: onCheckout }, "Finalizar compra")
      )
    )
  );
}

window.CartDrawer = CartDrawer;
