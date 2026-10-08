import React from 'react';
import { Award, BookOpen, Building2, Calendar, Flame, Landmark, Layers, MapPin, Mic, Navigation, Sparkles, Sun, Trophy } from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  BookOpen,
  Award,
  Landmark,
  Building2,
  Layers,
  Navigation,
  Flame,
  Sun,
  Mic,
  Trophy,
};

/**
 * Milestone Card & Roadside Stop Component
 * Renders an interactive milestone destination with roadside signboard, connecting turnoff, and rich typography.
 */
export const MilestoneCard = ({
  milestone,
  position = 'left',
  isActive = false,
  isPassed = false,
  onClick,
}) => {
  const IconComponent = ICON_MAP[milestone.icon] || MapPin;
  const isLeft = position === 'left';

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer transition-all duration-500 ${
        isActive
          ? 'scale-[1.02] opacity-100 z-20'
          : isPassed
          ? 'opacity-85 hover:opacity-100 z-10'
          : 'opacity-70 hover:opacity-95 z-10'
      }`}
    >
      {/* Main Card Container */}
      <div
        className={`relative p-6 sm:p-7 rounded-3xl bg-white transition-all duration-300 border-2 ${
          isActive
            ? 'border-[#F4511E] shadow-[0_16px_40px_rgba(244,81,30,0.18),0_4px_16px_rgba(11,35,64,0.06)] ring-4 ring-[#F4511E]/15'
            : 'border-[#EBD6A2] hover:border-[#F4511E]/60 shadow-[0_4px_24px_rgba(11,35,64,0.06)] hover:shadow-xl'
        }`}
      >
        {/* Top Header Row: Highway KM Stone & Year Signboard */}
        <div
          className={`flex flex-wrap items-center gap-2.5 mb-3.5 ${
            isLeft ? 'md:justify-end' : 'md:justify-start'
          } justify-start`}
        >
          {/* Milestone Number / Distance Pill */}
          <span className="px-2.5 py-1 rounded-lg bg-[#0B2340] text-[#FFC107] text-[11px] font-black font-mono tracking-wider shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            {milestone.km}
          </span>

          {/* Prominent Year Badge */}
          {milestone.isContinuing ? (
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F4511E] to-[#FFC107] text-white text-xs sm:text-[13px] font-black font-heading tracking-wide shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{milestone.displayYear}</span>
            </span>
          ) : milestone.isRecurring ? (
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-700 text-xs sm:text-[13px] font-black font-heading tracking-wide flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span>{milestone.displayYear}</span>
            </span>
          ) : (
            <span
              className={`px-3.5 py-1 rounded-full text-xs sm:text-[13px] font-black font-heading tracking-wide transition-colors ${
                isActive
                  ? 'bg-[#F4511E] text-white shadow-md'
                  : 'bg-[#F4511E]/15 text-[#F4511E] group-hover:bg-[#F4511E] group-hover:text-white'
              }`}
            >
              {milestone.displayYear}
            </span>
          )}

          {/* Category Tag */}
          <span className="text-[11px] font-bold text-[#3D607E] uppercase tracking-wider hidden sm:inline-block">
            • {milestone.tag}
          </span>
        </div>

        {/* Milestone Title */}
        <h3
          className={`text-lg sm:text-xl font-black font-heading leading-tight mb-2.5 transition-colors ${
            isActive
              ? 'text-[#F4511E]'
              : 'text-[#0B2340] group-hover:text-[#F4511E]'
          } ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}
        >
          {milestone.title}
        </h3>

        {/* Description */}
        <p
          className={`text-xs sm:text-sm text-[#24415C] leading-relaxed ${
            isLeft ? 'md:text-right' : 'md:text-left'
          } text-left`}
        >
          {milestone.description}
        </p>

        {/* SPECIAL HIGHLIGHT BADGE for Milestone 3: "BEST UPCOMING CENTER" */}
        {milestone.highlightBadge && (
          <div
            className={`mt-3.5 pt-3 border-t border-[#EBD6A2]/60 flex items-center gap-2 ${
              isLeft ? 'md:justify-end' : 'md:justify-start'
            } justify-start`}
          >
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 border border-amber-500/50 text-amber-900 text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <span>AWARD: {milestone.highlightBadge}</span>
            </div>
          </div>
        )}

        {/* Active Bus Station Indicator Bar */}
        {isActive && (
          <div className="mt-3.5 pt-2 flex items-center justify-between text-[11px] font-extrabold text-[#F4511E] animate-pulse">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F4511E] animate-ping" />
              BUS STOPPED HERE
            </span>
            <span className="text-[10px] font-bold text-[#3D607E] font-mono">
              STOP #{milestone.id} OF 13
            </span>
          </div>
        )}
      </div>

      {/* Decorative Roadside Milestone Marker Stone */}
      <div
        className={`hidden md:flex absolute top-1/2 -translate-y-1/2 items-center ${
          isLeft ? '-right-14 flex-row' : '-left-14 flex-row-reverse'
        }`}
      >
        {/* Roadside Turnoff Connector Line */}
        <div
          className={`h-0.5 transition-all duration-300 ${
            isActive ? 'w-10 bg-[#F4511E]' : 'w-8 bg-[#EBD6A2]'
          }`}
        />

        {/* Indian Highway Style Milestone Post (Curved Top, Yellow Header, White Base) */}
        <div
          className={`w-7 h-10 rounded-t-xl rounded-b-md border shadow-md flex flex-col items-center justify-between overflow-hidden transition-transform duration-300 ${
            isActive
              ? 'scale-110 border-[#F4511E] ring-2 ring-[#F4511E]/30'
              : 'border-[#CBD5E1] group-hover:scale-105'
          }`}
        >
          {/* Top Yellow Cap */}
          <div className="w-full h-4 bg-[#FFC107] flex items-center justify-center">
            <span className="text-[7px] font-black text-[#0B2340] font-mono">
              {milestone.id}
            </span>
          </div>
          {/* White Base with Stop Initials */}
          <div className="w-full h-6 bg-white flex flex-col items-center justify-center px-0.5">
            <span className="text-[6.5px] font-black text-[#0B2340] leading-none">
              CMA
            </span>
            <span className="text-[5.5px] font-bold text-[#F4511E] font-mono">
              {milestone.km}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
