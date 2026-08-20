import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseGesturesOptions {
  imageCount: number;
  activeImageIndex: number;
  onImageChange: (newIndex: number) => void;
  onNextProduct?: () => void;
  onPrevProduct?: () => void;
  hasPrevProduct?: boolean;
  hasNextProduct?: boolean;
  minScale?: number;
  maxScale?: number;
}

export function useGestures({
  imageCount,
  activeImageIndex,
  onImageChange,
  onNextProduct,
  onPrevProduct,
  hasPrevProduct = true,
  hasNextProduct = true,
  minScale = 1.0,
  maxScale = 3.5,
}: UseGesturesOptions) {
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [swipeDeltaX, setSwipeDeltaX] = useState(0);

  // Gesture tracking refs
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const lastTapTime = useRef(0);
  const lastTapPos = useRef({ x: 0, y: 0 });
  const initialDistance = useRef(0);
  const initialScale = useRef(1.0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset zoom and offsets when image changes
  useEffect(() => {
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setSwipeDeltaX(0);
  }, [activeImageIndex]);

  // Helper to clamp values
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  // Helper to get touch distance for pinch
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper to calculate bounded pan
  const clampOffsets = useCallback(
    (newScale: number, newX: number, newY: number) => {
      if (!containerRef.current || newScale <= 1.05) {
        return { x: 0, y: 0 };
      }
      const rect = containerRef.current.getBoundingClientRect();
      const maxPanX = (rect.width * (newScale - 1)) / 2;
      const maxPanY = (rect.height * (newScale - 1)) / 2;
      return {
        x: clamp(newX, -maxPanX, maxPanX),
        y: clamp(newY, -maxPanY, maxPanY),
      };
    },
    []
  );

  // Touch Start Handler
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2-finger pinch
      setIsPinching(true);
      setIsDragging(false);
      initialDistance.current = getTouchDistance(e.touches[0], e.touches[1]);
      initialScale.current = scale;
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      startTime.current = Date.now();
      setIsDragging(true);

      // Check for double tap
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTime.current;
      const distFromLastTap = Math.hypot(
        touch.clientX - lastTapPos.current.x,
        touch.clientY - lastTapPos.current.y
      );

      if (timeSinceLastTap < 300 && distFromLastTap < 30) {
        // Double Tap Detected
        if (scale > 1.1) {
          // Zoom out to normal
          setScale(1.0);
          setOffsetX(0);
          setOffsetY(0);
        } else {
          // Zoom in to 2.5x
          const targetScale = 2.5;
          setScale(targetScale);
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const tapX = touch.clientX - rect.left - rect.width / 2;
            const tapY = touch.clientY - rect.top - rect.height / 2;
            const bounded = clampOffsets(targetScale, -tapX * 0.8, -tapY * 0.8);
            setOffsetX(bounded.x);
            setOffsetY(bounded.y);
          }
        }
        lastTapTime.current = 0;
        return;
      }

      lastTapTime.current = now;
      lastTapPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  // Touch Move Handler
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      if (initialDistance.current > 0) {
        const factor = currentDist / initialDistance.current;
        const newScale = clamp(initialScale.current * factor, minScale, maxScale);
        setScale(newScale);
      }
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      // When actively dragging or distance > 10px from initial touch, reset lastTapTime to avoid false-positive double-tap zoom
      if (isDragging || Math.hypot(deltaX, deltaY) > 10) {
        lastTapTime.current = 0;
      }

      if (isDragging) {
        if (scale > 1.05) {
          // In zoom mode: pan the image
          const bounded = clampOffsets(scale, offsetX + deltaX * 0.5, offsetY + deltaY * 0.5);
          setOffsetX(bounded.x);
          setOffsetY(bounded.y);
          startX.current = touch.clientX;
          startY.current = touch.clientY;
        } else {
          // In 1x scale: horizontal swipe for gallery or product
          // Apply rubber-band dampening if at edges without adjacent items
          const isAtLeftEdge = activeImageIndex === 0;
          const isAtRightEdge = activeImageIndex === imageCount - 1;

          let dampenedDeltaX = deltaX;
          if ((isAtLeftEdge && deltaX > 0 && !hasPrevProduct) || (isAtRightEdge && deltaX < 0 && !hasNextProduct)) {
            dampenedDeltaX = deltaX * 0.35;
          }

          setSwipeDeltaX(dampenedDeltaX);
        }
      }
    }
  };

  // Touch End Handler
  const handleTouchEnd = () => {
    if (isPinching) {
      setIsPinching(false);
      if (scale < 1.05) {
        setScale(1.0);
        setOffsetX(0);
        setOffsetY(0);
      }
      return;
    }

    if (isDragging) {
      setIsDragging(false);

      if (scale <= 1.05) {
        const threshold = 45; // px swipe threshold
        const duration = Date.now() - startTime.current;
        const velocity = Math.abs(swipeDeltaX) / Math.max(duration, 1);

        if (Math.abs(swipeDeltaX) > threshold || velocity > 0.35) {
          if (swipeDeltaX < -threshold) {
            // Swiped Left -> next photo or next product
            if (activeImageIndex < imageCount - 1) {
              onImageChange(activeImageIndex + 1);
            } else if (onNextProduct && hasNextProduct) {
              onNextProduct();
            }
          } else if (swipeDeltaX > threshold) {
            // Swiped Right -> previous photo or previous product
            if (activeImageIndex > 0) {
              onImageChange(activeImageIndex - 1);
            } else if (onPrevProduct && hasPrevProduct) {
              onPrevProduct();
            }
          }
        }
      }

      setSwipeDeltaX(0);
    }
  };

  // Desktop Mouse Drag Support
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;

    if (scale > 1.05) {
      const bounded = clampOffsets(scale, offsetX + deltaX * 0.4, offsetY + deltaY * 0.4);
      setOffsetX(bounded.x);
      setOffsetY(bounded.y);
      startX.current = e.clientX;
      startY.current = e.clientY;
    } else {
      setSwipeDeltaX(deltaX);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (scale <= 1.05) {
      const threshold = 45;
      if (swipeDeltaX < -threshold) {
        if (activeImageIndex < imageCount - 1) {
          onImageChange(activeImageIndex + 1);
        } else if (onNextProduct && hasNextProduct) {
          onNextProduct();
        }
      } else if (swipeDeltaX > threshold) {
        if (activeImageIndex > 0) {
          onImageChange(activeImageIndex - 1);
        } else if (onPrevProduct && hasPrevProduct) {
          onPrevProduct();
        }
      }
    }
    setSwipeDeltaX(0);
  };

  const resetZoom = useCallback(() => {
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setSwipeDeltaX(0);
  }, []);

  const toggleZoom = useCallback(() => {
    if (scale > 1.05) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  }, [scale, resetZoom]);

  return {
    scale,
    offsetX,
    offsetY,
    swipeDeltaX,
    isDragging,
    isPinching,
    containerRef,
    resetZoom,
    toggleZoom,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}
