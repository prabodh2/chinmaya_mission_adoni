import React from 'react';

/**
 * JourneyBus Component (Straight Travel Coach)
 * Travels strictly along the straight vertical central highway.
 * Casts headlights forward down the road, and displays the active destination year badge.
 * 
 * @param {object} props
 * @param {boolean} [props.isMoving] - True when scrolling/moving
 * @param {string} [props.currentYear] - Current milestone year
 * @param {string} [props.className] - Additional classes
 */
export const JourneyBus = ({
  isMoving = false,
  currentYear = '1992',
  className = '',
}) => {
  return (
    <div
      className={`relative z-40 select-none pointer-events-none ${className}`}
      style={{
        width: '56px',
        height: '96px',
      }}
      aria-label="Chinmaya Mission Tour Bus"
    >
      {/* 1. Forward Headlight Beams (Shooting straight forward down the vertical road) */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-28 h-36 pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full opacity-80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="headlightBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FDE047" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
            <filter id="beamBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
            </filter>
          </defs>
          {/* Left Lamp Beam */}
          <polygon
            points="32,0 8,130 44,130 38,0"
            fill="url(#headlightBeamGrad)"
            filter="url(#beamBlur)"
          />
          {/* Right Lamp Beam */}
          <polygon
            points="62,0 56,130 92,130 68,0"
            fill="url(#headlightBeamGrad)"
            filter="url(#beamBlur)"
          />
        </svg>
      </div>

      {/* 2. Soft Dynamic Vehicle Shadow on Road */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-22 bg-black/40 rounded-2xl blur-md pointer-events-none" />

      {/* 3. Coach Body Vector Graphic (Top-Down Coach facing straight down) */}
      <svg
        viewBox="0 0 70 120"
        className="w-full h-full relative z-10 drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D84315" />
            <stop offset="25%" stopColor="#F4511E" />
            <stop offset="75%" stopColor="#FF7043" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>
          <linearGradient id="roofCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FFF3D6" />
          </linearGradient>
          <linearGradient id="windshieldGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B2340" />
          </linearGradient>
        </defs>

        {/* Wheels (4 rubber tires with grip) */}
        <rect x="2" y="16" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <rect x="62" y="16" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <rect x="2" y="80" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <rect x="62" y="80" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />

        {/* Outer Bumper / Chassis */}
        <rect x="7" y="6" width="56" height="106" rx="16" fill="#0B2340" />

        {/* Main Aerodynamic Bus Body */}
        <rect x="9" y="8" width="52" height="102" rx="14" fill="url(#busBodyGrad)" stroke="#C83E13" strokeWidth="1.5" />

        {/* Rear Lights & Exhaust Vent */}
        <rect x="17" y="10" width="36" height="5" rx="2" fill="#334155" />
        <rect x="12" y="9" width="7" height="4" rx="2" fill="#EF4444" />
        <rect x="51" y="9" width="7" height="4" rx="2" fill="#EF4444" />

        {/* White Cream Roof */}
        <rect x="13" y="19" width="44" height="74" rx="10" fill="url(#roofCreamGrad)" stroke="#EBD6A2" strokeWidth="1" />

        {/* Side Passenger Windows */}
        <rect x="12" y="30" width="3.5" height="50" rx="1.5" fill="#1E293B" />
        <rect x="54.5" y="30" width="3.5" height="50" rx="1.5" fill="#1E293B" />

        {/* Front Panoramic Curved Windshield */}
        <path
          d="M 15 90 Q 35 95 55 90 L 53 102 Q 35 107 17 102 Z"
          fill="url(#windshieldGlass)"
          stroke="#0F172A"
          strokeWidth="1.2"
        />

        {/* Windshield Glare Reflection */}
        <path
          d="M 19 92 Q 28 95 38 93 L 36 100 Q 26 100 21 97 Z"
          fill="white"
          opacity="0.5"
        />

        {/* Glowing Headlight Bulbs */}
        <circle cx="19" cy="105" r="3.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="19" cy="105" r="1.5" fill="#FFFFFF" />
        <circle cx="51" cy="105" r="3.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="51" cy="105" r="1.5" fill="#FFFFFF" />

        {/* Roof Destination Display Screen */}
        <rect x="19" y="58" width="32" height="15" rx="3" fill="#0B2340" />
        <text
          x="35"
          y="69"
          fontSize="5.5"
          fontWeight="900"
          fill="#FFC107"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          CMA 2026
        </text>

        {/* Roof Vent / AC Unit */}
        <rect x="22" y="33" width="26" height="18" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="26" y1="37" x2="44" y2="37" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="26" y1="42" x2="44" y2="42" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Chinmaya Mission Sacred Om Insignia on Front Roof */}
        <circle cx="35" cy="26" r="4.5" fill="#F4511E" stroke="#FFC107" strokeWidth="1" />
        <path
          d="M 33 25 C 34 24 36 24 37 26 C 36 28 34 28 33 27"
          stroke="#FFFFFF"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="36.5" cy="23.5" r="0.6" fill="#FFFFFF" />
      </svg>

      {/* 4. Active Stop Tag Floating Above the Bus */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B2340] text-[#FFC107] text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-[#FFC107]/40 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
        <span>{currentYear}</span>
      </div>
    </div>
  );
};

export default JourneyBus;
