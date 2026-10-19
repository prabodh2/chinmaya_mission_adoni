import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { webContentService } from '../services/api';
import { ManagingCommittee } from '../components/ManagingCommittee';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Sparkles,
  User,
  Flame,
  ArrowRight,
} from 'lucide-react';

const MEMBERS_DATA = [
  {
    id: 'founder',
    role: 'FOUNDER',
    name: 'Chinmayananda Saraswati',
    honorific: 'Pujya Gurudev Swami Chinmayananda Saraswati',
    description: 'The visionary founder whose teachings continue to inspire generations.',
    extendedBio:
      'Pujya Gurudev Swami Chinmayananda Saraswati (1916–1993) was one of the foremost spiritual leaders and teachers of Vedanta in the modern era. Through his dynamic lectures, insightful commentaries on the Upanishads and Bhagavad Gita, and compassionate guidance, he revitalized spiritual education across India and globally.',
    largeImage: '/assets/leadership/swami-chinmayananda.png',
    thumbImage: '/assets/leadership/swami-chinmayananda-thumb.jpg',
    isFounder: true,
  },
  {
    id: 'former-head',
    role: 'Former Global Head',
    name: 'Pujya Swami Tejomayananda',
    honorific: 'Pujya Swami Tejomayananda (Guruji)',
    description:
      "A respected spiritual guide who has contributed to the continuation of Chinmaya Mission's teachings.",
    extendedBio:
      'Pujya Swami Tejomayananda served as the worldwide head of Chinmaya Mission from 1993 to 2017. A poet, philosopher, and profound teacher of Vedanta, Guruji steered the Mission through global expansion while deepening its educational, spiritual, and rural welfare initiatives.',
    largeImage: '/assets/leadership/swami-tejomayananda-official.jpg',
    thumbImage: '/assets/leadership/swami-tejomayananda-thumb.jpg',
  },
  {
    id: 'present-head',
    role: 'Global Head',
    name: 'Pujya Swami Swaroopananda',
    honorific: 'Pujya Swami Swaroopananda',
    description: "Guiding the Mission's spiritual vision and activities.",
    extendedBio:
      'Pujya Swami Swaroopananda is the current worldwide head of Chinmaya Mission. Internationally renowned for his contemporary and inspiring discourses, Swamiji guides hundreds of Chinmaya Mission centers, schools, and youth projects across the world.',
    largeImage: '/assets/leadership/swami-swaroopananda-official.jpg',
    thumbImage: '/assets/leadership/swami-swaroopananda-thumb.jpg',
  },
  {
    id: 'resident-acharya',
    role: 'RESIDENT BRAHMACHARI',
    name: 'Brahmachari Narayana Chaitanya',
    honorific: 'Brahmachari Narayana Chaitanya',
    description: 'Serving as the resident of Chinmaya Mission.',
    extendedBio:
      'Serving as the dedicated resident of Chinmaya Mission, coordinating spiritual discourses, youth mentoring programs, daily temple pujas, and community welfare initiatives across the region.',
    largeImage: '/assets/leadership/narayana-chaitanya.jpg',
    thumbImage: '/assets/leadership/narayana-chaitanya-thumb.jpg',
  },
];

