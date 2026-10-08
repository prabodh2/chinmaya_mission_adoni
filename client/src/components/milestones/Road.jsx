import React from 'react';
import { Check, MapPin } from 'lucide-react';

/**
 * Landscape Decorative Element: Subtle Stylized Shrub / Tree
 */
const RoadsideTree = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 30 40"
    className={`w-5 h-7 opacity-75 drop-shadow-sm select-none pointer-events-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Trunk */}
    <rect x="13.5" y="26" width="3" height="12" rx="1.5" fill="#78350F" />
    {/* Foliage Layers */}
    <path
      d="M15 2 C22 2 28 9 27 16 C26 23 20 27 15 27 C10 27 4 23 3 16 C2 9 8 2 15 2 Z"
      fill={flip ? '#15803D' : '#16A34A'}
    />
    <circle cx="12" cy="11" r="5" fill="#22C55E" opacity="0.6" />
  </svg>
);

/**
 * Roadside Streetlamp / Lantern Post
 */
const StreetLamp = ({ className = '', active = false }) => (
  <svg
    viewBox="0 0 20 40"
    className={`w-4 h-8 select-none pointer-events-none drop-shadow-sm ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 38 L10 10 Q10 4 15 4" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="15" cy="7" r="2.5" fill={active ? '#FBBF24' : '#E2E8F0'} stroke="#334155" strokeWidth="1" />
    {active && (
      <circle cx="15" cy="7" r="5" fill="#FEF08A" opacity="0.5" />
    )}
  </svg>
);

/**
 * Continuous Vertical Highway Road Component
 * Provides the central roadway, road markings, roadside landscape, and stop station beacons.
 */
export const Road = ({
  milestones = [],
  activeStopIndex = 0,
  onStopClick,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-y-0 w-16 sm:w-20 md:w-24 left-6 md:left-1/2 -translate-x-1/2 z-0 flex flex-col items-center ${className}`}
      aria-hidden="true"
    >
      {/* 1. Main Asphalt Highway Surface */}
      <div className="absolute inset-y-0 w-14 sm:w-16 md:w-20 bg-gradient-to-b from-[#1E293B] via-[#334155] to-[#1E293B] rounded-full shadow-[0_0_24px_rgba(11,35,64,0.18)] border-x-2 border-[#64748B]/40 overflow-hidden">
        
        {/* Subtle Asphalt Texture & Road Curbs */}
        <div className="absolute inset-y-0 left-1 w-0.5 bg-white/30" />
        <div className="absolute inset-y-0 right-1 w-0.5 bg-white/30" />

        {/* Center Dashed Highway Dividing Line */}
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-[#FBBF24]/75"
          style={{
            backgroundRepeat: 'repeat-y',
          }}
        />

        {/* Road Surface Subtle Lighting Highlight */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-white/[0.04] pointer-events-none" />
      </div>

      {/* 2. Soft Roadside Shoulder & Natural Gravel Buffers */}
      <div className="absolute inset-y-0 -left-3 w-3 bg-gradient-to-r from-transparent to-[#EBD6A2]/50 pointer-events-none" />
      <div className="absolute inset-y-0 -right-3 w-3 bg-gradient-to-l from-transparent to-[#EBD6A2]/50 pointer-events-none" />

      {/* 3. Roadside Natural Landscape Scatter (Trees & Streetlamps) */}
      <div className="absolute top-[8%] -left-8 hidden md:block">
        <RoadsideTree flip={false} />
      </div>
      <div className="absolute top-[18%] -right-8 hidden md:block">
        <RoadsideTree flip={true} />
      </div>
      <div className="absolute top-[32%] -left-7 hidden md:block">
        <StreetLamp active={activeStopIndex >= 4} />
      </div>
      <div className="absolute top-[48%] -right-8 hidden md:block">
        <RoadsideTree flip={false} />
      </div>
      <div className="absolute top-[64%] -left-8 hidden md:block">
        <RoadsideTree flip={true} />
      </div>
      <div className="absolute top-[78%] -right-7 hidden md:block">
        <StreetLamp active={activeStopIndex >= 10} />
      </div>
      <div className="absolute top-[92%] -left-8 hidden md:block">
        <RoadsideTree flip={false} />
      </div>
    </div>
  );
};

export default Road;
