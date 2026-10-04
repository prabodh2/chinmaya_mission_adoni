import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const CountdownTimer = ({ targetDate = '2026-12-20T06:00:00.000+05:30' }) => {
  const calculateTimeLeft = () => {
    const eventTime = Date.parse(targetDate) || Date.parse('2026-12-20T06:00:00.000+05:30');
    const difference = eventTime - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEventPassed: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isEventPassed: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatUnit = (num) => String(num).padStart(2, '0');

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--orange)]/30 relative overflow-hidden shadow-2xl bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
        
        {/* Glow Accent */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[var(--cyan)]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Header Info */}
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs uppercase tracking-wider border border-[var(--orange)]/30 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>EVENT COUNTDOWN</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              20 DECEMBER <span className="text-[var(--orange)]">2026</span>
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4 text-[var(--cyan)]" /> 6:00 AM ONWARDS • <MapPin className="w-4 h-4 text-[var(--orange)]" /> ADONI, ANDHRA PRADESH
            </p>
          </div>

          {/* Timer Digits Display */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full md:w-auto">
            {[
              { label: 'DAYS', value: formatUnit(timeLeft.days), color: 'text-[var(--orange)]' },
              { label: 'HOURS', value: formatUnit(timeLeft.hours), color: 'text-[var(--yellow)]' },
              { label: 'MINUTES', value: formatUnit(timeLeft.minutes), color: 'text-[var(--cyan)]' },
              { label: 'SECONDS', value: formatUnit(timeLeft.seconds), color: 'text-[var(--green)]' },
            ].map((unit, idx) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-inner min-w-[65px] sm:min-w-[85px]"
              >
                <span className={`text-2xl sm:text-4xl font-extrabold font-heading tracking-tight ${unit.color}`}>
                  {unit.value}
                </span>
                <span className="text-[9px] sm:text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
