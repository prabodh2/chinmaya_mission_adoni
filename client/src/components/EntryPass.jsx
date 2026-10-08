import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Reusable EntryPass Component
 * Faithfully matches the official Chinmaya Mission Adoni Entry Pass design reference.
 * 
 * @param {object} props
 * @param {object} props.registration - Registration record data
 * @param {object} [props.eventConfig] - Optional marathon event details
 * @param {string} [props.id] - Optional HTML container ID (defaults to 'official-entry-pass')
 */
export const EntryPass = ({ registration, eventConfig, id = 'official-entry-pass' }) => {
  if (!registration) return null;

  // Format event date dynamically or fallback to reference date
  const displayDate = eventConfig?.eventDate
    ? new Date(eventConfig.eventDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'Sunday, 20 December';

  const displayLocation = eventConfig?.venue || 'Chinmaya Mission Adoni';

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

  // Format contact number with "+91  XXXXXXXXXX" spacing matching reference
  const formattedPhone = registration.contactNumber
    ? `+91  ${registration.contactNumber.replace(/^\+?91/, '').trim()}`
    : '—';

  return (
    <div
      id={id}
      className="entry-pass-container w-full max-w-[460px] mx-auto bg-white rounded-[28px] sm:rounded-[32px] border-[2px] border-[#ea580c] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 text-slate-800 relative transition-all"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 1. TOP HEADER WITH LOGOS */}
      <div className="relative pb-3 sm:pb-3.5">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Chinmaya Mission Om Logo */}
          <div className="shrink-0 w-11 sm:w-12 flex justify-start">
            <img
              src="/assets/logos/logo-2.png"
              alt="Chinmaya Mission"
              className="w-9 sm:w-10 h-13 sm:h-14 object-contain"
              crossOrigin="anonymous"
            />
          </div>

          {/* Center: Title & Subtitles */}
          <div className="flex-1 text-center px-1">
            <h2 className="text-base sm:text-[17px] font-black uppercase tracking-[0.05em] text-[#0f172a] leading-tight">
              CHINMAYA MISSION ADONI
            </h2>
            <p className="text-xs sm:text-[13px] font-semibold text-[#2563eb] mt-0.5">
              Chinmaya Yuva Kendra <span className="font-black text-[#0f172a]">Adoni</span>
            </p>
            <p className="text-xs sm:text-[13px] font-black text-[#10b981] tracking-[0.16em] uppercase mt-1">
              ENTRY PASS
            </p>
          </div>

          {/* Right: Chyk Logo */}
          <div className="shrink-0 w-11 sm:w-12 flex justify-end">
            <img
              src="/assets/logos/chyk-logo.png"
              alt="Chyk"
              className="w-11 sm:w-13 h-9 sm:h-10 object-contain"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Divider below header */}
        <div className="w-full border-b border-[#e2e8f0] mt-3 sm:mt-3.5" />
      </div>

      {/* 2. EVENT TITLE */}
      <div className="text-center my-3 sm:my-3.5">
        <h1 className="text-xl sm:text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight font-heading">
          ANTI-DRUG MARATHON 2026
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-[#ea580c] tracking-[0.2em] uppercase mt-1">
          ENTRY PASS
        </p>
      </div>

      {/* 3. PARTICIPANT INFORMATION CARD */}
      <div className="bg-[#f8faff] rounded-2xl border border-[#dbeafe] p-5 sm:p-6 space-y-4 mt-3 sm:mt-4 shadow-sm">
        {/* Two-Column Grid for Details */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-left">
          
          {/* Row 1 Left: REGISTRATION ID */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3b82f6] tracking-wider uppercase block">
              REGISTRATION ID
            </span>
            <div className="text-base sm:text-[17px] font-black text-[#0f172a] font-mono tracking-wide mt-0.5 border-b border-[#dbeafe] pb-1 truncate">
              {registration.registrationId || '—'}
            </div>
          </div>

          {/* Row 1 Right: PARTICIPANT NAME */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3b82f6] tracking-wider uppercase block">
              PARTICIPANT NAME
            </span>
            <div className="text-base sm:text-[17px] font-black text-[#0f172a] mt-0.5 border-b border-[#dbeafe] pb-1 truncate" title={registration.fullName}>
              {registration.fullName || '—'}
            </div>
          </div>

          {/* Row 2 Left: T-SHIRT SIZE */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3b82f6] tracking-wider uppercase block">
              T-SHIRT SIZE
            </span>
            <div className="text-base sm:text-[17px] font-black text-[#0f172a] mt-0.5 border-b border-[#dbeafe] pb-1">
              {registration.tShirtSize || 'M'}
            </div>
          </div>

          {/* Row 2 Right: CONTACT NUMBER */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3b82f6] tracking-wider uppercase block">
              CONTACT NUMBER
            </span>
            <div className="text-base sm:text-[17px] font-black text-[#0f172a] font-mono mt-0.5 border-b border-[#dbeafe] pb-1 truncate">
              {formattedPhone}
            </div>
          </div>

          {/* Row 3 Left: INSTITUTION / TYPE */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3b82f6] tracking-wider uppercase block">
              INSTITUTION / TYPE
            </span>
            <div className="text-xs sm:text-sm font-black text-[#0f172a] uppercase mt-0.5 truncate" title={institutionDisplay}>
              {institutionDisplay}
            </div>
          </div>

          {/* Row 3 Right: Empty column for symmetry */}
          <div aria-hidden="true" />

        </div>

        {/* 4. EVENT DETAILS LIGHT-GREY BOX */}
        <div className="bg-white/80 border border-[#dbeafe] rounded-xl p-3 sm:p-3.5 space-y-2 mt-3.5">
          {/* Date Row */}
          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-bold text-[#1e3a8a]">
            <div className="w-5 h-5 flex items-center justify-center text-[#ea580c] shrink-0">
              <Calendar className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="truncate">{displayDate}</span>
          </div>

          {/* Location Row */}
          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-bold text-[#1e3a8a]">
            <div className="w-5 h-5 flex items-center justify-center text-[#0284c7] shrink-0">
              <MapPin className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="truncate">{displayLocation}</span>
          </div>
        </div>

      </div>

      {/* 5. FOOTER MESSAGE */}
      <p className="text-[11px] sm:text-xs font-semibold text-[#3b82f6] text-center mt-5">
        Please carry this pass for entry to the marathon.
      </p>

      {/* 6. FOOTER DIVIDER & BRANDING */}
      <div className="w-3/4 mx-auto border-t border-[#dbeafe] mt-3 mb-2.5" />

      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#3b82f6] text-center">
        CHINMAYA MISSION ADONI • CHINMAYA YUVA KENDRA ADONI
      </p>
    </div>
  );
};

export default EntryPass;
