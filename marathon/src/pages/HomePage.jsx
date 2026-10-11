import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContinuousVerticalBannerSlider } from '../components/ContinuousVerticalBannerSlider';
import { TransformationSection } from '../components/TransformationSection';
import { SectionRenderer } from '../components/homepage/SectionRenderer';
import { bannerService, eventService, faqService, activityService, homepageService } from '../services/api';
import { applyDynamicTheme } from '../utils/themeHelper';
import {
  Flame,
  Wrench,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const DEFAULT_HOMEPAGE_SECTIONS = [
  {
    sectionId: 'hero-1',
    type: 'hero',
    title: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
    subtitle: '"YOUR LIFE. YOUR CHOICE."',
    description: 'Run for a Drug-Free Future • Join Thousands of Youth in Adoni Building Health, Strength & Discipline',
    badgeText: 'CHINMAYA MISSION ADONI & CHYK ADONI',
    primaryButtonText: 'REGISTER NOW',
    primaryButtonLink: '/register',
    secondaryButtonText: 'EXPLORE THE MOVEMENT',
    secondaryButtonLink: '#about',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
    isEnabled: true,
    order: 1,
  },
  {
    sectionId: 'marathon-1',
    type: 'marathon',
    title: 'EVENT DETAILS & COUNTDOWN',
    subtitle: 'Sunday, 20 December 2026 • 6:00 AM Onwards',
    description: 'Starting from Chinmaya Mission Adoni, Andhra Pradesh.',
    badgeText: 'EVENT INFORMATION',
    primaryButtonText: 'REGISTER FOR MARATHON',
    primaryButtonLink: '/register',
    isEnabled: true,
    order: 2,
  },
  {
    sectionId: 'activities-1',
    type: 'activities',
    title: 'MOVEMENT ACTIVITIES & HIGHLIGHTS',
    subtitle: 'GALLERY & HIGHLIGHTS',
    description: 'Explore community drives, bootcamps, wellness seminars, and youth initiatives.',
    primaryButtonText: 'VIEW ALL ACTIVITIES',
    primaryButtonLink: '/activities',
    isEnabled: true,
    order: 4,
  },
  {
    sectionId: 'faq-1',
    type: 'faq',
    title: 'FREQUENTLY ASKED QUESTIONS',
    subtitle: 'QUESTIONS & ANSWERS',
    description: 'Everything you need to know about participating, registrations, certificates, and event details.',
    isEnabled: true,
    order: 5,
  },
  {
    sectionId: 'cta-1',
    type: 'cta',
    title: 'BE PART OF THE MOVEMENT IN ADONI!',
    subtitle: 'CHINMAYA MISSION & CHYK ADONI',
    description: 'Register today individually or submit your school/college bulk student details. Receive your official marathon certificate & pass!',
    primaryButtonText: 'MARATHON REGISTRATION',
    primaryButtonLink: '/register',
    isEnabled: true,
    order: 6,
  },
];

const DEFAULT_ACTIVITIES = [
  {
    _id: 'act-1',
    title: 'Youth Marathon Prep Bootcamps',
    category: 'Marathon Training',
    description: 'Weekly morning running sessions and endurance training across Adoni schools and colleges.',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop',
    active: true,
  },
  {
    _id: 'act-3',
    title: 'Mind & Body Wellness Seminars',
    category: 'Fitness & Wellness',
    description: 'Guided meditation, stress management and yoga sessions organized by Chinmaya Yuva Kendra.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    active: true,
  },
  {
    _id: 'act-4',
    title: 'Adoni Torch Relay & Street Rallies',
    category: 'Awareness Campaign',
    description: 'Torch relay highlighting positive choices, sports culture, and freedom from addiction.',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
    active: true,
  },
];

const DEFAULT_FAQS = [
  {
    _id: 'faq-1',
    question: 'When and where is the Anti-Drug Marathon Run 2026?',
    answer: 'The event will take place on Sunday, 20 December 2026, starting at 6:00 AM from Chinmaya Mission Adoni, Andhra Pradesh.',
  },
  {
    _id: 'faq-2',
    question: 'Who can participate in the marathon?',
    answer: 'The marathon is open to everyone! Students from schools and colleges, working professionals, families, and senior citizens in Adoni are all encouraged to join.',
  },
  {
    _id: 'faq-3',
    question: 'What is the last date to register for the marathon?',
    answer: 'The last day of registration is 30 November 2026 (30/11/2026). Make sure to register online before the deadline.',
  },
  {
    _id: 'faq-4',
    question: 'Is there an entry fee for registration?',
    answer: 'Registration is free for all, anyone can participate.',
  },
  {
    _id: 'faq-5',
    question: 'How can schools and colleges submit registrations?',
    answer: 'Institutions can visit the Registration page, select "School & College Registration", download the template, upload student details, and submit in one single step.',
  },
  {
    _id: 'faq-6',
    question: 'Will certificates be provided to participants?',
    answer: 'Yes! Physical certificates will be given after the completion of the run.',
  },
];

const getCached = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch (_) {}
  return fallback;
};

