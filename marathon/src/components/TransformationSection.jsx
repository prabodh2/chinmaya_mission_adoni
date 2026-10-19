import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldAlert,
  Sparkles,
  HeartPulse,
  Users,
  Smile,
  Target,
  Compass,
  Sun,
  AlertTriangle,
  Frown,
  Zap,
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Lightbulb,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { PEER_PRESSURE_DETAILS, ORDERED_TRAIT_NAMES } from '../data/peerPressureData';
import { CLARITY_STRENGTH_DETAILS, ORDERED_POSITIVE_TRAIT_NAMES } from '../data/clarityStrengthData';

export const TransformationSection = ({ content }) => {
  if (content?._isEnabled === false) return null;

  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedPositiveTrait, setSelectedPositiveTrait] = useState(null);

  const title = content?.title || 'YOUR LIFE. YOUR CHOICE.';
  const subtitle =
    content?.subtitle ||
    'The Anti-Drug Movement Marathon is not just a run — it is a conscious transition from darkness into light, strength, and purposeful living.';
  const negativeTitle = content?.negativeTitle || 'Peer Pressure & Addiction';
  const positiveTitle = content?.positiveTitle || 'Clarity, Strength & Purpose';

  const negativeTraits = [
    { name: 'Peer Pressure', desc: 'Feeling forced to blend in with risky habits', icon: AlertTriangle },
    { name: 'Stress & Anxiety', desc: 'Seeking temporary escape from mental pressure', icon: Frown },
    { name: 'Bad Influences', desc: 'Negative social circles eroding values', icon: ShieldAlert },
    { name: 'Substance Addiction', desc: 'Loss of self-control, health and mental clarity', icon: Zap },
    { name: 'False Escape', desc: 'Illusion of comfort leading to long-term suffering', icon: AlertTriangle },
  ];

  const positiveTraits = [
    { name: 'Physical Health', desc: 'Building strength, stamina and natural vitality', icon: HeartPulse, color: 'text-emerald-500' },
    { name: 'Good Friends', desc: 'Surrounding yourself with supportive, uplifting peers', icon: Users, color: 'text-cyan-500' },
    { name: 'Inner Confidence', desc: 'Believing in your potential without fake substances', icon: Smile, color: 'text-amber-500' },
    { name: 'Self-Discipline', desc: 'Mastering daily habits and fitness goals', icon: Target, color: 'text-purple-500' },
    { name: 'Life Purpose', desc: 'Directing your energy towards meaningful achievements', icon: Compass, color: 'text-orange-500' },
    { name: 'Brighter Future', desc: 'Creating a healthy legacy for Adoni and society', icon: Sun, color: 'text-yellow-500' },
  ];

  // Lock background scroll when any modal is open
  useEffect(() => {
    const isModalOpen = Boolean(selectedTrait || selectedPositiveTrait);
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedTrait(null);
          setSelectedPositiveTrait(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedTrait, selectedPositiveTrait]);

  // Dark Escape Factor Navigation
  const activeDarkData = selectedTrait ? PEER_PRESSURE_DETAILS[selectedTrait] : null;
  const currentDarkIndex = selectedTrait ? ORDERED_TRAIT_NAMES.indexOf(selectedTrait) : -1;

  const handlePrevDark = () => {
    if (currentDarkIndex > 0) {
      setSelectedTrait(ORDERED_TRAIT_NAMES[currentDarkIndex - 1]);
    }
  };

  const handleNextDark = () => {
    if (currentDarkIndex < ORDERED_TRAIT_NAMES.length - 1) {
      setSelectedTrait(ORDERED_TRAIT_NAMES[currentDarkIndex + 1]);
    }
  };

  // Clarity & Strength Pillar Navigation
  const activePositiveData = selectedPositiveTrait ? CLARITY_STRENGTH_DETAILS[selectedPositiveTrait] : null;
  const currentPositiveIndex = selectedPositiveTrait ? ORDERED_POSITIVE_TRAIT_NAMES.indexOf(selectedPositiveTrait) : -1;

  const handlePrevPositive = () => {
    if (currentPositiveIndex > 0) {
      setSelectedPositiveTrait(ORDERED_POSITIVE_TRAIT_NAMES[currentPositiveIndex - 1]);
    }
  };

  const handleNextPositive = () => {
    if (currentPositiveIndex < ORDERED_POSITIVE_TRAIT_NAMES.length - 1) {
      setSelectedPositiveTrait(ORDERED_POSITIVE_TRAIT_NAMES[currentPositiveIndex + 1]);
    }
  };

  return (
    <section id="about" className="pt-2 sm:pt-4 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black font-heading text-[var(--text-primary)]">
          {title.includes('YOUR CHOICE') ? (
            <>
              YOUR LIFE. <span className="text-[var(--orange)]">YOUR CHOICE.</span>
            </>
          ) : (
            title
          )}
        </h2>
        <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Side-by-Side Visual Storytelling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
        {/* Dark / Negative Side Card */}
        <div className="gradient-negative p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between border border-slate-800 group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                {negativeTitle}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                Tap to explore
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
              Curiosity, stress, and negative influences lead young minds down a dangerous spiral, robbing youth of their dreams and peace.
            </p>

            {/* Hint */}
            <div className="flex items-center gap-1.5 text-[11px] text-red-300/80 mb-3 bg-red-950/40 border border-red-500/20 px-3 py-1.5 rounded-lg">
              <Info className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Click any factor below to view in-depth guide, impacts & prevention</span>
            </div>

            {/* List of Negative Factors */}
            <div className="space-y-2.5">
              {negativeTraits.map((trait, idx) => {
                const IconComponent = trait.icon;
                return (
                  <button
                    key={trait.name}
                    type="button"
                    onClick={() => setSelectedTrait(trait.name)}
                    className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-950/30 transition-all duration-200 cursor-pointer group/item focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 group-hover/item:bg-red-500/30 transition-all">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-red-400/90 bg-red-500/10 px-1.5 py-0.2 rounded">
                            #{idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 group-hover/item:text-red-300 transition-colors">
                            {trait.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {trait.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover/item:text-red-400 group-hover/item:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bright / Positive Side Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between border border-slate-200/90 border-l-4 border-l-[var(--orange)] group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-heading">
                {positiveTitle}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/25">
                Tap to explore
              </span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
              Running builds physical stamina, mental clarity, genuine friendships, and lasting self-respect.
            </p>

            {/* Hint */}
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800/90 mb-3 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-lg">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Click any pillar below to view health benefits, real examples & key message</span>
            </div>

            {/* List of Positive Factors - Now fully interactive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {positiveTraits.map((trait, idx) => {
                const IconComp = trait.icon;
                return (
                  <button
                    key={trait.name}
                    type="button"
                    onClick={() => setSelectedPositiveTrait(trait.name)}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 shadow-none hover:border-[var(--orange)] hover:bg-[var(--orange)]/[0.04] hover:shadow-md transition-all duration-200 text-left cursor-pointer group/pos focus:outline-none focus:ring-2 focus:ring-[var(--orange)]/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-[var(--orange)]/10 flex items-center justify-center ${trait.color} group-hover/pos:scale-110 transition-transform`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400 group-hover/pos:text-[var(--orange)]">
                            #{idx + 1}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/pos:text-[var(--orange)] group-hover/pos:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover/pos:text-[var(--orange)] transition-colors">
                        {trait.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        {trait.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL 1: Dark Escape Factors (Peer Pressure & Addiction) */}
      {selectedTrait && activeDarkData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedTrait(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="peer-pressure-modal-title"
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-[#0A1324] border border-red-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-1/4 w-80 h-36 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 bg-[#07101E]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    DARK ESCAPE • FACTOR #{activeDarkData.id} OF 5
                  </span>
                </div>
                <h3
                  id="peer-pressure-modal-title"
                  className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide"
                >
                  {activeDarkData.id}. {activeDarkData.title}
                </h3>
                <p className="text-xs sm:text-sm text-red-300/90 font-medium mt-1">
                  <span className="text-white/60 font-normal">Meaning:</span> {activeDarkData.meaning}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrait(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-red-500 text-white transition-all cursor-pointer shrink-0 mt-0.5"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="relative z-10 p-5 sm:p-7 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed text-slate-300 max-h-[calc(90vh-140px)]">
              {/* Overview */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <p className="leading-relaxed">{activeDarkData.overview}</p>
              </div>

              {/* How it can lead to addiction */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{activeDarkData.howItLeadsTitle || 'How it can lead to addiction'}</span>
                </h4>
                <ul className="space-y-2 pl-1">
                  {activeDarkData.howItLeads.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {activeDarkData.extraNote && (
                  <p className="text-xs text-slate-400 italic pt-1 pl-4">
                    {activeDarkData.extraNote}
                  </p>
                )}
              </div>

              {/* Real Example */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/30 to-slate-900/40 border border-red-500/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Real-World Scenario / Example</span>
                </div>
                <p className="text-slate-200 italic leading-relaxed">
                  "{activeDarkData.example}"
                </p>
              </div>

              {/* Impact */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/25 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Impact</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {activeDarkData.impact}
                </p>
              </div>

              {/* Prevention */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{activeDarkData.preventionTitle || 'Prevention & Action'}</span>
                </div>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeDarkData.prevention}
                </p>
              </div>

              {/* Key Message */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/30">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Key Message</span>
                </div>
                <p className="text-white font-bold text-sm sm:text-base leading-snug">
                  "{activeDarkData.keyMessage}"
                </p>
              </div>
            </div>

            {/* Modal Footer: Navigation between factors */}
            <div className="relative z-10 px-5 sm:px-7 py-3.5 border-t border-white/10 flex items-center justify-between bg-[#07101E] gap-2">
              <button
                type="button"
                onClick={handlePrevDark}
                disabled={currentDarkIndex === 0}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Factor Dots */}
              <div className="flex items-center gap-1.5">
                {ORDERED_TRAIT_NAMES.map((traitName) => (
                  <button
                    key={traitName}
                    type="button"
                    onClick={() => setSelectedTrait(traitName)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      selectedTrait === traitName
                        ? 'w-6 bg-red-500'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={traitName}
                    aria-label={`Go to ${traitName}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextDark}
                disabled={currentDarkIndex === ORDERED_TRAIT_NAMES.length - 1}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: Positive Pillars (Clarity, Strength & Purpose) */}
      {selectedPositiveTrait && activePositiveData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPositiveTrait(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="positive-pillar-modal-title"
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-[#0A1629] border border-[var(--orange)]/35 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Gold/Orange Glow */}
            <div className="absolute top-0 right-1/4 w-80 h-36 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 bg-[#071120]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[var(--orange)]/20 text-[var(--orange)] border border-[var(--orange)]/35 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[var(--orange)]" />
                    <span>CLARITY, STRENGTH & PURPOSE • PILLAR #{activePositiveData.id} OF 6</span>
                  </span>
                </div>
                <h3
                  id="positive-pillar-modal-title"
                  className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide"
                >
                  {activePositiveData.id}. {activePositiveData.title}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-1">
                  <span className="text-white/60 font-normal">Meaning:</span> {activePositiveData.meaning}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPositiveTrait(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-[var(--orange)] text-white transition-all cursor-pointer shrink-0 mt-0.5"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="relative z-10 p-5 sm:p-7 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed text-slate-300 max-h-[calc(90vh-140px)]">
              {/* Overview */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <p className="leading-relaxed">{activePositiveData.overview}</p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{activePositiveData.benefitsTitle || 'Core Benefits & Life Growth'}</span>
                </h4>
                <ul className="space-y-2.5 pl-1">
                  {activePositiveData.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real Example */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-900/40 border border-emerald-500/25">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Real-World Scenario / Example</span>
                </div>
                <p className="text-slate-200 italic leading-relaxed">
                  "{activePositiveData.example}"
                </p>
              </div>

              {/* Key Message */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[var(--orange)]/15 via-amber-500/15 to-emerald-500/10 border border-[var(--orange)]/35">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--orange)] mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Key Message</span>
                </div>
                <p className="text-white font-bold text-sm sm:text-base leading-snug">
                  "{activePositiveData.keyMessage}"
                </p>
              </div>
            </div>

            {/* Modal Footer: Navigation between positive pillars */}
            <div className="relative z-10 px-5 sm:px-7 py-3.5 border-t border-white/10 flex items-center justify-between bg-[#071120] gap-2">
              <button
                type="button"
                onClick={handlePrevPositive}
                disabled={currentPositiveIndex === 0}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Pillar Dots */}
              <div className="flex items-center gap-1.5">
                {ORDERED_POSITIVE_TRAIT_NAMES.map((traitName) => (
                  <button
                    key={traitName}
                    type="button"
                    onClick={() => setSelectedPositiveTrait(traitName)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      selectedPositiveTrait === traitName
                        ? 'w-6 bg-[var(--orange)]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={traitName}
                    aria-label={`Go to ${traitName}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextPositive}
                disabled={currentPositiveIndex === ORDERED_POSITIVE_TRAIT_NAMES.length - 1}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TransformationSection;
