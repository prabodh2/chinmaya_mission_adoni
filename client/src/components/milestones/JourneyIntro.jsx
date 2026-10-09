import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

/**
 * Journey Intro / Hero Section for Milestones
 */
export const JourneyIntro = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4 px-4">
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
      <div className="space-y-3 text-sm sm:text-base text-[#24415C] leading-relaxed max-w-2xl mx-auto font-medium">
        <p>
          Chinmaya Mission Adoni has been serving the spiritual, cultural, and educational needs of the community for several decades. Established in 1992 by 
          Swami Shyamananda (Dr. Shyamala) under the guidance of Swami Sharadapriyananda, the Mission was founded with the generous support and encouragement of well-wishers, including Sri Vita Bhimaiah and Sri B. V. R. Reddy.
        </p>
        <p className="text-[#3D607E] font-semibold">
          Over the years, the Mission has expanded its activities and contributed to the development of important spiritual and cultural institutions in Adoni!
        </p>
      </div>

      {/* Interactive Road Guide Tip */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-[#3D607E]">
        <Compass className="w-4 h-4 text-[var(--orange)] animate-spin-slow" />
        <span>Scroll to drive along the historical road from 1992 to 2026</span>
      </div>
    </div>
  );
};

export default JourneyIntro;
