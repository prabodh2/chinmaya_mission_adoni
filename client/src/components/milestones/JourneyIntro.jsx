import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

/**
 * Journey Intro / Hero Section for Milestones
 */
export const JourneyIntro = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-4 px-4">
      {/* Top Journey Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/25 text-[var(--orange)] text-xs font-black uppercase tracking-widest shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>OUR JOURNEY THROUGH TIME</span>
      </div>

      {/* Main Heading */}
      <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#0B2340] tracking-tight leading-tight">
        OUR MILESTONES
      </h2>

      {/* Introductory Description */}
      <p className="text-sm sm:text-base text-[#24415C] leading-relaxed max-w-2xl mx-auto font-medium">
        From humble beginnings to a journey of service, culture, youth engagement and spiritual learning, these milestones reflect the continuing legacy of Chinmaya Mission Adoni.
      </p>

      {/* Interactive Road Guide Tip */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-[#3D607E]">
        <Compass className="w-4 h-4 text-[var(--orange)] animate-spin-slow" />
        <span>Scroll to drive along the historical road from 1992 to 2026</span>
      </div>
    </div>
  );
};

export default JourneyIntro;
