import * as React from "react";
export interface ButtonProps {
  variant?: "primary" | "secondary" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
