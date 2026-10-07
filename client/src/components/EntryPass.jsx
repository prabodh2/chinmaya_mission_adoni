import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Chinmaya Mission Lamp & Om Insignia SVG
 * Faithfully matches the top-left emblem in the design reference.
 */
export const ChinmayaMissionLogo = ({ className = 'w-9 h-11' }) => (
  <svg
    viewBox="0 0 44 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Flame loop at top */}
    <path
      d="M18 4C18 4 12 11 12 19C12 26 17 31 19 35C21 39 19 43 15 47C11 50 6 48 4 45C2 42 3 37 6 35C9 33 13 34 14 37"
      stroke="#ea580c"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 4C21 4 24 9 24 16C24 23 20 28 17 32"
      stroke="#ea580c"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Om base glyph */}
    <path
      d="M23 37C25 34 29 34 32 37C35 40 34 44 30 46C34 48 38 50 37 54C36 57 30 58 24 56"
      stroke="#ea580c"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M32 46C37 46 41 49 42 53"
      stroke="#ea580c"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M33 32C38 31 41 34 42 37"
      stroke="#ea580c"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="42.5" cy="29" r="1.6" fill="#ea580c" />
  </svg>
);

/**
 * Reusable EntryPass Component
 * Closely reproduces the reference Entry Pass design.
 * 
 * @param {object} props
 * @param {object} props.registration - Registration record data
 * @param {object} [props.eventConfig] - Optional marathon event details
 * @param {string} [props.id] - Optional HTML container ID (defaults to 'entry-pass-card')
 */
