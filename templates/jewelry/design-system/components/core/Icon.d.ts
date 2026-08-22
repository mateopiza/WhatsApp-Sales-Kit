import * as React from "react";
export interface IconProps {
  /** Icon name from the redrawn line-icon set */
  name: "diamond" | "ring" | "necklace" | "bag" | "shield" | "gift" | "heart" | "cart" | "search" | "chevronDown" | "chevronRight" | "close" | "check" | "plus" | "minus";
  size?: number;
  strokeWidth?: number;
  color?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
