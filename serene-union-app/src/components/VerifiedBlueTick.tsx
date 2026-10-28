import React from 'react';

interface VerifiedBlueTickProps {
  size?: number;
  className?: string;
  title?: string;
}

/**
 * Authentic Telegram/Twitter style Scalloped Verified Blue Tick Badge
 * Featuring a vibrant azure blue seal (#0088CC) and a crisp white checkmark.
 */
export const VerifiedBlueTick: React.FC<VerifiedBlueTickProps> = ({ 
  size = 16, 
  className = '',
  title = 'Verified Official Channel'
}) => {
  return (
    <span 
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`} 
      title={title}
      style={{ verticalAlign: 'middle' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 136, 204, 0.4))' }}
        aria-hidden="true"
      >
        {/* Iconic Scalloped Rosette Seal */}
        <path
          d="M12 1L14.6 3.9L18.4 4.1L19.4 7.8L22.6 9.8L21.7 13.5L23.2 17L19.9 18.9L18.4 22.4L14.6 22.1L12 24.5L9.4 22.1L5.6 22.4L4.1 18.9L0.8 17L2.3 13.5L1.4 9.8L4.6 7.8L5.6 4.1L9.4 3.9L12 1Z"
          fill="#0088CC"
        />
        {/* Crisp Bold White Checkmark */}
        <path
          d="M10.2 16.2L6.5 12.5L7.9 11.1L10.2 13.4L16.1 7.5L17.5 8.9L10.2 16.2Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
