export interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export interface PinchState {
  initialDistance: number;
  initialScale: number;
  center: { x: number; y: number };
}

export interface GestureState {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  isPinching: boolean;
  swipeDeltaX: number;
}
