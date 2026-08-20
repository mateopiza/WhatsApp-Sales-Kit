import React, { useState } from 'react';

export interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'portrait' | 'square' | 'hero' | 'editorial' | 'tall' | 'custom';
  wrapperClassName?: string;
  fallbackText?: string;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  src,
  alt = 'Empires Jewelry',
  aspectRatio = 'portrait',
  className = '',
  wrapperClassName = '',
  fallbackText = 'EMPIRES JEWELRY',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const ratioClass = {
    portrait: 'aspect-[4/5]',
    square: 'aspect-square',
    hero: 'aspect-[3/4] sm:aspect-[16/9]',
    editorial: 'aspect-[3/4]',
    tall: 'aspect-[9/16]',
    custom: '',
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden bg-stone/20 ${ratioClass} ${wrapperClassName}`}>
      {/* Shimmer Pulse */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/60 to-transparent animate-shimmer"
          style={{ backgroundSize: '200% 100%' }}
        />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-cream-200/50 text-taupe-dark">
          <span className="font-display text-xs tracking-wider uppercase">{fallbackText}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={props.loading || 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
