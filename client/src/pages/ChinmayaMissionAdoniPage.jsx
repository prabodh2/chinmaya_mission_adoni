import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService, webContentService } from '../services/api';
import { MilestoneJourney } from '../components/milestones/MilestoneJourney';
import {
  Flame,
  Sparkles,
  BookOpen,
  Zap,
  HeartHandshake,
  Compass,
  Quote,
  ArrowRight,
  Users,
  Sun,
  Shield,
  Landmark,
  Heart,
  ChevronRight,
  CheckCircle,
  Activity as ActivityIcon,
  X,
  MapPin,
  Clock,
} from 'lucide-react';

export const ChinmayaMissionAdoniPage = () => {
  // Fallback default content matching exact prompt specification
  const defaultContent = {
    hero: {
      title: 'CHINMAYA MISSION ADONI',
      subtitle: 'Timeless Wisdom. Inspired Youth. Meaningful Service.',
      intro:
        'Chinmaya Mission, Adoni is a spiritual and cultural organisation dedicated to sharing timeless wisdom, nurturing human values and inspiring individuals to lead purposeful lives.',
      imageUrl: '/assets/images/about-ashram-hero.jpg',
    },
    whoWeAre: {
      heading: 'WHO WE ARE',
      p1: 'Chinmaya Mission has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swamini Shyamananda (Dr. Shyamala) under the guidance and blessings of Swamini Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy. Inspired by the vision of Pujya Gurudev Swami Chinmayananda, the Mission has consistently worked to spread the timeless wisdom of the Bhagavad Gita, Upanishads and other scriptures while promoting Indian culture, values and character-building among children, youth and adults. Over the years, Chinmaya Mission has expanded its activities and has made significant contributions to the spiritual, cultural and social development of the region.',
      p2: 'We believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.',
    },
    ourStory: {
      heading: 'OUR STORY',
      p1: 'Chinmaya Mission has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swamini Shyamananda (Dr. Shyamala) under the guidance and blessings of Swamini Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy.',
      p2: 'Inspired by the vision of Pujya Gurudev Swami Chinmayananda, the Mission has consistently worked to spread the timeless wisdom of the Bhagavad Gita, Upanishads and other scriptures while promoting Indian culture, values and character-building among children, youth and adults. Over the years, Chinmaya Mission has expanded its activities and has made significant contributions to the spiritual, cultural and social development of the region.',
      timeline: [
        {
          year: '1992',
          title: 'Establishment of Chinmaya Mission',
          desc: 'Established by Swamini Shyamananda (Dr. Shyamala) under the guidance of Swamini Sharadapriyananda.',
        },
        {
          year: '2001',
          title: 'Chinmaya Cultural Complex',
          desc: 'Inauguration of the Chinmaya Cultural Complex by Pujya Swami Tejomayanandaji.',
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
    chykSection: {
      heading: 'CHINMAYA YUVA KENDRA (CHYK), ADONI',
      p1: 'Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission, provides a platform for young people to explore spiritual knowledge, cultivate leadership qualities and participate in meaningful community initiatives.',
      p2: "CHYK, Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation through workshops and camps.",
      keywords: ['KNOWLEDGE', 'LEADERSHIP', 'DISCIPLINE', 'CONFIDENCE', 'SERVICE'],
      imageUrl: '/assets/chyk-group.jpg',
    },
    spiritualityInAction: {
      heading: 'SPIRITUALITY IN ACTION',
      content:
        'At Chinmaya Mission, spirituality extends beyond individual practice into actions that benefit the wider community. The Mission seeks to bring people together through spiritual learning, cultural engagement, festivals and service initiatives, fostering a spirit of unity, compassion and collective responsibility.',
      flow: ['KNOWLEDGE', 'ACTION', 'SERVICE', 'COMMUNITY'],
      imageUrl:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    },
    ourActivities: {
      heading: 'OUR ACTIVITIES',
      intro:
        'At Chinmaya Mission, our activities bring together spirituality, devotion, cultural values, youth development and selfless service. Through our dedicated wings and initiatives, we strive to nurture spiritual awareness, strengthen community bonds and inspire individuals of all ages to live by timeless values.',
      cards: [
        {
          id: 'act-3',
          title: 'DEVI GROUP',
          content:
            "The Devi Group is dedicated to nurturing devotion, spiritual understanding and the preservation of cultural values. Through devotional gatherings, spiritual learning and collective participation in traditional activities, the group encourages members to deepen their spiritual connection and contribute to the Mission's broader vision.",
          imageUrl: '/assets/images/activity-devigroup.jpg',
          badge: 'DEVOTIONAL WING',
          iconName: 'Heart',
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
          id: 'act-balvihar',
          title: 'BALVIHAR CLASSES',
          content:
            'Chinmaya Balvihar classes provide structured value-based spiritual education for children. Through interactive storytelling, shlokas, bhajans, Indian cultural traditions, moral games, and creative activities, Balvihar helps young minds grow with noble ideals, love for heritage, character, and self-confidence inspired by Pujya Gurudev Swami Chinmayananda’s vision.',
          imageUrl: '/assets/images/activity-balvihar.jpg',
          badge: 'CHILDREN’S WING • VALUE EDUCATION',
          featured: true,
          iconName: 'Users',
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
      ],
    },
    continuingLegacy: {
      heading: 'CONTINUING THE LEGACY',
      content:
        'Guided by the principles of knowledge, devotion and selfless service, Chinmaya Mission continues to share the vision and teachings of Pujya Gurudev Swami Chinmayananda, inspiring individuals, empowering youth and contributing to the spiritual and cultural enrichment of society.',
      highlights: ['Knowledge', 'Devotion', 'Selfless Service', 'Youth', 'Community'],
    },
    conclusion: {
      heading: 'Conclusion',
      paragraph1:
        'From its humble beginning in 1992, Chinmaya Mission has grown into a vibrant centre dedicated to spiritual growth, cultural preservation, value-based education and community service.',
      paragraph2:
        'Through its sustained Geeta Chanting Competitions, Balavihar, Youth Camps, temple development initiatives and numerous cultural programmes, the Mission has positively influenced thousands of children, youth and families over the past three decades.',
      paragraph3:
        "The journey of Chinmaya Mission reflects its unwavering commitment to preserving India's spiritual heritage while making eternal values meaningful and relevant for present and future generations. Guided by the ideals of Pujya Gurudev Swami Chinmayananda, the Mission continues to inspire individuals to lead lives of knowledge, devotion, discipline and selfless service, thereby contributing to the moral and cultural enrichment of society.",
    },
    ourVision: {
      heading: 'OUR VISION',
      quote:
        'To spread the timeless wisdom of Vedanta and inspire individuals to live purposeful, value-based lives rooted in knowledge, devotion and selfless service.',
    },
    ourMission: {
      heading: 'OUR MISSION',
      items: [
        {
          id: 'mission-1',
          title: 'Spiritual Knowledge',
          description:
            'Sharing the timeless teachings of Vedanta and the Bhagavad Gita to inspire self-transformation and inner growth.',
          iconName: 'BookOpen',
        },
        {
          id: 'mission-2',
          title: 'Youth Empowerment',
          description:
            'Nurturing young minds through CHYK programmes, leadership camps and cultural activities that build character and confidence.',
          iconName: 'Zap',
        },
        {
          id: 'mission-3',
          title: 'Cultural Preservation',
          description:
            'Preserving and promoting Indian cultural heritage through festivals, arts and traditional practices.',
          iconName: 'Sparkles',
        },
        {
          id: 'mission-4',
          title: 'Community Service',
          description:
            'Serving the community through welfare initiatives, medical camps and educational programmes that uplift society.',
          iconName: 'HeartHandshake',
        },
        {
          id: 'mission-5',
          title: 'Value-Based Living',
          description:
            'Encouraging individuals to integrate spiritual wisdom into daily life for a more compassionate and purposeful existence.',
          iconName: 'Shield',
        },
      ],
    },
    closingCta: {
      title: 'Timeless Wisdom.\nInspired Youth.\nMeaningful Service.',
      subtext:
        'We are a community united by knowledge, strengthened by values and inspired by selfless service — working towards a more enlightened and compassionate society.',
      btn1Text: 'EXPLORE OUR EVENTS',
      btn1Link: '/events',
      btn2Text: "LET'S CONNECT",
      btn2Link: '/lets-connect',
    },
  };

  const normalizeActivities = (cards) => {
    const filtered = (cards || []).filter(
      (c) =>
        c.id !== 'act-1' &&
        c.id !== 'act-2' &&
        !c.title?.toLowerCase().includes('sanjeevaraya') &&
        !c.title?.toLowerCase().includes('malleshwara')
    );

    const deviCard = filtered.find(
      (c) => c.title?.toLowerCase().includes('devi') || c.id === 'act-3'
    );
    const balviharCard = filtered.find(
      (c) =>
        c.title?.toLowerCase().includes('balvihar') ||
        c.title?.toLowerCase().includes('bhal') ||
        c.title?.toLowerCase().includes('balavihar') ||
        c.title?.toLowerCase().includes('chyk') ||
        c.title?.toLowerCase().includes('yuva') ||
        c.id === 'act-4' ||
        c.id === 'act-balvihar'
    );

    return [
      {
        ...defaultContent.ourActivities.cards[0],
        ...(deviCard || {}),
        id: 'act-3',
        title: 'DEVI GROUP',
        badge: 'DEVOTIONAL WING',
        iconName: 'Heart',
        imageUrl: '/assets/images/activity-devigroup.jpg',
        detailedInfo: defaultContent.ourActivities.cards[0].detailedInfo,
      },
      {
        ...defaultContent.ourActivities.cards[1],
        ...(balviharCard || {}),
        id: 'act-balvihar',
        title: 'BALVIHAR CLASSES',
        badge: 'CHILDREN’S WING • VALUE EDUCATION',
        featured: true,
        iconName: 'Users',
        imageUrl: '/assets/images/activity-balvihar.jpg',
        content: defaultContent.ourActivities.cards[1].content,
        detailedInfo: defaultContent.ourActivities.cards[1].detailedInfo,
      },
    ];
  };

  const filterLegacyHighlights = (items) => {
    const defaultHighlights = ['Knowledge', 'Devotion', 'Selfless Service', 'Youth', 'Community'];
    if (!Array.isArray(items) || items.length === 0) return defaultHighlights;
    const filtered = items.filter((item) => {
      if (!item) return false;
      const str = String(item).trim();
      return str !== '1992' && str !== '2001' && !/^\d+$/.test(str);
    });
    return filtered.length > 0 ? filtered : defaultHighlights;
  };

  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedActivity(null);
      }
    };
    if (selectedActivity) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedActivity]);

  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('cms_about_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.hero?.title?.toLowerCase().startsWith('about ')) {
          parsed.hero.title = parsed.hero.title.replace(/^about\s+/i, '').trim();
        }
        if (!parsed?.whoWeAre?.p1?.includes('Swamini Shyamananda')) {
          parsed.whoWeAre = { ...defaultContent.whoWeAre };
        }
        if (!parsed?.ourStory?.p1?.includes('Swamini Shyamananda')) {
          parsed.ourStory = { ...defaultContent.ourStory };
        }
        if (!parsed?.conclusion?.paragraph3 || parsed?.conclusion?.paragraph1?.includes('an important centre for spiritual development')) {
          parsed.conclusion = { ...defaultContent.conclusion };
        }
        if (parsed?.continuingLegacy?.highlights) {
          parsed.continuingLegacy.highlights = filterLegacyHighlights(parsed.continuingLegacy.highlights);
        }
        if (
          !parsed?.chykSection?.imageUrl ||
          parsed?.chykSection?.imageUrl?.includes('photo-1529156069898-49953e39b3ac') ||
          parsed?.chykSection?.imageUrl?.includes('youth-runners') ||
          parsed?.chykSection?.imageUrl?.includes('chyk-youth-team') ||
          parsed?.chykSection?.imageUrl !== '/assets/chyk-group.jpg'
        ) {
          parsed.chykSection = {
            ...parsed?.chykSection,
            heading: 'CHINMAYA YUVA KENDRA (CHYK), ADONI',
            p1: 'Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission, provides a platform for young people to explore spiritual knowledge, cultivate leadership qualities and participate in meaningful community initiatives.',
            p2: "CHYK, Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation through workshops and camps.",
            keywords: ['KNOWLEDGE', 'LEADERSHIP', 'DISCIPLINE', 'CONFIDENCE', 'SERVICE'],
            imageUrl: '/assets/chyk-group.jpg',
          };
        }
        if (parsed?.ourActivities) {
          parsed.ourActivities.cards = normalizeActivities(parsed.ourActivities.cards);
        }
        try {
          localStorage.setItem('cms_about_content', JSON.stringify(parsed));
        } catch (_) {}
        return parsed;
      }
    } catch (_) {}
    return null;
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('cms_about_content');
    } catch (_) {
      return true;
    }
  });

  const loadAboutContent = () => {
    webContentService
      .getPublicPage('chinmaya', 'about')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const pageData = res.data.data;
          const f = pageData.fieldsMap || {};
          const merged = { ...defaultContent };

          if (f.about_hero) {
            merged.hero = {
              ...merged.hero,
              title: f.about_hero.title || merged.hero.title,
              subtitle: f.about_hero.subtitle || merged.hero.subtitle,
              intro: f.about_hero.intro || merged.hero.intro,
              imageUrl: f.about_hero.imageUrl || merged.hero.imageUrl,
            };
          }
          if (f.who_we_are) {
            const rawP1 = f.who_we_are.p1 || merged.whoWeAre.p1;
            merged.whoWeAre = {
              ...merged.whoWeAre,
              heading: (f.who_we_are.heading || merged.whoWeAre.heading).replace(/WHO ARE WE\??/i, 'WHO WE ARE'),
              p1: rawP1.replace(/Swami Shyamananda/g, 'Swamini Shyamananda').replace(/Swami Sharadapriyananda/g, 'Swamini Sharadapriyananda'),
              p2: f.who_we_are.p2 || merged.whoWeAre.p2,
            };
          }
          if (f.our_story) {
            const rawP1 = f.our_story.p1 || merged.ourStory.p1;
            merged.ourStory = {
              ...merged.ourStory,
              heading: f.our_story.heading || merged.ourStory.heading,
              p1: rawP1.replace(/Swami Shyamananda/g, 'Swamini Shyamananda').replace(/Swami Sharadapriyananda/g, 'Swamini Sharadapriyananda'),
              timeline: f.our_story.items?.length
                ? f.our_story.items.map((item) => ({
                    year: item.dateOrYear || item.order || '',
                    title: item.title || '',
                    desc: (item.description || '').replace(/Swami Shyamananda/g, 'Swamini Shyamananda').replace(/Swami Sharadapriyananda/g, 'Swamini Sharadapriyananda'),
                  }))
                : merged.ourStory.timeline,
            };
          }
          if (f.chyk_section) {
            const rawChykImg = f.chyk_section.imageUrl;
            const chykImg = (!rawChykImg || rawChykImg.includes('photo-1529156069898-49953e39b3ac') || rawChykImg.includes('youth-runners') || rawChykImg.includes('chyk-youth-team'))
              ? '/assets/chyk-group.jpg'
              : rawChykImg;

            merged.chykSection = {
              ...merged.chykSection,
              heading: f.chyk_section.heading || 'CHINMAYA YUVA KENDRA (CHYK), ADONI',
              p1: f.chyk_section.p1 || merged.chykSection.p1,
              p2: f.chyk_section.p2 || "CHYK, Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation through workshops and camps.",
              imageUrl: chykImg,
            };
          }
          if (f.spirituality_in_action) {
            merged.spiritualityInAction = {
              ...merged.spiritualityInAction,
              heading: f.spirituality_in_action.heading || merged.spiritualityInAction.heading,
              content: f.spirituality_in_action.content || merged.spiritualityInAction.content,
              imageUrl: f.spirituality_in_action.imageUrl || merged.spiritualityInAction.imageUrl,
            };
          }
          if (f.continuing_legacy) {
            merged.continuingLegacy = {
              ...merged.continuingLegacy,
              heading: f.continuing_legacy.heading || merged.continuingLegacy.heading,
              content: f.continuing_legacy.content || merged.continuingLegacy.content,
            };
          }
          if (f.our_vision) {
            merged.ourVision = {
              ...merged.ourVision,
              heading: f.our_vision.heading || merged.ourVision.heading,
              quote: f.our_vision.quote || merged.ourVision.quote,
            };
          }
          if (f.our_mission) {
            merged.ourMission = {
              ...merged.ourMission,
              heading: f.our_mission.heading || merged.ourMission.heading,
              items: f.our_mission.items?.length
                ? f.our_mission.items.map((item) => ({
                    id: item.itemId || item._id,
                    title: item.title,
                    description: item.description,
                    iconName: item.subtitle || 'Sparkles',
                  }))
                : merged.ourMission.items,
            };
          }
          if (f.closing_cta) {
            merged.closingCta = {
              ...merged.closingCta,
              title: f.closing_cta.title || merged.closingCta.title,
              subtext: f.closing_cta.subtext || merged.closingCta.subtext,
              btn1Text: f.closing_cta.btn1Text || merged.closingCta.btn1Text,
              btn1Link: f.closing_cta.btn1Link || merged.closingCta.btn1Link,
              btn2Text: f.closing_cta.btn2Text || merged.closingCta.btn2Text,
              btn2Link: f.closing_cta.btn2Link || merged.closingCta.btn2Link,
            };
          }

          if (merged?.ourActivities) {
            merged.ourActivities.cards = normalizeActivities(merged.ourActivities?.cards);
          }
          if (merged?.continuingLegacy?.highlights) {
            merged.continuingLegacy.highlights = filterLegacyHighlights(merged.continuingLegacy.highlights);
          }

          setContent(merged);
          try {
            localStorage.setItem('cms_about_content', JSON.stringify(merged));
          } catch (_) {}
          setLoading(false);
          return;
        }
        throw new Error('No page data returned');
      })
      .catch(() => {
        contentService
          .getContent('about_page')
          .then((res) => {
            if (res.data?.success && res.data?.data) {
              const apiData = res.data.data;
              const merged = { ...defaultContent, ...apiData };
              if (merged?.chykSection) {
                merged.chykSection.imageUrl = '/assets/chyk-group.jpg';
                merged.chykSection.heading = 'CHINMAYA YUVA KENDRA (CHYK), ADONI';
                merged.chykSection.p2 = "CHYK, Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation through workshops and camps.";
              }
              if (merged?.ourActivities) {
                merged.ourActivities.cards = normalizeActivities(merged.ourActivities?.cards);
              }
              if (merged?.continuingLegacy?.highlights) {
                merged.continuingLegacy.highlights = filterLegacyHighlights(merged.continuingLegacy.highlights);
              }
              setContent(merged);
              try {
                localStorage.setItem('cms_about_content', JSON.stringify(merged));
              } catch (_) {}
            } else {
              setContent((prev) => prev || defaultContent);
            }
          })
          .catch(() => setContent((prev) => prev || defaultContent))
          .finally(() => setLoading(false));
      });
  };

  useEffect(() => {
    document.title = 'Chinmaya Mission Adoni';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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

  const data = { ...defaultContent, ...content };

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
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <ActivityIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen pb-12 space-y-8 sm:space-y-10">
      {/* 1. ABOUT HERO SECTION */}
      <section className="relative pt-2 sm:pt-3 pb-3 px-4 sm:px-8 lg:px-12 w-full overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Title & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-widest uppercase border border-[var(--orange)]/30 shadow-sm">
              <Flame className="w-4 h-4 text-[var(--orange)] animate-pulse" />
              <span>CHINMAYA MISSION ADONI • EST. 2001</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-[var(--text-primary)] leading-[1.1]">
              {(() => {
                const rawTitle = (data.hero?.title || 'CHINMAYA MISSION ADONI')
                  .replace(/^ABOUT\s+/i, '')
                  .replace(/,\s*Adoni/gi, ' ADONI')
                  .trim();
                return /adoni/i.test(rawTitle) ? rawTitle : `${rawTitle} ADONI`;
              })()}
            </h1>

            <p className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-[var(--orange)] via-[var(--yellow)] to-[var(--orange)] bg-clip-text text-transparent">
              {data.hero.subtitle}
            </p>

            <p className="text-base sm:text-lg text-[var(--text-muted)] font-medium leading-relaxed max-w-2xl">
              "{data.hero.intro}"
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a href="#our-milestones" className="btn-primary py-3.5 px-7 text-sm font-extrabold text-decoration-none shadow-xl">
                <span>EXPLORE OUR MILESTONES</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <Link to="/events" className="btn-secondary py-3.5 px-7 text-sm font-extrabold text-decoration-none">
                <span>OUR EVENTS</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Organization Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl group hover:border-[var(--orange)] transition-colors duration-500">
              <img
                src={data.hero.imageUrl}
                alt="Chinmaya Mission Visual"
                className="w-full h-80 sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE SECTION */}
      <section id="who-we-are" className="w-full px-4 sm:px-8 lg:px-12 scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
                {(data.whoWeAre.heading || 'WHO WE ARE').replace(/WHO ARE WE\??/i, 'WHO WE ARE')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Pujya Gurudev Swami Chinmayananda Image */}
            <div className="lg:col-span-5">
              <div className="relative group overflow-hidden rounded-2xl border border-[rgba(11,35,64,0.1)] bg-gradient-to-b from-[#fbf8f3] to-white shadow-md">
                <div className="relative w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src="/assets/swami-chinmayananda-full.png"
                    alt="Pujya Gurudev Swami Chinmayananda"
                    className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/leadership/swami-chinmayananda.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--orange)]/90 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1 shadow-sm">
                      Pujya Gurudev
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-heading leading-tight drop-shadow-sm text-white">
                      Swami Chinmayananda
                    </h3>
                    <p className="text-xs text-white/80 font-medium mt-0.5">
                      Visionary & Founder of Chinmaya Mission
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Existing Content */}
            <div className="lg:col-span-7 space-y-5 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-normal">
              <p className="p-5 sm:p-6 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm">
                {data.whoWeAre.p1}
              </p>
              {data.whoWeAre.p2 && data.whoWeAre.p2.trim() !== '' && data.whoWeAre.p2 !== data.whoWeAre.p1 && (
                <p className="p-5 sm:p-6 rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-sm">
                  {data.whoWeAre.p2}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR MILESTONES (INTERACTIVE ROAD JOURNEY THROUGH TIME) */}
      <div className="!mt-4 sm:!mt-6">
        <MilestoneJourney />
      </div>

      {/* 4. OUR VISION SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
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


          </div>
        </div>
      </section>

      {/* 5. OUR MISSION SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[var(--text-primary)] tracking-tight">
            {data.ourMission.heading}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] font-medium">
            Guiding individuals towards self-transformation, service, and youth empowerment.
          </p>
        </div>

        {/* All 5 Mission Items in One Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-5 w-full items-stretch">
          {data.ourMission.items.map((item, index) => (
            <div
              key={item.id || index}
              className="p-5 sm:p-6 lg:p-5 xl:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-[var(--orange)]/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-full w-full"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {getMissionIcon(item.iconName)}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] font-heading mb-2 group-hover:text-[var(--orange)] transition-colors leading-snug uppercase tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. OUR ACTIVITIES SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[var(--text-primary)] tracking-tight">
            {data.ourActivities.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {data.ourActivities.intro}
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full items-stretch">
          {(data.ourActivities?.cards || [])
            .filter(
              (card) =>
                card.id !== 'act-1' &&
                card.id !== 'act-2' &&
                !card.title?.toLowerCase().includes('sanjeevaraya') &&
                !card.title?.toLowerCase().includes('malleshwara')
            )
            .map((card) => {
              const isDevi = card.id === 'act-3' || card.title?.toLowerCase().includes('devi');
              const fallbackImg = isDevi
                ? '/assets/images/activity-devigroup.jpg'
                : '/assets/images/activity-balvihar.jpg';
              const cardImgSrc = isDevi
                ? '/assets/images/activity-devigroup.jpg'
                : (card.imageUrl && !card.imageUrl.includes('activity-chyk') ? card.imageUrl : '/assets/images/activity-balvihar.jpg');

              return (
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
                      src={cardImgSrc}
                      alt={card.title}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
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

                  {/* Card Body with Consistent Padding & Structured Flow */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1 text-left">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 group-hover:bg-[var(--orange)] group-hover:text-white transition-colors duration-300">
                        {getActivityIcon(card.iconName)}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-extrabold font-heading text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors leading-snug uppercase tracking-wide">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 mb-6 font-normal">
                      {card.content}
                    </p>

                    {/* Bottom Action Button: Know More */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          const isDevi = card.id === 'act-3' || card.title?.toLowerCase().includes('devi');
                          const fallbackDef = isDevi
                            ? defaultContent.ourActivities.cards[0]
                            : defaultContent.ourActivities.cards[1];
                          setSelectedActivity({
                            ...fallbackDef,
                            ...card,
                            imageUrl: cardImgSrc,
                            detailedInfo: card.detailedInfo || fallbackDef.detailedInfo,
                          });
                        }}
                        className="btn-secondary w-full justify-center text-sm py-3 px-4 font-bold shadow-sm rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      >
                        <span>Know More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      {/* 7. CHINMAYA YUVA KENDRA (CHYK) SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-10 relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
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
              <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--orange)] shadow-2xl group bg-slate-900 flex items-center justify-center h-80 sm:h-[400px]">
                <img
                  src={data.chykSection?.imageUrl || '/assets/chyk-group.jpg'}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-110 pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/chyk-group.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <img
                  src={data.chykSection?.imageUrl || '/assets/chyk-group.jpg'}
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

      {/* 9. CONTINUING THE LEGACY SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
              {data.continuingLegacy.heading}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {data.continuingLegacy.content}
            </p>
          </div>

          {/* Key Values Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
            {filterLegacyHighlights(data.continuingLegacy?.highlights).map((item, idx) => (
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
      <section className="w-full px-4 sm:px-8 lg:px-12 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[var(--orange)] via-[#E64A19] to-[var(--orange)] text-white shadow-2xl space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight whitespace-pre-line leading-tight">
              {data.closingCta.title}
            </h2>

            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {data.closingCta.subtext}
            </p>
          </div>
        </div>
      </section>

      {/* Activity Details Modal Popup */}
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setSelectedActivity(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative my-auto flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Area: Full uncropped presentation */}
            <div className="relative w-full h-56 sm:h-72 md:h-80 bg-slate-950 shrink-0 overflow-hidden flex items-center justify-center p-3 sm:p-4 border-b border-slate-100">
              <img
                src={
                  selectedActivity.title?.toLowerCase().includes('devi')
                    ? '/assets/images/activity-devigroup.jpg'
                    : '/assets/images/activity-balvihar.jpg'
                }
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
              />

              <img
                src={
                  selectedActivity.title?.toLowerCase().includes('devi')
                    ? '/assets/images/activity-devigroup.jpg'
                    : '/assets/images/activity-balvihar.jpg'
                }
                alt={selectedActivity.title}
                className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-md block"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/75 hover:bg-black text-white transition-colors z-30 backdrop-blur-md cursor-pointer shadow-lg border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Floating Badges */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
                {selectedActivity.badge && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[var(--orange)] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    {selectedActivity.badge}
                  </span>
                )}
                {selectedActivity.detailedInfo?.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold shadow-lg border border-white/15">
                    <MapPin className="w-3.5 h-3.5 text-[var(--orange)]" />
                    <span>{selectedActivity.detailedInfo.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Modal Content */}
            {(() => {
              const isDevi = selectedActivity.title?.toLowerCase().includes('devi');
              const fallbackDef = isDevi
                ? defaultContent.ourActivities.cards[0]
                : defaultContent.ourActivities.cards[1];
              const details = selectedActivity.detailedInfo || fallbackDef.detailedInfo;

              return (
                <div className="p-6 sm:p-8 space-y-6 text-left overflow-y-auto max-h-[calc(92vh-220px)]">
                  {/* Header Title */}
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-9 h-9 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0">
                        {getActivityIcon(selectedActivity.iconName || fallbackDef.iconName)}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)] uppercase tracking-tight m-0">
                        {details?.title || selectedActivity.title}
                      </h2>
                    </div>
                    {details?.subtitle && (
                      <p className="text-xs sm:text-sm font-semibold text-[var(--orange)] tracking-wide uppercase mt-1">
                        {details.subtitle}
                      </p>
                    )}
                    {details?.schedule && (
                      <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{details.schedule}</span>
                      </p>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-slate-700 text-sm sm:text-base leading-relaxed">
                    {selectedActivity.content || fallbackDef.content}
                  </div>

                  {/* Detailed Sections */}
                  {details?.sections?.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-[var(--orange)] shrink-0" />
                        <h3 className="text-base sm:text-lg font-extrabold font-heading text-[var(--text-primary)] m-0">
                          {section.heading}
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
              );
            })()}

            {/* Modal Footer without Join / Enquire */}
            <div className="px-6 sm:px-8 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 shrink-0">
              <span className="truncate">Chinmaya Mission, Adoni</span>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="px-5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChinmayaMissionAdoniPage;
