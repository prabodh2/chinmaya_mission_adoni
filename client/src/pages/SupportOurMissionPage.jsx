import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  HeartHandshake,
  GraduationCap,
  Laptop,
  Calendar,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { DonationModal } from '../components/DonationModal';
import '../styles/support-our-mission.css';

// Spiritual Lotus SVG Component
const LotusIcon = ({ className = 'w-8 h-8 text-[#C89B59]' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M32 46C24 46 16 38 16 28C22 30 28 36 32 46Z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path
      d="M32 46C40 46 48 38 48 28C42 30 36 36 32 46Z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path
      d="M32 46C27 38 27 22 32 14C37 22 37 38 32 46Z"
      fill="currentColor"
      fillOpacity="0.25"
    />
    <path
      d="M20 46C12 46 8 36 10 26C15 30 18 38 20 46Z"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M44 46C52 46 56 36 54 26C49 30 46 38 44 46Z"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path d="M14 48C24 52 40 52 50 48" />
  </svg>
);

// 5 Categories for Ways to Participate in Seva (Matching Reference Screenshot)
const sevaCategories = [
  {
    id: 'temple-support',
    title: 'TEMPLE AND CENTRE SUPPORT',
    description:
      'Help with temple upkeep, event arrangements, decorations, visitor assistance, and maintaining welcoming spaces for devotees.',
    icon: Landmark,
  },
  {
    id: 'community-service',
    title: 'COMMUNITY SERVICE',
    description:
      'Participate in community outreach, food distribution, welfare initiatives, and other service activities organized by the Mission.',
    icon: HeartHandshake,
  },
  {
    id: 'education-youth',
    title: 'EDUCATION AND YOUTH ENGAGEMENT',
    description:
      'Support educational programmes, cultural activities, youth initiatives, and learning opportunities based on your skills and interests.',
    icon: GraduationCap,
  },
  {
    id: 'professional-digital',
    title: 'PROFESSIONAL AND DIGITAL SEVA',
    description:
      'Contribute your expertise in areas such as technology, website management, graphic design, communications, administration, photography, and event coordination.',
    icon: Laptop,
    isActivePreview: true,
  },
  {
    id: 'programme-support',
    title: 'PROGRAMME AND EVENT SUPPORT',
    description:
      'Assist with the planning and coordination of spiritual gatherings, festivals, workshops, cultural programmes, and community events.',
    icon: Calendar,
  },
];

export const SupportOurMissionPage = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Devotee Donation Details');
  const [modalSubtitle, setModalSubtitle] = useState('Pooja Sankalpa & Contribution Record');

  const openContributionModal = () => {
    setModalTitle('Explore Contribution Options');
    setModalSubtitle('Pooja Sankalpa, Devotee Details & Contribution Record');
    setIsDonationModalOpen(true);
  };

  const openDonationModal = () => {
    setModalTitle('Devotee Donation Details');
    setModalSubtitle('Pooja Sankalpa & Sacred Seva Offering');
    setIsDonationModalOpen(true);
  };

  useEffect(() => {
    document.title = 'Support Our Mission | Chinmaya Mission';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="support-mission-page min-h-screen">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="hero-spiritual-wrap relative text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Image with peaceful overlay */}
        <img
          src="/assets/temple-hilltop-view.jpeg"
          alt="Revered hilltop temple sanctuary under serene sky"
          className="hero-spiritual-bg"
        />
        <div className="hero-spiritual-overlay" />
        <div className="hero-gold-glow" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-3 sm:space-y-4">
          {/* Chinmaya Mission Official Logo */}
          <div className="flex justify-center mb-1 sm:mb-2">
            <img
              src="/assets/logos/chinmaya-mission-lamp-logo.png"
              alt="Chinmaya Mission Logo"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(246,132,31,0.25)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-300"
              onError={(e) => {
                e.currentTarget.src = '/assets/logos/chinmaya-logo-original.png';
              }}
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-spiritual-heading text-white tracking-tight drop-shadow-md">
            Support Our Mission
          </h1>

          <div className="gold-divider" />

          <p className="text-base sm:text-lg md:text-xl text-[#F4E8D3] font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Be part of a journey of wisdom, service, and compassion.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. INTRODUCTION SECTION                                      */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-18 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-7 leading-relaxed">
          <div className="flex justify-center">
            <LotusIcon className="w-9 h-9 text-[#C89B59]" />
          </div>

          <div className="space-y-5 text-[#2D3748] text-base sm:text-lg font-normal leading-relaxed sm:leading-loose">
            <p>
              Chinmaya Mission is a journey of spiritual learning, personal
              growth, and selfless service. Through spiritual education,
              cultural initiatives, community outreach, and the preservation of
              our heritage, we strive to enrich lives and make a meaningful
              difference in society.
            </p>
            <p>
              There are many ways to be part of this journey. Whether through a
              financial contribution or by offering your time, talents, and
              skills in seva, your participation helps carry the Mission's
              vision forward.
            </p>
            <p className="text-[#0C1A30] font-medium">
              Discover how you can contribute to this shared purpose and help
              nurture a legacy of wisdom, service, and compassion for generations
              to come.
            </p>
          </div>

          <div className="pt-2">
            <div className="gold-divider" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CONTRIBUTE TO THE MISSION SECTION                         */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto">
          <article className="spiritual-card overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
            {/* Left Column: Chinmaya Amrit Yatra vehicle & sanctuary */}
            <div className="md:col-span-5 relative min-h-[260px] md:min-h-[420px] bg-[#0C1A30] overflow-hidden group">
              <img
                src="/assets/images/chinmaya-amrit-yatra.jpg"
                alt="Chinmaya Amrit Yatra vehicle and sanctuary at Chinmaya Mission"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/temple-seva-pradosha.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A30]/60 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Column: Heading, Subheading, Content, Button */}
            <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold font-spiritual-heading text-[#0C1A30] tracking-tight">
                    Contribute to the Mission
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#B8860B]">
                    Contribute to a Lasting Purpose
                  </p>
                </div>

                <div className="w-12 h-0.5 bg-[#C89B59]" />

                <div className="space-y-3.5 text-[#3D4752] text-sm sm:text-base leading-relaxed">
                  <p>
                    Your contribution can help sustain the activities of Chinmaya
                    Mission, support educational and community initiatives, and
                    preserve our cherished spiritual and cultural heritage.
                  </p>
                  <p>
                    By supporting the Mission, you become part of a collective
                    effort to make spiritual wisdom accessible, strengthen
                    communities, and create opportunities for learning and growth.
                  </p>
                  <p>
                    You may choose to support the Mission's broader activities or
                    contribute towards specific initiatives, including temple
                    development and maintenance.
                  </p>
                  <p className="font-medium text-[#0C1A30]">
                    Every contribution is an opportunity to support a meaningful
                    cause and help the Mission's vision continue to flourish.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={openContributionModal}
                  className="btn-spiritual-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                  id="explore-contribution-options-btn"
                >
                  <Heart className="w-4 h-4 text-[#C89B59]" />
                  <span>Explore Contribution Options</span>
                  <ArrowRight className="w-4 h-4 text-[#C89B59]" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PARTICIPATE IN SEVA SECTION                              */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto">
          <article className="spiritual-card overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
            {/* Left Column: Relevant photograph of volunteers / Sevaks */}
            <div className="md:col-span-5 relative min-h-[260px] md:min-h-[420px] bg-[#0C1A30] overflow-hidden group">
              <img
                src="/gallery/Sevak_Team.jpeg"
                alt="Volunteers and Sevaks dedicated to community service and Mission activities"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/assets/chyk-group.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A30]/60 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Column: Heading, Subheading, Content */}
            <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold font-spiritual-heading text-[#0C1A30] tracking-tight">
                    Participate in Seva
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#B8860B]">
                    Offer Your Time. Share Your Talents.
                  </p>
                </div>

                <div className="w-12 h-0.5 bg-[#C89B59]" />

                <div className="space-y-3.5 text-[#3D4752] text-sm sm:text-base leading-relaxed">
                  <p>
                    Seva is an opportunity to put our values into action through
                    selfless service. It brings people together through a shared
                    commitment to learning, community well-being, and spiritual
                    growth.
                  </p>
                  <p>
                    Whether you have a few hours to offer or would like to
                    contribute your professional expertise, there are many ways
                    to participate according to your interests, availability,
                    and abilities.
                  </p>
                  <p className="font-medium text-[#0C1A30]">
                    You can support activities that keep our centres vibrant, our
                    programmes enriching, and our community connected.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/lets-connect"
                  className="btn-spiritual-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide"
                >
                  <span>Connect for Volunteering</span>
                  <ArrowRight className="w-4 h-4 text-[#C89B59]" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. WAYS TO PARTICIPATE IN SEVA SECTION                      */}
      {/* ============================================================ */}
      <section className="seva-section-bg py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#ECE3D4]/70">
        <div className="max-w-[1360px] mx-auto space-y-12 sm:space-y-14">
          {/* Section Header */}
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold font-spiritual-heading uppercase tracking-wider text-[#0A192F]">
              WAYS TO PARTICIPATE IN SEVA
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A059] mx-auto rounded-full" />
          </div>

          {/* 5 Cards / Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
            {sevaCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  className={`seva-tile ${cat.isActivePreview ? 'active-preview' : ''}`}
                >
                  <div className="seva-icon-box">
                    <IconComp className="w-5 h-5 text-[#0A192F]" strokeWidth={1.8} />
                  </div>
                  <h3 className="seva-tile-title">
                    {cat.title}
                  </h3>
                  <p className="seva-tile-desc">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Register for Seva Button */}
          <div className="text-center pt-2 sm:pt-4">
            <Link
              to="/lets-connect"
              className="btn-seva-register"
            >
              <span>Register for Seva</span>
              <ArrowRight className="w-4 h-4 text-[#0A192F]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. MANY WAYS TO SERVE. ONE SHARED VISION SECTION             */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EBF2F7] via-[#F4F8FA] to-[#FAF7F2] border-y border-[#E2EBF2]">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-7">
          <div className="flex justify-center">
            <LotusIcon className="w-10 h-10 text-[#C89B59]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-spiritual-heading text-[#0C1A30] tracking-tight">
            Many Ways to Serve. One Shared Vision.
          </h2>

          <div className="gold-divider" />

          <div className="space-y-4 text-[#334155] text-base sm:text-lg leading-relaxed sm:leading-loose">
            <p>
              Whether you contribute resources or offer your time and talents,
              every sincere effort can help nurture wisdom, strengthen our
              community, and carry the Mission's vision forward.
            </p>
            <p>
              Together, we can continue to create opportunities for spiritual
              learning, meaningful service, and lasting community impact.
            </p>
          </div>

          <div className="pt-3">
            <p className="text-lg sm:text-xl md:text-2xl font-spiritual-heading italic font-semibold text-[#0C1A30] tracking-wide">
              Be a Part of the Journey.
            </p>
          </div>

          {/* Donation CTA Button */}
          <div className="pt-2 sm:pt-4">
            <button
              type="button"
              onClick={openDonationModal}
              className="btn-seva-register hover:scale-105 transition-all text-base px-9 py-3.5 cursor-pointer font-bold shadow-lg inline-flex items-center gap-2.5"
              id="open-donation-modal-btn"
            >
              <Heart className="w-5 h-5 text-[#0A192F] fill-current" />
              <span>Donation</span>
              <ArrowRight className="w-4 h-4 text-[#0A192F]" />
            </button>
          </div>
        </div>
      </section>

      {/* Devotee Donation Modal with Form & Review steps */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        modalTitle={modalTitle}
        modalSubtitle={modalSubtitle}
      />
    </div>
  );
};

export default SupportOurMissionPage;
