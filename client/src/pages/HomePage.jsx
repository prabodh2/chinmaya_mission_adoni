import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Leaf,
  CalendarDays,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Users,
  Sun,
} from 'lucide-react';
import '../styles/homepage.css';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL ||
  (import.meta.env.DEV ? 'http://localhost:5175' : 'https://marathon-chinmaya-mission-adoni.netlify.app');

const corePillars = [
  {
    icon: '/assets/images/vision-icon.png',
    title: 'Our Vision',
    text: 'The inner transformation of individuals through knowledge of Vedanta, spiritual practices and service to society, resulting in a happy world around them.',
  },
  {
    icon: '/assets/images/mission-icon.png',
    title: 'Our Mission',
    text: 'To provide to individuals from any background, the wisdom of Vedanta and the practical means for spiritual growth and happiness enabling them to become positive contributors to society.',
  },
  {
    icon: '/assets/images/motto-icon.png',
    title: 'Our Motto',
    text: 'To give maximum happiness to the maximum number for the maximum time.',
  },
];

const events = [
  {
    title: '3K Anti-Drug Marathon',
    subtitle: 'We Rise · We Run · We Resist',
    date: 'Sunday, Dec 20, 2026',
    kind: 'marathon',
    image: '/assets/chyk-marathon.jpg',
    url: MARATHON_PORTAL_URL,
    isExternal: true,
  },
  {
    title: 'Chinmaya Amrit Yatra',
    subtitle: 'A 75-year legacy journey',
    date: 'Dec 31, 2025 – Oct 23, 2026',
    kind: 'journey',
    icon: '✦',
    url: '/activities',
  },
  {
    title: 'Jnana Yajna',
    subtitle: 'Spiritual discourses',
    date: 'Regular sessions',
    kind: 'wisdom',
    icon: 'ॐ',
    url: '/activities',
  },
  {
    title: 'Bala Vihar',
    subtitle: 'Values for life',
    date: 'Ongoing',
    kind: 'meditation',
    icon: '☼',
    url: '/activities',
  },
];

export function HomePage() {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();

  const goTo = (label) => {
    setActive(label);
    const targetId = label.toLowerCase();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
              <span className="eyebrow-line" /> CHINMAYA MISSION · ADONI
            </p>
            <h1>
              Inner Transformation<br />
              <em>for a Better World</em>
            </h1>
            <p className="hero-description">
              Through Vedanta, values and service,<br className="desktop-break" /> we strive to build a generation of conscious,<br className="desktop-break" /> compassionate and capable individuals.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('About');
                }}
              >
                Explore Our Mission <ArrowRight size={16} />
              </a>
              <a
                className="btn btn-outline"
                href="#chyk"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('CHYK');
                }}
              >
                Know About CHYK
              </a>
            </div>
          </div>

          <div className="hero-portrait" aria-hidden="true">
            <div className="portrait-aura" />
            <div className="portrait-frame">
              <img
                src="/assets/swami-chinmayananda-natural.jpg"
                alt="Swami Chinmayananda"
                className="portrait-img"
              />
            </div>
            <div className="signature">Swami Chinmayananda</div>
          </div>

          <div className="hero-bottom-note">
            <span>01</span>
            <span className="note-line" /> A journey inward. A difference outward.
          </div>
          <div className="sun-disc" />
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section section-wrap" id="about">
          <div className="about-copy">
            <p className="eyebrow">OUR PURPOSE</p>
            <h2>About Chinmaya Mission, Adoni</h2>
            <span className="title-underline" />
            <p>
              Chinmaya Mission, Adoni is a spiritual organization dedicated to spreading timeless wisdom, nurturing cultural values, and inspiring individuals through spiritual learning, education, and community service.
            </p>
            <Link className="text-link" to="/about">
              Learn More <ArrowRight size={15} />
            </Link>
          </div>
          <Leaf className="decor-leaf" size={75} strokeWidth={1} />
        </section>

        {/* CORE VALUES SECTION */}
        <section className="values-section" id="activities">
          <div className="section-wrap">
            <div className="section-heading">
              <p className="eyebrow">WHAT GUIDES US</p>
              <h2>Our Core Values</h2>
              <span className="title-underline" />
            </div>
            <div className="pillars-grid">
              {corePillars.map(({ icon, title, text }) => (
                <article className="pillar-card" key={title}>
                  <div className="pillar-icon-wrap">
                    <img src={icon} alt={title} className="pillar-icon-img" />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CHYK SECTION */}
        <section className="chyk-section section-wrap" id="chyk">
          <div className="chyk-image">
            <img
              src="/assets/youth-runners.png"
              alt="Young people taking part in a healthy community activity"
            />
            <div className="image-label">
              <span>CHYK</span>
              <small>Young minds. Big dreams.</small>
            </div>
          </div>
          <div className="chyk-copy">
            <p className="eyebrow">THE YOUTH WING</p>
            <h2>
              CHYK <span>— The Youth Wing</span>
            </h2>
            <span className="title-underline" />
            <p>
              CHYK (Chinmaya Yuva Kendra) empowers young minds through value-based education, spiritual learning, cultural activities and social service.
            </p>
            <div className="chyk-tags">
              <span>
                <Sparkles size={14} /> Discover your potential
              </span>
              <span>
                <Heart size={14} /> Serve with purpose
              </span>
            </div>
            <Link
              className="btn btn-primary"
              to="/lets-connect"
            >
              Join CHYK <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* UPCOMING EVENTS SECTION */}
        <section className="events-section section-wrap" id="events">
          <div className="events-heading">
            <div>
              <p className="eyebrow">COME BE A PART</p>
              <h2>Upcoming Events</h2>
              <span className="title-underline" />
            </div>
            <Link className="text-link" to="/activities">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="events-grid">
            {events.map((event, i) => (
              <article
                className="event-card cursor-pointer group"
                key={event.title}
                onClick={() => {
                  if (event.url) {
                    if (event.isExternal) {
                      window.open(event.url, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(event.url);
                    }
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
                  <span className="event-number">0{i + 1}</span>
                </div>
                <div className="event-info">
                  <div className="flex items-start justify-between gap-1">
                    <h3>{event.title}</h3>
                    {event.isExternal && (
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
