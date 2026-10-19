import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService, webContentService } from '../services/api';
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
  MapPin,
  ArrowRight,
  Clock,
} from 'lucide-react';

// Featured Wings (Devi Group & Balvihar Classes) directly from the Chinmaya Mission Adoni page
const FEATURED_WINGS = [
  {
    id: 'devi-group',
    title: 'DEVI GROUP',
    badge: 'DEVOTIONAL WING',
    icon: <Heart className="w-5 h-5 text-[var(--orange)]" />,
    imageUrl: '/assets/images/activity-devigroup.jpg',
    content:
      "The Devi Group is dedicated to nurturing devotion, spiritual understanding and the preservation of cultural values. Through devotional gatherings, spiritual learning and collective participation in traditional activities, the group encourages members to deepen their spiritual connection and contribute to the Mission's broader vision.",
    detailedInfo: {
      title: 'Devi Group • Women’s Devotional Wing',
      subtitle: 'Devotion, Cultural Preservation & Family Values',
      location: 'Chinmaya Cultural Complex, Adoni',
      schedule: 'Weekly Gatherings & Special Festive Observances',
      sections: [
        {
          heading: 'Spiritual Devotion & Scriptural Learning',
          paragraphs: [
            'The Devi Group is dedicated to nurturing devotion, spiritual understanding, and the preservation of cultural values across families and communities.',
            'Through scriptural study, devotional singing, collective poojas, and participation in Chinmaya Mission festivals, members deepen their spiritual connection and foster dharmic values within the household.',
          ],
        },
        {
          heading: 'Key Activities & Sacred Chanting',
          paragraphs: [
            'Study and chanting of sacred stotrams including Sri Lalita Sahasranamam, Sri Vishnu Sahasranamam, and Bhagavad Gita.',
            'Special poojas during Navaratri, Varalakshmi Vratham, Karthika Masam, and auspicious festive occasions throughout the year.',
            'Devotional singing (Bhajans), spiritual discussions, and sharing practical insights for harmonizing family life with spiritual principles.',
            'Active participation in community service, Annadanam (food offering), and organizing Mission cultural programmes.',
          ],
        },
        {
          heading: 'Nurturing the Family & Society',
          paragraphs: [
            'Pujya Gurudev Swami Chinmayananda emphasized that mothers and women are the spiritual backbone of the home. The Devi Group provides a supportive fellowship where women inspire one another to lead lives rooted in devotion, moral clarity, and cultural heritage.',
          ],
        },
      ],
    },
  },
  {
    id: 'balvihar-classes',
    title: 'BALVIHAR CLASSES',
    badge: 'CHILDREN’S WING • VALUE EDUCATION',
    icon: <Users className="w-5 h-5 text-[var(--orange)]" />,
    imageUrl: '/assets/images/activity-balvihar.jpg',
    featured: true,
    content:
      'Chinmaya Balvihar classes provide structured value-based spiritual education for children. Through interactive storytelling, shlokas, bhajans, Indian cultural traditions, moral games, and creative activities, Balvihar helps young minds grow with noble ideals, love for heritage, character, and self-confidence inspired by Pujya Gurudev Swami Chinmayananda’s vision.',
    detailedInfo: {
      title: 'Chinmaya Balvihar Classes',
      subtitle: 'Value-Based Cultural & Spiritual Education for Children',
      location: 'Chinmaya Cultural Complex, Adoni',
      schedule: 'Sunday Classes for Children of All Age Groups',
      sections: [
        {
          heading: 'Vision & Purpose of Balvihar',
          paragraphs: [
            'Balvihar is a global initiative started by Pujya Gurudev Swami Chinmayananda with the vision: "Children are not vessels to be filled, but lamps to be lit."',
            'It aims to inculcate reverence for India’s timeless cultural heritage, foster moral integrity, instill universal human values, and build strong character in children in an enjoyable, engaging atmosphere.',
          ],
        },
        {
          heading: 'Curriculum & What Children Learn',
          paragraphs: [
            '- Sanskrit Shlokas & Chanting: Learning authentic pronunciation and meanings of foundational Sanskrit shlokas and daily prayers.\n- Epics & Stories: Inspiring values from the Ramayana, Mahabharata, Bhagavata, and lives of great spiritual masters.\n- Bhajans & Devotional Music: Melodious singing that awakens joy, devotion, and inner peace.\n- Cultural Values & Life Skills: Respect for elders, truthfulness, sharing, environmental mindfulness, and discipline.\n- Interactive Learning: Arts, crafts, moral skits, Vedic quizzes, games, and festival celebrations.',
          ],
        },
        {
          heading: 'Annual Highlights & Events',
          paragraphs: [
            'Annual Geeta Chanting Competition: Encouraging hundreds of children across Adoni schools to memorize and chant the holy Bhagavad Gita.',
            'Festive Celebrations: Krishna Janmashtami celebrations, Balvihar Utsav, and Guru Paduka Pooja.',
            'Summer & Winter Camps: High-energy character-building workshops packed with fun and spiritual wisdom.',
          ],
        },
        {
          heading: 'Who Can Join & How to Enroll',
          paragraphs: [
            'Balvihar classes are open to all children from Kindergarten through 10th Standard. Dedicated and affectionate sevaks and sevikas guide each age group with interactive pedagogy designed for modern children.',
          ],
        },
      ],
    },
  },
];

