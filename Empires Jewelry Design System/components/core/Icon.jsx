import React from "react";
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
export function Icon({ name, size = 20, strokeWidth = 1.5, color = "currentColor", style, ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style, ...rest }, React.createElement("path", { d }));
}