export const HomePage = () => {
  const [homepageData, setHomepageData] = useState(() => getCached('cms_homepage_config', null));
  const [loading, setLoading] = useState(() => !getCached('cms_homepage_config', null));
  const [eventConfig, setEventConfig] = useState(() => getCached('cms_event_config', null));
  const [banners, setBanners] = useState(() => getCached('cms_banners', { horizontal: null, vertical: [] }));
  const [faqs, setFaqs] = useState(() => getCached('cms_faqs', DEFAULT_FAQS));
  const [activities, setActivities] = useState(() => {
    const cached = getCached('cms_activities', null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached.filter((a) => !/School Anti-Drug Oath/i.test(a.title || ''));
    }
    return DEFAULT_ACTIVITIES;
  });

  const loadAllData = () => {
    // 1. Fetch Public Homepage Configuration from CMS
    homepageService
      .getPublicHomepage()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setHomepageData(res.data.data);
          try { localStorage.setItem('cms_homepage_config', JSON.stringify(res.data.data)); } catch (_) {}
          if (res.data.data.theme) {
            applyDynamicTheme(res.data.data.theme);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // 2. Fetch Auxiliary Data (Events, Banners, FAQs, Activities)
    eventService.getConfig().then((res) => {
      if (res.data?.success) {
        setEventConfig(res.data.data);
        try { localStorage.setItem('cms_event_config', JSON.stringify(res.data.data)); } catch (_) {}
      }
    }).catch(() => {});

    bannerService.getBanners().then((res) => {
      if (res.data?.success) {
        setBanners(res.data.data);
        try { localStorage.setItem('cms_banners', JSON.stringify(res.data.data)); } catch (_) {}
      }
    }).catch(() => {});

    faqService.getFAQs().then((res) => {
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setFaqs(res.data.data);
        try { localStorage.setItem('cms_faqs', JSON.stringify(res.data.data)); } catch (_) {}
      } else {
        setFaqs(DEFAULT_FAQS);
      }
    }).catch(() => {
      setFaqs(DEFAULT_FAQS);
    });

    activityService.getActivities().then((res) => {
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const cleanActs = res.data.data
          .filter((a) => a.active !== false && !/School Anti-Drug Oath/i.test(a.title || ''))
          .slice(0, 3);
        setActivities(cleanActs);
        try { localStorage.setItem('cms_activities', JSON.stringify(cleanActs)); } catch (_) {}
      } else {
        setActivities(DEFAULT_ACTIVITIES);
      }
    }).catch(() => {
      setActivities(DEFAULT_ACTIVITIES);
    });
  };

  useEffect(() => {
    loadAllData();

    const handleCmsUpdate = (e) => {
      if (e.type === 'storage' && e.key && e.key !== 'cms_last_updated') return;
      loadAllData();
    };

    window.addEventListener('cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    window.addEventListener('focus', handleCmsUpdate);

    return () => {
      window.removeEventListener('cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
      window.removeEventListener('focus', handleCmsUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--orange)] border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
          Loading Anti-Drug Movement 2026...
        </p>
      </div>
    );
  }

  // GLOBAL HOMEPAGE OFF / DISABLED MAINTENANCE STATE
  if (homepageData && homepageData.isEnabled === false) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[var(--bg-primary)]">
        <div className="bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] rounded-3xl max-w-2xl w-full p-8 sm:p-12 text-center space-y-6 shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center mx-auto shadow-inner">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-[10px] tracking-widest uppercase border border-[var(--orange)]/30">
            NOTICE • HOMEPAGE TEMPORARILY UNAVAILABLE
          </span>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-[var(--text-primary)]">
            {homepageData.disabledTitle || 'Website Updates In Progress'}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] font-semibold leading-relaxed max-w-xl mx-auto">
            {homepageData.disabledMessage || 'The public homepage is currently undergoing scheduled updates. Please check back soon!'}
          </p>

          {homepageData.disabledImage && (
            <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] max-h-[260px] mx-auto shadow-md">
              <img
                src={homepageData.disabledImage}
                alt="Maintenance"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {homepageData.disabledContactButton && (
            <div className="pt-4">
              <Link
                to={homepageData.disabledContactUrl || '/lets-connect'}
                className="btn-primary text-sm py-3.5 px-8 inline-flex text-decoration-none shadow-xl"
              >
                <Mail className="w-4 h-4" />
                <span>CONTACT ORGANIZERS</span>
              </Link>
            </div>
          )}

          <p className="text-[11px] text-[var(--text-muted)] pt-4 border-t border-[var(--border-color)]">
            Chinmaya Mission Adoni & Chinmaya Yuva Kendra
          </p>
        </div>
      </div>
    );
  }

  // HOMEPAGE IS ON: RENDER SECTIONS
  const sections = (homepageData?.sections && homepageData.sections.length > 0)
    ? homepageData.sections
    : DEFAULT_HOMEPAGE_SECTIONS;

  return (
    <div className="min-h-screen space-y-4">
      {/* Dynamic Sections Rendered According to Admin Order */}
      {sections.length > 0 ? (
        sections.map((section) => (
          <React.Fragment key={section.sectionId || section._id}>
            <SectionRenderer
              section={section}
              eventConfig={eventConfig}
              banners={banners}
              activities={activities}
              faqs={faqs}
            />

            {/* Inject Banner Carousel after Hero Section */}
            {section.type === 'hero' && banners.vertical && banners.vertical.length > 0 && (
              <section className="py-4">
                <ContinuousVerticalBannerSlider banners={banners.vertical} />
              </section>
            )}

            {/* Inject Transformation Story after Marathon Section */}
            {section.type === 'marathon' && (
              <TransformationSection />
            )}
          </React.Fragment>
        ))
      ) : (
        /* Fallback if no sections configured */
        <div className="py-20 text-center text-sm font-bold text-[var(--text-muted)]">
          No homepage sections published yet.
        </div>
      )}
    </div>
  );
};
