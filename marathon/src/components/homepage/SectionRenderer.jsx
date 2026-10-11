import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../CountdownTimer';
import { TransformationSection } from '../TransformationSection';
import {
  Flame,
  Award,
  ArrowRight,
  HeartPulse,
  Users,
  Smile,
  Target,
  Compass,
  MapPin,
  Calendar,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const SectionRenderer = ({ section, eventConfig, banners, activities, faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);

  if (!section || !section.isEnabled) return null;

  const eventDateStr = eventConfig?.eventDate || '2026-12-20T06:00:00.000+05:30';

  switch (section.type) {
    case 'hero':
      return (
        <section className="relative flex items-center justify-center py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-tertiary)] to-[var(--bg-primary)]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--orange)]/10 pointer-events-none rounded-full blur-3xl" />
          
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 w-full flex flex-col items-center">
            {section.badgeText && (
              <div className="flex flex-wrap items-center justify-center gap-3 animate-in fade-in">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-widest uppercase border border-[var(--orange)]/30">
                  <Flame className="w-4 h-4 text-[var(--orange)]" />
                  {section.badgeText}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] font-extrabold text-xs tracking-widest uppercase border border-[var(--cyan)]/30">
                  <MapPin className="w-3.5 h-3.5" />
                  ADONI, ANDHRA PRADESH
                </span>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-[var(--text-primary)] leading-[1.1]">
                {section.title || 'ANTI-DRUG MOVEMENT MARATHON RUN 2026'}
              </h1>
              {section.subtitle && (
                <p className="text-lg sm:text-2xl font-extrabold font-heading text-[var(--orange)] tracking-wide">
                  {section.subtitle}
                </p>
              )}
              {section.description && (
                <p className="text-sm sm:text-lg font-bold text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                  {section.description}
                </p>
              )}
            </div>

            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--orange)]" />
                <span>Sunday, 20 December 2026</span>
              </div>
              <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />
              <Link
                to="/register#marathon-map"
                className="flex items-center gap-2 text-decoration-none text-[var(--text-primary)] hover:text-[var(--cyan)] transition-colors cursor-pointer group"
                title="Click to view 7KM Marathon Route Map"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--cyan)] group-hover:scale-110 transition-transform" />
                <span className="underline decoration-dotted underline-offset-4 font-extrabold">Chinmaya Mission Adoni</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              {section.primaryButtonText && (
                <Link
                  to={section.primaryButtonLink || '/register'}
                  className="btn-primary text-sm sm:text-base py-3.5 sm:py-4 px-8 text-decoration-none shadow-2xl"
                >
                  <Award className="w-5 h-5" />
                  <span>{section.primaryButtonText}</span>
                </Link>
              )}
              {section.secondaryButtonText && (
                <a
                  href={section.secondaryButtonLink || '#about'}
                  className="btn-secondary text-sm sm:text-base py-3.5 sm:py-4 px-8 text-decoration-none"
                >
                  <span>{section.secondaryButtonText}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              )}
            </div>

            {section.imageUrl && (
              <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-[var(--orange)]/30 shadow-2xl mt-4 bg-black/10 flex justify-center">
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full h-auto max-h-[440px] object-cover mx-auto block"
                />
              </div>
            )}
          </div>
        </section>
      );

    case 'marathon':
      return (
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)] border-y border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto space-y-6 text-center">
            {section.title && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/20">
                  {section.badgeText || 'EVENT INFORMATION'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-sm font-bold text-[var(--text-muted)]">{section.subtitle}</p>
                )}
              </div>
            )}
            <CountdownTimer targetDate={eventDateStr} />
          </div>
        </section>
      );

    case 'pillars':
      return null;

    case 'activities':
      return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left pb-2 border-b border-slate-200/60">
            <div>
              <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest block mb-1">
                {section.subtitle || 'GALLERY & HIGHLIGHTS'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'MOVEMENT ACTIVITIES & HIGHLIGHTS'}
              </h2>
            </div>
            {section.primaryButtonText && (
              <Link
                to={section.primaryButtonLink || '/activities'}
                className="btn-secondary py-2.5 px-5 text-xs font-bold text-decoration-none whitespace-nowrap shadow-sm hover:shadow"
              >
                <span>{section.primaryButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {activities && activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {activities.map((act) => (
                <article
                  key={act._id || act.title}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[var(--orange)]/50 transition-all duration-300 flex flex-col h-full overflow-hidden group"
                >
                  {/* Full-width Image Area */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 block">
                    <img
                      src={act.imageUrl}
                      alt={act.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out block"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity" />
                    
                    {act.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-wider border border-white/20 shadow-sm">
                        {act.category}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 text-left">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors leading-snug line-clamp-2 mb-2">
                      {act.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
                      {act.description}
                    </p>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[var(--orange)]">
                      <span className="text-[11px] uppercase tracking-wider text-slate-500">Movement Drive</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-2xl">
              Activities will appear here once published.
            </div>
          )}
        </section>
      );

    case 'faq':
      return (
        <section className="py-16 px-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest">
                {section.subtitle || 'QUESTIONS & ANSWERS'}
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'FREQUENTLY ASKED QUESTIONS'}
              </h2>
            </div>

            <div className="space-y-4">
              {(faqs || []).map((faq, idx) => (
                <div key={faq._id || idx} className="rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_4px_12px_rgba(11,35,64,0.04)] overflow-hidden hover:shadow-[0_4px_12px_rgba(11,35,64,0.06),0_8px_24px_rgba(11,35,64,0.08)] transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[var(--orange)] flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${openFaq === idx ? 'rotate-180 text-[var(--orange)]' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-color)]/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-16 px-4 bg-gradient-to-r from-[var(--orange)] via-[#E64A19] to-[var(--orange)] text-white text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
              {section.title || 'BE PART OF THE MOVEMENT IN ADONI!'}
            </h2>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-medium">
              {section.description || 'Register today individually or submit your school/college bulk student details. Receive your official marathon certificate & pass!'}
            </p>
            {section.primaryButtonText && (
              <div>
                <Link
                  to={section.primaryButtonLink || '/register'}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-extrabold text-base shadow-2xl hover:bg-slate-100 transition-transform hover:scale-105 text-decoration-none"
                >
                  <Award className="w-5 h-5 text-[var(--orange)]" />
                  <span>{section.primaryButtonText}</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] space-y-6 shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)]">
            {section.badgeText && (
              <span className="px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs uppercase tracking-widest">
                {section.badgeText}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
              {section.title}
            </h2>
            {section.subtitle && (
              <h3 className="text-lg font-bold text-[var(--orange)]">{section.subtitle}</h3>
            )}
            {section.description && (
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{section.description}</p>
            )}
            {section.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-[350px]">
                <img src={section.imageUrl} alt={section.title} className="w-full object-cover" />
              </div>
            )}
          </div>
        </section>
      );

    case 'custom':
    case 'text':
    default:
      return (
        <section className="py-12 px-4 max-w-6xl mx-auto space-y-4 text-center">
          {section.badgeText && (
            <span className="px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs uppercase tracking-widest">
              {section.badgeText}
            </span>
          )}
          {section.title && (
            <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-base font-bold text-[var(--orange)]">{section.subtitle}</p>
          )}
          {section.description && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto">
              {section.description}
            </p>
          )}
          {section.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-[350px] mx-auto max-w-3xl pt-4">
              <img src={section.imageUrl} alt={section.title} className="w-full object-cover" />
            </div>
          )}
          {(section.primaryButtonText || section.secondaryButtonText) && (
            <div className="flex justify-center gap-4 pt-4">
              {section.primaryButtonText && (
                <Link to={section.primaryButtonLink || '/register'} className="btn-primary py-3 px-6 text-xs text-decoration-none">
                  {section.primaryButtonText}
                </Link>
              )}
              {section.secondaryButtonText && (
                <Link to={section.secondaryButtonLink || '/about'} className="btn-secondary py-3 px-6 text-xs text-decoration-none">
                  {section.secondaryButtonText}
                </Link>
              )}
            </div>
          )}
        </section>
      );
  }
};
