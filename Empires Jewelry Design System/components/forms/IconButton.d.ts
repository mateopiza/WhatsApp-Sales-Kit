import * as React from "react";
export interface IconButtonProps {
  icon: React.ReactNode;
  size?: number;
  variant?: "ghost" | "outline" | "filled";
  ariaLabel: string;
  onClick?: () => void;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
