import User from '../models/User.js';
import EventConfig from '../models/EventConfig.js';
import Institution from '../models/Institution.js';
import Banner from '../models/Banner.js';
import Activity from '../models/Activity.js';
import FAQ from '../models/FAQ.js';
import PageContent from '../models/PageContent.js';
import HomePage from '../models/HomePage.js';
import Footer from '../models/Footer.js';
import Media from '../models/Media.js';
import { defaultFooterConfig } from '../controllers/footerController.js';

export const adoniInstitutionsList = [
  'Stonehill International School',
  'Stonehill EM High School',
  'Bhasyam Public School',
  'Narayana E-Techno School',
  'Sri Chaitanya School',
  'Chinmaya Vidyalaya',
  'Roots Global School (CBSE)',
  'Plaksha World of School',
  'Plaksha Kids World School',
  'Kiddys Global School',
  "Kiddy's High School",
  'Kiddys E-Techno School',
  "St. Joseph's High School",
  "St. Joseph's Convent",
  'Amaravati International School',
  'Narendra English Medium School',
  'Alfa English Medium School',
  'Mohammed Ali English Medium School',
  'National English Medium School',
  'National School',
  'Sri Sarada Niketan High School',
  'Milton Grammar English Medium High School',
  'Shelly English Medium High School',
  'Akshara Sree English Medium High School',
  'Emile Curriculum English Medium School',
  'Sri Vidya English Medium High School',
  'Sri Balaji Vidya Niketan',
  'Sri Balaji Vidyaniketan School',
  'Jawaher English Medium High School',
  'The Elahi English Medium School',
  'Annunya Juniors English Medium School',
  'Aruna Primary School',
  'Kidzee Preschool',
  'Makoons Play School',
  'Smartkidz Play School',
  'Sri Vidya Day and Residential High School',
  'Sri Jiheswara Vidyalaya',
  'Sanskriti Global Preschool - Adoni',
  'Mithram Nurture Preschool',
  'Little Angels Montessori School',
  'Times Primary School (Times.PS.EM.Adoni)',
  'Sri Chaitanya EM UP School',
  'Akshara Sree English Medium Primary School',
  'C. Mallikarjuna Vidyalayam',
  'Sri Vidya EM T.M. School',
  'Vivekananda Junior College Adoni',
  'Yale Malleshappa Kannada High School',
  'Shelley English Medium High School',
  'Bhasyam School',
  'Kiddiez Global School',
  'Sri Vidya High School',
];

