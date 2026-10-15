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
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
      <div className="glass-card p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border-l-4 sm:border-l-6 border-l-[var(--orange)] relative overflow-hidden shadow-lg w-full">
        
        {/* Glow Accent */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[var(--cyan)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8 relative z-10 w-full">
          
          {/* Header Info */}
          <div className="text-center lg:text-left space-y-1 sm:space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider border border-[var(--orange)]/30 mb-0.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>EVENT COUNTDOWN</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-[var(--text-primary)] tracking-tight">
              20 DECEMBER <span className="text-[var(--orange)]">2026</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[var(--text-muted)] flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--cyan)] flex-shrink-0" />
                <span>6:00 AM ONWARDS</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--orange)] flex-shrink-0" />
                <span>ADONI, ANDHRA PRADESH</span>
              </span>
            </p>
          </div>

          {/* Timer Digits Display (Compact Size) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 w-full lg:w-auto">
            {[
              { label: 'DAYS', value: formatUnit(timeLeft.days), color: 'text-[var(--orange)]' },
              { label: 'HOURS', value: formatUnit(timeLeft.hours), color: 'text-[var(--yellow)]' },
              { label: 'MINUTES', value: formatUnit(timeLeft.minutes), color: 'text-[var(--cyan)]' },
              { label: 'SECONDS', value: formatUnit(timeLeft.seconds), color: 'text-[var(--green)]' },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm min-w-[58px] sm:min-w-[76px] md:min-w-[88px] transition-transform hover:scale-105 duration-200"
              >
                <span className={`text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight ${unit.color}`}>
                  {unit.value}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider mt-1">
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
