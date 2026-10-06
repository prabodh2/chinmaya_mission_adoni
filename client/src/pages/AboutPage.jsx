import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../services/api';
import {
  Flame,
  Sparkles,
  BookOpen,
  Zap,
  HeartHandshake,
  Compass,
  Quote,
  ArrowRight,
  Calendar,
  Award,
  Users,
  Sun,
  Shield,
  Landmark,
  Heart,
  ChevronRight,
  CheckCircle,
  Activity as ActivityIcon,
} from 'lucide-react';

export const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback default content matching exact prompt specification
  const defaultContent = {
    hero: {
      title: 'ABOUT CHINMAYA MISSION ADONI',
      subtitle: 'Timeless Wisdom. Inspired Youth. Meaningful Service.',
      intro:
        'Chinmaya Mission Adoni is a spiritual and cultural organisation dedicated to sharing timeless wisdom, nurturing human values and inspiring individuals to lead purposeful lives.',
      imageUrl:
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop',
    },
    whoWeAre: {
      heading: 'WHO ARE WE?',
      p1: 'Chinmaya Mission Adoni is a spiritual and cultural organisation established in 2001 and inaugurated by Pujya Swami Tejomayananda. As part of the global Chinmaya Mission movement founded by Pujya Gurudev Swami Chinmayananda, we are dedicated to sharing the timeless wisdom of Vedanta and the Bhagavad Gita, inspiring individuals to lead lives rooted in knowledge, values and selfless service.',
      p2: 'We believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.',
      highlights: [
        { label: 'ESTABLISHED', value: '2001' },
        { label: 'INAUGURATED BY', value: 'Pujya Swami Tejomayananda' },
        { label: 'ROOTED IN', value: 'Vedanta & Bhagavad Gita' },
      ],
    },
    ourStory: {
      heading: 'OUR STORY',
      p1: 'Established in 2001 and inaugurated by Pujya Swami Tejomayananda, Chinmaya Mission Adoni is part of the global Chinmaya Mission movement founded by Pujya Gurudev Swami Chinmayananda. Rooted in the timeless wisdom of Vedanta and the teachings of the Bhagavad Gita, the Mission is dedicated to nurturing spiritual growth, strengthening human values and inspiring individuals to lead purposeful lives.',
      p2: 'Since its inception, Chinmaya Mission Adoni has sought to bring the light of spiritual knowledge and Indian cultural heritage to the local community. Through spiritual learning, cultural activities, youth engagement and community service, the Mission strives to make ancient wisdom meaningful and relevant to contemporary life.',
      timeline: [
        {
          year: '2001',
          title: 'Establishment of Chinmaya Mission Adoni',
          desc: 'Inaugurated by Pujya Swami Tejomayananda to share timeless wisdom in Adoni.',
        },
        {
          year: '2005',
          title: 'Spiritual & Cultural Growth',
          desc: 'Expanding study groups, spiritual discourses, and cultural programs.',
        },
        {
          year: '2012',
          title: 'Youth Engagement & CHYK',
          desc: 'Empowering young minds through youth forums, leadership camps, and fitness.',
        },
        {
          year: '2018',
          title: 'Community Service Initiatives',
          desc: 'Organizing medical camps, educational drives, and community welfare programs.',
        },
        {
          year: '2026',
          title: 'Continuing Legacy & Anti-Drug Movement',
          desc: 'Inspiring thousands of youth to run for a drug-free, healthy and purposeful tomorrow.',
        },
      ],
    },
    ourVision: {
      heading: 'OUR VISION',
      quote:
        'To inspire individuals to discover their inner potential, live by universal values and contribute positively to society through knowledge, compassion and selfless service.',
    },
    ourMission: {
      heading: 'OUR MISSION',
      items: [
        {
          id: 'item-1',
          title: 'SPIRITUAL GROWTH',
          description:
            'Sharing the wisdom of Vedanta and the Bhagavad Gita to encourage self-understanding and spiritual development.',
          iconName: 'BookOpen',
        },
        {
          id: 'item-2',
          title: 'YOUTH EMPOWERMENT',
          description:
            'Guiding young people towards leadership, discipline, confidence and character building.',
          iconName: 'Zap',
        },
        {
          id: 'item-3',
          title: 'CULTURAL ENRICHMENT',
          description:
            "Preserving and promoting India's spiritual and cultural heritage through meaningful programmes and celebrations.",
          iconName: 'Sparkles',
        },
        {
          id: 'item-4',
          title: 'COMMUNITY SERVICE',
          description:
            'Encouraging selfless service and initiatives that contribute to the welfare of society.',
          iconName: 'HeartHandshake',
        },
        {
          id: 'item-5',
          title: 'HOLISTIC DEVELOPMENT',
          description:
            'Integrating timeless spiritual wisdom with practical living to nurture responsible, compassionate and well-rounded individuals.',
          iconName: 'Compass',
        },
      ],
    },
    chykSection: {
      heading: 'CHINMAYA YUVA KENDRA (CHYK) ADONI',
      p1: 'Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission, provides a platform for young people to explore spiritual knowledge, cultivate leadership qualities and participate in meaningful community initiatives.',
      p2: "CHYK Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation. Through youth-led programmes, interactive activities, cultural initiatives and service-oriented projects, it encourages young people to become responsible leaders who combine knowledge with action and personal growth with social responsibility.",
      keywords: ['KNOWLEDGE', 'LEADERSHIP', 'DISCIPLINE', 'CONFIDENCE', 'SERVICE'],
      imageUrl:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    },
    spiritualityInAction: {
      heading: 'SPIRITUALITY IN ACTION',
      content:
        'At Chinmaya Mission Adoni, spirituality extends beyond individual practice into actions that benefit the wider community. The Mission seeks to bring people together through spiritual learning, cultural engagement, festivals and service initiatives, fostering a spirit of unity, compassion and collective responsibility.',
      flow: ['KNOWLEDGE', 'ACTION', 'SERVICE', 'COMMUNITY'],
      imageUrl:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    },
    ourActivities: {
      heading: 'OUR ACTIVITIES',
      intro:
        'At Chinmaya Mission Adoni, our activities bring together spirituality, devotion, cultural values, youth development and selfless service. Through our temples and dedicated groups, we strive to nurture spiritual awareness, strengthen community bonds and inspire individuals of all ages to live by timeless values.',
      cards: [
        {
          id: 'act-1',
          title: 'CHINMAYA SANJEEVARAYA TEMPLE',
          content:
            'Dedicated to devotion and spiritual practice, Chinmaya Sanjeevaraya Temple serves as a place for worship, prayer and the observance of religious traditions. Through devotional activities and spiritual gatherings, the temple seeks to nurture faith, preserve cultural heritage and bring the community together.',
          imageUrl: '/assets/images/activity-sanjeevaraya.png',
          badge: 'SPIRITUAL TEMPLE',
          iconName: 'Landmark',
        },
        {
          id: 'act-2',
          title: 'SHANTA MALLESHWARA TEMPLE',
          content:
            'Shanta Malleshwara Temple is an important centre of worship and devotion associated with Chinmaya Mission Adoni. The temple provides a space for devotees to participate in religious observances, festivals and spiritual activities, fostering a sense of unity, devotion and community service.',
          imageUrl: '/assets/images/activity-shantamalleshwara.webp',
          badge: 'SACRED CENTRE',
          iconName: 'Flame',
        },
        {
          id: 'act-3',
          title: 'DEVI GROUP',
          content:
            "The Devi Group is dedicated to nurturing devotion, spiritual understanding and the preservation of cultural values. Through devotional gatherings, spiritual learning and collective participation in traditional activities, the group encourages members to deepen their spiritual connection and contribute to the Mission's broader vision.",
          imageUrl:
            'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
          badge: 'DEVOTIONAL WING',
          iconName: 'Heart',
        },
        {
          id: 'act-4',
          title: 'CHINMAYA YUVA KENDRA (CHYK)',
          content:
            'Chinmaya Yuva Kendra (CHYK) is the youth wing of Chinmaya Mission, providing a platform for young people to grow spiritually, develop leadership skills and engage in meaningful community initiatives. CHYK Adoni encourages young minds to discover their potential and apply the wisdom of Indian philosophy to modern-day life. Through youth programmes, cultural activities, interactive initiatives and social service, CHYK inspires young people to become responsible leaders guided by knowledge, discipline, confidence and compassion.',
          imageUrl: '/assets/images/activity-chyk.jpg',
          badge: 'YOUTH WING • FEATURED',
          featured: true,
          iconName: 'Zap',
        },
      ],
    },
    continuingLegacy: {
      heading: 'CONTINUING THE LEGACY',
      content:
        'Since its inauguration in 2001 by Pujya Swami Tejomayananda, Chinmaya Mission Adoni has been part of the continuing effort to share the vision and teachings of Pujya Gurudev Swami Chinmayananda. Guided by the principles of knowledge, devotion and selfless service, the Mission aspires to inspire individuals, empower youth and contribute to the spiritual and cultural enrichment of Adoni.',
      highlights: ['2001', 'Knowledge', 'Devotion', 'Selfless Service', 'Youth', 'Community'],
    },
    closingCta: {
      title: 'Timeless Wisdom.\nInspired Youth.\nMeaningful Service.',
      subtext:
        'We are a community united by knowledge, strengthened by values and inspired by selfless service — working towards a more enlightened and compassionate society.',
      btn1Text: 'EXPLORE OUR ACTIVITIES',
      btn1Link: '/activities',
      btn2Text: "LET'S CONNECT",
      btn2Link: '/lets-connect',
    },
  };

  const loadAboutContent = () => {
    contentService
      .getContent('about_page')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const apiData = res.data.data;
          setContent({ ...defaultContent, ...apiData });
        } else {
          setContent(defaultContent);
        }
      })
      .catch(() => setContent(defaultContent))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAboutContent();

    const handleCmsUpdate = (e) => {
      if (e.type === 'storage' && e.key && e.key !== 'cms_last_updated') return;
      loadAboutContent();
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

  const data = content || defaultContent;

  const getMissionIcon = (name) => {
    switch (name) {
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getActivityIcon = (name) => {
    switch (name) {
      case 'Landmark':
        return <Landmark className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      default:
        return <ActivityIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 space-y-24 sm:space-y-32">
      {/* 1. ABOUT HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-8 px-4 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Title & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-widest uppercase border border-[var(--orange)]/30 shadow-sm">
              <Flame className="w-4 h-4 text-[var(--orange)] animate-pulse" />
              <span>CHINMAYA MISSION ADONI • EST. 2001</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-[var(--text-primary)] leading-[1.1]">
              {data.hero.title}
            </h1>

            <p className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-[var(--orange)] via-[var(--yellow)] to-[var(--orange)] bg-clip-text text-transparent">
              {data.hero.subtitle}
            </p>

            <p className="text-base sm:text-lg text-[var(--text-muted)] font-medium leading-relaxed max-w-2xl">
              "{data.hero.intro}"
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a href="#who-we-are" className="btn-primary py-3.5 px-7 text-sm font-extrabold text-decoration-none shadow-xl">
                <span>LEARN OUR STORY</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <Link to="/activities" className="btn-secondary py-3.5 px-7 text-sm font-extrabold text-decoration-none">
                <span>OUR ACTIVITIES</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Organization Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl group hover:border-[var(--orange)] transition-colors duration-500">
              <img
                src={data.hero.imageUrl}
                alt="Chinmaya Mission Adoni Visual"
                className="w-full h-80 sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/90 via-[var(--navy)]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--yellow)] px-3 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-md w-max mb-2">
                  SPIRITUAL & CULTURAL CENTRE
                </span>
                <h3 className="text-xl font-extrabold font-heading text-white">
                  Chinmaya Mission Ashram
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Arts College Road, Adoni, Andhra Pradesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE SECTION */}
      <section id="who-we-are" className="px-4 max-w-7xl mx-auto scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
            <div>
              <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/20">
                FOUNDATION & PURPOSE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)] mt-2">
                {data.whoWeAre.heading}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] max-w-md">
              Rooted in knowledge, values and selfless community service since 2001.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Paragraphs */}
            <div className="lg:col-span-7 space-y-5 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-normal">
              <p className="p-5 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm">
                {data.whoWeAre.p1}
              </p>
              <p className="p-5 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm">
                {data.whoWeAre.p2}
              </p>
            </div>

            {/* Highlights Statistics Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              {data.whoWeAre.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] hover:border-[var(--orange)]/50 transition-all shadow-sm flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0">
                    {idx === 0 ? (
                      <Calendar className="w-6 h-6" />
                    ) : idx === 1 ? (
                      <Award className="w-6 h-6" />
                    ) : (
                      <BookOpen className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold font-heading text-[var(--text-primary)]">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/20">
            OUR JOURNEY THROUGH TIME
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
            {data.ourStory.heading}
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {data.ourStory.p1}
          </p>
        </div>

        {/* Clean Visual Timeline */}
        <div className="relative">
          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-[var(--orange)] via-[var(--yellow)] to-[var(--cyan)] opacity-30 rounded-full" />

          <div className="space-y-8 relative">
            {data.ourStory.timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="p-6 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] hover:border-[var(--orange)] transition-all group">
                      <span className="inline-block px-3 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] text-xs font-extrabold font-heading mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-extrabold text-[var(--text-primary)] font-heading mb-2 group-hover:text-[var(--orange)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Badge Dot */}
                  <div className="w-10 h-10 rounded-full bg-[var(--orange)] text-white font-extrabold text-xs flex items-center justify-center border-4 border-[var(--bg-primary)] shadow-md z-10 flex-shrink-0">
                    {idx + 1}
                  </div>

                  <div className="w-full md:w-1/2 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. OUR VISION SECTION */}
      <section className="px-4 max-w-5xl mx-auto">
        <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-[var(--navy)] via-[#0F2D52] to-[var(--navy)] text-white shadow-2xl overflow-hidden border border-white/10 text-center">
          {/* Subtle Glow Overlay */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--orange)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--yellow)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-[var(--yellow)] flex items-center justify-center mx-auto border border-white/20">
              <Quote className="w-8 h-8" />
            </div>

            <span className="text-xs font-extrabold tracking-widest text-[var(--yellow)] uppercase px-4 py-1.5 rounded-full bg-white/10 border border-white/20 inline-block">
              {data.ourVision.heading}
            </span>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-heading leading-relaxed max-w-3xl mx-auto text-slate-100">
              "{data.ourVision.quote}"
            </h2>

            <div className="pt-4 flex items-center justify-center gap-3 text-xs font-bold text-slate-300">
              <span className="w-12 h-px bg-[var(--orange)]" />
              <span>CHINMAYA MISSION ADONI</span>
              <span className="w-12 h-px bg-[var(--orange)]" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR MISSION SECTION */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
            {data.ourMission.heading}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Guiding individuals towards self-transformation, service, and youth empowerment.
          </p>
        </div>

        {/* 5 Mission Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.ourMission.items.map((item, index) => (
            <div
              key={item.id || index}
              className={`p-8 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-t-4 border-t-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] hover:shadow-[0_4px_12px_rgba(11,35,64,0.06),0_16px_40px_rgba(11,35,64,0.1)] hover:border-[var(--orange)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {getMissionIcon(item.iconName)}
                </div>

                <span className="text-[10px] font-extrabold text-[var(--orange)] tracking-wider uppercase mb-1 block">
                  PILLAR 0{index + 1}
                </span>

                <h3 className="text-xl font-extrabold text-[var(--text-primary)] font-heading mb-3 group-hover:text-[var(--orange)] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)]/50 flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--orange)]">
                <span>ACTION IN ADONI</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CHINMAYA YUVA KENDRA (CHYK) ADONI SECTION */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-10 relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)] text-white font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-[var(--orange)]/30">
                <Zap className="w-4 h-4 fill-current" />
                <span>YOUTH WING • CHYK ADONI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] leading-tight">
                {data.chykSection.heading}
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {data.chykSection.p1}
              </p>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {data.chykSection.p2}
              </p>

              {/* Dynamic Youth Keywords */}
              <div className="pt-2">
                <span className="text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider block mb-3">
                  CORE VALUES & DRIVING FORCE
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {data.chykSection.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-white border border-[rgba(11,35,64,0.08)] text-[var(--orange)] font-extrabold text-xs tracking-wider uppercase shadow-sm hover:border-[var(--orange)] transition-colors"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--orange)] shadow-2xl group">
                <img
                  src={data.chykSection.imageUrl}
                  alt="CHYK Youth Power"
                  className="w-full h-80 sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-black/80 text-[var(--yellow)] font-extrabold text-xs backdrop-blur-md border border-white/20">
                  YOUTH IN ACTION
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OUR ACTIVITIES SECTION */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/20">
            TEMPLES & DEVOTIONAL GROUPS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
            {data.ourActivities.heading}
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {data.ourActivities.intro}
          </p>
        </div>

        {/* 4 Interactive Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.ourActivities.cards.map((card) => (
            <div
              key={card.id || card.title}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] hover:shadow-[0_4px_12px_rgba(11,35,64,0.06),0_16px_40px_rgba(11,35,64,0.1)] flex flex-col justify-between ${
                card.featured
                  ? 'bg-white border-2 border-[var(--orange)]'
                  : 'bg-white border-[rgba(11,35,64,0.08)] hover:border-[var(--orange)]/60'
              }`}
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-md border border-white/20">
                    {card.badge}
                  </span>
                </div>

                <div className="p-7 space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(card.iconName)}
                    </div>
                    <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed pt-1">
                    {card.content}
                  </p>
                </div>
              </div>

              <div className="px-7 pb-7 pt-2">
                <Link
                  to="/activities"
                  className="btn-secondary w-full justify-center text-xs py-2.5 text-decoration-none"
                >
                  <span>LEARN MORE ABOUT ACTIVITIES</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CONTINUING THE LEGACY SECTION */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/20">
              EVERLASTING INSPIRATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
              {data.continuingLegacy.heading}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {data.continuingLegacy.content}
            </p>
          </div>

          {/* Key Values Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
            {data.continuingLegacy.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm text-center space-y-1 hover:border-[var(--orange)] transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-[var(--orange)] mx-auto mb-1" />
                <span className="text-xs font-extrabold text-[var(--text-primary)] font-heading block truncate">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CLOSING STATEMENT / CTA SECTION */}
      <section className="px-4 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[var(--orange)] via-[#E64A19] to-[var(--orange)] text-white shadow-2xl space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight whitespace-pre-line leading-tight">
              {data.closingCta.title}
            </h2>

            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {data.closingCta.subtext}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={data.closingCta.btn1Link}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105 text-decoration-none"
              >
                <ActivityIcon className="w-4 h-4 text-[var(--orange)]" />
                <span>{data.closingCta.btn1Text}</span>
              </Link>

              <Link
                to={data.closingCta.btn2Link}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black/30 text-white font-extrabold text-sm border border-white/30 hover:bg-black/40 transition-all text-decoration-none"
              >
                <Users className="w-4 h-4 text-[var(--yellow)]" />
                <span>{data.closingCta.btn2Text}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
