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

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'https://chinmaya-mission-adoni-nine.vercel.app';

export const SectionRenderer = ({ section, eventConfig, banners, activities, faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);

  if (!section || !section.isEnabled) return null;

  const eventDateStr = eventConfig?.eventDate || '2026-12-20T06:00:00.000+05:30';

  switch (section.type) {
    case 'hero': {
      const heroGraphicUrl =
        section.imageUrl && !section.imageUrl.includes('unsplash.com')
          ? section.imageUrl
          : '/assets/images/hero-runners-graphic.png';

      const rawSubtitle = section.subtitle || '';
      const displaySubtitle =
        /YOUR LIFE\.?\s*YOUR CHOICE/i.test(rawSubtitle) || !rawSubtitle
          ? 'WE RISE. WE RUN. WE RESIST.'
          : rawSubtitle;

      const rawDescription = section.description || '';
      const displayDescription =
        /Run for a Drug-Free Future/i.test(rawDescription) || !rawDescription
          ? 'RUN FOR LIFE. STAND AGAINST DRUGS'
          : rawDescription;

      return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[var(--bg-primary)] to-[#FFFDF9] border-b border-[var(--border-color)]/30">
          {/* Subtle warm decorative glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-[var(--yellow)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex flex-col lg:flex-row items-center py-6 sm:py-8 lg:py-12 relative z-10 pl-4 sm:pl-6 lg:pl-10 xl:pl-16 pr-0 lg:pr-0 xl:pr-0 overflow-hidden">
            {/* Center Column: Content brought directly to the middle */}
            <div className="w-full lg:flex-1 flex justify-center items-center py-4 px-2 sm:px-4 lg:px-6 z-10">
              <div className="w-full max-w-xl xl:max-w-2xl flex flex-col items-center text-center space-y-5 sm:space-y-6">
                <div className="space-y-2.5 sm:space-y-3">
                  <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black font-heading tracking-tight text-[var(--text-primary)] leading-[1.08] uppercase">
                    {section.title || 'ANTI-DRUG MOVEMENT MARATHON RUN 2026'}
                  </h1>
                  {displaySubtitle && (
                    <p className="text-lg sm:text-2xl lg:text-3xl font-black font-heading text-[var(--orange)] tracking-wide">
                      {displaySubtitle}
                    </p>
                  )}
                  {displayDescription && (
                    <p className="text-sm sm:text-base lg:text-lg font-extrabold text-[var(--text-primary)]/85 max-w-lg mx-auto leading-relaxed tracking-wider uppercase">
                      {displayDescription}
                    </p>
                  )}
                </div>

                {/* Date & Route Pill */}
                <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 sm:px-5 py-3 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] text-xs sm:text-sm font-bold text-[var(--text-primary)] mx-auto">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--orange)] shrink-0" />
                    <span>Sunday, 20 December 2026</span>
                  </div>
                  <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />
                  <Link
                    to="/register#marathon-map"
                    className="flex items-center gap-2 text-decoration-none text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors cursor-pointer group"
                    title="Click to view Marathon Route Map"
                  >
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--cyan)] group-hover:scale-110 transition-transform shrink-0" />
                    <span className="underline decoration-dotted underline-offset-4 font-extrabold">Route of Marathon</span>
                  </Link>
                </div>

                {/* Primary & Secondary Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1 w-full sm:w-auto mx-auto">
                  {section.primaryButtonText && (
                    <Link
                      to={section.primaryButtonLink || '/register'}
                      className="btn-primary text-sm sm:text-base py-3.5 sm:py-4 px-8 text-decoration-none shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto justify-center"
                    >
                      <Award className="w-5 h-5 shrink-0" />
                      <span>{section.primaryButtonText}</span>
                    </Link>
                  )}
                  {section.secondaryButtonText && (
                    <a
                      href={section.secondaryButtonLink || '#about'}
                      className="btn-secondary text-sm sm:text-base py-3.5 sm:py-4 px-8 text-decoration-none bg-white/70 hover:bg-white transition-all duration-300 w-full sm:w-auto justify-center"
                    >
                      <span>{section.secondaryButtonText}</span>
                      <ArrowRight className="w-5 h-5 shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Runners Dynamic Graphic kept strictly flush to the far right edge */}
            <div className="w-full lg:w-auto shrink-0 flex justify-end items-center pr-0 mr-0 relative self-center lg:self-stretch overflow-hidden">
              <div className="w-full flex justify-end items-center pr-0 mr-0">
                <img
                  src={heroGraphicUrl}
                  alt={section.title || 'Anti-Drug Movement Marathon Runners'}
                  className="w-full sm:w-auto max-w-[650px] lg:max-w-[760px] xl:max-w-[850px] h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[470px] object-contain object-right ml-auto block drop-shadow-2xl transform lg:scale-105 origin-right transition-transform duration-500 hover:scale-108 pr-0 mr-0"
                  onError={(e) => {
                    if (e.target.src !== window.location.origin + '/assets/images/hero-runners-graphic.png') {
                      e.target.src = '/assets/images/hero-runners-graphic.png';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'marathon':
      return null;

    case 'pillars':
      return null;

    case 'activities':
      return null;

    case 'faq':
      return (
        <section id="faq" className="py-16 px-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'FREQUENTLY ASKED QUESTIONS'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto font-medium">
                Got a question regarding the marathon? Find quick answers below.
              </p>
            </div>

            <div className="space-y-3.5">
              {(faqs || []).map((faq, idx) => (
                <div key={faq._id || idx} className="rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_4px_12px_rgba(11,35,64,0.04)] overflow-hidden hover:shadow-[0_4px_12px_rgba(11,35,64,0.06),0_8px_24px_rgba(11,35,64,0.08)] transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors gap-3"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 border border-[var(--orange)]/30">
                        <HelpCircle className="w-4 h-4 text-[var(--orange)]" />
                      </span>
                      <span className="font-extrabold">{faq.question}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[var(--orange)]' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-color)]/50 pt-3">
                      <p className="pl-10 font-medium">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Link to dedicated FAQs Page where ASK YOUR FAQ is available */}
            <div className="text-center pt-2">
              <Link
                to="/faqs"
                className="btn-secondary py-3 px-6 rounded-2xl text-xs sm:text-sm font-black shadow-sm hover:shadow inline-flex items-center gap-2 text-decoration-none"
              >
                <span>HAVE MORE QUESTIONS? VISIT FAQS PAGE</span>
                <ArrowRight className="w-4 h-4 text-[var(--orange)]" />
              </Link>
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

export const QuoteBanner = ({ content }) => {
  if (content?._isEnabled === false) return null;

  const quoteText = content?.quoteText || 'The youth are not useless , they are used less. The youth are not careless , they are cared less.';
  const quoteAuthor = content?.quoteAuthor || '- Swami Chinmayananda';

  return (
    <section className="relative overflow-hidden min-h-[100px] sm:min-h-[120px] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-6 sm:py-7 text-white bg-[#07162D] border-y border-slate-800/80 shadow-xl">
      {/* Background Road Image with Dark Blue Tint */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage: "url('/assets/sunset-road.jpg')",
          backgroundPosition: "center 60%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07162D]/95 via-[#07162D]/90 to-[#07162D]/85 pointer-events-none" />

      {/* Quote Content - Centered in one clean line, italic, size 28 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
        <p className="font-serif italic text-base sm:text-xl md:text-2xl lg:text-[28px] text-white font-medium leading-relaxed mb-2 whitespace-nowrap overflow-x-auto">
          <span className="font-serif not-italic text-[#FFD12D] text-xl sm:text-2xl md:text-3xl lg:text-[34px] mr-1 select-none">“</span>
          {quoteText.replace(/^["“]|["”]$/g, '').trim()}”
        </p>
        <small className="block font-sans not-italic text-xs sm:text-sm text-[#F6D9BA] font-semibold tracking-wider uppercase">
          {quoteAuthor}
        </small>
      </div>
    </section>
  );
};
