import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

/**
 * RoadSign Component
 * Heritage roadside signboard displaying the historical year beside the road.
 * Illuminates and highlights when the bus approaches or arrives at this stop.
 */
export const RoadSign = ({
  year,
  isActive = false,
  isPassed = false,
  side = 'left',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 select-none transition-all duration-300 ${
        isActive
          ? 'scale-110 filter drop-shadow-[0_6px_16px_rgba(244,81,30,0.35)]'
          : isPassed
          ? 'opacity-85'
          : 'opacity-65'
      } ${className}`}
    >
      {/* Signboard Post Graphic */}
      <div
        className={`px-3.5 py-1.5 rounded-xl border-2 flex items-center gap-2 shadow-md transition-all ${
          isActive
            ? 'bg-[#0B2340] text-[#FFC107] border-[#F4511E] ring-2 ring-[#F4511E]/30'
            : isPassed
            ? 'bg-[#0B2340]/90 text-white border-[#EBD6A2]'
            : 'bg-white text-[#0B2340] border-[#CBD5E1]'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            isActive ? 'bg-[#10B981] animate-ping' : isPassed ? 'bg-[#FFC107]' : 'bg-[#94A3B8]'
          }`}
        />
        
        <span className="font-black font-mono tracking-wider text-xs sm:text-sm">
          {year}
        </span>

        {isActive && (
          <Sparkles className="w-3 h-3 text-[#FFC107] animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default RoadSign;
