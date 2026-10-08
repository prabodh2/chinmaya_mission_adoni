import React from 'react';
import { Award, CheckCircle2, ChevronUp, Flag, Heart, MapPin, Sparkles } from 'lucide-react';

/**
 * Final Destination Component
 * The terminal station of the journey through the history of Chinmaya Mission Adoni.
 */
export const FinalDestination = ({ onRestartJourney }) => {
  return (
    <div className="relative mt-20 pt-10 text-center max-w-4xl mx-auto px-4 z-20">
      
      {/* Road Finish Line Marker Graphic */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-0.5 w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#F4511E]" />
        <div className="px-4 py-1.5 rounded-full bg-[#0B2340] text-[#FFC107] text-xs font-black tracking-widest uppercase flex items-center gap-2 border border-[#FFC107]/30 shadow-lg">
          <Flag className="w-3.5 h-3.5 text-[#F4511E]" />
          <span>JOURNEY CONTINUES INTO 2026 & BEYOND</span>
        </div>
        <div className="h-0.5 w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#F4511E]" />
      </div>

      {/* Destination Terminal Card */}
      <div className="relative p-8 sm:p-12 rounded-[36px] bg-gradient-to-b from-white to-[#FFF9E6] border-2 border-[#EBD6A2] shadow-[0_20px_50px_rgba(11,35,64,0.1)] overflow-hidden">
        
        {/* Subtle Warm Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-[#F4511E]/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Emblem Pill */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#F4511E] to-[#FF7043] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#F4511E]/25">
            <Sparkles className="w-8 h-8" />
          </div>

          {/* Core Prompt Headline */}
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-[#0B2340] tracking-tight">
              THESE ARE OUR MILESTONES
            </h3>

            {/* Core Prompt Subtitle */}
            <p className="text-base sm:text-xl font-medium text-[#24415C] max-w-2xl mx-auto leading-relaxed italic">
              “Every milestone is a step in a journey of service, values, culture and spiritual growth.”
            </p>
          </div>

          {/* Legacy Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-[#EBD6A2]/80 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black font-heading text-[#F4511E] block">
                34+ Years
              </span>
              <span className="text-xs font-bold text-[#3D607E] uppercase tracking-wider mt-1 block">
                Dedicated Service (1992–2026)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBD6A2]/80 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black font-heading text-[#0B2340] block">
                13 Historic Stops
              </span>
              <span className="text-xs font-bold text-[#3D607E] uppercase tracking-wider mt-1 block">
                Temples, Complex & Youth Camps
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EBD6A2]/80 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black font-heading text-[#10B981] block">
                Thousands
              </span>
              <span className="text-xs font-bold text-[#3D607E] uppercase tracking-wider mt-1 block">
                Youth & Devotees Inspired
              </span>
            </div>
          </div>

          {/* Action: Re-drive journey button */}
          <div className="pt-4">
            <button
              onClick={onRestartJourney}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B2340] text-white hover:bg-[#F4511E] transition-all font-extrabold text-xs tracking-wider uppercase shadow-md hover:scale-105"
            >
              <ChevronUp className="w-4 h-4" />
              <span>RETURN TO START (1992)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default FinalDestination;
