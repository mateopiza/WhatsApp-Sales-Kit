import React from 'react';

export type IconName =
  | 'diamond'
  | 'ring'
  | 'necklace'
  | 'bag'
  | 'shield'
  | 'gift'
  | 'heart'
  | 'search'
  | 'sparkle'
  | 'whatsapp';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = '',
  ...props
}) => {
  switch (name) {
    case 'diamond':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M6 2h12l4 6-10 14L2 8z" />
          <path d="M2 8h20" />
          <path d="M9 2l-3 6 6 14 6-14-3-6" />
        </svg>
      );

    case 'ring':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3l4 4-4 4-4-4z" />
          <path d="M12 11a7 7 0 1 0 0.01 0z" />
        </svg>
      );

    case 'necklace':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M4 4c0 6 3.5 10 8 10s8-4 8-10" />
          <path d="M12 14v2" />
          <path d="M12 16a2.5 2.5 0 1 0 0.01 0z" />
        </svg>
      );

    case 'bag':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M6 8h12l1 13H5z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );

    case 'shield':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );

    case 'gift':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M4 9h16v4H4z" />
          <path d="M6 9v11h12V9" />
          <path d="M12 9v11" />
          <path d="M12 9C9 9 8 6 9.5 4.8 11 3.6 12 6 12 9z" />
          <path d="M12 9c3 0 4-3 2.5-4.2C13 3.6 12 6 12 9z" />
        </svg>
      );

    case 'heart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2.3 4.5 6 4.5c2.1 0 3.5 1.2 4.5 2.7C11.5 5.7 12.9 4.5 15 4.5c3.7 0 5.2 3.5 3.5 7C19 15.65 12 20 12 20z" />
        </svg>
      );

    case 'search':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );

    case 'sparkle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 2v4m0 12v4m-10-10h4m12 0h4m-3.5-6.5l-2.8 2.8m-7.4 7.4l-2.8 2.8m0-13l2.8 2.8m7.4 7.4l2.8 2.8" />
        </svg>
      );

    case 'whatsapp':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          {...props}
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.301-.776.98-.952 1.18-.175.2-.35.226-.651.076-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.175-.3-.019-.463.131-.613.136-.134.301-.35.451-.526.15-.175.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.233-.244-.588-.493-.508-.677-.518-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.507s1.078 2.908 1.229 3.109c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35z" />
        </svg>
      );

    default:
      return null;
  }
};
