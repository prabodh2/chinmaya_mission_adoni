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
    <div className="w-full max-w-5xl mx-auto pt-1 pb-1 px-2 sm:px-4">
      <div className="glass-card p-6 sm:p-8 md:p-10 rounded-[28px] sm:rounded-[36px] border-l-6 border-l-[var(--orange)] relative overflow-hidden shadow-xl">
        
        {/* Glow Accent */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-[var(--cyan)]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
          
          {/* Header Info */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-black text-xs sm:text-sm uppercase tracking-wider border border-[var(--orange)]/30 mb-1 shadow-sm">
              <Calendar className="w-4 h-4" />
              <span>EVENT COUNTDOWN</span>
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight">
              20 DECEMBER <span className="text-[var(--orange)]">2026</span>
            </h3>
            <p className="text-xs sm:text-base font-bold text-[var(--text-muted)] flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--cyan)] flex-shrink-0" />
                <span>6:00 AM ONWARDS</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--orange)] flex-shrink-0" />
                <span>ADONI, ANDHRA PRADESH</span>
              </span>
            </p>
          </div>

          {/* Timer Digits Display (Bigger Size) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 w-full lg:w-auto">
            {[
              { label: 'DAYS', value: formatUnit(timeLeft.days), color: 'text-[var(--orange)]' },
              { label: 'HOURS', value: formatUnit(timeLeft.hours), color: 'text-[var(--yellow)]' },
              { label: 'MINUTES', value: formatUnit(timeLeft.minutes), color: 'text-[var(--cyan)]' },
              { label: 'SECONDS', value: formatUnit(timeLeft.seconds), color: 'text-[var(--green)]' },
            ].map((unit, idx) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] shadow-md min-w-[70px] sm:min-w-[100px] md:min-w-[115px] transition-transform hover:scale-105 duration-300"
              >
                <span className={`text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight ${unit.color}`}>
                  {unit.value}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-black text-[var(--text-muted)] uppercase tracking-wider mt-1.5 sm:mt-2">
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
