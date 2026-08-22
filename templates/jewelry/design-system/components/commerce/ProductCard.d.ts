import * as React from "react";
export interface ProductCardProps {
  image?: string;
  name: string;
  price: string;
  badge?: string;
  onAddToCart?: () => void;
}
export declare function ProductCard(props: ProductCardProps): JSX.Element;
