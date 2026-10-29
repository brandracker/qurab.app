import React from 'react';

interface VerifiedBlueTickProps {
  size?: number;
  className?: string;
  title?: string;
}

/**
 * Authentic Twitter/Instagram/Telegram style Verified Blue Tick Badge
 * Crisp azure blue rosette (#1D9BF0) with smooth rounded lobes and centered white checkmark.
 */
export const VerifiedBlueTick: React.FC<VerifiedBlueTickProps> = ({ 
  size = 15, 
  className = '',
  title = 'Verified'
}) => {
  return (
    <span 
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`} 
      title={title}
      style={{ verticalAlign: 'middle', display: 'inline-flex' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M22.5 12.5c0-1.58-.8-2.95-2.03-3.69.41-1.54.1-3.21-.9-4.21s-2.67-1.31-4.21-.9C14.62 2.47 13.25 1.67 11.67 1.67s-2.95.8-3.69 2.03c-1.54-.41-3.21-.1-4.21.9s-1.31 2.67-.9 4.21C1.64 9.55.84 10.92.84 12.5s.8 2.95 2.03 3.69c-.41 1.54-.1 3.21.9 4.21s2.67 1.31 4.21.9c.74 1.23 2.11 2.03 3.69 2.03s2.95-.8 3.69-2.03c1.54.41 3.21.1 4.21-.9s1.31-2.67.9-4.21c1.23-.74 2.03-2.11 2.03-3.69z"
          fill="#1D9BF0"
        />
        <path
          d="M7 12.4l3.3 3.3 6.7-6.7"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
