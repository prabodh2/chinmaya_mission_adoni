import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { webContentService } from '../services/api';
import {
  Heart,
  CalendarDays,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Users,
  Sun,
  Compass,
  Flame,
  Maximize2,
  X,
} from 'lucide-react';
import '../styles/homepage.css';

const corePillars = [
  {
    id: 'vision',
    icon: Compass,
    title: 'Our Vision',
    text: 'The inner transformation of individuals through knowledge of Vedanta, spiritual practices and service to society, resulting in a happy world around them.',
    badgeClass: 'pillar-badge-vision',
  },
  {
    id: 'mission',
    icon: Flame,
    title: 'Our Mission',
    text: 'To provide to individuals from any background, the wisdom of Vedanta and the practical means for spiritual growth and happiness enabling them to become positive contributors to society.',
    badgeClass: 'pillar-badge-mission',
  },
  {
    id: 'motto',
    icon: Heart,
    title: 'Our Motto',
    text: 'To give maximum happiness to the maximum number for the maximum time.',
    badgeClass: 'pillar-badge-motto',
  },
];

const events = [
  {
    title: 'Magamasam Poojallu',
    subtitle: 'Rudra Abhishekam, Rudra Homam, Siva Parvathi Kalyanam & Amavasya Poojalu',
    date: 'FEB 07 To March 08',
    kind: 'devotion',
    image: '/assets/magamasam-poojallu.jpg',
    icon: '🔥',
    url: '/activities',
    isExternal: false,
  },
  {
    title: 'Rama Navami',
    subtitle: 'Sri Sita Rama Kalyanam & Divine Celebrations',
    date: 'April 15th, 2027',
    kind: 'journey',
    image: '/assets/rama-navami.jpg',
    icon: '✦',
    url: '/activities',
    isExternal: false,
  },
  {
    title: 'Hanuman Jayanthi',
    subtitle: 'Special Pooja & Hanuman Chalisa Parayanam',
    date: 'April 20th, 2027',
    kind: 'wisdom',
    image: '/assets/hanuman-jayanthi.png',
    icon: 'ॐ',
    url: '/activities',
    isExternal: false,
  },
  {
    title: 'Krishna Janmashtami',
    subtitle: 'Lord Krishna Birth Celebrations & Utsavam',
    date: 'August 25th, 2027',
    kind: 'meditation',
    image: '/assets/krishna-janmashtami.jpg',
    icon: '☼',
    url: '/activities',
    isExternal: false,
  },
];

