import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  showText?: boolean;
  variant?: 'badge' | 'full' | 'icon' | 'horizontal';
  invertSloganForDark?: boolean;
}

export default function Logo({
  className = '',
  size = 'md',
  showSlogan = true,
  showText = false,
  variant = 'badge',
  invertSloganForDark = true,
}: LogoProps) {
  const sizeMap = {
    sm: { badgeSize: 42, width: 48, height: 56, textClass: 'text-xs' },
    md: { badgeSize: 52, width: 62, height: 72, textClass: 'text-sm' },
    lg: { badgeSize: 76, width: 90, height: 104, textClass: 'text-base' },
    xl: { badgeSize: 110, width: 130, height: 152, textClass: 'text-xl' },
  };

  const { width, height } = sizeMap[size];

  // SVG Badge representation of the official logo
  const badgeSvg = (
    <svg
      viewBox="0 0 240 270"
      className={`shrink-0 select-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Racores y Mangueras de Nariño - Calidad y Servicio"
    >
      <defs>
        <clipPath id="rmCircleClip">
          <circle cx="120" cy="115" r="92" />
        </clipPath>
        <linearGradient id="rmNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#091e48" />
          <stop offset="100%" stopColor="#0d2e6e" />
        </linearGradient>
        <linearGradient id="rmGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd400" />
          <stop offset="100%" stopColor="#f5b800" />
        </linearGradient>
        <path id="rmSloganArc" d="M 24 198 A 110 110 0 0 0 216 198" fill="none" />
      </defs>

      {/* Main Circular Seal */}
      <g className="transition-transform duration-300 group-hover:scale-105 origin-center">
        {/* Navy Blue Base (Upper-Left) */}
        <circle cx="120" cy="115" r="92" fill="url(#rmNavyGrad)" />

        {/* Diagonal Cut Yellow Half (Bottom-Right) */}
        <polygon
          points="0,235 235,0 260,0 260,260 0,260"
          clipPath="url(#rmCircleClip)"
          fill="url(#rmGoldGrad)"
        />

        {/* Clean diagonal division hairline */}
        <line
          x1="55"
          y1="180"
          x2="185"
          y2="50"
          stroke="#091e48"
          strokeWidth="2.5"
          clipPath="url(#rmCircleClip)"
        />

        {/* Letter R (Golden Yellow on Navy Blue) */}
        <text
          x="78"
          y="118"
          fontFamily="'Montserrat', 'Arial Black', Impact, sans-serif"
          fontSize="68"
          fontWeight="900"
          fill="#ffd400"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ letterSpacing: '-2px' }}
        >
          R
        </text>

        {/* Letter M (Navy Blue on Golden Yellow) */}
        <text
          x="158"
          y="145"
          fontFamily="'Montserrat', 'Arial Black', Impact, sans-serif"
          fontSize="64"
          fontWeight="900"
          fill="#091e48"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ letterSpacing: '-2px' }}
        >
          M
        </text>

        {/* Outer Circular Navy Border */}
        <circle
          cx="120"
          cy="115"
          r="92"
          fill="none"
          stroke="#091e48"
          strokeWidth="5"
        />
        {/* Subtle inner gold rim for modern elegance */}
        <circle
          cx="120"
          cy="115"
          r="89"
          fill="none"
          stroke="#ffd400"
          strokeWidth="1.2"
          strokeOpacity="0.75"
        />
      </g>

      {/* Slogan Text: CALIDAD Y SERVICIO */}
      {showSlogan && (
        <text
          fontFamily="'Montserrat', 'Arial Black', sans-serif"
          fontSize="18"
          fontWeight="900"
          fill={invertSloganForDark ? '#ffd400' : '#091e48'}
          letterSpacing="2"
          className="uppercase tracking-widest font-black"
        >
          <textPath href="#rmSloganArc" startOffset="50%" textAnchor="middle">
            CALIDAD Y SERVICIO
          </textPath>
        </text>
      )}
    </svg>
  );

  if (variant === 'badge' || variant === 'icon') {
    return badgeSvg;
  }

  // Horizontal variant (Emblem + Company Name + Slogan)
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {badgeSvg}

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black text-lg md:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
              RACORES Y MANGUERAS
            </span>
          </div>
          <span className="text-[11px] md:text-xs font-bold text-amber-400 tracking-[0.25em] uppercase font-heading">
            DE NARIÑO • S.A.S.
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-amber-300/90 font-mono">
              Calidad y Servicio
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
