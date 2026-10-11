import React from 'react';
import { Sparkles } from 'lucide-react';

export const ContinuousVerticalBannerSlider = ({ banners = [] }) => {
  // Default 7 poster visuals if backend banners are loading or empty
  const defaultPosters = [
    {
      id: 'p1',
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
      title: 'SAY NO TO DRUGS • CHOOSE LIFE',
      tag: 'HEALTH & ENERGY',
      color: 'from-orange-600 to-amber-500',
    },
    {
      id: 'p2',
      imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
      title: 'ADONI YOUTH FOR A DRUG-FREE FUTURE',
      tag: 'DISCIPLINE & PURPOSE',
      color: 'from-cyan-600 to-blue-500',
    },
    {
      id: 'p3',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      title: 'RUN FOR FITNESS, FRIENDSHIP & FREEDOM',
      tag: 'CONFIDENCE & WILLPOWER',
      color: 'from-emerald-600 to-green-500',
    },
    {
      id: 'p4',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
      title: 'PEER PRESSURE IS OUT • INTEGRITY IS IN',
      tag: 'CHINMAYA YUVA KENDRA',
      color: 'from-purple-600 to-indigo-500',
    },
    {
      id: 'p5',
      imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
      title: 'YOUR CHOICE DEFINES YOUR TOMORROW',
      tag: 'DECEMBER 20, 2026',
      color: 'from-pink-600 to-rose-500',
    },
    {
      id: 'p6',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
      title: 'UNITED SCHOOLS & COLLEGES OF ADONI',
      tag: 'COMMUNITY POWER',
      color: 'from-yellow-600 to-orange-500',
    },
    {
      id: 'p7',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      title: 'MOVE. INSPIRE. CONNECT. ADONI 2026',
      tag: 'ANTI-DRUG MOVEMENT',
      color: 'from-blue-600 to-cyan-400',
    },
  ];

  // Filter out any default 'Vertical Poster' items
  const cleanBanners = (banners || []).filter(
    (b) => !/^Vertical Poster/i.test(b.title || '')
  );
  const itemsToDisplay = cleanBanners.length > 0 ? cleanBanners : defaultPosters;
  // Duplicate list to guarantee seamless infinite loop from right to left
  const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay];

  return (
    <div className="w-full overflow-hidden py-10 sm:py-14 bg-[var(--bg-dark-section)] relative border-y border-[var(--border-color)]">
      
      {/* Header Container aligned with main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--yellow)]/15 text-[var(--yellow)] font-extrabold text-xs tracking-widest uppercase border border-[var(--yellow)]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MOVEMENT POSTERS & INSPIRATION</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
          YOUTH EMPOWERMENT GALLERY
        </h3>
      </div>

      {/* Visual Overlay Gradients for smooth fade on left/right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[var(--bg-dark-section)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[var(--bg-dark-section)] to-transparent z-10 pointer-events-none" />

      {/* Infinite Right-to-Left Continuous Loop Container */}
      <div className="animate-scroll gap-5 sm:gap-6 px-4">
        {duplicatedItems.map((item, idx) => {
          const cleanTag = (item.tag || item.category || '')
            .replace(/\bmarathon\b\s*/gi, '')
            .replace(/\b2026\b/gi, '')
            .trim();

          return (
            <div
              key={`${item._id || item.id || idx}-${idx}`}
              className="w-64 sm:w-72 h-88 sm:h-96 flex-shrink-0 rounded-3xl overflow-hidden relative group border border-white/15 shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-slate-900"
            >
              <img
                src={item.imageUrl}
                alt={item.title || 'Chinmaya Mission Adoni'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100 block"
                loading="lazy"
              />
              
              {/* Poster Card Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 sm:p-6 flex flex-col justify-end text-left space-y-2">
                {cleanTag && cleanTag.toLowerCase() !== 'banner' ? (
                  <span className="inline-block self-start px-2.5 py-1 text-[10px] font-black tracking-wider rounded-lg bg-[var(--orange)] text-white shadow-md uppercase">
                    {cleanTag}
                  </span>
                ) : null}
                <h4 className="text-base font-extrabold text-white leading-snug font-heading group-hover:text-[var(--yellow)] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  Chinmaya Mission Adoni
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
