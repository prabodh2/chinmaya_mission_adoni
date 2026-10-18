import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService, contentService, webContentService } from '../services/api';
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
} from 'lucide-react';

// Reusable Activity Card Component (Classic, Clean, Standardized Design)
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
        {/* Full uncropped image visible completely - 100% visible, crystal clear, never cropped */}
        <img
          src={cardImgSrc}
          alt={activity.imageAlt || activity.title}
          onError={(e) => {
            if (isSanjeevaraya) {
              e.currentTarget.src = '/assets/images/chinmaya-sanjeevaraya-temple.png';
            } else if (activity.id === 'shanta-malleshwara-temple' || activity.title?.toLowerCase().includes('malleshwara')) {
              e.currentTarget.src = '/assets/images/activity-shantamalleshwara.webp';
            } else if (activity.id === 'devi-group' || activity.title?.toLowerCase().includes('devi')) {
              e.currentTarget.src = '/assets/images/activity-devigroup.jpg';
            } else if (activity.id === 'balavihar-classes' || activity.title?.toLowerCase().includes('balavihar')) {
              e.currentTarget.src = '/assets/our-activities/balavihar-classes.jpg';
            } else if (activity.id === 'kuchipudi-classes' || activity.title?.toLowerCase().includes('kuchipudi')) {
              e.currentTarget.src = '/assets/our-activities/kuchipudi-classes.jpg';
            } else if (activity.id === 'bhagavad-gita' || activity.title?.toLowerCase().includes('gita')) {
              e.currentTarget.src = '/assets/our-activities/bhagavad-gita-book.jpg';
            } else if (activity.id === 'chinmaya-yuva-kendra' || activity.id === 'chyk-classes' || activity.title?.toLowerCase().includes('chyk')) {
              e.currentTarget.src = '/assets/images/activity-chyk.jpg';
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
          onClick={() => onSelect(activity)}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-[var(--orange)] transition-all shadow-sm z-20 cursor-pointer"
          title="Enlarge Image"
          aria-label={`Enlarge image for ${activity.title}`}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body - Equal height structure across all cards */}
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

        {/* Card Footer Meta - Aligned at exact same baseline */}
        <div className="mt-auto pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between">
          <span className="truncate max-w-[55%] text-slate-500 font-medium text-xs">
            {activity.imageSource ? `Source: ${activity.imageSource}` : (activity.subtitle ? `Source: ${activity.subtitle}` : 'Chinmaya Mission')}
          </span>
          {activity.id === 'chinmaya-sanjeevaraya-temple' || activity.title?.toLowerCase().includes('sanjeevaraya') ? (
            <Link
              to="/chinmaya-sanjeevaraya-temple"
              className="text-[var(--orange)] hover:text-[#d04a02] font-bold text-xs sm:text-sm flex items-center gap-1 group/btn transition-colors cursor-pointer shrink-0"
              title={`Explore Chinmaya Sanjeevaraya Temple Page`}
            >
              <span>Know More</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          ) : activity.id === 'shanta-malleshwara-temple' || activity.title?.toLowerCase().includes('malleshwara') ? (
            <Link
              to="/shri-shantamalleshwara-swami-temple"
              className="text-[var(--orange)] hover:text-[#d04a02] font-bold text-xs sm:text-sm flex items-center gap-1 group/btn transition-colors cursor-pointer shrink-0"
              title={`Explore Shri Shantamalleshwara Swami Temple Page`}
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

// Reusable CHYK Feature Section Component
const ChykFeatureSection = ({ activity, onSelect }) => {
  return (
    <article className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-10 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Visual Image */}
        <div className="lg:col-span-5 order-1">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md group block h-72 sm:h-[360px] bg-slate-900 flex items-center justify-center">
            {/* Ambient blurred backdrop */}
            <img
              src={activity.imageUrl || '/assets/our-activities/chyk-classes.jpg'}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-110 pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            {/* Full uncropped image - 100% FULLY VISIBLE */}
            <img
              src={activity.imageUrl || '/assets/our-activities/chyk-classes.jpg'}
              alt={activity.imageAlt || activity.title}
              onError={(e) => {
                e.currentTarget.src = '/assets/our-activities/chyk-classes.jpg';
              }}
              className="relative z-10 w-full h-full object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500 block"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[var(--orange)] text-white font-bold text-[11px] tracking-wider uppercase shadow-sm z-20">
              {activity.category}
            </span>
            <button
              onClick={() => onSelect(activity)}
              className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/75 backdrop-blur-sm text-white hover:bg-black transition-colors border border-white/20 z-20 cursor-pointer"
              aria-label="Enlarge CHYK Activity Image"
            >
              <Maximize2 className="w-4 h-4 text-[var(--yellow)]" />
            </button>
          </div>
        </div>

        {/* Right Column: CHYK Content */}
        <div className="lg:col-span-7 space-y-4 text-left order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-bold text-xs uppercase tracking-widest border border-[var(--orange)]/25">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>CHINMAYA YUVA KENDRA • YOUTH WING</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)] leading-tight">
            {activity.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            "{activity.description}"
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {activity.additionalDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {['KNOWLEDGE', 'DISCIPLINE', 'CONFIDENCE', 'COMPASSION', 'SERVICE'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] tracking-wider uppercase border border-slate-200"
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

// Overview Activities as displayed in the initial visual grid (Matching user layout)
const OVERVIEW_ACTIVITIES = [
  {
    id: 'balavihar-classes',
    title: 'Balavihar Classes',
    subtitle: 'Every Sunday',
    category: 'Values & Character',
    imageUrl: '/assets/our-activities/balavihar-classes.jpg',
    imageSource: 'Every Sunday | Chinmaya Mission',
    icon: <Users className="w-5 h-5" />,
    description:
      'Balavihar instills core spiritual, moral, and cultural values in children through engaging stories from the epics, Vedic chanting, bhajans, dynamic games, and character-building discussions every Sunday.',
    detailedInfo: {
      location: 'Chinmaya Cultural Complex',
      sections: [
        {
          heading: 'Weekly Children Program',
          paragraphs: [
            'Balavihar provides a dynamic weekly platform where children explore Indian heritage, ethics, and universal spiritual values in a fun, loving, and encouraging environment.',
            'Classes are conducted every Sunday with trained Sevaks, nurturing young minds into confident, compassionate, and responsible individuals.',
          ],
        },
      ],
    },
  },
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
    id: 'chyk-classes',
    title: 'CHYK Classes',
    subtitle: 'Every Sunday',
    category: 'Youth Leadership',
    imageUrl: '/assets/our-activities/chyk-classes.jpg',
    imageSource: 'Chinmaya Yuva Kendra | Every Sunday',
    icon: <Zap className="w-5 h-5" />,
    description:
      'Chinmaya Yuva Kendra (CHYK) offers youth dynamic forums, leadership development, Vedanta study classes, youth seminars, and community service projects.',
    detailedInfo: {
      location: 'Chinmaya Cultural Complex',
      sections: [
        {
          heading: 'Empowering the Youth',
          paragraphs: [
            'CHYK brings together young men and women every Sunday to explore practical philosophy, clarity in decision-making, emotional mastery, and purposeful living.',
            'Through interactive seminars, discussions, camps, and marathon initiatives, CHYK channels youth energy into positive personal transformation and societal service.',
          ],
        },
      ],
    },
  },
  {
    id: 'sanskrit-classes',
    title: 'Sanskrit Classes',
    subtitle: 'Online sessions',
    category: 'Culture & Celebrations',
    imageUrl: '/assets/our-activities/sankranti@2x.png',
    imageSource: 'Online sessions & Ashram Campus',
    icon: <Sun className="w-5 h-5" />,
    description:
      'Interactive cultural workshops, traditional festive celebrations, rangoli arts, and online sessions celebrating the auspicious harvest festival of Makara Sankranti.',
    detailedInfo: {
      location: 'Online & Ashram Campus',
      sections: [
        {
          heading: 'Festive Learning & Community Spirit',
          paragraphs: [
            'Sankranti classes and workshops bring families and youth together to celebrate Indian cultural traditions, understand the spiritual symbolism behind solar transitions, and cultivate gratitude for nature.',
            'Includes online interactive sessions, rangoli traditions, and festive joy connecting participants near and far.',
          ],
        },
      ],
    },
  },
  {
    id: 'bhagavad-gita',
    title: 'Bhagavad Gita',
    subtitle: 'Wisdom for life',
    category: 'Scriptural Wisdom',
    imageUrl: '/assets/our-activities/bhagavad-gita-book.jpg',
    imageSource: 'Wisdom for life | Chinmaya Mission',
    icon: <Flame className="w-5 h-5" />,
    description:
      'Systematic study of the timeless verses of Shrimad Bhagavad Gita, illuminating the path of self-discovery, righteous action (Karma Yoga), and inner peace.',
    detailedInfo: {
      location: 'Chinmaya Mission',
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
    id: 'vishnu-sahasranamam',
    title: 'Vishnu Sahasranamam',
    subtitle: 'Devotional chanting',
    category: 'Devotional Chanting',
    imageUrl: '/assets/our-activities/vishnu@2x.png',
    imageSource: 'Devotional chanting | Temples & Satsang',
    icon: <Heart className="w-5 h-5" />,
    description:
      'Regular collective chanting of the sacred thousand names of Lord Vishnu (Sri Vishnu Sahasranama Stotram), cultivating devotion, mental focus, and divine vibrations.',
    detailedInfo: {
      location: 'Temples & Satsang Hall',
      sections: [
        {
          heading: 'Sacred Stotra Recitation',
          paragraphs: [
            'Chanting the Vishnu Sahasranamam brings serenity, purification of mind, and collective spiritual upliftment. Devotees gather regularly to chant with devotion and correct pronunciation.',
            'Open to all seekers, elders, and families wishing to immerse themselves in devotional harmony and sacred vibrations.',
          ],
        },
      ],
    },
  },
];

export const ActivitiesPage = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Centralized structured data for core Chinmaya Mission centres & wings
  const initialActivities = [
    {
      id: 'chinmaya-sanjeevaraya-temple',
      title: 'Chinmaya Sanjeevaraya Temple',
      section: 'SPIRITUALITY & DEVOTION',
      category: 'Spirituality & Devotion',
      description:
        'Dedicated to devotion and spiritual practice, Chinmaya Sanjeevaraya Temple serves as a place for worship, prayer and the observance of religious traditions. Through devotional activities and spiritual gatherings, the temple seeks to nurture faith, preserve cultural heritage and bring the community together.',
      imageUrl: '/assets/images/chinmaya-sanjeevaraya-temple.png',
      imageAlt: 'Chinmaya Sanjeevaraya Temple Devotional Practice',
      imageSource: 'Chinmaya Mission Devotional Center',
      imageCredit: 'Official Shrine & Devotional Gatherings',
      icon: <Landmark className="w-5 h-5 text-[var(--orange)]" />,
      detailedInfo: {
        deity: 'Sri Chinnaya Sanjeevarya Swamy Devasthanam',
        location: 'Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'History and Spiritual Significance',
            paragraphs: [
              'The Sri Chinnaya Sanjeevarya Swamy Devasthanam was consecrated in 2006 (Vyaya Nama Samvatsaram), in accordance with the vision and spiritual inspiration of Pujya Swamini Shyamananda, the founder of Chinmaya Mission.',
              'The consecration ceremony was performed in accordance with the traditional Agama Shastras, under the guidance of Pujya Swami Pranavananda, with the support and cooperation of Sri Vitta Bhimayasetty, Sri B. V. R. Reddy, Sri Adapa Mohan Reddy, and the devoted community.',
              'In 2012, a sacred Kumbhabhishekam ceremony was performed to renew the spiritual sanctity of the temple, under the guidance of Pujya Swami Paratparananda and Pujya Swami Pranavananda.',
              'With the wholehearted participation of devotees, a sacred Havan was conducted. Silver armour was offered to the presiding deity, and two ornamental pieces were provided for the festival deities (Utsava Murtis), reflecting the devotion and reverence of the community.',
            ],
          },
          {
            heading: 'Daily Worship and Annual Celebrations',
            paragraphs: [
              'Daily poojas are performed with devotion and reverence to the presiding deity. Special rituals and religious observances are conducted on auspicious days and during important festivals throughout the year.',
              'The temple celebrates Shravana Masa, Hanuman Jayanti, and Karthika Deepotsavam with great devotion and spiritual fervour. These sacred observances bring devotees together in prayer, worship, and the celebration of their spiritual traditions.',
              'The Devasthanam continues to serve as a place of worship and devotion, preserving religious traditions and nurturing the spiritual aspirations of its devotees.',
            ],
          },
        ],
      },
    },
    {
      id: 'shanta-malleshwara-temple',
      title: 'Shri Shantamalleshwara Swami Temple',
      section: 'SPIRITUALITY & DEVOTION',
      category: 'Devotion & Community',
      description:
        'Shri Shantamalleshwara Swami Temple is an important centre of worship and devotion associated with Chinmaya Mission. The temple provides a space for devotees to participate in religious observances, festivals and spiritual activities, fostering a sense of unity, devotion and community service.',
      imageUrl: '/assets/images/activity-shantamalleshwara.webp',
      imageAlt: 'Shri Shantamalleshwara Swami Temple Worship Center',
      imageSource: 'Shri Shantamalleshwara Swami Temple',
      imageCredit: 'Official Festival & Devotional Observances',
      icon: <Flame className="w-5 h-5 text-[var(--orange)]" />,
      detailedInfo: {
        deity: 'Shri Shantamalleshwara Swami Temple',
        location: 'Navarantanagiri',
        sections: [
          {
            heading: 'History and Spiritual Legacy',
            paragraphs: [
              'Shri Shantamalleshwara Swami Temple is a sacred centre of worship and devotion associated with Chinmaya Mission. The development of the temple commenced in 1996 under the spiritual inspiration and vision of the Mission.',
              'In 2003 and 2004, major infrastructural access developments, including the temple bridge and foot bridge, were constructed to facilitate ease of access for pilgrims and devotees.',
              'The temple continues to serve as a vital spiritual sanctum hosting sacred rituals, festivals, and community celebrations throughout the year.',
            ],
          },
        ],
      },
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
      detailedInfo: {
        deity: 'Devi Group • Women’s Cultural Wing',
        location: 'Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'Spiritual Devotion & Cultural Values',
            paragraphs: [
              "The Devi Group is dedicated to nurturing devotion, spiritual understanding, and the preservation of cultural values across families.",
              "Through scriptural study, devotional singing, collective poojas, and participation in Chinmaya Mission festivals, members deepen their spiritual connection and foster dharmic values within the household and community.",
            ],
          },
        ],
      },
    },
    {
      id: 'chinmaya-yuva-kendra',
      title: 'Chinmaya Yuva Kendra (CHYK)',
      section: 'YOUTH & LEADERSHIP',
      category: 'Youth • Leadership • Service',
      description:
        'Chinmaya Yuva Kendra (CHYK) is the youth wing of Chinmaya Mission, providing a platform for young people to grow spiritually, develop leadership skills and engage in meaningful community initiatives.',
      additionalDescription:
        "CHYK encourages young minds to discover their potential and apply the wisdom of Indian philosophy to modern-day life. Through youth programmes, cultural activities, interactive initiatives and social service, CHYK inspires young people to become responsible leaders guided by knowledge, discipline, confidence and compassion.",
      imageUrl: '/assets/images/activity-chyk.jpg',
      imageAlt: 'Chinmaya Yuva Kendra Youth Empowerment',
      imageSource: 'Chinmaya Yuva Kendra',
      imageCredit: 'Youth Empowerment & Community Leadership',
      icon: <Zap className="w-5 h-5 text-[var(--orange)]" />,
      featured: true,
      detailedInfo: {
        deity: 'Chinmaya Yuva Kendra (CHYK)',
        location: 'Chinmaya Cultural Complex',
        sections: [
          {
            heading: 'Youth Empowerment & Philosophy in Action',
            paragraphs: [
              'Chinmaya Yuva Kendra (CHYK) is the global youth wing of Chinmaya Mission, empowering youth aged 16 to 30 through spiritual insight, leadership development, and dynamic service.',
              'CHYK organizes youth camps, marathon training, personality development workshops, study groups, and community awareness rallies such as the Anti-Drug Movement 2026.',
              'CHYK inspires youth to channel their boundless energy constructively, uniting physical dynamism with spiritual wisdom and moral excellence.',
            ],
          },
        ],
      },
    },
  ];

  const defaultMovementActivities = [];

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
            if (act.id === 'chinmaya-sanjeevaraya-temple' || act.id === 'act-1' || act.title?.toLowerCase().includes('sanjeevaraya')) {
              img = '/assets/images/chinmaya-sanjeevaraya-temple.png';
            } else if (!img || img === 'undefined' || typeof img !== 'string' || img.trim() === '') {
              img = initialMatch?.imageUrl || '';
            } else if (img.includes('activity-sanjeevaraya.png')) {
              img = '/assets/images/chinmaya-sanjeevaraya-temple.png';
            } else if (img.includes('devi_group_wing') || img.includes('photo-1511632765486')) {
              img = '/assets/images/activity-devigroup.jpg';
            }
            return {
              ...act,
              imageUrl: img,
              icon: act.icon || initialMatch?.icon,
              detailedInfo: act.detailedInfo || initialMatch?.detailedInfo,
            };
          });
        }
        return parsed;
      }
    } catch (_) {}
    return fallback;
  };

  const handleSelectActivity = (act) => {
    const initialMatch = initialActivities.find(
      (init) => init.id === act.id || init.title?.toLowerCase() === act.title?.toLowerCase()
    );
    setSelectedActivity({
      ...act,
      detailedInfo: act.detailedInfo || initialMatch?.detailedInfo,
    });
  };

  const [missionActivities, setMissionActivities] = useState(() => {
    const cached = getCached('cms_mission_activities', null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached.map((a) =>
        a.title === 'Sankranti Classes' || a.id === 'sankranti-classes'
          ? { ...a, title: 'Sanskrit Classes', id: 'sanskrit-classes' }
          : a
      );
    }
    return initialActivities;
  });
  const [movementActivities, setMovementActivities] = useState(() => {
    const cached = getCached('cms_movement_activities', null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached
        .filter((a) => !/School Anti-Drug Oath|Youth Marathon Prep|Mind & Body Wellness|Torch Relay/i.test(a.title || ''))
        .map((a) =>
          a.description?.includes('helps youth build confidence')
            ? {
                ...a,
                description: a.description.replace(
                  'helps youth build confidence',
                  'helps youth to build confidence'
                ),
              }
            : a
        );
    }
    return defaultMovementActivities;
  });

  const [heroContent, setHeroContent] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cms_chinmaya_activities');
      if (cached) return JSON.parse(cached)?.fieldsMap?.activities_hero || null;
    } catch (_) {}
    return null;
  });

  const loadActivities = () => {
    webContentService
      .getPublicPage('chinmaya', 'activities')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          try {
            localStorage.setItem('cached_cms_chinmaya_activities', JSON.stringify(res.data.data));
          } catch (_) {}
          setHeroContent(res.data.data.fieldsMap?.activities_hero || null);
        }
      })
      .catch(() => {});
    // 1. Fetch community & movement activities from API
    activityService
      .getActivities()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const list = res.data.data
            .filter((act) => act.active !== false && !/School Anti-Drug Oath|Youth Marathon Prep|Mind & Body Wellness|Torch Relay/i.test(act.title || ''))
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
                if (
                  item.id === 'chinmaya-sanjeevaraya-temple' ||
                  item.title?.toLowerCase().includes('sanjeevaraya') ||
                  matchedCard.id === 'act-1' ||
                  matchedCard.title?.toLowerCase().includes('sanjeevaraya')
                ) {
                  cleanImg = '/assets/images/chinmaya-sanjeevaraya-temple.png';
                } else if (!cleanImg || cleanImg === 'undefined' || typeof cleanImg !== 'string' || cleanImg.trim() === '') {
                  cleanImg = item.imageUrl;
                } else if (cleanImg.includes('activity-sanjeevaraya.png')) {
                  cleanImg = '/assets/images/chinmaya-sanjeevaraya-temple.png';
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
    document.title = 'Events | Chinmaya Mission';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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

  const cultureDevotionActivities = missionActivities.filter(
    (item) => item.section === 'CULTURE & DEVOTION'
  );
  const chykActivity =
    missionActivities.find(
      (item) => item.id === 'chinmaya-yuva-kendra' || item.title?.includes('CHYK')
    ) || initialActivities[3];

  return (
    <div className="min-h-screen pt-1 sm:pt-2 pb-16 px-4 sm:px-8 lg:px-12 w-full space-y-12 sm:space-y-16">
      {/* 1. OUR EVENTS OVERVIEW */}
      <section className="space-y-8 w-full">
        <header className="text-center space-y-2 max-w-4xl mx-auto">
          {heroContent?.badge && (
            <div className="flex justify-center mb-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/20">
                {heroContent.badge}
              </span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[var(--text-primary)] tracking-tight">
            {(!heroContent?.heading || heroContent?.heading.toLowerCase().includes('activities')) ? 'Our Events' : heroContent.heading}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] font-medium max-w-3xl mx-auto">
            {(!heroContent?.subtitle || heroContent?.subtitle.toLowerCase().includes('activities'))
              ? 'Festivals, cultural celebrations, learning, and youth gatherings for all ages.'
              : heroContent.subtitle.replace(/,\s*Adoni/gi, '').replace(/\bin\s+Adoni\b/gi, '').replace(/\bAdoni\b/gi, '').trim()}
          </p>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch">
          {OVERVIEW_ACTIVITIES.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onSelect={handleSelectActivity}
            />
          ))}
        </div>
      </section>


      {/* 3. SECTION 2: CULTURE & DEVOTION */}
      <section className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch">
          {cultureDevotionActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onSelect={handleSelectActivity}
            />
          ))}
        </div>
      </section>

      {/* 4. SECTION 3: YOUTH & LEADERSHIP (SPECIAL CHYK SECTION) */}
      <section className="space-y-8 w-full">
        {chykActivity && (
          <ChykFeatureSection
            activity={chykActivity}
            onSelect={handleSelectActivity}
          />
        )}
      </section>

      {/* 5. SECTION 4: COMMUNITY & MOVEMENT INITIATIVES */}
      {movementActivities.length > 0 && (
        <section className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch">
            {movementActivities.map((act) => (
              <ActivityCard
                key={act.id || act._id || act.title}
                activity={act}
                onSelect={handleSelectActivity}
              />
            ))}
          </div>
        </section>
      )}

      {/* Detail & History Modal for Activity */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setSelectedActivity(null)}
        >
          <div 
            className="bg-white border border-[rgba(11,35,64,0.08)] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-[0_4px_12px_rgba(11,35,64,0.06),0_16px_40px_rgba(11,35,64,0.1)] relative my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Area: 100% Full Uncropped Image Presentation */}
            <div className="relative w-full min-h-[300px] sm:min-h-[380px] md:min-h-[460px] max-h-[65vh] bg-[#0B1320] shrink-0 overflow-hidden flex items-center justify-center p-3 sm:p-5">
              {/* Ambient blurred backdrop so any aspect ratio fills gracefully */}
              <img
                src={
                  selectedActivity.id === 'chinmaya-sanjeevaraya-temple' || selectedActivity.title?.toLowerCase().includes('sanjeevaraya')
                    ? '/assets/images/chinmaya-sanjeevaraya-temple.png'
                    : selectedActivity.imageUrl
                }
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
              />
              {/* Full uncropped, complete image - NEVER CROPPED, NEVER CUT OFF */}
              <img
                src={
                  selectedActivity.id === 'chinmaya-sanjeevaraya-temple' || selectedActivity.title?.toLowerCase().includes('sanjeevaraya')
                    ? '/assets/images/chinmaya-sanjeevaraya-temple.png'
                    : selectedActivity.imageUrl
                }
                alt={selectedActivity.imageAlt || selectedActivity.title}
                onError={(e) => {
                  if (selectedActivity.id === 'chinmaya-sanjeevaraya-temple' || selectedActivity.title?.toLowerCase().includes('sanjeevaraya')) {
                    e.currentTarget.src = '/assets/images/chinmaya-sanjeevaraya-temple.png';
                  } else if (selectedActivity.id === 'shanta-malleshwara-temple' || selectedActivity.title?.toLowerCase().includes('malleshwara')) {
                    e.currentTarget.src = '/assets/images/activity-shantamalleshwara.webp';
                  } else if (selectedActivity.id === 'devi-group' || selectedActivity.title?.toLowerCase().includes('devi')) {
                    e.currentTarget.src = '/assets/images/activity-devigroup.jpg';
                  } else if (selectedActivity.id === 'balavihar-classes' || selectedActivity.title?.toLowerCase().includes('balavihar')) {
                    e.currentTarget.src = '/assets/our-activities/balavihar-classes.jpg';
                  } else if (selectedActivity.id === 'kuchipudi-classes' || selectedActivity.title?.toLowerCase().includes('kuchipudi')) {
                    e.currentTarget.src = '/assets/our-activities/kuchipudi-classes.jpg';
                  } else if (selectedActivity.id === 'bhagavad-gita' || selectedActivity.title?.toLowerCase().includes('gita')) {
                    e.currentTarget.src = '/assets/our-activities/bhagavad-gita-book.jpg';
                  } else if (selectedActivity.id === 'chinmaya-yuva-kendra' || selectedActivity.id === 'chyk-classes' || selectedActivity.title?.toLowerCase().includes('chyk')) {
                    e.currentTarget.src = '/assets/our-activities/chyk-classes.jpg';
                  }
                }}
                className="relative z-10 w-full h-full max-h-[58vh] object-contain mx-auto my-auto drop-shadow-2xl rounded-xl block"
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/75 hover:bg-black text-white transition-colors z-30 backdrop-blur-md cursor-pointer shadow-xl border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badges Floating on Image */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
                {selectedActivity.category && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[var(--orange)] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    {selectedActivity.category}
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
                  {selectedActivity.detailedInfo?.deity || selectedActivity.title}
                </h2>
                {selectedActivity.detailedInfo?.location && (
                  <p className="text-xs font-bold text-[var(--orange)] tracking-widest uppercase mt-1">
                    {selectedActivity.detailedInfo.location}
                  </p>
                )}
              </div>

              {/* Detailed Sections if available */}
              {selectedActivity.detailedInfo?.sections ? (
                <div className="space-y-6">
                  {selectedActivity.detailedInfo.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <div className="flex items-center gap-2.5 pb-1.5 border-b border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-[var(--orange)]" />
                        <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 tracking-tight">
                          {section.heading}
                        </h3>
                      </div>
                      <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  <p>{selectedActivity.description}</p>
                  {selectedActivity.additionalDescription && (
                    <p className="pt-2 border-t border-slate-100">{selectedActivity.additionalDescription}</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 shrink-0">
              <span className="truncate max-w-[50%]">
                {selectedActivity.imageSource ? `Source: ${selectedActivity.imageSource}` : 'Chinmaya Mission'}
              </span>
              <div className="flex items-center gap-2">
                {(selectedActivity.id === 'chinmaya-sanjeevaraya-temple' || selectedActivity.title?.toLowerCase().includes('sanjeevaraya')) && (
                  <Link
                    to="/chinmaya-sanjeevaraya-temple"
                    className="text-[var(--orange)] hover:underline font-bold text-xs flex items-center gap-1 mr-2"
                  >
                    <span>Full Temple Page</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {(selectedActivity.id === 'shanta-malleshwara-temple' || selectedActivity.title?.toLowerCase().includes('malleshwara')) && (
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
