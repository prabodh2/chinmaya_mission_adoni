import React from 'react';

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
      tag: 'DECEMBER 6, 2026',
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

  const itemsToDisplay = banners.length > 0 ? banners : defaultPosters;
  // Duplicate list to guarantee seamless infinite loop from right to left
  const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay];

  return (
    <div className="w-full overflow-hidden py-8 bg-[var(--bg-dark-section)] relative border-y border-[var(--border-color)]">
      
      {/* Visual Overlay Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--bg-dark-section)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--bg-dark-section)] to-transparent z-10 pointer-events-none" />

      <div className="mb-4 text-center">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--yellow)] px-3 py-1 rounded-full bg-[var(--yellow)]/10 border border-[var(--yellow)]/30">
          FEATURED MOVEMENT POSTERS • ADONI 2026
        </span>
      </div>

      {/* Infinite Right-to-Left Continuous Loop Container */}
      <div className="animate-scroll gap-4 sm:gap-6 px-4">
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item._id || item.id || idx}-${idx}`}
            className="w-56 sm:w-64 h-80 sm:h-96 flex-shrink-0 rounded-2xl overflow-hidden relative group border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.03]"
          >
            <img
              src={item.imageUrl}
              alt={item.title || 'Marathon Poster'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              loading="lazy"
            />
            
            {/* Poster Card Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 sm:p-5 flex flex-col justify-end">
              <span className="inline-block self-start px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-lg bg-[var(--orange)] text-white mb-2 shadow-md">
                {item.tag || item.category || 'MARATHON 2026'}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight font-heading group-hover:text-[var(--yellow)] transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-300 font-medium mt-1">
                Chinmaya Mission Adoni
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