// CHYK Feature Section Data (Matching Chinmaya Mission Adoni layout)
const CHYK_FEATURE_DATA = {
  heading: 'CHINMAYA YUVA KENDRA (CHYK), ADONI',
  p1: 'Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission, provides a platform for young people to explore spiritual knowledge, cultivate leadership qualities and participate in meaningful community initiatives.',
  p2: "CHYK, Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation through workshops and camps.",
  keywords: ['KNOWLEDGE', 'LEADERSHIP', 'DISCIPLINE', 'CONFIDENCE', 'SERVICE'],
  imageUrl: '/assets/chyk-group.jpg',
  detailedInfo: {
    title: 'Chinmaya Yuva Kendra (CHYK)',
    subtitle: 'Youth Empowerment • Leadership • Selfless Service',
    location: 'Chinmaya Cultural Complex, Adoni',
    schedule: 'Weekly Youth Forums, Seminars & Dynamic Community Projects',
    sections: [
      {
        heading: 'Empowering the Youth with Timeless Wisdom',
        paragraphs: [
          'Chinmaya Yuva Kendra (CHYK) is the youth wing of Chinmaya Mission, empowering young men and women to discover their inner strength and leadership through the practical philosophy of Vedanta.',
          'CHYK channels the unbounded energy of youth into purposeful personal transformation and constructive societal development.',
        ],
      },
      {
        heading: 'Core Activities & Annual Initiatives',
        paragraphs: [
          'Interactive workshops, self-management seminars, and discussions on practical philosophy.',
          'Annual Chinmaya Marathon & Anti-Drug Movement, mobilizing thousands of youth for healthy, drug-free living.',
          'Social service initiatives, environmental clean-ups, blood donation camps, and cultural events.',
        ],
      },
    ],
  },
};

