import React, { useState } from 'react';
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
} from 'lucide-react';

export const TransformationSection = () => {
  const [activeTab, setActiveTab] = useState('ALL');

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

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] text-xs font-extrabold tracking-widest uppercase border border-[var(--orange)]/30">
          <Sparkles className="w-4 h-4" />
          THE TRANSFORMATION STORY
        </span>
        <h2 className="text-3xl sm:text-5xl font-black font-heading text-[var(--text-primary)]">
          YOUR LIFE. <span className="text-[var(--orange)]">YOUR CHOICE.</span>
        </h2>
        <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
          The Anti-Drug Movement Marathon is not just a run — it is a conscious transition from darkness into light, strength, and purposeful living.
        </p>
      </div>

      {/* Side-by-Side Visual Storytelling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
        
        {/* Dark / Negative Side Card */}
        <div className="gradient-negative p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between border border-slate-800 group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-[11px] uppercase tracking-wider mb-5 border border-red-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              THE DARK SIDE • THE TRAP
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-heading">
              Peer Pressure & Addiction
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Curiosity, stress, and negative influences lead young minds down a dangerous spiral, robbing youth of their dreams and peace.
            </p>

            {/* List of Negative Factors */}
            <div className="space-y-3">
              {negativeTraits.map((trait) => {
                const IconComponent = trait.icon;
                return (
                  <div key={trait.name} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{trait.name}</h4>
                      <p className="text-[11px] text-slate-400">{trait.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>DARK ESCAPE</span>
            <span className="text-red-400">CHOOSE TO BREAK FREE →</span>
          </div>
        </div>

        {/* Bright / Positive Side Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between border border-slate-200/90 border-l-4 border-l-[var(--orange)] group">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-bold text-[11px] uppercase tracking-wider mb-5 border border-[var(--orange)]/25">
              <Sun className="w-3.5 h-3.5" />
              THE BRIGHT SIDE • THE MOVEMENT
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 font-heading">
              Health, Purpose & Brighter Future
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Running builds physical stamina, mental clarity, genuine friendships, and lasting self-respect.
            </p>

            {/* List of Positive Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {positiveTraits.map((trait) => {
                const IconComp = trait.icon;
                return (
                  <div key={trait.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 shadow-none hover:border-[var(--orange)]/50 transition-colors">
                    <div className={`w-7 h-7 rounded-lg bg-[var(--orange)]/10 flex items-center justify-center mb-1.5 ${trait.color}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{trait.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{trait.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--orange)] uppercase tracking-wider">
              RUN FOR A DRUG-FREE ADONI
            </span>
            <Link to="/register" className="btn-primary py-2 px-5 text-xs text-decoration-none inline-flex items-center gap-1.5 shadow-sm">
              <span>JOIN THE RUN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
};
