import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageCircleQuestion,
  Send,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { faqService, contactService } from '../services/api';

const DEFAULT_MARATHON_FAQS = [
  {
    _id: 'faq-1',
    question: 'When and where is the Anti-Drug Marathon Run 2026?',
    answer: 'The marathon will be held on Sunday, 20 December 2026, starting at 6:00 AM from Chinmaya Mission, Adoni, Andhra Pradesh. All runners must assemble by 5:30 AM.',
  },
  {
    _id: 'faq-2',
    question: 'Who can participate in the marathon?',
    answer: 'The marathon is open to everyone! Students from schools and colleges, working professionals, families, youth, and senior citizens in Adoni are all warmly invited to join.',
  },
  {
    _id: 'faq-3',
    question: 'Is there an entry fee for registration?',
    answer: 'No, participation in the Anti-Drug Movement Marathon Run 2026 is completely FREE. It is a community awareness initiative organized by Chinmaya Mission, Adoni & Chinmaya Yuva Kendra, Adoni.',
  },
  {
    _id: 'faq-4',
    question: 'How can schools and colleges submit registrations?',
    answer: 'Educational institutions can register multiple students at once through bulk registrations. Individual students can also register directly online through our student registration form.',
  },
  {
    _id: 'faq-5',
    question: 'Will certificates and T-shirts be provided to participants?',
    answer: 'Yes! Every registered participant who completes the marathon will receive an official Anti-Drug Movement Marathon certificate, event T-shirt, and refreshments.',
  },
  {
    _id: 'faq-6',
    question: 'How do I get my Marathon Entry Pass?',
    answer: 'Once you complete your registration, an official Entry Pass with a secure QR code will be generated instantly. You can view, download, or print it anytime from your profile.',
  },
  {
    _id: 'faq-7',
    question: 'Can I register a friend or family member?',
    answer: 'Yes! Use the "+ ADD A FRIEND" feature on the registration form to register yourself and a friend together in one simple step.',
  },
];

export const FaqPage = () => {
  const [faqs, setFaqs] = useState(DEFAULT_MARATHON_FAQS);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    question: '',
  });

  const ADMIN_PANEL_URL =
    import.meta.env.VITE_ADMIN_URL || 'https://chinmaya-mission-adoni-admin.vercel.app';

  // Fetch dynamic FAQs from backend
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const res = await faqService.getFAQs();
        const apiFaqs = res.data?.data || res.data || [];
        if (Array.isArray(apiFaqs) && apiFaqs.length > 0) {
          setFaqs(apiFaqs);
        }
      } catch (err) {
        console.warn('Using default marathon FAQs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.question.trim()) {
      setErrorMessage('Please enter your question or doubt.');
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

      // Redirect to the Admin Panel after a short delay
      setTimeout(() => {
        window.location.href = ADMIN_PANEL_URL;
      }, 2000);
    } catch (err) {
      console.error('Error submitting FAQ question:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit question. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-2 sm:pt-4 pb-14 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto font-medium">
            Everything you need to know about the Anti-Drug Movement Marathon Run 2026. Have a question not listed here? Ask our organizers directly!
          </p>

          {/* Action Button: Ask Your FAQ */}
          <div className="pt-2">
            <button
              onClick={() => {
                setShowAskForm(!showAskForm);
                setSubmitSuccess(false);
                setErrorMessage('');
              }}
              className="btn-primary py-3.5 px-7 rounded-2xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all inline-flex items-center gap-2.5"
            >
              <MessageCircleQuestion className="w-4 h-4" />
              <span>{showAskForm ? 'CLOSE QUESTION FORM' : 'ASK YOUR FAQ'}</span>
            </button>
          </div>
        </div>

        {/* INLINE FORM: Ask Your FAQ */}
        {showAskForm && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[var(--orange)]/30 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-[var(--orange)] uppercase block">
                  SUBMIT YOUR QUESTION / DOUBT
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-heading">
                  Ask Chinmaya Mission Organizers
                </h3>
              </div>
              <button
                onClick={() => setShowAskForm(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div>
                  <h4 className="text-base sm:text-lg font-black text-emerald-900">
                    Question Submitted Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 font-medium mt-1">
                    Your question has been saved and forwarded to the Chinmaya Mission Admin Team.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={ADMIN_PANEL_URL}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow hover:bg-emerald-700 transition-colors text-decoration-none"
                  >
                    <span>REDIRECTING TO ADMIN PANEL...</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                {/* Field: Full Name */}
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 text-sm font-semibold text-slate-800 transition-all"
                  />
                </div>

                {/* Field: Phone (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Contact Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 text-sm font-semibold text-slate-800 transition-all"
                  />
                </div>

                {/* Field: Question / Doubt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    What is your doubt / question? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Describe what you would like to ask regarding the marathon route, timing, bib collection, certificate, or rules..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 text-sm font-semibold text-slate-800 transition-all resize-none"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAskForm(false)}
                    className="btn-secondary w-full sm:w-auto py-2.5 px-5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto py-3 px-6 text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
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

        {/* FAQ Accordion List matching screenshot */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq._id || idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(11,35,64,0.04),0_4px_12px_rgba(11,35,64,0.04)] overflow-hidden hover:shadow-[0_4px_12px_rgba(11,35,64,0.06),0_8px_20px_rgba(11,35,64,0.06)] transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 border border-[var(--orange)]/30">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <span className="font-extrabold">{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--orange)]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <p className="pl-10 font-medium">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-[var(--orange)] mx-auto" />
          <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
            Still Have Questions?
          </h4>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            Click <strong>"ASK YOUR FAQ"</strong> above to send your questions directly to our event management team.
          </p>
        </div>

      </div>
    </div>
  );
};