export const seedInitialData = async () => {
  try {
    // 1. Admin User
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        fullName: 'Chinmaya Admin',
        email: 'admin@anti-drug-marathon.org',
        phone: '9876543210',
        password: 'adminpassword123',
        role: 'admin',
      });
      console.log('[Seed] Default admin created: admin@anti-drug-marathon.org / adminpassword123');
    }

    // 2. Event Config
    const configExists = await EventConfig.findOne();
    if (!configExists) {
      await EventConfig.create({
        programName: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
        slogan: 'YOUR LIFE. YOUR CHOICE.',
        subSlogan: 'Run for a Drug-Free Future',
        location: 'Adoni, Andhra Pradesh, India',
        venue: 'Chinmaya Mission Adoni',
        eventDate: new Date('2026-12-20T06:00:00.000+05:30'),
        eventTime: '6:00 AM onwards',
        organizers: ['Chinmaya Mission Adoni', 'Chinmaya Yuva Kendra Adoni'],
        registrationOpen: true,
      });
      console.log('[Seed] Event configuration initialized.');
    }

    // 3. Institutions
    const instCount = await Institution.countDocuments();
    if (instCount === 0) {
      const docs = adoniInstitutionsList.map((name) => ({
        name,
        type: name.includes('College') ? 'COLLEGE' : 'SCHOOL',
        city: 'Adoni',
      }));
      await Institution.insertMany(docs);
      console.log(`[Seed] ${docs.length} Adoni institutions seeded.`);
    }

    // 4. Initial Banners (Poster styling inspired SVGs / default URLs)
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.create([
        {
          title: 'Hero Main Horizontal Banner',
          imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
          publicId: 'hero_main_horiz',
          bannerType: 'HORIZONTAL',
          active: true,
          order: 1,
        },
        {
          title: 'Vertical Poster 1 - Say No to Drugs',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_1',
          bannerType: 'VERTICAL',
          active: true,
          order: 1,
        },
        {
          title: 'Vertical Poster 2 - Youth Power Adoni',
          imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_2',
          bannerType: 'VERTICAL',
          active: true,
          order: 2,
        },
        {
          title: 'Vertical Poster 3 - Health & Discipline',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_3',
          bannerType: 'VERTICAL',
          active: true,
          order: 3,
        },
        {
          title: 'Vertical Poster 4 - Chinmaya Mission Movement',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_4',
          bannerType: 'VERTICAL',
          active: true,
          order: 4,
        },
        {
          title: 'Vertical Poster 5 - Brighter Future Adoni',
          imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_5',
          bannerType: 'VERTICAL',
          active: true,
          order: 5,
        },
      ]);
      console.log('[Seed] Default banners created.');
    }

    // 5. Initial Activities
    const activityCount = await Activity.countDocuments();
    if (activityCount === 0) {
      await Activity.create([
        {
          title: 'Youth Marathon Prep Bootcamps',
          category: 'Marathon Training',
          description: 'Weekly morning running sessions and endurance training across Adoni schools and colleges.',
          imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_1',
          active: true,
          order: 1,
        },
        {
          title: 'School Anti-Drug Oath & Pledge',
          category: 'School Drive',
          description: 'Interactive student rallies and pledge signatures taking place in 50+ Adoni institutions.',
          imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_2',
          active: true,
          order: 2,
        },
        {
          title: 'Mind & Body Wellness Seminars',
          category: 'Fitness & Wellness',
          description: 'Guided meditation, stress management and yoga sessions organized by Chinmaya Yuva Kendra.',
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_3',
          active: true,
          order: 3,
        },
        {
          title: 'Adoni Torch Relay & Street Rallies',
          category: 'Awareness Campaign',
          description: 'Torch relay highlighting positive choices, sports culture, and freedom from addiction.',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_4',
          active: true,
          order: 4,
        },
      ]);
      console.log('[Seed] Activities gallery seeded.');
    }

    // 6. Initial FAQs
    const defaultFaqsList = [
      {
        question: 'When and where is the Anti-Drug Marathon Run 2026?',
        answer: 'The event will take place on Sunday, 20 December 2026, starting at 6:00 AM from Chinmaya Mission Adoni, Andhra Pradesh.',
        order: 1,
      },
      {
        question: 'Who can participate in the marathon?',
        answer: 'The marathon is open to everyone! Students from schools and colleges, working professionals, families, and senior citizens in Adoni are all encouraged to join.',
        order: 2,
      },
      {
        question: 'Is there an entry fee for registration?',
        answer: 'Registration is free for all , Anyone can particpate .',
        order: 3,
      },
      {
        question: 'How can schools and colleges submit registrations?',
        answer: 'Institutions can visit the Registration page, select "School & College Registration", download the template, upload student details, and submit in one single step.',
        order: 4,
      },
      {
        question: 'Will certificates be provided to participants?',
        answer: 'Yes! physical certificates will be given after the completion of the run.',
        order: 5,
      },
    ];

    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      await FAQ.create(defaultFaqsList);
      console.log('[Seed] FAQs seeded.');
    } else {
      // Update existing FAQ entries in MongoDB if present
      for (const item of defaultFaqsList) {
        await FAQ.findOneAndUpdate(
          { order: item.order },
          { question: item.question, answer: item.answer },
          { upsert: true }
        );
      }
      console.log('[Seed] FAQs updated with latest text.');
    }

    // 7. Initial PageContent for About Page
    const aboutContent = await PageContent.findOne({ sectionKey: 'about_page' });
    if (!aboutContent) {
      await PageContent.create({
        sectionKey: 'about_page',
        content: {
          hero: {
            title: 'ABOUT CHINMAYA MISSION ADONI',
            subtitle: 'Timeless Wisdom. Inspired Youth. Meaningful Service.',
            intro: 'Chinmaya Mission Adoni is a spiritual and cultural organisation dedicated to sharing timeless wisdom, nurturing human values and inspiring individuals to lead purposeful lives.',
            imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop'
          },
          whoWeAre: {
            heading: 'WHO ARE WE?',
            p1: 'Chinmaya Mission Adoni is a spiritual and cultural organisation established in 2001 and inaugurated by Pujya Swami Tejomayananda. As part of the global Chinmaya Mission movement founded by Pujya Gurudev Swami Chinmayananda, we are dedicated to sharing the timeless wisdom of Vedanta and the Bhagavad Gita, inspiring individuals to lead lives rooted in knowledge, values and selfless service.',
            p2: 'We believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.',
            highlights: [
              { label: 'ESTABLISHED', value: '2001' },
              { label: 'INAUGURATED BY', value: 'Pujya Swami Tejomayananda' },
              { label: 'ROOTED IN', value: 'Vedanta & Bhagavad Gita' }
            ]
          },
          ourStory: {
            heading: 'OUR STORY',
            p1: 'Established in 2001 and inaugurated by Pujya Swami Tejomayananda, Chinmaya Mission Adoni is part of the global Chinmaya Mission movement founded by Pujya Gurudev Swami Chinmayananda. Rooted in the timeless wisdom of Vedanta and the teachings of the Bhagavad Gita, the Mission is dedicated to nurturing spiritual growth, strengthening human values and inspiring individuals to lead purposeful lives.',
            p2: 'Since its inception, Chinmaya Mission Adoni has sought to bring the light of spiritual knowledge and Indian cultural heritage to the local community. Through spiritual learning, cultural activities, youth engagement and community service, the Mission strives to make ancient wisdom meaningful and relevant to contemporary life.',
            timeline: [
              { year: '2001', title: 'Establishment of Chinmaya Mission Adoni', desc: 'Inaugurated by Pujya Swami Tejomayananda to bring Vedanta to Adoni.' },
              { year: '2005', title: 'Spiritual & Cultural Growth', desc: 'Expanding study groups, spiritual discourses, and cultural programs.' },
              { year: '2012', title: 'Youth Engagement & CHYK', desc: 'Empowering youth through leadership camps, forums, and sports.' },
              { year: '2018', title: 'Community Service Initiatives', desc: 'Organizing medical camps, educational drives, and social service.' },
              { year: '2026', title: 'Continuing Legacy & Anti-Drug Movement', desc: 'Inspiring youth to run for a drug-free, healthy tomorrow.' }
            ]
          },
          ourVision: {
            heading: 'OUR VISION',
            quote: 'To inspire individuals to discover their inner potential, live by universal values and contribute positively to society through knowledge, compassion and selfless service.'
          },
          ourMission: {
            heading: 'OUR MISSION',
            items: [
              {
                id: 'item-1',
                title: 'SPIRITUAL GROWTH',
                description: 'Sharing the wisdom of Vedanta and the Bhagavad Gita to encourage self-understanding and spiritual development.',
                iconName: 'BookOpen'
              },
              {
                id: 'item-2',
                title: 'YOUTH EMPOWERMENT',
                description: 'Guiding young people towards leadership, discipline, confidence and character building.',
                iconName: 'Zap'
              },
              {
                id: 'item-3',
                title: 'CULTURAL ENRICHMENT',
                description: "Preserving and promoting India's spiritual and cultural heritage through meaningful programmes and celebrations.",
                iconName: 'Sparkles'
              },
              {
                id: 'item-4',
                title: 'COMMUNITY SERVICE',
                description: 'Encouraging selfless service and initiatives that contribute to the welfare of society.',
                iconName: 'HeartHandshake'
              },
              {
                id: 'item-5',
                title: 'HOLISTIC DEVELOPMENT',
                description: 'Integrating timeless spiritual wisdom with practical living to nurture responsible, compassionate and well-rounded individuals.',
                iconName: 'Compass'
              }
            ]
          },
          chykSection: {
            heading: 'CHINMAYA YUVA KENDRA (CHYK) ADONI',
            p1: 'Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission, provides a platform for young people to explore spiritual knowledge, cultivate leadership qualities and participate in meaningful community initiatives.',
            p2: "CHYK Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation. Through youth-led programmes, interactive activities, cultural initiatives and service-oriented projects, it encourages young people to become responsible leaders who combine knowledge with action and personal growth with social responsibility.",
            keywords: ['KNOWLEDGE', 'LEADERSHIP', 'DISCIPLINE', 'CONFIDENCE', 'SERVICE'],
            imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop'
          },
          spiritualityInAction: {
            heading: 'SPIRITUALITY IN ACTION',
            content: 'At Chinmaya Mission Adoni, spirituality extends beyond individual practice into actions that benefit the wider community. The Mission seeks to bring people together through spiritual learning, cultural engagement, festivals and service initiatives, fostering a spirit of unity, compassion and collective responsibility.',
            flow: ['KNOWLEDGE', 'ACTION', 'SERVICE', 'COMMUNITY'],
            imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
          },
          ourActivities: {
            heading: 'OUR ACTIVITIES',
            intro: 'At Chinmaya Mission Adoni, our activities bring together spirituality, devotion, cultural values, youth development and selfless service. Through our temples and dedicated groups, we strive to nurture spiritual awareness, strengthen community bonds and inspire individuals of all ages to live by timeless values.',
            cards: [
              {
                id: 'act-1',
                title: 'CHINMAYA SANJEEVARAYA TEMPLE',
                content: 'Dedicated to devotion and spiritual practice, Chinmaya Sanjeevaraya Temple serves as a place for worship, prayer and the observance of religious traditions. Through devotional activities and spiritual gatherings, the temple seeks to nurture faith, preserve cultural heritage and bring the community together.',
                imageUrl: '/assets/images/activity-sanjeevaraya.png',
                badge: 'SPIRITUAL TEMPLE'
              },
              {
                id: 'act-2',
                title: 'SHANTA MALLESHWARA TEMPLE',
                content: 'Shanta Malleshwara Temple is an important centre of worship and devotion associated with Chinmaya Mission Adoni. The temple provides a space for devotees to participate in religious observances, festivals and spiritual activities, fostering a sense of unity, devotion and community service.',
                imageUrl: '/assets/images/activity-shantamalleshwara.webp',
                badge: 'SACRED CENTRE'
              },
              {
                id: 'act-3',
                title: 'DEVI GROUP',
                content: "The Devi Group is dedicated to nurturing devotion, spiritual understanding and the preservation of cultural values. Through devotional gatherings, spiritual learning and collective participation in traditional activities, the group encourages members to deepen their spiritual connection and contribute to the Mission's broader vision.",
                imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
                badge: 'DEVOTIONAL WING'
              },
              {
                id: 'act-4',
                title: 'CHINMAYA YUVA KENDRA (CHYK)',
                content: 'Chinmaya Yuva Kendra (CHYK) is the youth wing of Chinmaya Mission, providing a platform for young people to grow spiritually, develop leadership skills and engage in meaningful community initiatives. CHYK Adoni encourages young minds to discover their potential and apply the wisdom of Indian philosophy to modern-day life. Through youth programmes, cultural activities, interactive initiatives and social service, CHYK inspires young people to become responsible leaders guided by knowledge, discipline, confidence and compassion.',
                imageUrl: '/assets/images/activity-chyk.jpg',
                badge: 'YOUTH WING',
                featured: true
              }
            ]
          },
          continuingLegacy: {
            heading: 'CONTINUING THE LEGACY',
            content: 'Since its inauguration in 2001 by Pujya Swami Tejomayananda, Chinmaya Mission Adoni has been part of the continuing effort to share the vision and teachings of Pujya Gurudev Swami Chinmayananda. Guided by the principles of knowledge, devotion and selfless service, the Mission aspires to inspire individuals, empower youth and contribute to the spiritual and cultural enrichment of Adoni.',
            highlights: ['2001', 'Knowledge', 'Devotion', 'Selfless Service', 'Youth', 'Community']
          },
          closingCta: {
            title: 'Timeless Wisdom.\nInspired Youth.\nMeaningful Service.',
            subtext: 'We are a community united by knowledge, strengthened by values and inspired by selfless service — working towards a more enlightened and compassionate society.',
            btn1Text: 'EXPLORE OUR ACTIVITIES',
            btn1Link: '/activities',
            btn2Text: "LET'S CONNECT",
            btn2Link: '/lets-connect'
          }
        }
      });
      console.log('[Seed] Default About Page content seeded.');
    }

    // 8. Initial HomePage CMS Configuration
    const homePageExists = await HomePage.findOne();
    if (!homePageExists) {
      await HomePage.create({
        isEnabled: true,
        disabledTitle: 'Website Updates In Progress',
        disabledMessage: 'The public homepage is currently undergoing scheduled updates. Please check back soon!',
        disabledImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
        disabledContactButton: true,
        disabledContactUrl: '/lets-connect',
        theme: {
          primaryColor: '#0B2340',
          secondaryColor: '#FFF8EC',
          accentColor: '#F4511E',
          backgroundColor: '#FFF8EC',
          textColor: '#0B2340',
          buttonColor: '#F4511E',
          buttonHoverColor: '#D84315',
          cardBackgroundColor: '#FFFFFF',
          headingColor: '#0B2340',
        },
        sections: [
          {
            sectionId: 'hero-1',
            type: 'hero',
            title: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
            subtitle: '"YOUR LIFE. YOUR CHOICE."',
            description: 'Run for a Drug-Free Future • Join Thousands of Youth in Adoni Building Health, Strength & Discipline',
            badgeText: 'CHINMAYA MISSION ADONI & CHYK ADONI',
            primaryButtonText: 'REGISTER NOW',
            primaryButtonLink: '/register',
            secondaryButtonText: 'EXPLORE THE MOVEMENT',
            secondaryButtonLink: '#about',
            imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
            isEnabled: true,
            order: 1,
          },
          {
            sectionId: 'marathon-1',
            type: 'marathon',
            title: 'EVENT DETAILS & COUNTDOWN',
            subtitle: 'Sunday, 20 December 2026 • 6:00 AM Onwards',
            description: 'Starting from Chinmaya Mission Adoni, Andhra Pradesh.',
            badgeText: 'EVENT INFORMATION',
            primaryButtonText: 'REGISTER FOR MARATHON',
            primaryButtonLink: '/register',
            isEnabled: true,
            order: 2,
          },

          {
            sectionId: 'activities-1',
            type: 'activities',
            title: 'MOVEMENT ACTIVITIES & HIGHLIGHTS',
            subtitle: 'GALLERY & HIGHLIGHTS',
            description: 'Explore community drives, bootcamps, wellness seminars, and youth initiatives.',
            primaryButtonText: 'VIEW ALL ACTIVITIES',
            primaryButtonLink: '/activities',
            isEnabled: true,
            order: 4,
          },
          {
            sectionId: 'faq-1',
            type: 'faq',
            title: 'FREQUENTLY ASKED QUESTIONS',
            subtitle: 'QUESTIONS & ANSWERS',
            description: 'Everything you need to know about participating, registrations, certificates, and event details.',
            isEnabled: true,
            order: 5,
          },
          {
            sectionId: 'cta-1',
            type: 'cta',
            title: 'BE PART OF THE MOVEMENT IN ADONI!',
            subtitle: 'CHINMAYA MISSION & CHYK ADONI',
            description: 'Register today individually or submit your school/college bulk student details. Receive your official marathon certificate & pass!',
            primaryButtonText: 'MARATHON REGISTRATION',
            primaryButtonLink: '/register',
            isEnabled: true,
            order: 6,
          },
        ],
      });
      console.log('[Seed] Default HomePage CMS configuration created.');
    }

    // 9. Initial Footer CMS Configuration
    const footerExists = await Footer.findOne();
    if (!footerExists) {
      await Footer.create(defaultFooterConfig);
      console.log('[Seed] Default Footer CMS configuration created.');
    }

    // 10. Centralized Media Library Assets Seeding
    const mediaCount = await Media.countDocuments();
    if (mediaCount === 0) {
      const initialMediaList = [
        {
          fileName: 'hero_main_horiz.jpg',
          originalFileName: 'hero_marathon_banner.jpg',
          title: 'Hero Main Horizontal Banner',
          description: 'Main horizontal hero banner image for the Anti-Drug Movement Marathon 2026.',
          caption: 'YOUR LIFE. YOUR CHOICE. — Anti-Drug Movement 2026',
          altText: 'Anti-Drug Movement Marathon Run 2026 Hero Banner',
          url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
          publicId: 'hero_main_horiz',
          mimeType: 'image/jpeg',
          fileSize: 245000,
          width: 1600,
          height: 900,
          category: 'Banner',
          page: 'Home',
          section: 'Hero Banner',
          tags: ['hero', 'marathon', 'banner', 'home'],
          status: 'ACTIVE',
          displayOrder: 1,
          usedIn: [{ page: 'Home', section: 'Hero Section', component: 'Banner' }],
        },
        {
          fileName: 'vert_poster_1.jpg',
          originalFileName: 'say_no_to_drugs.jpg',
          title: 'Vertical Poster 1 - Say No to Drugs',
          description: 'Vertical carousel poster highlighting youth sports culture and clean living.',
          caption: 'Say No to Drugs • Choose Health & Purpose',
          altText: 'Say No to Drugs Poster - Anti-Drug Movement Adoni',
          url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_1',
          mimeType: 'image/jpeg',
          fileSize: 185000,
          width: 800,
          height: 1200,
          category: 'Banner',
          page: 'Home',
          section: 'Vertical Poster Carousel',
          tags: ['poster', 'vertical', 'youth', 'marathon'],
          status: 'ACTIVE',
          displayOrder: 2,
          usedIn: [{ page: 'Home', section: 'Vertical Carousel', component: 'Banner' }],
        },
        {
          fileName: 'vert_poster_2.jpg',
          originalFileName: 'youth_power_adoni.jpg',
          title: 'Vertical Poster 2 - Youth Power Adoni',
          description: 'Vertical poster celebrating youth participation and athletic strength.',
          caption: 'Youth Power Adoni — Building a Drug-Free Future',
          altText: 'Youth Power Adoni - Anti-Drug Movement',
          url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_2',
          mimeType: 'image/jpeg',
          fileSize: 192000,
          width: 800,
          height: 1200,
          category: 'Banner',
          page: 'Home',
          section: 'Vertical Poster Carousel',
          tags: ['poster', 'vertical', 'sports', 'youth'],
          status: 'ACTIVE',
          displayOrder: 3,
          usedIn: [{ page: 'Home', section: 'Vertical Carousel', component: 'Banner' }],
        },
        {
          fileName: 'vert_poster_3.jpg',
          originalFileName: 'health_discipline.jpg',
          title: 'Vertical Poster 3 - Health & Discipline',
          description: 'Vertical poster inspiring health, fitness, and self-discipline.',
          caption: 'Health & Discipline for Adoni Youth',
          altText: 'Health & Discipline - Marathon Training',
          url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_3',
          mimeType: 'image/jpeg',
          fileSize: 178000,
          width: 800,
          height: 1200,
          category: 'Banner',
          page: 'Home',
          section: 'Vertical Poster Carousel',
          tags: ['poster', 'vertical', 'fitness'],
          status: 'ACTIVE',
          displayOrder: 4,
          usedIn: [{ page: 'Home', section: 'Vertical Carousel', component: 'Banner' }],
        },
        {
          fileName: 'vert_poster_4.jpg',
          originalFileName: 'chinmaya_movement.jpg',
          title: 'Vertical Poster 4 - Chinmaya Mission Movement',
          description: 'Vertical poster showcasing Chinmaya Yuva Kendra youth initiative.',
          caption: 'Chinmaya Mission & CHYK Adoni Movement',
          altText: 'Chinmaya Mission Movement Adoni',
          url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_4',
          mimeType: 'image/jpeg',
          fileSize: 204000,
          width: 800,
          height: 1200,
          category: 'Banner',
          page: 'Home',
          section: 'Vertical Poster Carousel',
          tags: ['poster', 'vertical', 'chinmaya'],
          status: 'ACTIVE',
          displayOrder: 5,
          usedIn: [{ page: 'Home', section: 'Vertical Carousel', component: 'Banner' }],
        },
        {
          fileName: 'vert_poster_5.jpg',
          originalFileName: 'brighter_future_adoni.jpg',
          title: 'Vertical Poster 5 - Brighter Future Adoni',
          description: 'Vertical poster focusing on clean living and positive choices.',
          caption: 'Run for a Brighter Future in Adoni',
          altText: 'Brighter Future Adoni Marathon Banner',
          url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
          publicId: 'vert_poster_5',
          mimeType: 'image/jpeg',
          fileSize: 190000,
          width: 800,
          height: 1200,
          category: 'Banner',
          page: 'Home',
          section: 'Vertical Poster Carousel',
          tags: ['poster', 'vertical', 'future'],
          status: 'ACTIVE',
          displayOrder: 6,
          usedIn: [{ page: 'Home', section: 'Vertical Carousel', component: 'Banner' }],
        },
        {
          fileName: 'act_bootcamps.jpg',
          originalFileName: 'marathon_bootcamps.jpg',
          title: 'Youth Marathon Prep Bootcamps',
          description: 'Weekly morning running sessions and endurance training across Adoni schools and colleges.',
          caption: 'Morning Training Bootcamps across Adoni Institutions',
          altText: 'Youth Marathon Prep Bootcamps in Adoni',
          url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_1',
          mimeType: 'image/jpeg',
          fileSize: 210000,
          width: 800,
          height: 600,
          category: 'Activities',
          page: 'Activities',
          section: 'Bootcamps & Training',
          tags: ['activities', 'bootcamp', 'training', 'marathon'],
          status: 'ACTIVE',
          displayOrder: 1,
          usedIn: [{ page: 'Activities', section: 'Bootcamps & Training', component: 'Activities Gallery' }],
        },
        {
          fileName: 'act_school_pledge.jpg',
          originalFileName: 'school_pledge_drive.jpg',
          title: 'School Anti-Drug Oath & Pledge',
          description: 'Interactive student rallies and pledge signatures taking place in 50+ Adoni institutions.',
          caption: 'Anti-Drug Oath & Pledge across 50+ Adoni Institutions',
          altText: 'Students taking anti-drug pledge in Adoni',
          url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_2',
          mimeType: 'image/jpeg',
          fileSize: 230000,
          width: 800,
          height: 600,
          category: 'Activities',
          page: 'Activities',
          section: 'School Pledge Drive',
          tags: ['activities', 'pledge', 'school', 'oath'],
          status: 'ACTIVE',
          displayOrder: 2,
          usedIn: [{ page: 'Activities', section: 'School Pledge Drive', component: 'Activities Gallery' }],
        },
        {
          fileName: 'act_wellness.jpg',
          originalFileName: 'wellness_seminars.jpg',
          title: 'Mind & Body Wellness Seminars',
          description: 'Guided meditation, stress management and yoga sessions organized by Chinmaya Yuva Kendra.',
          caption: 'Mind & Body Wellness & Guided Meditation',
          altText: 'Guided meditation and wellness seminar by CHYK',
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_3',
          mimeType: 'image/jpeg',
          fileSize: 195000,
          width: 800,
          height: 600,
          category: 'Activities',
          page: 'Activities',
          section: 'Fitness & Wellness',
          tags: ['activities', 'wellness', 'yoga', 'meditation'],
          status: 'ACTIVE',
          displayOrder: 3,
          usedIn: [{ page: 'Activities', section: 'Fitness & Wellness', component: 'Activities Gallery' }],
        },
        {
          fileName: 'act_torch_relay.jpg',
          originalFileName: 'torch_relay_adoni.jpg',
          title: 'Adoni Torch Relay & Street Rallies',
          description: 'Torch relay highlighting positive choices, sports culture, and freedom from addiction.',
          caption: 'Adoni Torch Relay for Freedom from Addiction',
          altText: 'Torch relay highlighting freedom from addiction',
          url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
          publicId: 'act_4',
          mimeType: 'image/jpeg',
          fileSize: 220000,
          width: 800,
          height: 600,
          category: 'Activities',
          page: 'Activities',
          section: 'Awareness Campaign',
          tags: ['activities', 'torch', 'relay', 'campaign'],
          status: 'ACTIVE',
          displayOrder: 4,
          usedIn: [{ page: 'Activities', section: 'Awareness Campaign', component: 'Activities Gallery' }],
        },
        {
          fileName: 'about_ashram_hero.jpg',
          originalFileName: 'chinmaya_ashram_entrance.jpg',
          title: 'Chinmaya Mission Ashram Main Building',
          description: 'Arts College Road Ashrama Headquarters of Chinmaya Mission Adoni.',
          caption: 'Chinmaya Mission Ashrama, Adoni',
          altText: 'Chinmaya Mission Adoni Ashram Main Entrance',
          url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop',
          publicId: 'about_hero',
          mimeType: 'image/jpeg',
          fileSize: 310000,
          width: 1200,
          height: 800,
          category: 'About',
          page: 'About',
          section: 'Hero Header',
          tags: ['about', 'ashram', 'chinmaya', 'adoni'],
          status: 'ACTIVE',
          displayOrder: 1,
          usedIn: [{ page: 'About', section: 'Hero Header', component: 'PageContent' }],
        },
        {
          fileName: 'activity-sanjeevaraya.png',
          originalFileName: 'activity-sanjeevaraya.png',
          title: 'Chinmaya Sanjeevaraya Temple',
          description: 'Spiritual temple for worship, prayer, and cultural preservation in Adoni.',
          caption: 'Chinmaya Sanjeevaraya Temple • Sacred Spiritual Centre',
          altText: 'Chinmaya Sanjeevaraya Temple Adoni',
          url: '/assets/images/activity-sanjeevaraya.png',
          publicId: 'temple_sanjeevaraya',
          mimeType: 'image/png',
          fileSize: 1991444,
          width: 1672,
          height: 941,
          category: 'About',
          page: 'About',
          section: 'Our Activities',
          tags: ['about', 'temple', 'sanjeevaraya'],
          status: 'ACTIVE',
          displayOrder: 2,
          usedIn: [{ page: 'About', section: 'Temple Activities', component: 'PageContent' }],
        },
        {
          fileName: 'activity-shantamalleshwara.webp',
          originalFileName: 'activity-shantamalleshwara.webp',
          title: 'Shanta Malleshwara Temple',
          description: 'Sacred worship centre associated with Chinmaya Mission Adoni.',
          caption: 'Shanta Malleshwara Temple • Sacred Centre of Worship',
          altText: 'Shanta Malleshwara Temple Adoni',
          url: '/assets/images/activity-shantamalleshwara.webp',
          publicId: 'temple_shanta_malleshwara',
          mimeType: 'image/webp',
          fileSize: 87122,
          width: 640,
          height: 853,
          category: 'About',
          page: 'About',
          section: 'Our Activities',
          tags: ['about', 'temple', 'shanta_malleshwara'],
          status: 'ACTIVE',
          displayOrder: 3,
          usedIn: [{ page: 'About', section: 'Sacred Centres', component: 'PageContent' }],
        },
        {
          fileName: 'devi_group_wing.jpg',
          originalFileName: 'devi_group.jpg',
          title: 'Devi Group Devotional Wing',
          description: 'Nurturing devotion, spiritual learning, and cultural values.',
          caption: 'Devi Group • Devotional Wing of Chinmaya Mission',
          altText: 'Devi Group Devotional Wing Chinmaya Mission Adoni',
          url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
          publicId: 'devi_group_wing',
          mimeType: 'image/jpeg',
          fileSize: 215000,
          width: 800,
          height: 600,
          category: 'About',
          page: 'About',
          section: 'Devotional Wing',
          tags: ['about', 'devi_group', 'devotional'],
          status: 'ACTIVE',
          displayOrder: 4,
          usedIn: [{ page: 'About', section: 'Devotional Wing', component: 'PageContent' }],
        },
        {
          fileName: 'chyk_youth_wing.jpg',
          originalFileName: 'chyk_youth.jpg',
          title: 'Chinmaya Yuva Kendra (CHYK) Youth Wing',
          description: 'Empowering young minds with spiritual knowledge, leadership, and action.',
          caption: 'CHYK Adoni • Youth Wing of Chinmaya Mission',
          altText: 'CHYK Adoni Youth Wing Activity',
          url: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=800&auto=format&fit=crop',
          publicId: 'chyk_youth_wing',
          mimeType: 'image/jpeg',
          fileSize: 240000,
          width: 800,
          height: 600,
          category: 'About',
          page: 'About',
          section: 'Youth Wing',
          tags: ['about', 'chyk', 'youth', 'leadership'],
          status: 'ACTIVE',
          displayOrder: 5,
          usedIn: [{ page: 'About', section: 'Youth Wing', component: 'PageContent' }],
        },
        {
          fileName: 'chinmaya_adoni_map_preview.jpg',
          originalFileName: 'map-preview.jpg',
          title: 'Chinmaya Mission Adoni Map Location',
          description: 'Arts College Road location map preview card for Chinmaya Mission Adoni.',
          caption: 'Chinmaya Mission Adoni • Arts College Road Location',
          altText: 'Chinmaya Mission Adoni Arts College Road Map Location',
          url: '/assets/images/map-preview.jpg',
          publicId: 'adoni_map_preview',
          mimeType: 'image/jpeg',
          fileSize: 145000,
          width: 1280,
          height: 720,
          category: "Let's Connect",
          page: "Let's Connect",
          section: 'Location Card',
          tags: ['location', 'map', 'adoni', 'connect'],
          status: 'ACTIVE',
          displayOrder: 1,
          usedIn: [{ page: "Let's Connect", section: 'Location Card', component: 'Google Maps Card' }],
        },
        {
          fileName: 'chinmaya_mission_logo.png',
          originalFileName: 'logo-1.png',
          title: 'Official Chinmaya Mission Emblem',
          description: 'Official brand emblem logo for Chinmaya Mission Adoni.',
          caption: 'Chinmaya Mission Official Logo',
          altText: 'Official Chinmaya Mission Emblem',
          url: '/assets/logos/logo-1.png',
          publicId: 'chinmaya_official_logo',
          mimeType: 'image/png',
          fileSize: 35000,
          width: 300,
          height: 300,
          category: 'Footer',
          page: 'General',
          section: 'Navigation Header & Footer',
          tags: ['logo', 'emblem', 'chinmaya', 'brand'],
          status: 'ACTIVE',
          displayOrder: 1,
          usedIn: [{ page: 'General', section: 'Navigation Header & Footer', component: 'Navbar & Footer' }],
        },
      ];

      await Media.insertMany(initialMediaList);
      console.log(`[Seed] ${initialMediaList.length} website media assets seeded into central Media Library.`);
    }
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
};
