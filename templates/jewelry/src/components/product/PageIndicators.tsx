import React from 'react';

interface PageIndicatorsProps {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
}

export const PageIndicators: React.FC<PageIndicatorsProps> = ({
  total,
  current,
  onSelect,
}) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-ink/70 backdrop-blur-md border border-cream/20 shadow-sm">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect && onSelect(idx)}
          aria-label={`Ver foto ${idx + 1}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            idx === current
              ? 'w-6 bg-gold'
              : 'w-1.5 bg-cream/40 hover:bg-cream/70'
          }`}
        />
      ))}
      <span className="text-[10px] tracking-wider text-cream/90 font-medium ml-1 font-mono">
        0{current + 1} / 0{total}
      </span>
    </div>
  );
};
