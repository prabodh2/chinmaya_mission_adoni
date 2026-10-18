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
} from 'lucide-react';
import '../styles/homepage.css';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL || 'https://marathon-chinmaya-mission-adoni.vercel.app/';

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
    title: '3K Anti-Drug Marathon',
    subtitle: 'We Rise · We Run · We Resist',
    date: 'Sunday, Dec 20, 2026',
    kind: 'marathon',
    image: '/assets/chyk-marathon.jpg',
    url: null,
    isExternal: false,
  },
  {
    title: 'Rama Navami',
    subtitle: 'Sri Sita Rama Kalyanam & Divine Celebrations',
    date: 'April 15th',
    kind: 'journey',
    icon: '✦',
    url: '/events',
  },
  {
    title: 'Hanuman Jayanthi',
    subtitle: 'Special Pooja & Hanuman Chalisa Parayanam',
    date: 'April 20th',
    kind: 'wisdom',
    icon: 'ॐ',
    url: '/events',
  },
  {
    title: 'Krishna Janmashtami',
    subtitle: 'Lord Krishna Birth Celebrations & Utsavam',
    date: 'August 25th',
    kind: 'meditation',
    icon: '☼',
    url: '/events',
  },
];

export function HomePage() {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();

  const [pageData, setPageData] = useState(() => {
    try {
      localStorage.removeItem('cached_cms_chinmaya_home');
      const cached = localStorage.getItem('cached_cms_chinmaya_home_v2');
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
            localStorage.setItem('cached_cms_chinmaya_home_v2', JSON.stringify(res.data.data));
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

  const heroEyebrow = (f.hero?.eyebrow || 'CHINMAYA MISSION').replace(/[·,]\s*ADONI/gi, '').trim();
  const heroHeading = f.hero?.heading || 'Inner Transformation for a Better World';
  const heroDesc = f.hero?.description || 'Through Vedanta, values and service, we strive to build a generation of conscious, compassionate and capable individuals.';
  const primaryBtnText = f.hero?.primaryBtnText || 'Explore Our Mission';
  const primaryBtnLink = f.hero?.primaryBtnLink || '#about';
  const rawPortrait = f.hero?.portraitImage;
  const isOldPortrait =
    !rawPortrait ||
    rawPortrait.includes('swami-chinmayananda-natural') ||
    rawPortrait.includes('swami-chinmayananda-portrait') ||
    rawPortrait.includes('swami-chinmayananda.png') ||
    rawPortrait.includes('swami-chinmayananda.jpg') ||
    rawPortrait.includes('swami-chinmayananda-suitable-bg') ||
    rawPortrait.includes('swami-chinmayananda-divine-aura');

  const portraitImg = isOldPortrait
    ? '/assets/swami-chinmayananda-himalaya-sunrise.jpg'
    : rawPortrait;
  const portraitQuote = f.hero?.portraitQuote || 'Arise, Awake and Guide Others';
  const portraitSig = f.hero?.portraitSignature || 'Swami Chinmayananda';

  const aboutEyebrow = f.about_purpose?.eyebrow || 'OUR PURPOSE';
  const aboutHeading = (f.about_purpose?.heading || 'About Chinmaya Mission').replace(/,\s*Adoni/gi, '').trim();
  const rawAboutDesc = f.about_purpose?.description || 'Chinmaya Mission has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swami Shyamananda (Dr. Shyamala) under the guidance and blessings of Swami Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy.\n\nWe believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.';
  const aboutDesc = rawAboutDesc.replace(/,\s*Adoni/gi, '').replace(/\bAdoni\b/gi, '').replace(/\s{2,}/g, ' ');
  const aboutLinkText = f.about_purpose?.linkText || 'Learn More';
  const aboutLinkUrl = f.about_purpose?.linkUrl || '/about';

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
  const eventsLinkUrl = f.upcoming_events?.linkUrl || '/events';
  const dynamicEvents =
    f.upcoming_events?.items?.length &&
    !f.upcoming_events.items.some(
      (it) =>
        it.title?.includes('Amrit Yatra') ||
        it.title?.includes('Jnana Yajna') ||
        it.title?.includes('Bala Vihar')
    )
      ? f.upcoming_events.items.map((it, idx) => {
          const isMarathon = it.title?.toLowerCase().includes('marathon') || idx === 0;
          const targetUrl = isMarathon ? null : (it.linkUrl || '/events');
          return {
            title: it.title,
            subtitle: it.subtitle || '',
            date: it.dateOrYear || 'Upcoming',
            kind: idx === 0 ? 'marathon' : idx === 1 ? 'journey' : idx === 2 ? 'wisdom' : 'meditation',
            image: it.imageUrl || (idx === 0 ? '/assets/chyk-marathon.jpg' : ''),
            url: targetUrl,
            isExternal: Boolean(targetUrl && targetUrl.startsWith('http')),
          };
        })
      : events;

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
              <source src="/assets/logo.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-overlay" />
          </div>

          <div className="hero-glow" />
          <div className="hero-content">
            <p className="eyebrow">
              <span className="eyebrow-line" /> {heroEyebrow}
            </p>
            <h1>
              {heroHeading.includes('for a Better World') ? (
                <>
                  Inner Transformation<br />
                  <em>for a Better World</em>
                </>
              ) : (
                heroHeading
              )}
            </h1>
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

          <div className="hero-portrait" aria-hidden="true">
            <div className="portrait-aura" />
            <div className="portrait-frame">
              <img
                src={portraitImg}
                alt={portraitSig}
                className="portrait-img"
              />
            </div>
            <div className="signature">{portraitSig}</div>
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
              const isMarathon = event.kind === 'marathon' || event.title?.toLowerCase().includes('marathon');
              const targetUrl = isMarathon ? null : event.url;
              const hasLink = Boolean(targetUrl);

              return (
                <article
                  className={`event-card group ${hasLink ? 'cursor-pointer' : 'cursor-default'}`}
                  key={event.title}
                  onClick={() => {
                    if (!hasLink) return;
                    if (event.isExternal || targetUrl.startsWith('http')) {
                      window.open(targetUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(targetUrl);
                    }
                  }}
                >
                  <div className={'event-art ' + event.kind}>
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="event-art-img" />
                    ) : event.kind === 'journey' ? (
                      <div className="road-sun" />
                    ) : event.kind === 'wisdom' ? (
                      <div className="wisdom-symbol">ॐ</div>
                    ) : event.kind === 'youth' ? (
                      <Users size={50} />
                    ) : (
                      <Sun size={56} strokeWidth={1.2} />
                    )}
                  </div>
                  <div className="event-info">
                    <div className="flex items-start justify-between gap-1">
                      <h3>{event.title}</h3>
                      {event.isExternal && !isMarathon && (
                        <ExternalLink size={13} className="text-[var(--orange)] shrink-0 mt-0.5 opacity-70 group-hover:opacity-100" />
                      )}
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
    </div>
  );
}

export default HomePage;
