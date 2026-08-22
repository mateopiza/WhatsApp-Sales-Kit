import * as React from "react";
export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare function Input(props: InputProps): JSX.Element;