export const WhoAreWePage = () => {
  const [pageData, setPageData] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cms_chinmaya_who_are_we');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // If no one clicks, selectedMember is null (shows only the 4-card layout matching Image 2)
  const [selectedMember, setSelectedMember] = useState(null);
  const showcaseRef = useRef(null);

  // Set document title
  useEffect(() => {
    document.title = 'Who We Are | Chinmaya Mission';
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    webContentService
      .getPublicPage('chinmaya', 'who-are-we')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem('cached_cms_chinmaya_who_are_we', JSON.stringify(res.data.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const f = pageData?.fieldsMap || {};

  // Handle member selection (click on pic or card)
  const handleSelectMember = (member) => {
    setSelectedMember(member);
    // Smoothly scroll to the expanded view
    setTimeout(() => {
      if (showcaseRef.current) {
        showcaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleCloseShowcase = () => {
    setSelectedMember(null);
  };

  const handleNextMember = () => {
    if (!selectedMember) return;
    const currentIndex = MEMBERS_DATA.findIndex((m) => m.id === selectedMember.id);
    const nextIndex = (currentIndex + 1) % MEMBERS_DATA.length;
    setSelectedMember(MEMBERS_DATA[nextIndex]);
  };

  const handlePrevMember = () => {
    if (!selectedMember) return;
    const currentIndex = MEMBERS_DATA.findIndex((m) => m.id === selectedMember.id);
    const prevIndex = (currentIndex - 1 + MEMBERS_DATA.length) % MEMBERS_DATA.length;
    setSelectedMember(MEMBERS_DATA[prevIndex]);
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedMember) return;
      if (e.key === 'Escape') handleCloseShowcase();
      if (e.key === 'ArrowRight') handleNextMember();
      if (e.key === 'ArrowLeft') handlePrevMember();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember]);

  return (
    <div className="min-h-screen bg-[#F8F3E8] pt-2 sm:pt-4 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* TOP SECTION HEADER (Faithful to Attachment 1 & 2) */}
        <header className="text-center space-y-1.5">
          <p className="text-xs sm:text-sm font-extrabold tracking-widest text-[#A26E33] uppercase">
            {(f.leadership_hero?.subtitle || 'CHINMAYA MISSION').replace(/[·,]\s*ADONI/gi, '').trim()}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B362A] tracking-tight font-heading">
            {f.leadership_hero?.title ? f.leadership_hero.title.replace(/Who Are We/i, 'Who We Are') : 'Who We Are'}
          </h1>
          <p className="text-sm sm:text-base text-[#526558] font-medium max-w-xl mx-auto">
            {f.leadership_hero?.overview || 'A legacy of wisdom, service and spiritual growth'}
          </p>
          {/* Decorative golden-ochre accent underline */}
          <div className="w-14 sm:w-16 h-1 bg-[#C89B59] rounded-full mx-auto mt-2" />
        </header>

        {/* ============================================================ */}
        {/* EXPANDED VIEW: When someone clicks on a member's picture/card */}
        {/* EXACTLY MATCHES ATTACHMENT 1                                */}
        {/* ============================================================ */}
        {selectedMember && (
          <section
            ref={showcaseRef}
            aria-label="Expanded Member View"
            className="animate-in fade-in zoom-in-95 duration-300 relative space-y-3"
          >
            {/* Top Toolbar / Action Header */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A26E33] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C89B59]" />
                <span>Featured Profile View</span>
              </span>

              <div className="flex items-center gap-2">
                {/* Previous Member Button */}
                <button
                  onClick={handlePrevMember}
                  className="p-1.5 sm:p-2 rounded-full bg-white border border-[#E7DFD3] text-[#1B362A] hover:bg-[#FAF6EE] hover:text-[#A26E33] transition-colors shadow-sm"
                  title="Previous Member (Left Arrow)"
                  aria-label="Previous member"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Next Member Button */}
                <button
                  onClick={handleNextMember}
                  className="p-1.5 sm:p-2 rounded-full bg-white border border-[#E7DFD3] text-[#1B362A] hover:bg-[#FAF6EE] hover:text-[#A26E33] transition-colors shadow-sm"
                  title="Next Member (Right Arrow)"
                  aria-label="Next member"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Close Button to return to the 2nd image layout */}
                <button
                  onClick={handleCloseShowcase}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E7DFD3] text-xs font-bold text-[#1B362A] hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm cursor-pointer ml-1"
                  title="Close preview and return to member list"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* EXPANDED CARD (Identical to Attachment 1) */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD3] shadow-[0_4px_24px_rgba(20,50,35,0.08)] bg-white">
              {/* Photo Area */}
              <div className="relative w-full bg-[#18231C] overflow-hidden group">
                {selectedMember.isPortraitPlaceholder ? (
                  // Portrait Placeholder view for Brahmachari Narayana Chaitanya
                  <div className="w-full h-80 sm:h-96 md:h-[420px] bg-[#EADBCC] flex flex-col items-center justify-center text-[#554B3E]">
                    <div className="w-24 h-24 rounded-full bg-white/70 flex items-center justify-center mb-3 shadow-sm border border-[#554B3E]/10">
                      <User className="w-12 h-12 text-[#554B3E]" />
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase">
                      Portrait
                    </span>
                    <p className="text-xs text-[#554B3E]/80 mt-1">
                      Resident · Chinmaya Mission
                    </p>
                  </div>
                ) : (
                  // Full Photo view: ALWAYS 100% VISIBLE, NEVER CUT OFF, PERFECTLY CLEAR
                  <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] bg-[#0E1A13] overflow-hidden flex items-center justify-center">
                    {/* Ambient blurred backdrop so every image fills container gracefully */}
                    <img
                      src={selectedMember.largeImage}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                    />
                    {/* The crisp high-resolution photo: FULL, COMPLETE, NEVER CROPPED */}
                    <img
                      src={selectedMember.largeImage}
                      alt={selectedMember.name}
                      className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain mx-auto drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
                    />
                  </div>
                )}
              </div>

              {/* White card container below the photo (Exact layout of Image 1) */}
              <div className="p-6 sm:p-8 bg-white space-y-2 border-t border-[#E7DFD3]/80">
                <p className="text-xs sm:text-sm font-bold tracking-wider text-[#A26E33] uppercase">
                  {selectedMember.role}
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143224] font-heading tracking-tight">
                  {selectedMember.name}
                </h2>
                <p className="text-sm sm:text-base text-[#4E6155] leading-relaxed pt-1">
                  {selectedMember.description}
                </p>

                {/* Extended Context details */}
                {selectedMember.extendedBio && (
                  <p className="text-xs sm:text-sm text-[#6C7B71] leading-relaxed pt-2 border-t border-slate-100 mt-3">
                    {selectedMember.extendedBio}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 4-MEMBER LIST SECTION: Matches Attachment 2                  */}
        {/* "Leadership & Local Mission" with all 4 members             */}
        {/* ============================================================ */}
        <section aria-label="Leadership & Local Mission" className="space-y-4">
          <div className="pb-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F3D2F] font-heading">
              Leadership & Local Mission
            </h2>
          </div>

          {/* Cards Stack */}
          <div className="space-y-4 sm:space-y-5">
            {MEMBERS_DATA.map((member) => {
              const isCurrentlySelected = selectedMember?.id === member.id;

              return (
                <article
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 p-4 sm:p-6 flex items-center gap-4 sm:gap-6 cursor-pointer group shadow-[0_2px_10px_rgba(20,50,35,0.03)] hover:shadow-md hover:-translate-y-0.5 ${
                    isCurrentlySelected
                      ? 'border-[#C89B59] ring-2 ring-[#C89B59]/30 bg-[#FFFDF9]'
                      : 'border-[#E7DFD3] hover:border-[#C89B59]/60'
                  }`}
                >
                  {/* Left Column: Photo / Thumbnail */}
                  <div className="shrink-0 relative">
                    {member.isPortraitPlaceholder ? (
                      // Portrait Placeholder box for Brahmachari Narayana Chaitanya (Image 2 style)
                      <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl sm:rounded-2xl bg-[#EADBCC] flex flex-col items-center justify-center text-[#554B3E] shadow-inner transition-transform group-hover:scale-105 border border-[#554B3E]/15">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#554B3E] mb-1 opacity-80" />
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#554B3E]">
                          Portrait
                        </span>
                      </div>
                    ) : (
                      // Image Thumbnail
                      <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm relative">
                        <img
                          src={member.thumbImage}
                          alt={member.name}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Hover hint */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1 sm:space-y-1.5">
                    <p className="text-[10px] sm:text-xs font-bold tracking-wider text-[#A26E33] uppercase">
                      {member.role}
                    </p>
                    <h3 className="text-base sm:text-xl font-bold text-[#143224] font-heading leading-snug group-hover:text-[#A26E33] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4E6155] leading-relaxed line-clamp-3">
                      {member.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* MANAGING COMMITTEE SECTION                                   */}
        {/* ============================================================ */}
        <ManagingCommittee />

        {/* BOTTOM CALLOUT / LINK TO ACTIVITIES & LET'S CONNECT */}
        <footer className="pt-6 border-t border-[#E7DFD3]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#6C7B71]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#A26E33]" />
            <span>Chinmaya Mission & Yuva Kendra (CHYK)</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="text-[#143224] hover:text-[#A26E33] font-bold text-decoration-none transition-colors"
            >
              ← Explore Events
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/lets-connect"
              className="text-[#A26E33] hover:underline font-bold text-decoration-none transition-colors"
            >
              Let's Connect →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WhoAreWePage;
