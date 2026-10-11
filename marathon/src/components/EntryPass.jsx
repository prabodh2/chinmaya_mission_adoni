import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
      className="entry-pass-container w-full max-w-[460px] mx-auto bg-white rounded-[24px] sm:rounded-[28px] border-[2px] border-[#ea580c] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-7 text-slate-800 relative transition-all"
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 1. TOP HEADER WITH LOGOS */}
      <div className="relative pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {/* Left: Chinmaya Mission Om Logo */}
          <div style={{ flexShrink: 0, width: '44px', display: 'flex', justifyContent: 'flex-start' }}>
            <img
              src="/assets/logos/logo-2.png"
              alt="Chinmaya Mission"
              width="40"
              height="56"
              style={{ width: '40px', height: '56px', objectFit: 'contain', display: 'block' }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Center: Title & Subtitles */}
          <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              CHINMAYA MISSION ADONI
            </h2>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', margin: '2px 0 0 0' }}>
              Chinmaya Yuva Kendra <span style={{ fontWeight: 900, color: '#0f172a' }}>Adoni</span>
            </p>
            <p style={{ fontSize: '12px', fontWeight: 900, color: '#10b981', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '4px 0 0 0' }}>
              ENTRY PASS
            </p>
          </div>

          {/* Right: Chyk Logo */}
          <div style={{ flexShrink: 0, width: '52px', display: 'flex', justifyContent: 'flex-end' }}>
            <img
              src="/assets/logos/chyk-logo.png"
              alt="Chyk"
              width="48"
              height="38"
              style={{ width: '48px', height: '38px', objectFit: 'contain', display: 'block' }}
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* 2. EVENT TITLE */}
      <div style={{ textAlign: 'center', margin: '14px 0' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.03em', textTransform: 'uppercase', margin: 0, lineHeight: 1.2 }}>
          ANTI-DRUG MARATHON 2026
        </h1>
        <p style={{ fontSize: '11px', fontWeight: 800, color: '#ea580c', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '4px 0 0 0' }}>
          ENTRY PASS
        </p>
      </div>

      {/* 3. PARTICIPANT INFORMATION CARD */}
      <div
        style={{
          backgroundColor: '#f8faff',
          borderRadius: '16px',
          border: '1px solid #dbeafe',
          padding: '18px 20px',
          marginTop: '12px',
        }}
      >
        {/* Two-Column Grid for Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', rowGap: '14px', textAlign: 'left' }}>
          
          {/* Row 1 Left: REGISTRATION ID */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
              REGISTRATION ID
            </span>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', letterSpacing: '0.05em', marginTop: '2px', borderBottom: '1px solid #dbeafe', paddingBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {registration.registrationId || '—'}
            </div>
          </div>

          {/* Row 1 Right: PARTICIPANT NAME */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
              PARTICIPANT NAME
            </span>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '2px', borderBottom: '1px solid #dbeafe', paddingBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={registration.fullName}>
              {registration.fullName || '—'}
            </div>
          </div>

          {/* Row 2 Left: T-SHIRT SIZE */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
              T-SHIRT SIZE
            </span>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '2px', borderBottom: '1px solid #dbeafe', paddingBottom: '3px' }}>
              {registration.tShirtSize || 'M'}
            </div>
          </div>

          {/* Row 2 Right: CONTACT NUMBER */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
              CONTACT NUMBER
            </span>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px', borderBottom: '1px solid #dbeafe', paddingBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formattedPhone}
            </div>
          </div>

          {/* Row 3 Left: INSTITUTION / TYPE */}
          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
              INSTITUTION / TYPE
            </span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={institutionDisplay}>
              {institutionDisplay}
            </div>
          </div>

        </div>

        {/* 4. EVENT DETAILS & QR VERIFICATION ROW */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dbeafe',
            borderRadius: '14px',
            padding: '12px',
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Left: Event Date & Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
            {/* Date Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#1e3a8a' }}>
              <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', flexShrink: 0 }}>
                <Calendar className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayDate}</span>
            </div>

            {/* Location Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#1e3a8a' }}>
              <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                <MapPin className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayLocation}</span>
            </div>

            {/* Pass ID */}
            {registration.entryPassId && (
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: 'monospace', letterSpacing: '0.04em', marginTop: '2px' }}>
                PASS CODE: {registration.entryPassId}
              </div>
            )}
          </div>

          {/* Right: Unique QR Verification Code */}
          <div style={{ textAlign: 'center', flexShrink: 0, paddingLeft: '8px', borderLeft: '1px dashed #dbeafe' }}>
            <div style={{ display: 'inline-block', padding: '4px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <QRCodeSVG
                value={
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/verify-pass/${registration.entryPassId || registration.registrationId}`
                    : `https://marathon.chinmayamissionadoni.org/verify-pass/${registration.entryPassId || registration.registrationId}`
                }
                size={64}
                level="M"
              />
            </div>
            <span style={{ display: 'block', fontSize: '8px', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
              SCAN TO VERIFY
            </span>
          </div>
        </div>

      </div>

      {/* 5. FOOTER MESSAGE */}
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textAlign: 'center', margin: '14px 0 0 0' }}>
        Please carry this pass for entry to the marathon.
      </p>

      {/* 6. FOOTER DIVIDER & BRANDING */}
      <div style={{ width: '70%', margin: '10px auto 8px auto', borderTop: '1px solid #dbeafe' }} />

      <p style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#3b82f6', textAlign: 'center', margin: 0 }}>
        CHINMAYA MISSION ADONI • CHINMAYA YUVA KENDRA ADONI
      </p>
    </div>
  );
};

export default EntryPass;
