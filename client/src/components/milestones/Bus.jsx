import React from 'react';

/**
 * Animated Tour Coach Bus Component
 * Travels along the road, casting headlight beams on the highway and stopping at milestones.
 * 
 * @param {object} props
 * @param {boolean} [props.isMoving] - True when the bus is actively scrolling/moving
 * @param {string} [props.currentYear] - The year of the currently active milestone
 * @param {string} [props.className] - Extra Tailwind classes
 */
export const Bus = ({ isMoving = false, currentYear = '1992', className = '' }) => {
  return (
    <div
      className={`relative z-30 select-none pointer-events-none transition-transform duration-300 ${className}`}
      style={{
        width: '60px',
        height: '100px',
      }}
      aria-label="Chinmaya Mission Tour Bus"
    >
      {/* Headlight Beams Casting Light Forward Down the Road */}
      <div className="absolute top-[82px] left-1/2 -translate-x-1/2 w-28 h-32 pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full opacity-80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="headlightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FDE047" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </linearGradient>
            <filter id="lightGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
            </filter>
          </defs>
          {/* Left Headlight Beam */}
          <polygon
            points="34,0 12,120 44,120 38,0"
            fill="url(#headlightGradient)"
            filter="url(#lightGlow)"
          />
          {/* Right Headlight Beam */}
          <polygon
            points="62,0 56,120 88,120 66,0"
            fill="url(#headlightGradient)"
            filter="url(#lightGlow)"
          />
        </svg>
      </div>

      {/* Shadow below the bus */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-24 bg-black/35 rounded-2xl blur-md pointer-events-none" />

      {/* Main Bus SVG Graphic (Top-Down Coach View) */}
      <svg
        viewBox="0 0 70 120"
        className="w-full h-full relative z-10 drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E64A19" />
            <stop offset="25%" stopColor="#F4511E" />
            <stop offset="70%" stopColor="#FF7043" />
            <stop offset="100%" stopColor="#E64A19" />
          </linearGradient>
          <linearGradient id="roofCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FFF2D6" />
          </linearGradient>
          <linearGradient id="windshieldGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Wheels (4 Black rubber tires with silver hubcaps) */}
        <rect x="3" y="18" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <rect x="61" y="18" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <rect x="3" y="82" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <rect x="61" y="82" width="6" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />

        {/* Main Chassis / Bumper */}
        <rect x="8" y="6" width="54" height="106" rx="16" fill="#0B2340" />

        {/* Bus Body Base */}
        <rect x="10" y="8" width="50" height="102" rx="14" fill="url(#busBodyGrad)" stroke="#C83E13" strokeWidth="1.5" />

        {/* Rear Engine / Grill & Tail Lights */}
        <rect x="18" y="10" width="34" height="6" rx="2" fill="#334155" />
        {/* Tail lights */}
        <rect x="13" y="9" width="7" height="4" rx="2" fill="#EF4444" />
        <rect x="50" y="9" width="7" height="4" rx="2" fill="#EF4444" />

        {/* White Roof / Top Passenger Cabin */}
        <rect x="14" y="20" width="42" height="74" rx="10" fill="url(#roofCreamGrad)" stroke="#EBD6A2" strokeWidth="1" />

        {/* Side Windows Strip */}
        <rect x="13" y="32" width="3" height="48" rx="1.5" fill="#1E293B" />
        <rect x="54" y="32" width="3" height="48" rx="1.5" fill="#1E293B" />

        {/* Front Windshield Curved Glass */}
        <path
          d="M 16 90 Q 35 94 54 90 L 52 101 Q 35 106 18 101 Z"
          fill="url(#windshieldGlass)"
          stroke="#0F172A"
          strokeWidth="1"
        />
        {/* Windshield Shine Reflection */}
        <path
          d="M 20 92 Q 28 94 36 93 L 34 99 Q 26 99 22 97 Z"
          fill="url(#glassShine)"
        />

        {/* Headlight Lamps (Glowing Yellow/White) */}
        <circle cx="20" cy="104" r="3.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="20" cy="104" r="1.5" fill="#FFFFFF" />
        <circle cx="50" cy="104" r="3.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="50" cy="104" r="1.5" fill="#FFFFFF" />

        {/* Roof AC / Luggage Pod */}
        <rect x="22" y="34" width="26" height="20" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="26" y1="38" x2="44" y2="38" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="26" y1="44" x2="44" y2="44" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="26" y1="50" x2="44" y2="50" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Roof Insignia / Destination LED Plate */}
        <rect x="20" y="60" width="30" height="15" rx="3" fill="#0B2340" />
        <text
          x="35"
          y="70"
          fontSize="5"
          fontWeight="900"
          fill="#FFC107"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          CMA 2026
        </text>

        {/* Orange Accent Stripe on Roof */}
        <rect x="18" y="79" width="34" height="4" rx="1" fill="#F4511E" />

        {/* Center Golden Om Symbol Emblem on Roof */}
        <circle cx="35" cy="27" r="4.5" fill="#F4511E" stroke="#FFC107" strokeWidth="1" />
        <path
          d="M 33 26 C 34 25 36 25 37 27 C 36 29 34 29 33 28"
          stroke="#FFFFFF"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="36.5" cy="24.5" r="0.6" fill="#FFFFFF" />
      </svg>

      {/* Floating Active Stop Tag above Bus */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B2340] text-[#FFC107] text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-[#FFC107]/40 flex items-center gap-1.5 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
        <span>{currentYear}</span>
      </div>
    </div>
  );
};

export default Bus;
