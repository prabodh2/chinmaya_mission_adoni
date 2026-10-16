import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenLine,
  Sparkles,
  Compass,
  Search,
  Filter,
  RefreshCw,
  Heart,
  MessageSquare,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Smile,
  ShieldCheck,
  Send,
  LogIn,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { thoughtService } from '../services/api';

// Curated pastel color palette matching editorial stationery look
const COLOR_THEMES = {
  sky: {
    name: 'Sky Blue',
    bg: 'bg-[#E0F2FE]',
    border: 'border-[#BAE6FD]',
    text: 'text-[#0369A1]',
    tape: 'bg-[#BAE6FD]/80',
    dot: 'bg-[#38BDF8]',
    pill: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
  },
  yellow: {
    name: 'Warm Yellow',
    bg: 'bg-[#FEF9C3]',
    border: 'border-[#FDE047]',
    text: 'text-[#854D0E]',
    tape: 'bg-[#FDE047]/80',
    dot: 'bg-[#FACC15]',
    pill: 'bg-[#FEF9C3] text-[#854D0E] border-[#FDE047]',
  },
  coral: {
    name: 'Soft Coral',
    bg: 'bg-[#FFE4E6]',
    border: 'border-[#FECDD3]',
    text: 'text-[#9F1239]',
    tape: 'bg-[#FECDD3]/80',
    dot: 'bg-[#FB7185]',
    pill: 'bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]',
  },
  mint: {
    name: 'Mint Green',
    bg: 'bg-[#DCFCE7]',
    border: 'border-[#BBF7D0]',
    text: 'text-[#166534]',
    tape: 'bg-[#BBF7D0]/80',
    dot: 'bg-[#4ADE80]',
    pill: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
  },
  lavender: {
    name: 'Lavender',
    bg: 'bg-[#F3E8FF]',
    border: 'border-[#E9D5FF]',
    text: 'text-[#6B21A8]',
    tape: 'bg-[#E9D5FF]/80',
    dot: 'bg-[#C084FC]',
    pill: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
  },
  peach: {
    name: 'Peach',
    bg: 'bg-[#FFEDD5]',
    border: 'border-[#FED7AA]',
    text: 'text-[#9A3412]',
    tape: 'bg-[#FED7AA]/80',
    dot: 'bg-[#FB923C]',
    pill: 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]',
  },
  cream: {
    name: 'Warm Cream',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FEF3C7]',
    text: 'text-[#78350F]',
    tape: 'bg-[#FEF3C7]/80',
    dot: 'bg-[#FBBF24]',
    pill: 'bg-[#FFFBEB] text-[#78350F] border-[#FEF3C7]',
  },
};

// Deterministic rotation variations for organic sticky note feel
const ROTATION_STYLES = [
  '-rotate-1 hover:rotate-0',
  'rotate-1 hover:rotate-0',
  '-rotate-2 hover:rotate-0',
  'rotate-2 hover:rotate-0',
  '-rotate-0.5 hover:rotate-0',
  'rotate-1.5 hover:rotate-0',
  '-rotate-1.5 hover:rotate-0',
];

// Quick Emoji Palette for easy insertion
const QUICK_EMOJIS = [
  '🏃‍♂️', '🏃‍♀️', '🔥', '💪', '✨', '🌟', '🏅', '❤️',
  '🎉', '🕊️', '🌿', '🎯', '🙌', '🏆', '😊', '🙏',
];

