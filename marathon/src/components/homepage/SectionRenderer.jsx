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
  MessageCircleQuestion,
  Send,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { contactService } from '../../services/api';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173';

export const SectionRenderer = ({ section, eventConfig, banners, activities, faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', question: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!section || !section.isEnabled) return null;

  const eventDateStr = eventConfig?.eventDate || '2026-12-20T06:00:00.000+05:30';

  switch (section.type) {
    case 'hero':
      return (
        <section className="relative flex items-center justify-center py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-tertiary)] to-[var(--bg-primary)]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--orange)]/10 pointer-events-none rounded-full blur-3xl" />
          
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 w-full flex flex-col items-center">
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
                title="Click to view Marathon Route Map"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--cyan)] group-hover:scale-110 transition-transform" />
                <span className="underline decoration-dotted underline-offset-4 font-extrabold">Route of Marathon</span>
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
        <section className="pt-10 sm:pt-14 pb-2 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto space-y-6 text-center">
            {section.title && (
              <div className="space-y-2">
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
      return null;

    case 'faq':
      return (
        <section id="faq" className="py-16 px-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'FREQUENTLY ASKED QUESTIONS'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
                Got a question regarding the marathon? Find answers below or ask our organizers directly.
              </p>

              {/* Action Button: Ask Your FAQ */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowAskForm(!showAskForm);
                    setSubmitSuccess(false);
                    setErrorMessage('');
                  }}
                  className="btn-primary py-3 px-6 rounded-2xl text-xs font-black shadow-md hover:shadow-lg inline-flex items-center gap-2"
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  <span>{showAskForm ? 'CLOSE QUESTION FORM' : 'ASK YOUR FAQ'}</span>
                </button>
              </div>
            </div>

            {/* INLINE FORM: Ask Your FAQ */}
            {showAskForm && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[var(--orange)]/30 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-[var(--orange)] uppercase block">
                      SUBMIT YOUR QUESTION / DOUBT
                    </span>
                    <h3 className="text-lg font-black text-[var(--text-primary)] font-heading">
                      Ask Event Organizers
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAskForm(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-emerald-900">
                        Question Submitted Successfully!
                      </h4>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">
                        Your doubt has been forwarded to the Chinmaya Mission Admin Team.
                      </p>
                    </div>
                    <a
                      href="https://chinmaya-mission-adoni-admin.vercel.app"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow hover:bg-emerald-700 transition-colors text-decoration-none mt-2"
                    >
                      <span>REDIRECTING TO ADMIN PANEL...</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setErrorMessage('');
                      if (!formData.name.trim() || !formData.question.trim()) {
                        setErrorMessage('Please fill in both your Name and your Doubt/Question.');
                        return;
                      }
                      setSubmitting(true);
                      try {
                        await contactService.submitMessage({
                          fullName: formData.name.trim(),
                          message: formData.question.trim(),
                          phone: formData.phone.trim() || undefined,
                          category: 'Marathon FAQ Question',
                        });
                        setSubmitSuccess(true);
                        setTimeout(() => {
                          window.location.href = 'https://chinmaya-mission-adoni-admin.vercel.app';
                        }, 2000);
                      } catch (err) {
                        setErrorMessage(err.response?.data?.message || 'Failed to submit question. Please try again.');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                        {errorMessage}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 text-sm font-semibold text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                        Contact Phone <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 text-sm font-semibold text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                        What is your doubt / question? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Write your question or doubt here regarding the marathon event..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 text-sm font-semibold text-slate-800 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAskForm(false)}
                        className="btn-secondary py-2 px-4 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary py-2.5 px-6 text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>SUBMITTING...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>SUBMIT QUESTION</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

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
          </div>
        </section>
      );

    case 'cta':
      return (
        <div className="space-y-0">
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

          {/* QUOTE BANNER UNDER BE PART OF THE MOVEMENT */}
          <section className="relative overflow-hidden min-h-[175px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 sm:px-12 lg:px-20 py-10 text-white bg-[#07162D] border-t border-slate-800/80 shadow-2xl">
            {/* Background Road Image with Dark Blue Tint */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity"
              style={{
                backgroundImage: "url('/assets/sunset-road.jpg')",
                backgroundPosition: "center 60%",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07162D]/95 via-[#07162D]/90 to-[#07162D]/85 pointer-events-none" />

            {/* Center Background Watermark Brand */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-20 px-4 text-center">
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
                An Initiative by
              </span>
              <span className="text-xl sm:text-3xl font-black tracking-widest text-[#F0441D] mt-0.5">
                CHINMAYA YUVA KENDRA ADONI
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase mt-0.5">
                TOGETHER FOR A HEALTHY, BRIGHTER TOMORROW
              </span>
            </div>

            {/* Left Quote Content */}
            <div className="relative z-10 max-w-2xl text-left">
              <div className="font-serif text-[#FFD12D] text-4xl sm:text-5xl leading-none mb-1 select-none">
                “
              </div>
              <p className="font-serif text-base sm:text-lg lg:text-xl text-white font-medium leading-relaxed mb-2">
                The youth are not useless , they are used less. The youth are not careless , they are cared for less.”
              </p>
              <small className="block font-sans text-xs sm:text-sm text-[#F6D9BA] font-semibold tracking-wide">
                - Swami Chinmayananda
              </small>
            </div>

            {/* Right Action Button */}
            <div className="relative z-10 shrink-0">
              <a
                href={`${MAIN_SITE_URL}/about`}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FFF5E5] text-[#07162D] hover:bg-white text-xs sm:text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl text-decoration-none"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </div>
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
