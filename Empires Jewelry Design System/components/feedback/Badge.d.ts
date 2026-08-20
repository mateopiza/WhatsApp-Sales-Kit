import * as React from "react";
export interface BadgeProps {
  tone?: "neutral" | "gold" | "ink";
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