export function HomePage() {
  const [active, setActive] = useState('Home');
  const [previewEvent, setPreviewEvent] = useState(null);
  const navigate = useNavigate();

  const [pageData, setPageData] = useState(() => {
    try {
      localStorage.removeItem('cached_cms_chinmaya_home');
      localStorage.removeItem('cached_cms_chinmaya_home_v2');
      localStorage.removeItem('cached_cms_chinmaya_home_v3');
      localStorage.removeItem('cached_cms_chinmaya_home_v4');
      localStorage.removeItem('cached_cms_chinmaya_home_v5');
      localStorage.removeItem('cached_cms_chinmaya_home_v6');
      localStorage.removeItem('cached_cms_chinmaya_home_v7');
      const cached = localStorage.getItem('cached_cms_chinmaya_home_v8');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    webContentService
      .getPublicPage('chinmaya', 'home')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem('cached_cms_chinmaya_home_v8', JSON.stringify(res.data.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const f = pageData?.fieldsMap || {};

  const goTo = (label) => {
    setActive(label);
    const targetId = label.toLowerCase();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const rawEyebrow = (f.hero?.eyebrow || 'Inner Transformation for a Better World').replace(/^[\s\-—–]+/, '').trim();
  const rawHeading = (f.hero?.heading || 'Chinmaya Mission, Adoni').trim();

  let heroEyebrow = rawEyebrow || 'Inner Transformation for a Better World';
  let heroHeading = rawHeading || 'Chinmaya Mission, Adoni';

  // Normalize so Chinmaya Mission, Adoni is the heading (above) and Inner Transformation for a Better World is the tagline
  if (/inner\s*transformation/i.test(heroHeading) && /chinmaya\s*mission/i.test(heroEyebrow)) {
    heroHeading = 'Chinmaya Mission, Adoni';
    heroEyebrow = 'Inner Transformation for a Better World';
  } else if (!/chinmaya\s*mission/i.test(heroHeading) && /chinmaya\s*mission/i.test(heroEyebrow)) {
    heroHeading = 'Chinmaya Mission, Adoni';
    heroEyebrow = 'Inner Transformation for a Better World';
  }
  const heroDesc = f.hero?.description || 'Through Vedanta, values and service, we strive to build a generation of conscious, compassionate and capable individuals.';
  const primaryBtnText = f.hero?.primaryBtnText || 'Explore Our Mission';
  const primaryBtnLink = f.hero?.primaryBtnLink || '#about';
  const rawPortrait = f.hero?.portraitImage;
  const isCustomCloudinary =
    rawPortrait &&
    typeof rawPortrait === 'string' &&
    rawPortrait.startsWith('http') &&
    (rawPortrait.includes('cloudinary') || rawPortrait.includes('res.cloudinary.com')) &&
    !rawPortrait.includes('cutout');

  const portraitImg = isCustomCloudinary
    ? rawPortrait
    : '/assets/swami-chinmayananda-golden-tree.jpg';
  const portraitQuote = f.hero?.portraitQuote || 'Arise, Awake and Guide Others';
  const portraitSig = f.hero?.portraitSignature || 'Swami Chinmayananda';

  const aboutEyebrow = f.about_purpose?.eyebrow || 'OUR PURPOSE';
  let aboutHeading = f.about_purpose?.heading || 'About Chinmaya Mission, Adoni';
  if (!/adoni/i.test(aboutHeading)) {
    aboutHeading = 'About Chinmaya Mission, Adoni';
  }
  const rawAboutDesc = f.about_purpose?.description || 'Chinmaya Mission, Adoni has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swamini Shyamananda (Dr. Shyamala) under the guidance and blessings of Swamini Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy.\n\nWe believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.';
  const aboutDesc = rawAboutDesc
    .replace(/Swami Shyamananda/g, 'Swamini Shyamananda')
    .replace(/Swami Sharadapriyananda/g, 'Swamini Sharadapriyananda')
    .replace(/^Chinmaya Mission,?\s*has been serving/i, 'Chinmaya Mission, Adoni has been serving')
    .replace(/^Chinmaya Mission,?\s*Adoni,?\s*has been serving/i, 'Chinmaya Mission, Adoni has been serving')
    .replace(/\s{2,}/g, ' ');
  const aboutLinkText = f.about_purpose?.linkText || 'Learn More';
  const aboutLinkUrl = f.about_purpose?.linkUrl || '/chinmaya-mission-adoni';

  const valuesEyebrow = f.core_values?.eyebrow || 'WHAT GUIDES US';
  const valuesHeading = f.core_values?.heading || 'Our Core Values';
  const dynamicPillars = f.core_values?.items?.length
    ? f.core_values.items.map((it, idx) => ({
        id: it.itemId || `pillar-${idx}`,
        icon: idx === 0 ? Compass : idx === 1 ? Flame : Heart,
        title: it.title,
        text: it.description,
        badgeClass: idx === 0 ? 'pillar-badge-vision' : idx === 1 ? 'pillar-badge-mission' : 'pillar-badge-motto',
      }))
    : corePillars;

  const chykEyebrow = f.chyk_section?.eyebrow || 'THE YOUTH WING';
  const chykHeading = f.chyk_section?.heading || 'CHYK — The Youth Wing';
  const chykDesc = f.chyk_section?.description || 'CHYK (Chinmaya Yuva Kendra) empowers young minds through value-based education, spiritual learning, cultural activities and social service.';
  const chykTag1 = f.chyk_section?.tag1 || 'Discover your potential';
  const chykTag2 = f.chyk_section?.tag2 || 'Serve with purpose';
  const chykBtnText = f.chyk_section?.buttonText || 'Join CHYK';
  const chykBtnLink = f.chyk_section?.buttonLink || '/lets-connect';
  const rawChykImg = f.chyk_section?.imageUrl;
  const chykImg = (!rawChykImg || rawChykImg.includes('youth-runners'))
    ? '/assets/chyk-group.jpg'
    : rawChykImg;

  const eventsEyebrow = f.upcoming_events?.eyebrow || 'COME BE A PART';
  const eventsHeading = f.upcoming_events?.heading || 'Upcoming Events';
  const eventsLinkText = f.upcoming_events?.linkText || 'View All';
  const eventsLinkUrl = f.upcoming_events?.linkUrl || '/activities';

  const rawEventItems = (f.upcoming_events?.items || []).filter(
    (it) =>
      it &&
      it.itemId !== 'event-marathon' &&
      !it.title?.toLowerCase().includes('marathon')
  );

  const magamasamCard = {
    title: 'Magamasam Poojallu',
    subtitle: 'Rudra Abhishekam, Rudra Homam, Siva Parvathi Kalyanam & Amavasya Poojalu',
    date: 'FEB 07 To March 08',
    kind: 'devotion',
    image: '/assets/magamasam-poojallu.jpg',
    icon: '🔥',
    url: '/activities',
    isExternal: false,
  };

  const baseEvents =
    rawEventItems.length > 0 &&
    !rawEventItems.some(
      (it) =>
        it.title?.includes('Amrit Yatra') ||
        it.title?.includes('Jnana Yajna') ||
        it.title?.includes('Bala Vihar')
    )
      ? rawEventItems.map((it, idx) => {
          const targetUrl = it.linkUrl || '/activities';
          const titleLower = (it.title || '').toLowerCase();
          const isRamaNavami = titleLower.includes('rama navami');
          const isHanuman = titleLower.includes('hanuman');
          const isKrishna = titleLower.includes('krishna');

          let defaultImg = '';
          if (isRamaNavami) defaultImg = '/assets/rama-navami.jpg';
          else if (isHanuman) defaultImg = '/assets/hanuman-jayanthi.png';
          else if (isKrishna) defaultImg = '/assets/krishna-janmashtami.jpg';

          const eventImage =
            it.imageUrl && !it.imageUrl.includes('rama-navami-procession')
              ? it.imageUrl
              : defaultImg;

          return {
            title: it.title,
            subtitle: it.subtitle || '',
            date: it.dateOrYear || 'Upcoming',
            kind: idx === 0 ? 'journey' : idx === 1 ? 'wisdom' : idx === 2 ? 'meditation' : 'journey',
            image: eventImage,
            url: targetUrl,
            isExternal: Boolean(targetUrl && targetUrl.startsWith('http')),
          };
        })
      : events;

  // Always bring Magamasam Poojallu to 1st place
  const otherEvents = baseEvents.filter((e) => !e.title?.toLowerCase().includes('magamasam'));
  const foundMagamasam = baseEvents.find((e) => e.title?.toLowerCase().includes('magamasam'));
  const magamasamCardFinal = {
    ...(foundMagamasam || magamasamCard),
    title: 'Magamasam Poojallu',
    date: 'FEB 07 To March 08',
    image: foundMagamasam?.image || '/assets/magamasam-poojallu.jpg',
  };

  const dynamicEvents = [magamasamCardFinal, ...otherEvents];

  return (
    <div className="site-shell">
      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          {/* Background Video */}
          <div className="hero-video-wrap" aria-hidden="true">
            <video
              className="hero-video-bg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/assets/download.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-overlay" />
          </div>

          <div className="hero-glow" />
          <div className="hero-content">
            <h1 className="hero-main-heading">
              {heroHeading.toLowerCase().includes('chinmaya mission') ? (
                <>Chinmaya Mission, <em>Adoni</em></>
              ) : heroHeading.toLowerCase().includes('inner transformation') && heroHeading.toLowerCase().includes('better world') ? (
                <>Inner Transformation <em>for a Better World</em></>
              ) : (
                heroHeading
              )}
            </h1>
            <p className="hero-tagline">
              {heroEyebrow}
            </p>
            <p className="hero-description whitespace-pre-line">
              {heroDesc}
            </p>
            <div className="hero-actions">
              {primaryBtnLink.startsWith('#') ? (
                <a
                  className="btn btn-primary"
                  href={primaryBtnLink}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(primaryBtnLink.replace('#', ''));
                  }}
                >
                  {primaryBtnText} <ArrowRight size={16} />
                </a>
              ) : (
                <Link className="btn btn-primary" to={primaryBtnLink}>
                  {primaryBtnText} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="hero-signature" aria-hidden="true">
            {portraitSig}
          </div>

          <div className="sun-disc" />
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section section-wrap" id="about">
          <div className="about-copy">
            <p className="eyebrow">{aboutEyebrow}</p>
            <h2>{aboutHeading}</h2>
            <span className="title-underline" />
            {aboutDesc.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            <Link className="text-link" to={aboutLinkUrl}>
              {aboutLinkText} <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* CORE VALUES SECTION */}
        <section className="values-section" id="activities">
          <div className="section-wrap">
            <div className="section-heading">
              <p className="eyebrow">{valuesEyebrow}</p>
              <h2>{valuesHeading}</h2>
              <span className="title-underline" />
            </div>
            <div className="pillars-grid">
              {dynamicPillars.map(({ icon: IconComponent, title, text, badgeClass }) => (
                <article className="pillar-card group" key={title}>
                  <div className="pillar-icon-wrap">
                    <div className={`pillar-icon-badge ${badgeClass}`}>
                      <IconComponent className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS SECTION */}
        <section className="events-section section-wrap" id="events">
          <div className="events-heading">
            <div>
              <p className="eyebrow">{eventsEyebrow}</p>
              <h2>{eventsHeading}</h2>
              <span className="title-underline" />
            </div>
          </div>
          <div className="events-grid">
            {dynamicEvents.map((event) => {
              return (
                <article
                  className="event-card group cursor-pointer"
                  key={event.title}
                  onClick={() => setPreviewEvent(event)}
                >
                  <div
                    className={'event-art ' + (event.kind || 'journey')}
                    title="Click to view details"
                  >
                    {event.image ? (
                      <>
                        <img
                          src={event.image}
                          alt=""
                          className="event-art-blur-bg"
                          aria-hidden="true"
                        />
                        <img
                          src={event.image}
                          alt={event.title}
                          className="event-art-img"
                        />
                        <button
                          type="button"
                          className="event-art-enlarge-btn"
                          title="Enlarge image"
                          aria-label={`Enlarge image for ${event.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewEvent(event);
                          }}
                        >
                          <Maximize2 size={13} />
                        </button>
                      </>
                    ) : event.kind === 'wisdom' ? (
                      <div className="wisdom-symbol">ॐ</div>
                    ) : event.kind === 'youth' ? (
                      <Users size={50} />
                    ) : event.kind === 'meditation' ? (
                      <Sun size={56} strokeWidth={1.2} />
                    ) : (
                      <div className="road-sun" />
                    )}
                  </div>
                  <div className="event-info">
                    <div className="flex items-start justify-between gap-1">
                      <h3>{event.title}</h3>
                    </div>
                    <p>{event.subtitle}</p>
                    <div className="event-date">
                      <CalendarDays size={14} />
                      {event.date}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CHYK SECTION */}
        <section className="chyk-section section-wrap" id="chyk">
          <div className="chyk-image">
            <img
              src={chykImg}
              alt="Chinmaya Yuva Kendra and Mission members"
            />
          </div>
          <div className="chyk-copy">
            <p className="eyebrow">{chykEyebrow}</p>
            <h2>
              {chykHeading.includes('—') ? (
                <>
                  {chykHeading.split('—')[0]} <span>— {chykHeading.split('—')[1]}</span>
                </>
              ) : (
                chykHeading
              )}
            </h2>
            <span className="title-underline" />
            <p>{chykDesc}</p>
            <div className="chyk-tags">
              <span>
                <Sparkles size={14} /> {chykTag1}
              </span>
              <span>
                <Heart size={14} /> {chykTag2}
              </span>
            </div>
            <Link
              className="btn btn-primary"
              to={chykBtnLink}
            >
              {chykBtnText} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* Full-view Festival Image Modal */}
      {previewEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-slate-950 border border-white/15 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col items-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewEvent(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-[var(--orange)] text-white transition-all cursor-pointer z-30"
              aria-label="Close image modal"
            >
              <X size={18} />
            </button>
            <div className="w-full flex-1 flex items-center justify-center overflow-auto max-h-[76vh] py-1">
              <img
                src={previewEvent.image}
                alt={previewEvent.title}
                className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
            <div className="w-full pt-3 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white border-t border-white/10 mt-2 gap-1.5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {previewEvent.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {previewEvent.subtitle}
                </p>
              </div>
              <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--orange)]/20 text-[var(--orange)] border border-[var(--orange)]/30 shrink-0">
                {previewEvent.date}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