// Reusable Activity Card Component (For Additional Activities)
const ActivityCard = ({ activity, onSelect }) => {
  const isSanjeevaraya =
    activity.id === 'chinmaya-sanjeevaraya-temple' ||
    activity.id === 'act-1' ||
    activity.title?.toLowerCase().includes('sanjeevaraya');
  const cardImgSrc = isSanjeevaraya
    ? '/assets/images/chinmaya-sanjeevaraya-temple.png'
    : (activity.imageUrl || '/assets/images/chinmaya-sanjeevaraya-temple.png');

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-[var(--orange)]/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full overflow-hidden group w-full">
      {/* Full-width Image Area */}
      <div className="relative h-56 sm:h-60 md:h-64 w-full shrink-0 overflow-hidden bg-slate-950 flex items-center justify-center p-2.5 border-b border-slate-100/10 block">
        <img
          src={cardImgSrc}
          alt={activity.imageAlt || activity.title}
          onError={(e) => {
            if (isSanjeevaraya) {
              e.currentTarget.src = '/assets/images/chinmaya-sanjeevaraya-temple.png';
            } else if (activity.id === 'shanta-malleshwara-temple' || activity.title?.toLowerCase().includes('malleshwara')) {
              e.currentTarget.src = '/assets/images/activity-shantamalleshwara.webp';
            } else if (activity.id === 'satsang' || activity.title?.toLowerCase().includes('satsang')) {
              e.currentTarget.src = '/assets/images/activity-satsang.jpg';
            } else if (activity.id === 'kuchipudi-classes' || activity.title?.toLowerCase().includes('kuchipudi')) {
              e.currentTarget.src = '/assets/our-activities/kuchipudi-classes.jpg';
            } else if (activity.id === 'bhagavad-gita' || activity.title?.toLowerCase().includes('gita')) {
              e.currentTarget.src = '/assets/our-activities/bhagavad-gita-book.jpg';
            } else if (activity.id === 'sanskrit-classes' || activity.title?.toLowerCase().includes('sanskrit')) {
              e.currentTarget.src = '/assets/our-activities/sanskrit-classes.jpg';
            } else if (activity.id === 'vishnu-sahasranamam' || activity.title?.toLowerCase().includes('vishnu')) {
              e.currentTarget.src = '/assets/our-activities/vishnu-sahasranamam.jpg';
            }
          }}
          className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.02] block"
          loading="eager"
        />

        {activity.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-bold text-[10px] sm:text-[11px] uppercase tracking-wider border border-white/20 shadow-md z-20">
            {activity.category}
          </span>
        )}

        <button
          type="button"
          onClick={() => onSelect(activity)}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-[var(--orange)] transition-all shadow-sm z-20 cursor-pointer"
          title="Enlarge Image"
          aria-label={`Enlarge image for ${activity.title}`}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 text-left">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 group-hover:bg-[var(--orange)] group-hover:text-white transition-colors duration-300">
            {activity.icon || <Sparkles className="w-4 h-4" />}
          </div>
          <h3 className="text-base sm:text-lg font-extrabold font-heading text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors leading-snug line-clamp-1 uppercase tracking-wide truncate">
            {activity.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 h-[3.8rem] sm:h-[4.2rem] overflow-hidden mb-3 font-normal">
          {activity.description}
        </p>

        {/* Card Footer Meta */}
        <div className="mt-auto pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between">
          <span className="truncate max-w-[55%] text-slate-500 font-medium text-xs">
            {activity.imageSource || activity.subtitle || 'Chinmaya Mission'}
          </span>
          {activity.id === 'chinmaya-sanjeevaraya-temple' || activity.title?.toLowerCase().includes('sanjeevaraya') ? (
            <Link
              to="/chinmaya-sanjeevaraya-temple"
              className="text-[var(--orange)] hover:text-[#d04a02] font-bold text-xs sm:text-sm flex items-center gap-1 group/btn transition-colors cursor-pointer shrink-0"
              title="Explore Chinmaya Sanjeevaraya Temple Page"
            >
              <span>Know More</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          ) : activity.id === 'shanta-malleshwara-temple' || activity.title?.toLowerCase().includes('malleshwara') ? (
            <Link
              to="/shri-shantamalleshwara-swami-temple"
              className="text-[var(--orange)] hover:text-[#d04a02] font-bold text-xs sm:text-sm flex items-center gap-1 group/btn transition-colors cursor-pointer shrink-0"
              title="Explore Shri Shantamalleshwara Swami Temple Page"
            >
              <span>Know More</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(activity)}
              className="text-[var(--orange)] hover:text-[#d04a02] font-bold text-xs sm:text-sm flex items-center gap-1 group/btn transition-colors cursor-pointer shrink-0"
              title={`Know more about ${activity.title}`}
            >
              <span>Know More</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export const ActivitiesPage = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Centralized structured data for additional activities
  const additionalActivities = [
    {
      id: 'kuchipudi-classes',
      title: 'Kuchipudi Classes',
      subtitle: 'Indian classical dance',
      category: 'Classical Dance & Arts',
      imageUrl: '/assets/our-activities/kuchipudi-classes.jpg',
      imageSource: 'Indian classical dance | Chinmaya Mission',
      icon: <Sparkles className="w-5 h-5" />,
      description:
        'Rigorous training in the timeless classical dance form of Kuchipudi, developing rhythm, grace, devotion (bhakti), and artistic discipline among children and youth.',
      detailedInfo: {
        title: 'Kuchipudi Classical Dance Classes',
        subtitle: 'Traditional Indian Classical Dance & Devotional Arts',
        location: 'Dance Studio, Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'Traditional Indian Classical Dance',
            paragraphs: [
              'Kuchipudi is one of the premier classical dance traditions of India. Under expert guidance, students learn adavus, mudras, abhinaya, and devotional choreographies celebrating Indian spiritual traditions.',
              'Regular performances and cultural presentations help students build poise, physical fitness, and deep artistic appreciation.',
            ],
          },
        ],
      },
    },
    {
      id: 'sanskrit-classes',
      title: 'Sanskrit Classes',
      subtitle: 'Language & Chanting',
      category: 'Sacred Learning & Chanting',
      imageUrl: '/assets/our-activities/sanskrit-classes.jpg',
      imageAlt: 'Sanskrit Classes and Chanting at Chinmaya Mission',
      imageSource: 'Sanskrit Learning & Chanting Sessions',
      icon: <Sun className="w-5 h-5" />,
      description:
        'Structured Sanskrit learning classes, pronunciation of sacred slokas, Vedic chanting, and scriptural study for devotees, youth, and seekers.',
      detailedInfo: {
        title: 'Sanskrit Learning & Vedic Chanting',
        subtitle: 'Language of the Gods (Devavani)',
        location: 'Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'Learning the Language of the Gods (Devavani)',
            paragraphs: [
              'Sanskrit classes offer an accessible, structured pathway to learn the Devanagari script, correct pronunciation of sacred mantras, and understand the depth of ancient scriptures.',
              'Conducted for seekers of all ages, fostering a deeper connection with Vedic heritage, spiritual stotras, and classical wisdom in a devoted classroom setting.',
            ],
          },
        ],
      },
    },
    {
      id: 'bhagavad-gita',
      title: 'Bhagavad Gita Study',
      subtitle: 'Wisdom for life',
      category: 'Scriptural Wisdom',
      imageUrl: '/assets/our-activities/bhagavad-gita-book.jpg',
      imageSource: 'Wisdom for life | Chinmaya Mission',
      icon: <Flame className="w-5 h-5" />,
      description:
        'Systematic study of the timeless verses of Shrimad Bhagavad Gita, illuminating the path of self-discovery, righteous action (Karma Yoga), and inner peace.',
      detailedInfo: {
        title: 'Shrimad Bhagavad Gita Study Classes',
        subtitle: 'Timeless Philosophy for Modern Living',
        location: 'Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'Timeless Philosophy for Modern Living',
            paragraphs: [
              'Pujya Gurudev Swami Chinmayananda revitalized the Bhagavad Gita for all generations. Regular study circles and discourses expound the profound teachings of Lord Krishna to Arjuna.',
              'Participants learn how to apply spiritual wisdom in managing daily stress, relationships, career decisions, and leading a balanced, peaceful life.',
            ],
          },
        ],
      },
    },
    {
      id: 'satsang',
      title: 'Satsang',
      subtitle: 'Spiritual Fellowship',
      category: 'Spiritual Fellowship & Discourse',
      imageUrl: '/assets/images/activity-satsang.jpg',
      imageSource: 'Chinmaya Mission Satsang Gathering',
      icon: <Sun className="w-5 h-5" />,
      description:
        'Satsang brings devotees and seekers together in sacred fellowship to engage in spiritual discourse, devotional singing, and collective reflection.',
      detailedInfo: {
        title: 'Satsang • Spiritual Fellowship',
        subtitle: 'Sacred Fellowship & Vedantic Learning',
        location: 'Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'Sacred Fellowship & Wisdom for Daily Life',
            paragraphs: [
              'Satsang provides a sacred space where seekers and families assemble in the uplifting company of noble thoughts, scriptural wisdom, and devotional fellowship.',
              'Through inspired discourses, collective chanting, devotional singing, and spiritual discussions, participants discover inner peace, moral clarity, and joy in purposeful living.',
            ],
          },
        ],
      },
    },
    {
      id: 'vishnu-sahasranamam',
      title: 'Vishnu Sahasranamam',
      subtitle: 'Devotional chanting',
      category: 'Devotional Chanting',
      imageUrl: '/assets/our-activities/vishnu-sahasranamam.jpg',
      imageSource: 'Devotional chanting | Temples & Satsang',
      icon: <Heart className="w-5 h-5" />,
      description:
        'Regular collective chanting of the sacred thousand names of Lord Vishnu (Sri Vishnu Sahasranama Stotram), cultivating devotion, mental focus, and divine vibrations.',
      detailedInfo: {
        title: 'Sri Vishnu Sahasranamam Chanting',
        subtitle: 'Sacred Devotional Chanting & Stotra Recitation',
        location: 'Temples & Satsang Hall',
        sections: [
          {
            heading: 'Sacred Stotra Recitation',
            paragraphs: [
              'Chanting the Vishnu Sahasranamam brings serenity, purification of mind, and collective spiritual upliftment. Devotees gather regularly to chant with devotion and correct pronunciation.',
              'Open to all seekers, elders, and families wishing to immerse themselves in devotional harmony, mandala celebrations, and sacred vibrations.',
            ],
          },
        ],
      },
    },
  ];

  const handleSelectActivity = (act) => {
    setSelectedActivity(act);
  };

  useEffect(() => {
    document.title = 'Activities | Chinmaya Mission, Adoni';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen pt-4 sm:pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full space-y-14 sm:space-y-18">
      {/* 1. STARTING SECTION: EXACT "OUR ACTIVITIES" HERO, CARDS & CHYK BANNER */}
      <section className="w-full space-y-10 sm:space-y-12">
        {/* Header Block matching user image */}
        <header className="text-center max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight uppercase">
            OUR ACTIVITIES
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
            At Chinmaya Mission, our activities bring together spirituality, devotion, cultural values, youth development and selfless service. Through our dedicated wings and initiatives, we strive to nurture spiritual awareness, strengthen community bonds and inspire individuals of all ages to live by timeless values.
          </p>
        </header>

        {/* 2 Wing Cards: DEVI GROUP & BALVIHAR CLASSES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full items-stretch">
          {FEATURED_WINGS.map((card) => (
            <article
              key={card.id || card.title}
              className={`bg-white rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl flex flex-col h-full overflow-hidden group w-full ${
                card.featured
                  ? 'border-[var(--orange)]/70 ring-1 ring-[var(--orange)]/20'
                  : 'border-slate-200/90 hover:border-[var(--orange)]/50'
              }`}
            >
              {/* Full-width Top Image Area with full visibility & crystal clear presentation */}
              <div className="relative h-64 sm:h-72 md:h-80 w-full shrink-0 overflow-hidden bg-slate-950 flex items-center justify-center p-2.5 sm:p-3 border-b border-slate-100/10 block">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      card.id === 'devi-group'
                        ? '/assets/images/activity-devigroup.jpg'
                        : '/assets/images/activity-balvihar.jpg';
                  }}
                  className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-sm transition-transform duration-500 ease-out group-hover:scale-[1.02] block"
                  loading="eager"
                />

                {card.badge && (
                  <span className="absolute top-3.5 left-3.5 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider border border-white/20 shadow-md z-20">
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 text-left">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 group-hover:bg-[var(--orange)] group-hover:text-white transition-colors duration-300">
                    {card.icon}
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-extrabold font-heading text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors leading-snug uppercase tracking-wide">
                    {card.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 mb-6 font-normal">
                  {card.content}
                </p>

                {/* Bottom Action Button: Know More */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectActivity(card)}
                    className="btn-secondary w-full justify-center text-sm py-3 px-4 font-bold shadow-sm rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  >
                    <span>Know More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CHINMAYA YUVA KENDRA (CHYK), ADONI Banner Card */}
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-10 relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] leading-tight">
                {CHYK_FEATURE_DATA.heading}
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {CHYK_FEATURE_DATA.p1}
              </p>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {CHYK_FEATURE_DATA.p2}
              </p>

              {/* Dynamic Youth Keywords */}
              <div className="pt-2">
                <span className="text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider block mb-3">
                  CORE VALUES & DRIVING FORCE
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {CHYK_FEATURE_DATA.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-white border border-[rgba(11,35,64,0.08)] text-[var(--orange)] font-extrabold text-xs tracking-wider uppercase shadow-sm hover:border-[var(--orange)] transition-colors"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectActivity({
                      ...CHYK_FEATURE_DATA,
                      title: CHYK_FEATURE_DATA.heading,
                      badge: 'YOUTH IN ACTION',
                      icon: <Zap className="w-5 h-5 text-[var(--orange)]" />,
                      content: `${CHYK_FEATURE_DATA.p1} ${CHYK_FEATURE_DATA.p2}`,
                    })
                  }
                  className="btn-secondary py-3 px-6 text-sm font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                >
                  <span>Know More About CHYK</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--orange)] shadow-2xl group bg-slate-900 flex items-center justify-center h-80 sm:h-[400px]">
                <img
                  src={CHYK_FEATURE_DATA.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-110 pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/chyk-group.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <img
                  src={CHYK_FEATURE_DATA.imageUrl}
                  alt="CHYK Youth Power"
                  className="relative z-10 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/chyk-group.jpg';
                  }}
                />
                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-black/80 text-[var(--yellow)] font-extrabold text-xs backdrop-blur-md border border-white/20 z-20">
                  YOUTH IN ACTION
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMMES & SACRED INITIATIVES SECTION */}
      <section className="w-full">
        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch">
          {additionalActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onSelect={handleSelectActivity}
            />
          ))}
        </div>
      </section>

      {/* Detail & History Modal for Activity */}
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setSelectedActivity(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white border border-[rgba(11,35,64,0.08)] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Area: 100% Full Uncropped Image Presentation */}
            <div className="relative w-full min-h-[280px] sm:min-h-[360px] md:min-h-[420px] max-h-[60vh] bg-[#0B1320] shrink-0 overflow-hidden flex items-center justify-center p-3 sm:p-5">
              {/* Ambient blurred backdrop so any aspect ratio fills gracefully */}
              <img
                src={selectedActivity.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
              />
              {/* Full uncropped, complete image */}
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.imageAlt || selectedActivity.title}
                onError={(e) => {
                  if (
                    selectedActivity.id === 'chinmaya-sanjeevaraya-temple' ||
                    selectedActivity.title?.toLowerCase().includes('sanjeevaraya')
                  ) {
                    e.currentTarget.src = '/assets/images/chinmaya-sanjeevaraya-temple.png';
                  } else if (
                    selectedActivity.id === 'shanta-malleshwara-temple' ||
                    selectedActivity.title?.toLowerCase().includes('malleshwara')
                  ) {
                    e.currentTarget.src = '/assets/images/activity-shantamalleshwara.webp';
                  } else if (
                    selectedActivity.id === 'devi-group' ||
                    selectedActivity.title?.toLowerCase().includes('devi')
                  ) {
                    e.currentTarget.src = '/assets/images/activity-devigroup.jpg';
                  } else if (
                    selectedActivity.id === 'balvihar-classes' ||
                    selectedActivity.title?.toLowerCase().includes('balvihar')
                  ) {
                    e.currentTarget.src = '/assets/images/activity-balvihar.jpg';
                  } else if (
                    selectedActivity.id === 'satsang' ||
                    selectedActivity.title?.toLowerCase().includes('satsang')
                  ) {
                    e.currentTarget.src = '/assets/images/activity-satsang.jpg';
                  }
                }}
                className="relative z-10 w-full h-full max-h-[55vh] object-contain mx-auto my-auto drop-shadow-2xl rounded-xl block"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/75 hover:bg-black text-white transition-colors z-30 backdrop-blur-md cursor-pointer shadow-xl border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badges Floating on Image */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
                {(selectedActivity.badge || selectedActivity.category) && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[var(--orange)] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    {selectedActivity.badge || selectedActivity.category}
                  </span>
                )}
                {selectedActivity.detailedInfo?.location && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold shadow-lg border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[var(--orange)]" />
                    <span>{selectedActivity.detailedInfo.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 text-left">
              {/* Title & Subtitle */}
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)] leading-snug">
                  {selectedActivity.detailedInfo?.title || selectedActivity.title}
                </h2>
                {selectedActivity.detailedInfo?.subtitle && (
                  <p className="text-xs font-bold text-[var(--orange)] tracking-widest uppercase mt-1">
                    {selectedActivity.detailedInfo.subtitle}
                  </p>
                )}
                {selectedActivity.detailedInfo?.schedule && (
                  <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedActivity.detailedInfo.schedule}</span>
                  </p>
                )}
              </div>

              {/* Summary Box */}
              {(selectedActivity.content || selectedActivity.description) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-slate-700 text-sm sm:text-base leading-relaxed">
                  {selectedActivity.content || selectedActivity.description}
                </div>
              )}

              {/* Detailed Sections if available */}
              {selectedActivity.detailedInfo?.sections?.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-1.5 border-b border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-[var(--orange)]" />
                    <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 tracking-tight">
                      {section.heading}
                    </h3>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {section.paragraphs.map((p, pIdx) => {
                      if (p.startsWith('- ')) {
                        const items = p.split('\n');
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-2">
                            {items.map((line, lIdx) => {
                              const cleanLine = line.replace(/^[-\s*]+/, '');
                              const parts = cleanLine.split(': ');
                              return (
                                <li key={lIdx} className="text-slate-700">
                                  {parts.length > 1 ? (
                                    <>
                                      <strong className="text-[var(--text-primary)] font-bold">{parts[0]}:</strong>{' '}
                                      {parts.slice(1).join(': ')}
                                    </>
                                  ) : (
                                    cleanLine
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }
                      return <p key={pIdx}>{p}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 shrink-0">
              <span className="truncate max-w-[50%]">
                {selectedActivity.imageSource || 'Chinmaya Mission, Adoni'}
              </span>
              <div className="flex items-center gap-2">
                {(selectedActivity.id === 'chinmaya-sanjeevaraya-temple' ||
                  selectedActivity.title?.toLowerCase().includes('sanjeevaraya')) && (
                  <Link
                    to="/chinmaya-sanjeevaraya-temple"
                    className="text-[var(--orange)] hover:underline font-bold text-xs flex items-center gap-1 mr-2"
                  >
                    <span>Full Temple Page</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {(selectedActivity.id === 'shanta-malleshwara-temple' ||
                  selectedActivity.title?.toLowerCase().includes('malleshwara')) && (
                  <Link
                    to="/shri-shantamalleshwara-swami-temple"
                    className="text-[var(--orange)] hover:underline font-bold text-xs flex items-center gap-1 mr-2"
                  >
                    <span>Full Temple Page</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="btn-primary text-xs py-1.5 px-4 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
