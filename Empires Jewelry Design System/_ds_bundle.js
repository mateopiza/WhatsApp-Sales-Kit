/* @ds-bundle: {"format":4,"namespace":"EmpiresJewelryDesignSystem_5c52ea","components":[{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/commerce/ProductCard.jsx":"31c9922afd69","components/core/Card.jsx":"3ba8a4783c5e","components/core/Icon.jsx":"48d6a4788c67","components/feedback/Badge.jsx":"5a48911dc2d3","components/feedback/Tag.jsx":"3162fe075819","components/forms/Button.jsx":"19de8a40f518","components/forms/Checkbox.jsx":"984a0e150dc0","components/forms/IconButton.jsx":"865c75093402","components/forms/Input.jsx":"a61c070b07be","components/forms/QuantityStepper.jsx":"869fcec968c2","components/forms/Select.jsx":"b9e24dba6dcd","components/navigation/Tabs.jsx":"880859569b09","ui_kits/storefront/CartDrawer.jsx":"0da0901922f6","ui_kits/storefront/CategoryScreen.jsx":"efd17c9cab25","ui_kits/storefront/Footer.jsx":"3f96969df9d3","ui_kits/storefront/Header.jsx":"70c7cf87cd5f","ui_kits/storefront/HomeScreen.jsx":"2977ef2caeea","ui_kits/storefront/ProductScreen.jsx":"e29f8581da9c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EmpiresJewelryDesignSystem_5c52ea = window.EmpiresJewelryDesignSystem_5c52ea || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  padding = "24px",
  style
}) {
  return React.createElement("div", {
    style: {
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      padding,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const paths = {
  diamond: "M6 2h12l4 6-10 14L2 8z M2 8h20 M9 2l-3 6 6 14 6-14-3-6",
  ring: "M12 3l4 4-4 4-4-4z M12 11a7 7 0 1 0 0.01 0z",
  necklace: "M4 4c0 6 3.5 10 8 10s8-4 8-10 M12 14v2 M12 16a2.5 2.5 0 1 0 0.01 0z",
  bag: "M6 8h12l1 13H5z M9 8a3 3 0 0 1 6 0",
  shield: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z M9 12l2 2 4-4",
  gift: "M4 9h16v4H4z M6 9v11h12V9 M12 9v11 M12 9C9 9 8 6 9.5 4.8 11 3.6 12 6 12 9z M12 9c3 0 4-3 2.5-4.2C13 3.6 12 6 12 9z",
  heart: "M12 20s-7-4.35-9.5-8.5C.8 8 2.3 4.5 6 4.5c2.1 0 3.5 1.2 4.5 2.7C11.5 5.7 12.9 4.5 15 4.5c3.7 0 5.2 3.5 3.5 7C19 15.65 12 20 12 20z",
  cart: "M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-4.3-4.3",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  close: "M5 5l14 14M19 5L5 19",
  check: "M5 12l5 5L20 7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14"
};
function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color = "currentColor",
  style,
  ...rest
}) {
  const d = paths[name];
  if (!d) return null;
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
    ...rest
  }, React.createElement("path", {
    d
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = "neutral"
}) {
  const tones = {
    neutral: {
      background: "var(--bg-surface-muted)",
      color: "var(--fg-primary)"
    },
    gold: {
      background: "var(--color-gold)",
      color: "var(--color-ink)"
    },
    ink: {
      background: "var(--color-ink)",
      color: "var(--color-cream)"
    }
  };
  return React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  children,
  selected = false,
  onClick
}) {
  return React.createElement("button", {
    onClick,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "8px 16px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      border: `1px solid ${selected ? "var(--color-ink)" : "var(--border-subtle)"}`,
      background: selected ? "var(--color-ink)" : "transparent",
      color: selected ? "var(--color-cream)" : "var(--fg-primary)",
      transition: "all var(--duration-fast) var(--ease-standard)"
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const base = {
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "13px",
  border: "1px solid transparent",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  transition: "background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};
const sizes = {
  sm: {
    padding: "8px 16px",
    fontSize: "11px"
  },
  md: {
    padding: "12px 24px",
    fontSize: "13px"
  },
  lg: {
    padding: "16px 32px",
    fontSize: "13px"
  }
};
const variants = {
  primary: {
    background: "var(--color-ink)",
    color: "var(--color-cream)",
    borderColor: "var(--color-ink)"
  },
  secondary: {
    background: "transparent",
    color: "var(--color-ink)",
    borderColor: "var(--color-ink)"
  },
  gold: {
    background: "var(--color-gold)",
    color: "var(--color-ink)",
    borderColor: "var(--color-gold)"
  },
  ghost: {
    background: "transparent",
    color: "var(--color-taupe)",
    borderColor: "transparent"
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  style,
  ...rest
}) {
  const v = variants[variant] || variants.primary;
  return React.createElement("button", {
    style: {
      ...base,
      ...sizes[size],
      ...v,
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    },
    disabled,
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  style
}) {
  return React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      color: "var(--fg-primary)",
      cursor: "pointer",
      ...style
    }
  }, React.createElement("input", {
    type: "checkbox",
    checked,
    onChange,
    style: {
      width: 16,
      height: 16,
      accentColor: "var(--color-ink)"
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  size = 40,
  variant = "ghost",
  ariaLabel,
  style,
  ...rest
}) {
  const IconCmp = icon;
  const variants = {
    ghost: {
      background: "transparent",
      border: "1px solid transparent",
      color: "var(--color-ink)"
    },
    outline: {
      background: "transparent",
      border: "1px solid var(--border-strong)",
      color: "var(--color-ink)"
    },
    filled: {
      background: "var(--color-ink)",
      border: "1px solid var(--color-ink)",
      color: "var(--color-cream)"
    }
  };
  return React.createElement("button", {
    "aria-label": ariaLabel,
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
      ...variants[variant],
      ...style
    },
    ...rest
  }, IconCmp);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function ProductCard({
  image,
  name,
  price,
  badge,
  onAddToCart
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      fontFamily: "var(--font-body)"
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4/5",
      background: "var(--bg-surface-muted)",
      overflow: "hidden"
    }
  }, image && React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), badge && React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, React.createElement(__ds_scope.Badge, {
    tone: "gold"
  }, badge)), React.createElement(__ds_scope.IconButton, {
    icon: React.createElement(__ds_scope.Icon, {
      name: "heart",
      size: 16
    }),
    ariaLabel: "Favorito",
    variant: "filled",
    size: 32,
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      background: "rgba(245,237,230,0.9)",
      color: "var(--color-ink)"
    }
  })), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: "14px",
      color: "var(--fg-primary)"
    }
  }, name), React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "var(--fg-secondary)",
      marginTop: "4px"
    }
  }, price)), React.createElement(__ds_scope.IconButton, {
    icon: React.createElement(__ds_scope.Icon, {
      name: "cart",
      size: 16
    }),
    ariaLabel: "Añadir al carrito",
    variant: "outline",
    size: 32,
    onClick: onAddToCart
  })));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = "text",
  disabled = false,
  style,
  ...rest
}) {
  return React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && React.createElement("span", {
    style: {
      fontSize: "11px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--fg-secondary)"
    }
  }, label), React.createElement("input", {
    type,
    placeholder,
    disabled,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      padding: "12px 14px",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      background: disabled ? "var(--bg-surface-muted)" : "var(--bg-surface)",
      color: "var(--fg-primary)",
      outline: "none",
      transition: "border-color var(--duration-fast) var(--ease-standard)"
    },
    ...rest
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
function QuantityStepper({
  value = 1,
  onChange,
  min = 1,
  max = 99
}) {
  const dec = () => onChange && onChange(Math.max(min, value - 1));
  const inc = () => onChange && onChange(Math.min(max, value + 1));
  return React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "16px",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-pill)",
      padding: "6px 8px"
    }
  }, React.createElement(__ds_scope.IconButton, {
    icon: React.createElement(__ds_scope.Icon, {
      name: "minus",
      size: 14
    }),
    ariaLabel: "Disminuir",
    size: 28,
    onClick: dec
  }), React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      minWidth: 16,
      textAlign: "center"
    }
  }, value), React.createElement(__ds_scope.IconButton, {
    icon: React.createElement(__ds_scope.Icon, {
      name: "plus",
      size: 14
    }),
    ariaLabel: "Aumentar",
    size: 28,
    onClick: inc
  }));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  style
}) {
  return React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && React.createElement("span", {
    style: {
      fontSize: "11px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--fg-secondary)"
    }
  }, label), React.createElement("select", {
    value,
    onChange,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      padding: "12px 14px",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      background: "var(--bg-surface)",
      color: "var(--fg-primary)",
      outline: "none"
    }
  }, options.map(o => React.createElement("option", {
    key: o,
    value: o
  }, o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  active,
  onChange
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      gap: "32px",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, items.map(it => React.createElement("button", {
    key: it,
    onClick: () => onChange && onChange(it),
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "12px 0",
      background: "transparent",
      cursor: "pointer",
      color: it === active ? "var(--color-ink)" : "var(--fg-muted)",
      borderBottom: it === active ? "2px solid var(--color-ink)" : "2px solid transparent",
      marginBottom: "-1px"
    }
  }, it)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CartDrawer.jsx
try { (() => {
function CartDrawer({
  open,
  items,
  onClose,
  onQtyChange,
  onCheckout
}) {
  const NS = window.__EJDS_NS__;
  const {
    IconButton,
    Icon,
    QuantityStepper,
    Button
  } = window[NS];
  const total = items.reduce((s, i) => s + i.qty * i.priceNum, 0);
  return React.createElement(React.Fragment, null, open && React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(58,51,45,0.4)",
      zIndex: 10
    }
  }), React.createElement("aside", {
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      width: "400px",
      background: "var(--bg-page)",
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform var(--duration-slow) var(--ease-standard)",
      zIndex: 11,
      display: "flex",
      flexDirection: "column",
      boxShadow: "var(--shadow-lg)"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, React.createElement("div", {
    className: "font-display",
    style: {
      fontSize: "18px",
      color: "var(--color-ink)"
    }
  }, "Tu carrito"), React.createElement(IconButton, {
    icon: React.createElement(Icon, {
      name: "close"
    }),
    ariaLabel: "Cerrar",
    onClick: onClose
  })), React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, items.length === 0 && React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "var(--fg-secondary)"
    }
  }, "Tu carrito está vacío."), items.map(i => React.createElement("div", {
    key: i.id,
    style: {
      display: "flex",
      gap: "14px"
    }
  }, React.createElement("img", {
    src: i.image,
    style: {
      width: "72px",
      height: "90px",
      objectFit: "cover"
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "var(--fg-primary)"
    }
  }, i.name), React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--fg-secondary)"
    }
  }, i.price), React.createElement(QuantityStepper, {
    value: i.qty,
    onChange: v => onQtyChange(i.id, v)
  }))))), items.length > 0 && React.createElement("div", {
    style: {
      padding: "24px",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      marginBottom: "16px"
    }
  }, React.createElement("span", null, "Total"), React.createElement("span", null, "$" + total.toLocaleString("es-CO"))), React.createElement(Button, {
    variant: "primary",
    size: "lg",
    style: {
      width: "100%"
    },
    onClick: onCheckout
  }, "Finalizar compra"))));
}
window.CartDrawer = CartDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CartDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CategoryScreen.jsx
try { (() => {
function CategoryScreen({
  products,
  onSelectProduct,
  onAddToCart
}) {
  const NS = window.__EJDS_NS__;
  const {
    Tag,
    ProductCard
  } = window[NS];
  const [filter, setFilter] = React.useState("Todos");
  const cats = ["Todos", "Anillos", "Collares", "Aretes", "Pulseras"];
  return React.createElement("section", {
    style: {
      padding: "48px"
    }
  }, React.createElement("div", {
    className: "font-display",
    style: {
      fontSize: "30px",
      color: "var(--color-ink)",
      marginBottom: "24px"
    }
  }, "Colecciones"), React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginBottom: "36px"
    }
  }, cats.map(c => React.createElement(Tag, {
    key: c,
    selected: c === filter,
    onClick: () => setFilter(c)
  }, c))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "28px"
    }
  }, products.map(p => React.createElement("div", {
    key: p.id,
    style: {
      cursor: "pointer"
    },
    onClick: () => onSelectProduct(p)
  }, React.createElement(ProductCard, {
    image: p.image,
    name: p.name,
    price: p.price,
    badge: p.badge,
    onAddToCart: e => {
      e && e.stopPropagation();
      onAddToCart(p);
    }
  })))));
}
window.CategoryScreen = CategoryScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CategoryScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Footer.jsx
try { (() => {
function Footer() {
  const NS = window.__EJDS_NS__;
  const {
    Icon
  } = window[NS];
  const values = [["shield", "Calidad", "Seleccionamos lo mejor para ti."], ["shield", "Confianza", "Seguridad en cada compra."], ["heart", "Pasión", "Amamos lo que hacemos y se nota."], ["diamond", "Exclusividad", "Piezas únicas para personas únicas."]];
  return React.createElement("footer", {
    style: {
      background: "var(--color-ink)",
      color: "var(--color-cream)",
      padding: "56px 48px"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "32px",
      maxWidth: "1200px",
      margin: "0 auto"
    }
  }, values.map(([icon, title, body]) => React.createElement("div", {
    key: title,
    style: {
      display: "flex",
      gap: "14px"
    }
  }, React.createElement(Icon, {
    name: icon,
    size: 22,
    color: "var(--color-gold)"
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }
  }, title), React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--color-stone)",
      marginTop: "4px"
    }
  }, body))))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Header.jsx
try { (() => {
function Header({
  onNav,
  cartCount = 0,
  onCartClick
}) {
  const NS = window.__EJDS_NS__;
  const {
    IconButton,
    Icon
  } = window[NS];
  return React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 48px",
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-page)"
    }
  }, React.createElement("nav", {
    style: {
      display: "flex",
      gap: "28px"
    }
  }, ["Colecciones", "Anillos", "Collares", "Aretes"].map(n => React.createElement("a", {
    key: n,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav && onNav(n);
    },
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--fg-secondary)",
      textDecoration: "none"
    }
  }, n))), React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav && onNav("Home");
    },
    className: "font-display",
    style: {
      fontSize: "22px",
      letterSpacing: "0.2em",
      color: "var(--color-ink)",
      textDecoration: "none"
    }
  }, "EMPIRES"), React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      alignItems: "center"
    }
  }, React.createElement(IconButton, {
    icon: React.createElement(Icon, {
      name: "search",
      size: 18
    }),
    ariaLabel: "Buscar"
  }), React.createElement(IconButton, {
    icon: React.createElement(Icon, {
      name: "heart",
      size: 18
    }),
    ariaLabel: "Favoritos"
  }), React.createElement("div", {
    style: {
      position: "relative"
    }
  }, React.createElement(IconButton, {
    icon: React.createElement(Icon, {
      name: "cart",
      size: 18
    }),
    ariaLabel: "Carrito",
    onClick: onCartClick
  }), cartCount > 0 && React.createElement("span", {
    style: {
      position: "absolute",
      top: -2,
      right: -2,
      background: "var(--color-gold)",
      color: "var(--color-ink)",
      fontSize: "10px",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-body)"
    }
  }, cartCount))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/HomeScreen.jsx
try { (() => {
function HomeScreen({
  onSelectProduct,
  onAddToCart,
  products
}) {
  const NS = window.__EJDS_NS__;
  const {
    Button,
    ProductCard
  } = window[NS];
  return React.createElement(React.Fragment, null, React.createElement("section", {
    style: {
      display: "flex",
      height: "560px"
    }
  }, React.createElement("div", {
    style: {
      width: "45%",
      background: "var(--color-cream)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 64px"
    }
  }, React.createElement("div", {
    className: "font-display",
    style: {
      fontSize: "44px",
      color: "var(--color-ink)",
      lineHeight: 1.15
    }
  }, "Elegancia que te acompaña siempre"), React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      color: "var(--fg-secondary)",
      marginTop: "20px",
      maxWidth: "380px"
    }
  }, "Piezas pensadas para elevar tu estilo y convertirse en recuerdos especiales."), React.createElement(Button, {
    variant: "primary",
    size: "lg",
    style: {
      marginTop: "32px",
      width: "fit-content"
    },
    onClick: () => onSelectProduct && onSelectProduct(products[0])
  }, "Explorar colección")), React.createElement("img", {
    src: "../../assets/imagery/hero-necklace-rings.png",
    style: {
      width: "55%",
      height: "100%",
      objectFit: "cover"
    }
  })), React.createElement("section", {
    style: {
      padding: "64px 48px"
    }
  }, React.createElement("div", {
    className: "font-display",
    style: {
      fontSize: "22px",
      letterSpacing: "0.12em",
      textAlign: "center",
      color: "var(--color-ink)",
      marginBottom: "40px"
    }
  }, "COLECCIÓN DESTACADA"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "28px",
      maxWidth: "1200px",
      margin: "0 auto"
    }
  }, products.map(p => React.createElement(ProductCard, {
    key: p.id,
    image: p.image,
    name: p.name,
    price: p.price,
    badge: p.badge,
    onAddToCart: () => onAddToCart(p)
  })))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductScreen.jsx
try { (() => {
function ProductScreen({
  product,
  onAddToCart
}) {
  const NS = window.__EJDS_NS__;
  const {
    Button,
    Select,
    Tabs,
    Badge,
    QuantityStepper
  } = window[NS];
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("Detalles");
  const tabContent = {
    Detalles: "Pieza elaborada en baño de oro 18k sobre acero quirúrgico, resistente al agua y a la decoloración diaria.",
    Envío: "Envío estándar 3–5 días hábiles en todo el país. Empaque premium incluido en cada pedido.",
    Cuidado: "Evita el contacto con perfumes y agua de mar. Guarda la pieza en su empaque original."
  };
  return React.createElement("section", {
    style: {
      display: "flex",
      gap: "56px",
      padding: "56px 48px",
      maxWidth: "1200px",
      margin: "0 auto"
    }
  }, React.createElement("img", {
    src: "../../assets/imagery/hero-necklace-rings.png",
    style: {
      width: "50%",
      aspectRatio: "4/5",
      objectFit: "cover"
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, product.badge && React.createElement(Badge, {
    tone: "gold"
  }, product.badge), React.createElement("div", {
    className: "font-display",
    style: {
      fontSize: "32px",
      color: "var(--color-ink)"
    }
  }, product.name), React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "20px",
      color: "var(--fg-secondary)"
    }
  }, product.price), React.createElement(Select, {
    label: "Talla",
    options: ["14", "15", "16", "17"]
  }), React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px",
      alignItems: "center"
    }
  }, React.createElement(QuantityStepper, {
    value: qty,
    onChange: setQty
  }), React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onAddToCart(product, qty)
  }, "Añadir al carrito")), React.createElement(Tabs, {
    items: ["Detalles", "Envío", "Cuidado"],
    active: tab,
    onChange: setTab
  }), React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      color: "var(--fg-secondary)",
      lineHeight: 1.6
    }
  }, tabContent[tab])));
}
window.ProductScreen = ProductScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
