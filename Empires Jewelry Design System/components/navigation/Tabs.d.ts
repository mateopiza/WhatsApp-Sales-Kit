import * as React from "react";
export interface TabsProps {
  items: string[];
  active: string;
  onChange?: (item: string) => void;
}
export declare function Tabs(props: TabsProps): JSX.Element;
