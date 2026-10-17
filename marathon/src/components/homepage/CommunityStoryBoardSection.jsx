import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenLine,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import { thoughtService } from '../../services/api';

const COLOR_THEMES = {
  sky: {
    name: 'Sky Blue',
    bg: 'bg-[#E0F2FE]',
    border: 'border-[#BAE6FD]',
    text: 'text-[#0369A1]',
    tape: 'bg-[#BAE6FD]/80',
  },
  yellow: {
    name: 'Warm Yellow',
    bg: 'bg-[#FEF9C3]',
    border: 'border-[#FDE047]',
    text: 'text-[#854D0E]',
    tape: 'bg-[#FDE047]/80',
  },
  coral: {
    name: 'Soft Coral',
    bg: 'bg-[#FFE4E6]',
    border: 'border-[#FECDD3]',
    text: 'text-[#9F1239]',
    tape: 'bg-[#FECDD3]/80',
  },
  mint: {
    name: 'Mint Green',
    bg: 'bg-[#DCFCE7]',
    border: 'border-[#BBF7D0]',
    text: 'text-[#166534]',
    tape: 'bg-[#BBF7D0]/80',
  },
  lavender: {
    name: 'Lavender',
    bg: 'bg-[#F3E8FF]',
    border: 'border-[#E9D5FF]',
    text: 'text-[#6B21A8]',
    tape: 'bg-[#E9D5FF]/80',
  },
};

const ROTATION_STYLES = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];

const FALLBACK_THOUGHTS = [
  {
    _id: 'fb-1',
    content: 'Running for a drug-free generation! Adoni\'s youth have immense energy and potential. Let\'s channel it into sports, service, and spiritual strength. 🏃‍♂️🔥',
    color: 'yellow',
    createdAt: '2026-10-16T12:00:00.000Z',
  },
  {
    _id: 'fb-2',
    content: 'Every step we take together in this marathon echoes a clear message: Health is true wealth! Proud to be part of Chinmaya Mission\'s initiative. ✨💪',
    color: 'mint',
    createdAt: '2026-10-16T12:15:00.000Z',
  },
  {
    _id: 'fb-3',
    content: 'Running my first 5K with my college batch! Excited to promote healthy, drug-free living in Adoni! 🏃‍♂️🎉',
    color: 'sky',
    createdAt: '2026-10-16T12:30:00.000Z',
  },
  {
    _id: 'fb-4',
    content: 'Clean minds, active bodies, and a united community. Say NO to drugs, YES to life! 🕊️❤️',
    color: 'coral',
    createdAt: '2026-10-16T12:45:00.000Z',
  },
];

export const CommunityStoryBoardSection = ({ content }) => {
  if (content?._isEnabled === false) return null;

  const [thoughts, setThoughts] = useState(FALLBACK_THOUGHTS);
  const [loading, setLoading] = useState(false);

  const badgeText = content?.badgeText || 'COMMUNITY VOICES & STORY BOARD';
  const title = content?.title || 'Voices of Strength: Your Thoughts & Stories';
  const subtitle = content?.subtitle || 'Read real thoughts, pledges, and words of encouragement shared by runners, students, and citizens across Adoni standing united against addiction.';

  useEffect(() => {
    let isMounted = true;
    const fetchThoughts = async () => {
      try {
        setLoading(true);
        const res = await thoughtService.getApprovedThoughts({ limit: 4 });
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          setThoughts(res.data.data.slice(0, 4));
        }
      } catch (err) {
        // Graceful fallback to default curated community thoughts
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchThoughts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-[var(--bg-secondary,#FFFBF5)] to-[var(--bg-primary,#FFFFFF)] border-y border-[var(--border-color,rgba(11,35,64,0.08))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/25 text-[var(--orange)] text-xs font-black uppercase tracking-wider mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-primary,#0B2340)] tracking-tight">
              {title.includes('Your Thoughts') ? (
                <>
                  Voices of Strength: <span className="text-[var(--orange,#F0441D)]">Your Thoughts & Stories</span>
                </>
              ) : (
                title
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-muted,#475569)] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/your-thoughts"
              className="btn-primary text-decoration-none py-2.5 px-5 text-xs font-extrabold flex items-center gap-2 shadow-md hover:scale-[1.02] transition-transform"
            >
              <PenLine className="w-4 h-4" />
              <span>SHARE YOUR THOUGHT</span>
            </Link>
            <Link
              to="/your-thoughts"
              className="px-4 py-2.5 rounded-xl border-2 border-[var(--border-color,#E2E8F0)] hover:border-[var(--orange)] text-[var(--text-primary)] hover:text-[var(--orange)] font-bold text-xs flex items-center gap-1.5 transition-all text-decoration-none bg-white shadow-xs"
            >
              <span>View All Thoughts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {thoughts.map((thought, idx) => {
            const theme = COLOR_THEMES[thought.color] || COLOR_THEMES.yellow;
            const rotationClass = ROTATION_STYLES[idx % ROTATION_STYLES.length];

            return (
              <article
                key={thought._id || idx}
                className={`relative group ${theme.bg} ${theme.border} border-2 rounded-2xl sm:rounded-3xl p-5 shadow-[0_10px_25px_-5px_rgba(7,22,45,0.06)] hover:shadow-[0_20px_35px_-5px_rgba(7,22,45,0.12)] transition-all duration-300 transform ${rotationClass} hover:scale-[1.02] hover:z-20 flex flex-col justify-between min-h-[220px]`}
              >
                {/* Washi Tape Strip */}
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 ${theme.tape} rounded-xs shadow-xs backdrop-blur-xs transform -rotate-1 border border-black/5 pointer-events-none`}
                  aria-hidden="true"
                />

                {/* Top Note Meta */}
                <div className="flex items-center justify-between pt-1 pb-2 border-b border-black/5 text-[11px] font-bold opacity-75">
                  <span className="uppercase tracking-wider">
                    {theme.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wide">
                    Adoni 2026
                  </span>
                </div>

                {/* Content */}
                <div className="py-3 flex-1">
                  <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.text} line-clamp-5 whitespace-pre-line`}>
                    "{thought.content}"
                  </p>
                </div>

                {/* Note Footer */}
                <div className="pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] font-bold opacity-70">
                  <span className="inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Anonymous Runner</span>
                  </span>
                  <span className="text-[10px] tracking-wide uppercase text-[var(--orange)]">
                    Verified
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner Strip */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#0B2340] to-[#1E3A8A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[var(--orange)] flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">
                Have a pledge, story, or message to share with Adoni?
              </p>
              <p className="text-xs text-slate-300">
                Post your thought in seconds. All messages are moderated to maintain respect and inspire our community.
              </p>
            </div>
          </div>
          <Link
            to="/your-thoughts"
            className="px-5 py-2.5 rounded-xl bg-[var(--orange)] hover:bg-[#D73511] text-white font-extrabold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-md text-decoration-none"
          >
            Leave Your Mark →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CommunityStoryBoardSection;
