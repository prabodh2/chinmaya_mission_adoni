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
        <section className="relative min-h-[85vh] flex items-center justify-center py-16 px-4 overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-tertiary)] to-[var(--bg-primary)]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--orange)]/10 pointer-events-none rounded-full blur-3xl" />
          
          <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
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

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight text-[var(--text-primary)] leading-[1.08]">
                {section.title || 'ANTI-DRUG MOVEMENT MARATHON RUN 2026'}
              </h1>
              {section.subtitle && (
                <p className="text-xl sm:text-3xl font-extrabold font-heading text-[var(--orange)] tracking-wider">
                  {section.subtitle}
                </p>
              )}
              {section.description && (
                <p className="text-base sm:text-xl font-bold text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
                  {section.description}
                </p>
              )}
            </div>

            <div className="inline-flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--orange)]" />
                <span>Sunday, 20 December 2026</span>
              </div>
              <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />
              <Link
                to="/register#marathon-map"
                className="flex items-center gap-2 text-decoration-none text-[var(--text-primary)] hover:text-[var(--cyan)] transition-colors cursor-pointer group"
                title="Click to view 7KM Marathon Route Map"
              >
                <MapPin className="w-5 h-5 text-[var(--cyan)] group-hover:scale-110 transition-transform" />
                <span className="underline decoration-dotted underline-offset-4 font-extrabold">Chinmaya Mission Adoni</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {section.primaryButtonText && (
                <Link
                  to={section.primaryButtonLink || '/register'}
                  className="btn-primary text-base py-4 px-8 text-decoration-none shadow-2xl"
                >
                  <Award className="w-5 h-5" />
                  <span>{section.primaryButtonText}</span>
                </Link>
              )}
              {section.secondaryButtonText && (
                <a
                  href={section.secondaryButtonLink || '#about'}
                  className="btn-secondary text-base py-4 px-8 text-decoration-none"
                >
                  <span>{section.secondaryButtonText}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              )}
            </div>

            {section.imageUrl && (
              <div className="mt-8 rounded-3xl overflow-hidden border-2 border-[var(--orange)]/30 shadow-2xl max-w-4xl mx-auto">
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="w-full max-h-[420px] object-cover"
                />
              </div>
            )}
          </div>
        </section>
      );

    case 'marathon':
      return (
        <section className="py-8 px-4 bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
          <div className="max-w-6xl mx-auto space-y-6 text-center">
            {section.title && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/20">
                  {section.badgeText || 'EVENT INFORMATION'}
                </span>
                <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
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
        <section className="py-16 px-4 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest">
                {section.subtitle || 'GALLERY & HIGHLIGHTS'}
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'MOVEMENT ACTIVITIES'}
              </h2>
            </div>
            {section.primaryButtonText && (
              <Link to={section.primaryButtonLink || '/activities'} className="btn-secondary py-2.5 px-6 text-xs text-decoration-none">
                <span>{section.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {activities && activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activities.map((act) => (
                <div key={act._id || act.title} className="rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl group hover:border-[var(--orange)] transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img src={act.imageUrl} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/70 text-white font-bold text-[10px] backdrop-blur-md">
                      {act.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="text-base font-extrabold text-[var(--text-primary)] font-heading">{act.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-2xl">
              Activities will appear here once created.
            </div>
          )}
        </section>
      );

    case 'faq':
      return (
        <section className="py-16 px-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
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
                <div key={faq._id || idx} className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden">
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
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-secondary)] border-2 border-[var(--orange)]/30 space-y-6 shadow-2xl">
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
