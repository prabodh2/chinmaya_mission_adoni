import React, { useState, useEffect } from 'react';
import { activityService, contentService } from '../services/api';
import {
  Flame,
  Sparkles,
  Landmark,
  Heart,
  Zap,
  Users,
  Sun,
  Shield,
  X,
  ChevronRight,
  Maximize2,
  Calendar,
} from 'lucide-react';

// Reusable Activity Card Component (Compact 2-per-row design)
const ActivityCard = ({ activity, onSelect }) => {
  return (
    <article className="rounded-[24px] bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_4px_20px_rgba(11,35,64,0.04),0_1px_3px_rgba(11,35,64,0.03)] hover:shadow-[0_16px_40px_rgba(11,35,64,0.09)] hover:border-[var(--orange)]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-[16/10] sm:h-48 w-full overflow-hidden bg-slate-900/10">
          <img
            src={activity.imageUrl || '/assets/images/activity-sanjeevaraya.png'}
            alt={activity.imageAlt || activity.title}
            onError={(e) => {
              if (activity.id === 'chinmaya-sanjeevaraya-temple' || activity.title?.toLowerCase().includes('sanjeevaraya')) {
                e.currentTarget.src = '/assets/images/activity-sanjeevaraya.png';
              } else if (activity.id === 'shanta-malleshwara-temple' || activity.title?.toLowerCase().includes('malleshwara')) {
                e.currentTarget.src = '/assets/images/activity-shantamalleshwara.webp';
              } else if (activity.id === 'devi-group' || activity.title?.toLowerCase().includes('devi')) {
                e.currentTarget.src = '/assets/images/activity-devigroup.jpg';
              } else if (activity.id === 'chinmaya-yuva-kendra' || activity.title?.toLowerCase().includes('chyk')) {
                e.currentTarget.src = '/assets/images/activity-chyk.jpg';
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-40 transition-opacity" />
          
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-extrabold text-[10px] uppercase tracking-wider border border-white/20 shadow-sm">
            {activity.category}
          </span>

          <button
            onClick={() => onSelect(activity)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white transition-all shadow-md hover:scale-105"
            title="Enlarge Image"
            aria-label={`Enlarge image for ${activity.title}`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-[var(--orange)]" />
          </button>
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 space-y-2.5 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--orange)] group-hover:text-white transition-colors duration-300">
              {activity.icon || <Sparkles className="w-4 h-4" />}
            </div>
            <h3 className="text-base sm:text-lg font-black font-heading text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors leading-snug line-clamp-1">
              {activity.title}
            </h3>
          </div>

          <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed line-clamp-3 font-medium">
            {activity.description}
          </p>
        </div>
      </div>

      {/* Card Footer Meta */}
      {activity.imageSource && (
        <div className="px-5 sm:px-6 pb-4 pt-2.5 border-t border-[rgba(11,35,64,0.06)] text-[10px] font-bold text-[var(--text-muted)] flex items-center justify-between">
          <span className="truncate max-w-[65%]">Source: {activity.imageSource}</span>
          <span className="text-[var(--orange)] font-extrabold tracking-wider uppercase whitespace-nowrap">CHINMAYA MISSION</span>
        </div>
      )}
    </article>
  );
};

// Reusable CHYK Feature Section Component
const ChykFeatureSection = ({ activity, onSelect }) => {
  return (
    <article className="rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Visual Image */}
        <div className="lg:col-span-5 order-1">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--orange)] shadow-xl group">
            <img
              src={activity.imageUrl || '/assets/images/activity-chyk.jpg'}
              alt={activity.imageAlt || activity.title}
              onError={(e) => {
                e.currentTarget.src = '/assets/images/activity-chyk.jpg';
              }}
              className="w-full h-72 sm:h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-[var(--orange)] text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
              {activity.category}
            </span>
            <button
              onClick={() => onSelect(activity)}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-black/80 text-white hover:bg-black transition-colors border border-white/20"
              aria-label="Enlarge CHYK Activity Image"
            >
              <Maximize2 className="w-5 h-5 text-[var(--yellow)]" />
            </button>
          </div>
        </div>

        {/* Right Column: CHYK Content */}
        <div className="lg:col-span-7 space-y-5 text-left order-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs uppercase tracking-widest border border-[var(--orange)]/30">
            <Zap className="w-4 h-4 fill-current" />
            <span>CHINMAYA YUVA KENDRA • YOUTH WING</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black font-heading text-[var(--text-primary)] leading-tight">
            {activity.title}
          </h3>

          <p className="text-sm sm:text-base text-[var(--text-primary)] font-semibold leading-relaxed p-4 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm">
            "{activity.description}"
          </p>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            {activity.additionalDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {['KNOWLEDGE', 'DISCIPLINE', 'CONFIDENCE', 'COMPASSION', 'SERVICE'].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-[rgba(11,35,64,0.08)] text-[var(--orange)] font-extrabold text-[11px] tracking-wider uppercase shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export const ActivitiesPage = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Centralized structured data for core Chinmaya Mission Adoni centres & wings
  const initialActivities = [
    {
      id: 'chinmaya-sanjeevaraya-temple',
      title: 'Chinmaya Sanjeevaraya Temple',
      section: 'SPIRITUALITY & DEVOTION',
      category: 'Spirituality & Devotion',
      description:
        'Dedicated to devotion and spiritual practice, Chinmaya Sanjeevaraya Temple serves as a place for worship, prayer and the observance of religious traditions. Through devotional activities and spiritual gatherings, the temple seeks to nurture faith, preserve cultural heritage and bring the community together.',
      imageUrl: '/assets/images/activity-sanjeevaraya.png',
      imageAlt: 'Chinmaya Sanjeevaraya Temple Adoni Devotional Practice',
      imageSource: 'Chinmaya Mission Adoni Devotional Center',
      imageCredit: 'Official Shrine & Devotional Gatherings',
      icon: <Landmark className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      id: 'shanta-malleshwara-temple',
      title: 'Shanta Malleshwara Temple',
      section: 'SPIRITUALITY & DEVOTION',
      category: 'Devotion & Community',
      description:
        'Shanta Malleshwara Temple is an important centre of worship and devotion associated with Chinmaya Mission Adoni. The temple provides a space for devotees to participate in religious observances, festivals and spiritual activities, fostering a sense of unity, devotion and community service.',
      imageUrl: '/assets/images/activity-shantamalleshwara.webp',
      imageAlt: 'Shanta Malleshwara Temple Adoni Worship Center',
      imageSource: 'Shri Shantamalleshwara Swami Temple Adoni',
      imageCredit: 'Official Festival & Devotional Observances',
      icon: <Flame className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      id: 'devi-group',
      title: 'Devi Group',
      section: 'CULTURE & DEVOTION',
      category: 'Culture & Spiritual Learning',
      description:
        "The Devi Group is dedicated to nurturing devotion, spiritual understanding and the preservation of cultural values. Through devotional gatherings, spiritual learning and collective participation in traditional activities, the group encourages members to deepen their spiritual connection and contribute to the Mission's broader vision.",
      imageUrl: '/assets/images/activity-devigroup.jpg',
      imageAlt: 'Chinmaya Mission Devi Group Devotional Gathering',
      imageSource: 'Devi Group Cultural Learning Wing',
      imageCredit: 'Spiritual Learning & Cultural Preservation',
      icon: <Heart className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      id: 'chinmaya-yuva-kendra',
      title: 'Chinmaya Yuva Kendra (CHYK)',
      section: 'YOUTH & LEADERSHIP',
      category: 'Youth • Leadership • Service',
      description:
        'Chinmaya Yuva Kendra (CHYK) is the youth wing of Chinmaya Mission, providing a platform for young people to grow spiritually, develop leadership skills and engage in meaningful community initiatives.',
      additionalDescription:
        "CHYK Adoni encourages young minds to discover their potential and apply the wisdom of Indian philosophy to modern-day life. Through youth programmes, cultural activities, interactive initiatives and social service, CHYK inspires young people to become responsible leaders guided by knowledge, discipline, confidence and compassion.",
      imageUrl: '/assets/images/activity-chyk.jpg',
      imageAlt: 'Chinmaya Yuva Kendra CHYK Adoni Youth Empowerment',
      imageSource: 'Chinmaya Yuva Kendra (CHYK) Adoni',
      imageCredit: 'Youth Empowerment & Community Leadership',
      icon: <Zap className="w-5 h-5 text-[var(--orange)]" />,
      featured: true,
    },
  ];

  const defaultMovementActivities = [
    {
      id: 'act-1',
      title: 'Youth Marathon Prep Bootcamps',
      category: 'Marathon Training',
      section: 'COMMUNITY & MOVEMENT INITIATIVES',
      description:
        'Weekly morning running sessions and endurance training across Adoni schools and colleges.',
      imageUrl:
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Youth Marathon Prep Bootcamps',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      id: 'act-2',
      title: 'School Anti-Drug Oath & Pledge',
      category: 'School Drive',
      section: 'COMMUNITY & MOVEMENT INITIATIVES',
      description:
        'Interactive student rallies and pledge signatures taking place in 50+ Adoni institutions.',
      imageUrl:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'School Anti-Drug Oath & Pledge',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      id: 'act-3',
      title: 'Mind & Body Wellness Seminars',
      category: 'Fitness & Wellness',
      section: 'COMMUNITY & MOVEMENT INITIATIVES',
      description:
        'Guided meditation, stress management and yoga sessions organized by Chinmaya Yuva Kendra.',
      imageUrl:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Mind & Body Wellness Seminars',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      id: 'act-4',
      title: 'Adoni Torch Relay & Street Rallies',
      category: 'Awareness Campaign',
      section: 'COMMUNITY & MOVEMENT INITIATIVES',
      description:
        'Torch relay highlighting positive choices, sports culture, and freedom from addiction.',
      imageUrl:
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Adoni Torch Relay & Street Rallies',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
  ];

  const getCached = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          return parsed.map((act) => {
            const initialMatch = initialActivities.find(
              (init) => init.id === act.id || init.title?.toLowerCase() === act.title?.toLowerCase()
            );
            // Critical safeguard: if cached imageUrl is missing, undefined, or empty, fallback to initial match
            let img = act.imageUrl;
            if (!img || img === 'undefined' || typeof img !== 'string' || img.trim() === '') {
              img = initialMatch?.imageUrl || '';
            } else if (img.includes('activity-sanjeevaraya.png')) {
              img = '/assets/images/activity-sanjeevaraya.png';
            } else if (img.includes('devi_group_wing') || img.includes('photo-1511632765486')) {
              img = '/assets/images/activity-devigroup.jpg';
            }
            return {
              ...act,
              imageUrl: img,
              icon: act.icon || initialMatch?.icon,
            };
          });
        }
        return parsed;
      }
    } catch (_) {}
    return fallback;
  };

  const [missionActivities, setMissionActivities] = useState(() => {
    const cached = getCached('cms_mission_activities', null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return initialActivities;
  });
  const [movementActivities, setMovementActivities] = useState(() => {
    const cached = getCached('cms_movement_activities', null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached.filter((a) => !/School Anti-Drug Oath/i.test(a.title || ''));
    }
    return defaultMovementActivities;
  });

  const loadActivities = () => {
    // 1. Fetch community & movement activities from API
    activityService
      .getActivities()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const list = res.data.data
            .filter((act) => act.active !== false && !/School Anti-Drug Oath/i.test(act.title || ''))
            .map((act) => ({
              id: act._id || act.title,
              title: act.title,
              section: 'COMMUNITY & MOVEMENT INITIATIVES',
              category: act.category || 'Activity',
              description: act.description,
              imageUrl: act.imageUrl,
              imageAlt: act.title,
              icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
            }));
          setMovementActivities(list);
          try {
            localStorage.setItem(
              'cms_movement_activities',
              JSON.stringify(list.map((x) => ({ ...x, icon: undefined })))
            );
          } catch (_) {}
        }
      })
      .catch(() => {});

    // 2. Fetch About/Activities CMS updates if customized in admin dashboard
    contentService
      .getContent('about_page')
      .then((res) => {
        if (res.data?.success && res.data?.data?.ourActivities?.cards) {
          const cmsCards = res.data.data.ourActivities.cards;
          setMissionActivities((prev) => {
            const updated = prev.map((item, idx) => {
              const matchedCard = cmsCards.find(
                (c) =>
                  c.id === item.id ||
                  c.title?.toLowerCase() === item.title?.toLowerCase() ||
                  (idx === 0 && c.id === 'act-1') ||
                  (idx === 1 && c.id === 'act-2') ||
                  (idx === 2 && c.id === 'act-3') ||
                  (idx === 3 && c.id === 'act-4')
              );
              if (matchedCard) {
                let cleanImg = matchedCard.imageUrl;
                if (!cleanImg || cleanImg === 'undefined' || typeof cleanImg !== 'string' || cleanImg.trim() === '') {
                  cleanImg = item.imageUrl;
                } else if (cleanImg.includes('activity-sanjeevaraya.png')) {
                  cleanImg = '/assets/images/activity-sanjeevaraya.png';
                }

                return {
                  ...item,
                  title: matchedCard.title || item.title,
                  description: matchedCard.content || matchedCard.description || item.description,
                  imageUrl: cleanImg,
                };
              }
              return item;
            });
            try {
              localStorage.setItem(
                'cms_mission_activities',
                JSON.stringify(updated.map((x) => ({ ...x, icon: undefined })))
              );
            } catch (_) {
              try {
                // If quota exceeded, never set imageUrl to undefined; fall back to clean asset path
                const cleanForStorage = updated.map((x) => {
                  const initialMatch = initialActivities.find((init) => init.id === x.id);
                  return {
                    ...x,
                    icon: undefined,
                    imageUrl: (x.imageUrl && x.imageUrl.length > 50000) ? (initialMatch?.imageUrl || '') : x.imageUrl,
                  };
                });
                localStorage.setItem('cms_mission_activities', JSON.stringify(cleanForStorage));
              } catch (__) {}
            }
            return updated;
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadActivities();

    const handleCmsUpdate = (e) => {
      if (e.type === 'storage' && e.key && e.key !== 'cms_last_updated') return;
      loadActivities();
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

  const spiritualDevotionActivities = missionActivities.filter(
    (item) => item.section === 'SPIRITUALITY & DEVOTION'
  );
  const cultureDevotionActivities = missionActivities.filter(
    (item) => item.section === 'CULTURE & DEVOTION'
  );
  const chykActivity =
    missionActivities.find(
      (item) => item.id === 'chinmaya-yuva-kendra' || item.title?.includes('CHYK')
    ) || initialActivities[3];

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-24">
      {/* 1. ACTIVITIES PAGE INTRODUCTION */}
      <header className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-widest uppercase border border-[var(--orange)]/30">
          <Flame className="w-4 h-4 text-[var(--orange)]" />
          <span>CHINMAYA MISSION ADONI ACTIVITIES</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-[var(--text-primary)] tracking-tight">
          OUR <span className="text-[var(--orange)]">ACTIVITIES</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-muted)] font-medium leading-relaxed max-w-3xl mx-auto">
          "At Chinmaya Mission Adoni, our activities bring together spirituality, devotion, cultural values, youth development and selfless service. Through our temples and dedicated groups, we strive to nurture spiritual awareness, strengthen community bonds and inspire individuals of all ages to live by timeless values."
        </p>
      </header>

      {/* 2. SECTION 1: SPIRITUALITY & DEVOTION */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
          <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-[var(--orange)] uppercase tracking-wider block">
              SECTION 01
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              SPIRITUALITY & DEVOTION
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {spiritualDevotionActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onSelect={setSelectedActivity}
            />
          ))}
        </div>
      </section>

      {/* 3. SECTION 2: CULTURE & DEVOTION */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
          <div className="w-10 h-10 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-[var(--cyan)] uppercase tracking-wider block">
              SECTION 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              CULTURE & DEVOTION
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cultureDevotionActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onSelect={setSelectedActivity}
            />
          ))}
        </div>
      </section>

      {/* 4. SECTION 3: YOUTH & LEADERSHIP (SPECIAL CHYK SECTION) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
          <div className="w-10 h-10 rounded-2xl bg-[var(--orange)] text-white flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-[var(--orange)] uppercase tracking-wider block">
              SECTION 03
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              YOUTH & LEADERSHIP
            </h2>
          </div>
        </div>

        {chykActivity && (
          <ChykFeatureSection
            activity={chykActivity}
            onSelect={setSelectedActivity}
          />
        )}
      </section>

      {/* 5. SECTION 4: MOVEMENT & COMMUNITY INITIATIVES */}
      {movementActivities.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-2xl bg-[var(--yellow)]/15 text-[var(--orange)] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-[var(--orange)] uppercase tracking-wider block">
                SECTION 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                COMMUNITY & MOVEMENT INITIATIVES
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {movementActivities.map((act) => (
              <ActivityCard
                key={act.id || act._id || act.title}
                activity={act}
                onSelect={setSelectedActivity}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. CLOSING VISUAL SECTION */}
      <footer className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[var(--navy)] via-[#0F2D52] to-[var(--navy)] text-white text-center shadow-2xl space-y-6 relative overflow-hidden border border-white/10">
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--yellow)] font-extrabold text-xs uppercase tracking-widest border border-white/20">
            CHINMAYA MISSION ADONI
          </span>

          <h3 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white">
            Spirituality • Culture • Youth • Service
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Inspiring individuals to live by timeless values, empower youth, and foster clean, drug-free living across Adoni.
          </p>
        </div>
      </footer>

      {/* Lightbox Modal for Enlarged Activity Images */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[rgba(11,35,64,0.08)] rounded-3xl max-w-3xl w-full overflow-hidden shadow-[0_4px_12px_rgba(11,35,64,0.06),0_16px_40px_rgba(11,35,64,0.1)] relative">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] bg-black flex items-center justify-center">
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.imageAlt || selectedActivity.title}
                className="max-h-[60vh] w-full object-contain"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-3 text-left">
              <span className="px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] text-xs font-extrabold uppercase">
                {selectedActivity.category}
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--text-primary)] font-heading">
                {selectedActivity.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {selectedActivity.description}
              </p>
              {selectedActivity.additionalDescription && (
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--border-color)]/50">
                  {selectedActivity.additionalDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