export const YourThoughtsPage = () => {
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Story Board state
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState('ALL');

  // Composer Modal state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerContent, setComposerContent] = useState(() => {
    try {
      return sessionStorage.getItem('marathon_thought_draft') || '';
    } catch {
      return '';
    }
  });
  const [composerColor, setComposerColor] = useState('yellow');
  const [submitting, setSubmitting] = useState(false);
  const [composerError, setComposerError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Expanded note view modal for longer notes
  const [expandedThought, setExpandedThought] = useState(null);

  const boardSectionRef = useRef(null);
  const textareaRef = useRef(null);

  // Set document title
  useEffect(() => {
    document.title = 'Your Thoughts & Story Board | Marathon 2026';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Fetch approved thoughts
  const fetchThoughts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await thoughtService.getApprovedThoughts({ limit: 100 });
      if (res.data?.success) {
        setThoughts(res.data.data || []);
      } else {
        setError('Unable to load thoughts right now.');
      }
    } catch (err) {
      console.error('Error fetching approved thoughts:', err);
      setError('Could not connect to the story board. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  // Persist draft in sessionStorage so user doesn't lose text if they navigate to login
  useEffect(() => {
    try {
      if (composerContent) {
        sessionStorage.setItem('marathon_thought_draft', composerContent);
      } else {
        sessionStorage.removeItem('marathon_thought_draft');
      }
    } catch {}
  }, [composerContent]);

  // Insert emoji helper
  const handleInsertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setComposerContent((prev) => prev + emoji);
      return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const updated = composerContent.substring(0, start) + emoji + composerContent.substring(end);
    setComposerContent(updated);

    // Reposition cursor right after inserted emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Submit thought
  const handleSubmitThought = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setComposerError(null);

    const trimmed = composerContent.trim();
    if (!trimmed) {
      setComposerError('Please write your thought before submitting.');
      return;
    }
    if (trimmed.length < 3) {
      setComposerError('Please write at least a few words (minimum 3 characters).');
      return;
    }
    if (trimmed.length > 2000) {
      setComposerError('Your thought exceeds the 2,000 character maximum limit.');
      return;
    }

    if (!isUserAuthenticated) {
      setComposerError('Please log in with your phone number to submit your thought.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await thoughtService.createThought({
        content: trimmed,
        color: composerColor,
      });

      if (res.data?.success) {
        setSubmitSuccess(true);
        setComposerContent('');
        try {
          sessionStorage.removeItem('marathon_thought_draft');
        } catch {}
      } else {
        setComposerError(res.data?.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const msg = err.response?.data?.message || 'Could not submit your thought. Please check your connection and try again.';
      setComposerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Scroll to explore board
  const handleExploreBoard = () => {
    if (boardSectionRef.current) {
      boardSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered thoughts
  const filteredThoughts = useMemo(() => {
    return thoughts.filter((t) => {
      const matchesSearch = !searchQuery.trim() || t.content.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesColor = selectedColorFilter === 'ALL' || t.color === selectedColorFilter;
      return matchesSearch && matchesColor;
    });
  }, [thoughts, searchQuery, selectedColorFilter]);

  // Format non-identifying publication date
  const formatPublishedDate = (isoString) => {
    if (!isoString) return 'Marathon Community';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Marathon Community';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E5] text-[#07162D] transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION: OUR STORY BOARD                         */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#EBD6A2]/50">
        
        {/* Subtle decorative background paper grid pattern */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D4A373 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Ambient warm radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#FFD12D]/20 via-[#F0441D]/10 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#EBD6A2] shadow-xs backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-[#F0441D]" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#07162D]">
              Community Reflections & Voices
            </span>
          </div>

          {/* Elegant Oversized Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-[#07162D]">
              Our Story Board
            </h1>
            <p className="text-base sm:text-xl text-[#59616D] max-w-2xl mx-auto font-medium leading-relaxed">
              Every step has a story. Share your thoughts and discover the words that inspire our community.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            
            {/* Primary Action: Write Your Thoughts */}
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setComposerError(null);
                setIsComposerOpen(true);
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#F0441D] hover:bg-[#D73511] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_8px_20px_-4px_rgba(240,68,29,0.35)] hover:shadow-[0_12px_24px_-4px_rgba(240,68,29,0.45)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <PenLine className="w-5 h-5" />
              <span>Write Your Thoughts</span>
            </button>

            {/* Secondary Action: Explore the Story Board */}
            <button
              onClick={handleExploreBoard}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-[#07162D] border border-[#EBD6A2] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#F0441D]" />
              <span>Explore the Story Board</span>
            </button>
          </div>

          {/* Anonymous presentation reminder */}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#59616D] pt-1">
            <ShieldCheck className="w-4 h-4 text-[#138B52]" />
            <span>All stories are published completely anonymously to inspire fellow runners.</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STORY BOARD COMMUNITY WALL                            */}
      {/* ======================================================== */}
      <section
        ref={boardSectionRef}
        aria-label="Community Story Board Wall"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8"
      >
        
        {/* Filter and Search Bar */}
        <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#EBD6A2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#59616D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thoughts & stories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF5E5]/60 border border-[#EBD6A2] text-xs sm:text-sm text-[#07162D] focus:outline-none focus:border-[#F0441D] placeholder:text-[#59616D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#59616D] hover:text-[#07162D]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Center: Color Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center w-full md:w-auto">
            <button
              onClick={() => setSelectedColorFilter('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedColorFilter === 'ALL'
                  ? 'bg-[#07162D] text-white shadow-xs'
                  : 'bg-white text-[#59616D] border border-[#EBD6A2] hover:bg-[#FFF5E5]'
              }`}
            >
              All Colors ({thoughts.length})
            </button>

            {Object.entries(COLOR_THEMES).map(([colorKey, theme]) => {
              const count = thoughts.filter((t) => t.color === colorKey).length;
              if (count === 0 && selectedColorFilter !== colorKey) return null;

              return (
                <button
                  key={colorKey}
                  onClick={() => setSelectedColorFilter(colorKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    selectedColorFilter === colorKey
                      ? 'ring-2 ring-[#F0441D] ' + theme.pill
                      : theme.pill + ' opacity-75 hover:opacity-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                  <span>{theme.name}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Right: Refresh Button */}
          <button
            onClick={fetchThoughts}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-[#EBD6A2] text-[#07162D] hover:bg-[#FFF5E5] transition-colors shadow-xs cursor-pointer shrink-0"
            title="Refresh Story Board"
            aria-label="Refresh stories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F0441D]' : ''}`} />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#F0441D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#59616D]">
              Gathering community stories...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center max-w-lg mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-red-900">{error}</h3>
            <button
              onClick={fetchThoughts}
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredThoughts.length === 0 && (
          <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4 bg-white/70 rounded-3xl border border-[#EBD6A2] p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#FFE4E6] text-[#F0441D] flex items-center justify-center mx-auto shadow-inner">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-heading text-[#07162D]">
                {searchQuery || selectedColorFilter !== 'ALL'
                  ? 'No stories match your filter'
                  : 'No thoughts posted yet'}
              </h3>
              <p className="text-xs sm:text-sm text-[#59616D]">
                {searchQuery || selectedColorFilter !== 'ALL'
                  ? 'Try clearing your search query or color filter to see all community stories.'
                  : 'Be the very first runner or supporter to pin an encouraging thought on our community board!'}
              </p>
            </div>
            {searchQuery || selectedColorFilter !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedColorFilter('ALL');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#07162D] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setIsComposerOpen(true);
                }}
                className="px-6 py-3 rounded-xl bg-[#F0441D] text-white text-xs font-bold hover:bg-[#D73511] shadow-sm inline-flex items-center gap-2"
              >
                <PenLine className="w-4 h-4" />
                <span>Write the First Thought</span>
              </button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STICKY NOTES MASONRY / RESPONSIVE GRID                   */}
        {/* ======================================================== */}
        {!loading && !error && filteredThoughts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 pt-4">
            {filteredThoughts.map((thought, idx) => {
              const theme = COLOR_THEMES[thought.color] || COLOR_THEMES.yellow;
              const rotationClass = ROTATION_STYLES[idx % ROTATION_STYLES.length];
              const isLong = (thought.content || '').length > 220;

              return (
                <article
                  key={thought._id}
                  className={`relative group ${theme.bg} ${theme.border} border-2 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(7,22,45,0.06)] hover:shadow-[0_20px_35px_-5px_rgba(7,22,45,0.12)] transition-all duration-300 transform ${rotationClass} hover:scale-[1.02] hover:z-20 flex flex-col justify-between min-h-[220px]`}
                >
                  {/* Decorative Washi Tape strip at top */}
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-4 sm:h-5 ${theme.tape} rounded-xs shadow-xs backdrop-blur-xs transform -rotate-1 border border-black/5 pointer-events-none`}
                    aria-hidden="true"
                  />

                  {/* Top Bar inside note */}
                  <div className="flex items-center justify-between pt-1 pb-3 border-b border-black/5 text-[11px] font-bold opacity-75">
                    <span className="uppercase tracking-wider">
                      {theme.name}
                    </span>
                    <time dateTime={thought.createdAt}>
                      {formatPublishedDate(thought.createdAt)}
                    </time>
                  </div>

                  {/* Thought Content */}
                  <div className="py-3 flex-1">
                    <p
                      className={`text-sm sm:text-base leading-relaxed font-medium ${theme.text} whitespace-pre-line ${
                        isLong ? 'line-clamp-6' : ''
                      }`}
                    >
                      {thought.content}
                    </p>

                    {isLong && (
                      <button
                        onClick={() => setExpandedThought(thought)}
                        className="mt-2 text-xs font-bold underline hover:opacity-80 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read full note</span>
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Note Footer: Anonymity badge */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold opacity-70">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Anonymous Runner</span>
                    </span>
                    <span className="text-[10px] tracking-wide uppercase">
                      Marathon 2026
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. "SHARE YOUR THOUGHTS" WRITING MODAL                   */}
      {/* ======================================================== */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EBD6A2] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="composer-title"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#FFF5E5] border-b border-[#EBD6A2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F0441D] text-white flex items-center justify-center shadow-xs">
                  <PenLine className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="composer-title"
                    className="text-lg sm:text-xl font-black font-heading text-[#07162D]"
                  >
                    Share Your Thoughts
                  </h2>
                  <p className="text-xs text-[#59616D] font-medium">
                    Pin your words of inspiration to the Marathon Story Board.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-2 rounded-xl text-[#59616D] hover:text-[#07162D] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Success Notification after submission */}
              {submitSuccess ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#07162D] font-heading">
                      Thought Submitted Successfully!
                    </h3>
                    <p className="text-sm text-[#59616D] max-w-sm mx-auto leading-relaxed">
                      Thank you for sharing your thoughts! Your submission is awaiting review by our moderation team before appearing on the public Story Board.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsComposerOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#07162D] text-white font-bold text-xs hover:bg-[#F0441D] transition-colors"
                    >
                      Done & Back to Board
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitThought} className="space-y-4">
                  
                  {/* Anonymous Notice Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#E0F2FE]/70 border border-[#BAE6FD] flex items-center gap-2.5 text-xs text-[#0369A1]">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#0284C7]" />
                    <span>
                      <strong>100% Anonymous:</strong> Your name and contact details will never be displayed on the public Story Board.
                    </span>
                  </div>

                  {/* Authentication Banner if guest */}
                  {!isUserAuthenticated && (
                    <div className="p-4 rounded-2xl bg-[#FEF9C3] border border-[#FDE047] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#854D0E]">
                        <LogIn className="w-4 h-4 text-[#F0441D]" />
                        <span>Sign In Required to Submit</span>
                      </div>
                      <p className="text-xs text-[#854D0E]/90 leading-relaxed">
                        You can type your thought now! When you click submit, you will be prompted to sign in with your phone number. Your draft will be saved so you won't lose it.
                      </p>
                    </div>
                  )}

                  {/* Sticky Note Color Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#59616D] block">
                      Choose Sticky Note Color:
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(COLOR_THEMES).map(([colorKey, theme]) => (
                        <button
                          key={colorKey}
                          type="button"
                          onClick={() => setComposerColor(colorKey)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            composerColor === colorKey
                              ? 'ring-2 ring-[#07162D] ' + theme.pill
                              : theme.pill + ' opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                          <span>{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Sticky Note Text Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="thought-textarea" className="font-bold text-[#07162D]">
                        Your Thought / Inspiration:
                      </label>
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          composerContent.length > 1900
                            ? 'text-red-600'
                            : 'text-[#59616D]'
                        }`}
                      >
                        {composerContent.length} / 2,000 characters
                      </span>
                    </div>

                    {/* Paper styled textarea container */}
                    <div
                      className={`relative rounded-2xl border-2 p-4 transition-all ${
                        COLOR_THEMES[composerColor]?.bg || 'bg-[#FEF9C3]'
                      } ${COLOR_THEMES[composerColor]?.border || 'border-[#FDE047]'}`}
                    >
                      <textarea
                        ref={textareaRef}
                        id="thought-textarea"
                        rows={6}
                        value={composerContent}
                        onChange={(e) => setComposerContent(e.target.value)}
                        maxLength={2000}
                        placeholder="What inspires you to run? Share a cheer for our youth, your reflection on clean living, or an encouraging memory..."
                        className="w-full bg-transparent border-0 resize-y text-sm sm:text-base leading-relaxed text-[#07162D] focus:outline-none placeholder:text-[#59616D]/70 font-medium"
                      />
                    </div>
                  </div>

                  {/* Quick Emoji Tray */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#59616D]">
                      <span className="flex items-center gap-1">
                        <Smile className="w-3.5 h-3.5 text-[#F0441D]" />
                        <span>Tap to add emojis:</span>
                      </span>
                      <span className="text-[10px] text-[#59616D]">
                        Native keyboard emojis also supported
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-xl bg-[#FFF5E5] border border-[#EBD6A2]/60">
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleInsertEmoji(emoji)}
                          className="w-8 h-8 rounded-lg hover:bg-white text-base flex items-center justify-center transition-transform hover:scale-125 cursor-pointer shadow-2xs"
                          title={`Insert ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error display */}
                  {composerError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{composerError}</span>
                    </div>
                  )}

                  {/* Modal Action Buttons */}
                  <div className="pt-3 border-t border-[#EBD6A2] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsComposerOpen(false)}
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-white border border-[#EBD6A2] text-xs font-bold text-[#59616D] hover:text-[#07162D] hover:bg-[#FFF5E5] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    {!isUserAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsComposerOpen(false);
                          navigate('/login?redirect=/your-thoughts');
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#07162D] hover:bg-[#F0441D] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Submit</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting || composerContent.trim().length === 0}
                        className="px-6 py-2.5 rounded-xl bg-[#F0441D] hover:bg-[#D73511] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                      >
                        {submitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit for Review</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. EXPANDED THOUGHT MODAL (READ MORE)                    */}
      {/* ======================================================== */}
      {expandedThought && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-lg ${
              COLOR_THEMES[expandedThought.color]?.bg || 'bg-[#FEF9C3]'
            } ${
              COLOR_THEMES[expandedThought.color]?.border || 'border-[#FDE047]'
            } border-2 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200`}
            role="dialog"
            aria-modal="true"
          >
            {/* Top washi tape */}
            <div
              className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${
                COLOR_THEMES[expandedThought.color]?.tape || 'bg-[#FDE047]/80'
              } rounded-xs shadow-xs border border-black/5 pointer-events-none`}
            />

            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#07162D]/70">
                Story Board Note
              </span>
              <button
                onClick={() => setExpandedThought(null)}
                className="p-1.5 rounded-full hover:bg-black/10 text-[#07162D] transition-colors cursor-pointer"
                aria-label="Close note"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 max-h-[60vh] overflow-y-auto pr-1">
              <p
                className={`text-base sm:text-lg leading-relaxed font-medium ${
                  COLOR_THEMES[expandedThought.color]?.text || 'text-[#07162D]'
                } whitespace-pre-line`}
              >
                {expandedThought.content}
              </p>
            </div>

            <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-bold text-[#07162D]/70">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Anonymous Runner</span>
              </span>
              <span>{formatPublishedDate(expandedThought.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourThoughtsPage;
