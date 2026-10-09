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
      className={`group relative cursor-pointer transition-all duration-500 w-full max-w-md ${
        isActive
          ? 'scale-[1.02] opacity-100 z-30'
          : isPassed
          ? 'opacity-85 hover:opacity-100 z-10'
          : 'opacity-60 hover:opacity-95 z-10'
      }`}
    >
      {/* Main Card Shell */}
      <div
        className={`relative p-4 sm:p-5 rounded-2xl bg-white transition-all duration-300 border-2 ${
          isActive
            ? 'border-[#F4511E] shadow-[0_15px_35px_rgba(244,81,30,0.18),0_4px_16px_rgba(11,35,64,0.06)] ring-2 ring-[#F4511E]/15'
            : 'border-[#EBD6A2] hover:border-[#F4511E]/50 shadow-[0_2px_12px_rgba(11,35,64,0.04)] hover:shadow-md'
        }`}
      >
        {/* Top Header Row: Stop Tag & Year Signboard */}
        <div
          className={`flex flex-wrap items-center gap-2 mb-2.5 ${
            isLeft ? 'md:justify-end' : 'md:justify-start'
          } justify-start`}
        >
          {/* Historical Era Tag */}
          <EraBadge era={milestone.era} />

          {/* Prominent Year Badge */}
          {milestone.isContinuing ? (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F4511E] to-[#FFC107] text-white text-[11px] font-black font-heading tracking-wide shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{milestone.displayYear}</span>
            </span>
          ) : milestone.isRecurring ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-800 text-[11px] font-black font-heading tracking-wide flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-600 animate-spin-slow" />
              <span>{milestone.displayYear}</span>
            </span>
          ) : (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black font-heading tracking-wide transition-colors ${
                isActive
                  ? 'bg-[#F4511E] text-white shadow-sm'
                  : 'bg-[#F4511E]/15 text-[#F4511E] group-hover:bg-[#F4511E] group-hover:text-white'
              }`}
            >
              {milestone.displayYear}
            </span>
          )}

          {/* Category Tag */}
          <span className="text-[10px] font-bold text-[#3D607E] uppercase tracking-wider hidden sm:inline-block">
            • {milestone.tag}
          </span>
        </div>

        {/* Milestone Title */}
        <h3
          className={`text-sm sm:text-base font-black font-heading leading-snug mb-1.5 transition-colors ${
            isActive
              ? 'text-[#F4511E]'
              : 'text-[#0B2340] group-hover:text-[#F4511E]'
          } ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}
        >
          {milestone.title}
        </h3>

        {/* Description */}
        <p
          className={`text-xs text-[#24415C] leading-relaxed ${
            isLeft ? 'md:text-right' : 'md:text-left'
          } text-left`}
        >
          {milestone.description}
        </p>

        {/* SPECIAL HIGHLIGHT BADGE for Milestone 3 (1995): BEST UPCOMING CENTER */}
        {milestone.highlightBadge && (
          <div
            className={`mt-3 pt-2.5 border-t border-[#EBD6A2]/60 flex items-center gap-2 ${
              isLeft ? 'md:justify-end' : 'md:justify-start'
            } justify-start`}
          >
            <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-500/20 border border-amber-500/60 text-amber-900 text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm animate-pulse">
              <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>AWARD: {milestone.highlightBadge}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MilestoneCard;
