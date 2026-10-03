import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto', size = 34 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`object-contain flex-shrink-0 ${className}`}
      aria-label="Sultan's Kitchen Royal Crest Logo"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D076" />
          <stop offset="50%" stopColor="#E5A93C" />
          <stop offset="100%" stopColor="#AA711C" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="#141312" stroke="url(#goldGrad)" strokeWidth="3" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#E5A93C" strokeWidth="1" strokeDasharray="3 3" />
      <path
        d="M100 38 C108 55 125 65 142 68 C130 82 124 98 126 116 C115 110 106 108 100 112 C94 108 85 110 74 116 C76 98 70 82 58 68 C75 65 92 55 100 38 Z"
        fill="url(#goldGrad)"
      />
      <path
        d="M100 58 C96 68 85 75 75 78 C82 88 84 98 82 110 C88 106 95 106 100 108 C105 106 112 106 118 110 C116 98 118 88 125 78 C115 75 104 68 100 58 Z"
        fill="#141312"
      />
      <circle cx="100" cy="85" r="4.5" fill="url(#goldGrad)" />
      <text
        x="100"
        y="142"
        fontFamily="'Playfair Display', serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="3"
        fill="#FAF7F2"
        textAnchor="middle"
      >
        SULTAN'S
      </text>
      <text
        x="100"
        y="157"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="4"
        fill="#E5A93C"
        textAnchor="middle"
      >
        KITCHEN
      </text>
      <text
        x="100"
        y="172"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="9"
        fill="#A89F91"
        textAnchor="middle"
      >
        সুলতানস কিচেন
      </text>
    </svg>
  );
};
