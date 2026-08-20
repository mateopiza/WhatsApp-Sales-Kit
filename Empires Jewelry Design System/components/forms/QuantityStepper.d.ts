import * as React from "react";
export interface QuantityStepperProps {
  value?: number;
  onChange?: (next: number) => void;
  min?: number;
  max?: number;
}
export declare function QuantityStepper(props: QuantityStepperProps): JSX.Element;
