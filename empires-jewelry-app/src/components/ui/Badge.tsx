import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'ink' | 'taupe' | 'outline' | 'success' | 'alert';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-gold/20 text-ink border border-gold/40',
    ink: 'bg-ink text-cream border border-ink',
    taupe: 'bg-taupe/15 text-taupe-dark border border-taupe/30',
    outline: 'bg-transparent text-ink border border-taupe/40',
    success: 'bg-status-success/15 text-status-success border border-status-success/30',
    alert: 'bg-status-error/15 text-status-error border border-status-error/30',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] tracking-wider px-2 py-0.5 uppercase font-medium',
    md: 'text-xs tracking-wider px-3 py-1 uppercase font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-pill ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
