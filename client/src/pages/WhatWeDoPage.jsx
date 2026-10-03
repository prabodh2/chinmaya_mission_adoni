import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  BookOpen,
  Users,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  Target,
  Zap,
} from 'lucide-react';

export const WhatWeDoPage = () => {
  const initiatives = [
    {
      icon: ShieldAlert,
      color: 'from-orange-500 to-amber-500',
      badge: 'MOVEMENT 2026',
      title: 'Anti-Drug Marathon & Youth Awareness',
      description:
        'Inspiring the youth of Adoni to say NO to drugs and YES to healthy living. We organize city-wide marathons, school outreach, pledge campaigns, and wellness workshops.',
      points: [
        '5K & 10K Awareness Marathon Runs',
        'Anti-Drug Pledges in Schools & Colleges',
        'Youth Counseling & Clean Living Advocacy',
      ],
    },
    {
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      badge: 'WISDOM & VEDANTA',
      title: 'Spiritual Education & Study Groups',
      description:
        'Unlocking the practical wisdom of Vedanta, Upanishads, and the Bhagavad Gita for daily life. Study classes, interactive forums, and lectures for all age groups.',
      points: [
        'Bhagavad Gita Study Circles',
        'Balvihar Children Spiritual Classes',
        'Discourses by Eminent Monks & Scholars',
      ],
    },
    {
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      badge: 'CHYK ADONI',
      title: 'Chinmaya Yuva Kendra (CHYK) Leadership',
      description:
        'Empowering young minds through dynamic leadership, fitness, adventure camps, and personality development programs designed specifically for youth.',
      points: [
        'Youth Leadership Workshops & Camps',
        'Public Speaking & Character Building',
        'Community Volunteering Opportunities',
      ],
    },
    {
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      badge: 'SEVA / SERVICE',
      title: 'Community Welfare & Social Service',
      description:
        'Selfless service (Seva) to uplift society through blood donation drives, free health checkup camps, educational assistance, and environmental drives.',
      points: [
        'Free Medical & Blood Donation Camps',
        'Tree Plantation & Environmental Drives',
        'Educational Support & Merit Recognition',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <section className="max-w-5xl mx-auto text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] font-extrabold text-xs uppercase tracking-widest">
          <Flame className="w-4 h-4 animate-pulse" />
          <span>OUR CORE INITIATIVES & IMPACT</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-[var(--text-primary)] tracking-tight">
          WHAT <span className="text-[var(--orange)]">WE DO</span> AT CHINMAYA MISSION
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-muted)] font-medium max-w-3xl mx-auto leading-relaxed">
          Through spiritual knowledge, youth empowerment, anti-drug advocacy, and community service, Chinmaya Mission Adoni & CHYK work tirelessly to build a healthy, value-driven, and inspired society.
        </p>
      </section>

      {/* Grid of Initiatives */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {initiatives.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 hover:border-[var(--orange)]/50 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col justify-between group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[var(--bg-tertiary)] text-[var(--orange)] border border-[var(--border-color)]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold font-heading text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                  {item.description}
                </p>

                <ul className="space-y-2.5 pt-2">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--orange)] flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-muted)]">Pillar {index + 1} of 4</span>
                <Link
                  to="/lets-connect"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--orange)] hover:underline text-decoration-none"
                >
                  <span>Get Involved</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-[var(--orange)] to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider">
              JOIN THE MOVEMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              Ready to be part of Anti-Drug Marathon 2026?
            </h2>
            <p className="text-xs sm:text-sm font-semibold opacity-95 max-w-xl">
              Register now for the marathon or join our volunteer network in Adoni to make a lasting difference in youth lives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl bg-white text-[var(--orange)] font-extrabold text-xs uppercase tracking-wider text-center hover:bg-amber-50 shadow-lg transition-transform active:scale-95 text-decoration-none flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>REGISTER NOW</span>
            </Link>
            <Link
              to="/lets-connect"
              className="px-6 py-3.5 rounded-2xl bg-white/20 border border-white/40 text-white font-extrabold text-xs uppercase tracking-wider text-center hover:bg-white/30 transition-transform active:scale-95 text-decoration-none flex items-center justify-center gap-2"
            >
              <span>CONNECT WITH US</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDoPage;