export const EntryPass = ({ registration, eventConfig, id = 'entry-pass-card' }) => {
  if (!registration) return null;

  // Format event date dynamically or fallback to reference date
  const displayDate = eventConfig?.eventDate
    ? new Date(eventConfig.eventDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'Sunday, 20 December';

  const displayLocation = eventConfig?.venue || 'Municipal School, Adoni';

  // Format institution / type string
  const institutionName = (registration.institutionName || '').trim();
  const institutionType = (registration.institutionType || '').trim();
  let institutionDisplay = 'N/A';

  if (institutionName && institutionName !== 'N/A' && institutionName !== 'Other') {
    institutionDisplay = institutionType && institutionType !== 'OTHER'
      ? `${institutionName} / ${institutionType}`
      : institutionName;
  } else if (registration.isStudent) {
    institutionDisplay = 'STUDENT';
  } else {
    institutionDisplay = 'INDIVIDUAL';
  }

  return (
    <div
      id={id}
      className="entry-pass-container w-full max-w-[480px] mx-auto bg-white rounded-[32px] border-[2.5px] border-[#fca590] shadow-[0_12px_45px_-5px_rgba(0,0,0,0.08),0_4px_16px_-2px_rgba(0,0,0,0.04)] p-7 sm:p-9 text-slate-800 relative transition-all"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 1. HEADER */}
      <div className="relative pb-3.5">
        <div className="flex items-start">
          {/* Logo on the top-left */}
          <div className="absolute left-0 top-0.5">
            <ChinmayaMissionLogo className="w-8 sm:w-9 h-11" />
          </div>

          {/* Centered Heading */}
          <div className="w-full text-center pl-7 sm:pl-8 pr-2">
            <h2 className="text-base sm:text-[17px] font-black uppercase tracking-[0.06em] text-[#0f172a] leading-tight">
              CHINMAYA MISSION ADONI
            </h2>
            <p className="text-xs sm:text-[13px] font-medium text-[#475569] mt-0.5">
              Chinmaya Yuva Kendra
            </p>
            <p className="text-xs sm:text-[13px] font-black text-[#10b981] tracking-[0.14em] uppercase mt-1">
              ENTRY PASS
            </p>
          </div>
        </div>

        {/* Divider below header */}
        <div className="w-full border-b border-slate-200 mt-3.5" />
      </div>

      {/* 2. EVENT TITLE */}
      <div className="text-center my-3 sm:my-3.5">
        <h1 className="text-xl sm:text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight font-heading">
          ANTI-DRUG MARATHON 2026
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-[#ea580c] tracking-[0.18em] uppercase mt-1">
          ENTRY PASS
        </p>
      </div>

      {/* 3. PARTICIPANT INFORMATION CARD */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden mt-3 sm:mt-4">
        {/* Orange horizontal accent line */}
        <div className="w-full h-1 bg-[#f97316]" />

        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Two-Column Grid for Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-left">
            
            {/* Row 1 Left: REGISTRATION ID */}
            <div>
              <span className="text-[10px] sm:text-[10.5px] font-bold text-[#64748b] tracking-wider uppercase block">
                REGISTRATION ID
              </span>
              <div className="text-sm sm:text-base font-black text-[#0f172a] font-mono tracking-wide mt-0.5 border-b border-slate-200 pb-1 truncate">
                {registration.registrationId || '—'}
              </div>
            </div>

            {/* Row 1 Right: PARTICIPANT NAME */}
            <div>
              <span className="text-[10px] sm:text-[10.5px] font-bold text-[#64748b] tracking-wider uppercase block">
                PARTICIPANT NAME
              </span>
              <div className="text-sm sm:text-base font-black text-[#0f172a] mt-0.5 border-b border-slate-200 pb-1 truncate" title={registration.fullName}>
                {registration.fullName || '—'}
              </div>
            </div>

            {/* Row 2 Left: T-SHIRT SIZE */}
            <div>
              <span className="text-[10px] sm:text-[10.5px] font-bold text-[#64748b] tracking-wider uppercase block">
                T-SHIRT SIZE
              </span>
              <div className="text-sm sm:text-base font-black text-[#0f172a] mt-0.5 border-b border-slate-200 pb-1">
                {registration.tShirtSize || 'M'}
              </div>
            </div>

            {/* Row 2 Right: CONTACT NUMBER */}
            <div>
              <span className="text-[10px] sm:text-[10.5px] font-bold text-[#64748b] tracking-wider uppercase block">
                CONTACT NUMBER
              </span>
              <div className="text-sm sm:text-base font-black text-[#0f172a] font-mono mt-0.5 border-b border-slate-200 pb-1 truncate">
                {registration.contactNumber ? `+91 ${registration.contactNumber.replace(/^\+?91/, '').trim()}` : '—'}
              </div>
            </div>

            {/* Row 3 Left: INSTITUTION / TYPE */}
            <div className="col-span-2">
              <span className="text-[10px] sm:text-[10.5px] font-bold text-[#64748b] tracking-wider uppercase block">
                INSTITUTION / TYPE
              </span>
              <div className="text-xs sm:text-sm font-black text-[#0f172a] uppercase mt-0.5 border-b border-slate-200 pb-1 truncate" title={institutionDisplay}>
                {institutionDisplay}
              </div>
            </div>

          </div>

          {/* 4. EVENT DETAILS LIGHT-GREY BOX */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3 sm:p-3.5 space-y-2 mt-3">
            {/* Date Row */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-[#334155]">
              <div className="w-5 h-5 flex items-center justify-center text-[#ea580c] shrink-0">
                <Calendar className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="truncate">{displayDate}</span>
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-[#334155]">
              <div className="w-5 h-5 flex items-center justify-center text-[#0284c7] shrink-0">
                <MapPin className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="truncate">{displayLocation}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 5. FOOTER MESSAGE */}
      <p className="text-[11px] sm:text-xs font-semibold text-[#475569] text-center mt-5">
        Please carry this pass for entry to the marathon.
      </p>

      {/* 6. FOOTER DIVIDER & BRANDING */}
      <div className="w-3/4 mx-auto border-t border-slate-200 mt-3 mb-2.5" />

      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8] text-center">
        CHINMAYA MISSION ADONI • CHINMAYA YUVA KENDRA
      </p>
    </div>
  );
};

export default EntryPass;
