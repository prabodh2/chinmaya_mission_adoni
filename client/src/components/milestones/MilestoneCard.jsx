import React from 'react';
import { Award, BookOpen, Building2, Flame, Landmark, Layers, MapPin, Mic, Navigation, Sparkles, Sun, Trophy } from 'lucide-react';

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
 * Era theme subtle decorative accent badge
 */
const EraBadge = ({ era }) => {
  switch (era) {
    case 'beginning':
      return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">🌱 Origins</span>;
    case 'youth':
      return <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">⚡ Youth Leadership</span>;
    case 'temple':
      return <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">🛕 Temple Heritage</span>;
    case 'heritage':
      return <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">🏛️ Cultural Centre</span>;
    case 'spiritual':
      return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">🔥 Sacred Ceremony</span>;
    case 'education':
      return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">☀️ Value Education</span>;
    case 'celebration':
      return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">🏆 District Milestone</span>;
    default:
      return null;
  }
};

/**
 * MilestoneCard Component
 * Displays the destination stop with prominent year signboard, titles, descriptions, and award badges.
 * NOTE: Completely free of any "KM" badges per user instruction.
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
      className={`group relative cursor-pointer transition-all duration-500 w-full max-w-lg ${
        isActive
          ? 'scale-[1.03] opacity-100 z-30'
          : isPassed
          ? 'opacity-85 hover:opacity-100 z-10'
          : 'opacity-60 hover:opacity-95 z-10'
      }`}
    >
      {/* Main Card Shell */}
      <div
        className={`relative p-6 sm:p-7 rounded-[28px] bg-white transition-all duration-300 border-2 ${
          isActive
            ? 'border-[#F4511E] shadow-[0_20px_45px_rgba(244,81,30,0.22),0_4px_16px_rgba(11,35,64,0.06)] ring-4 ring-[#F4511E]/15'
            : 'border-[#EBD6A2] hover:border-[#F4511E]/50 shadow-[0_4px_20px_rgba(11,35,64,0.05)] hover:shadow-xl'
        }`}
      >
        {/* Top Header Row: Stop Tag & Year Signboard */}
        <div
          className={`flex flex-wrap items-center gap-2.5 mb-3.5 ${
            isLeft ? 'md:justify-end' : 'md:justify-start'
          } justify-start`}
        >
          {/* Historical Era Tag */}
          <EraBadge era={milestone.era} />

          {/* Prominent Year Badge */}
          {milestone.isContinuing ? (
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F4511E] to-[#FFC107] text-white text-xs sm:text-[13px] font-black font-heading tracking-wide shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{milestone.displayYear}</span>
            </span>
          ) : milestone.isRecurring ? (
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-800 text-xs sm:text-[13px] font-black font-heading tracking-wide flex items-center gap-1.5">
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
          className={`text-lg sm:text-xl font-black font-heading leading-tight mb-2 transition-colors ${
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

        {/* SPECIAL HIGHLIGHT BADGE for Milestone 3 (1995): BEST UPCOMING CENTER */}
        {milestone.highlightBadge && (
          <div
            className={`mt-4 pt-3.5 border-t border-[#EBD6A2]/60 flex items-center gap-2 ${
              isLeft ? 'md:justify-end' : 'md:justify-start'
            } justify-start`}
          >
            <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-500/20 border-2 border-amber-500/60 text-amber-900 text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-sm animate-pulse">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <span>AWARD: {milestone.highlightBadge}</span>
            </div>
          </div>
        )}

        {/* Active Bus Station Status Indicator */}
        {isActive && (
          <div className="mt-3.5 pt-2.5 flex items-center justify-between text-[11px] font-extrabold text-[#F4511E]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F4511E] animate-ping" />
              BUS STOPPED AT {milestone.year.toUpperCase()}
            </span>
            <span className="text-[10px] font-bold text-[#3D607E] font-mono">
              DESTINATION #{milestone.id} OF 13
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
