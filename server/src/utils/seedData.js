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
import Thought from '../models/Thought.js';
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
        slogan: 'WE RISE. WE RUN. WE RESIST.',
        subSlogan: 'RUN FOR LIFE. STAND AGAINST DRUGS',
        location: 'Adoni, Andhra Pradesh, India',
        venue: 'Chinmaya Mission, Adoni',
        eventDate: new Date('2026-12-20T06:00:00.000+05:30'),
        eventTime: '6:00 AM onwards',
        organizers: ['Chinmaya Mission, Adoni', 'Chinmaya Yuva Kendra, Adoni'],
        registrationOpen: true,
      });
      console.log('[Seed] Event configuration initialized.');
    } else {
      if (configExists.slogan === 'YOUR LIFE. YOUR CHOICE.' || !configExists.slogan) {
        configExists.slogan = 'WE RISE. WE RUN. WE RESIST.';
        configExists.subSlogan = 'RUN FOR LIFE. STAND AGAINST DRUGS';
        await configExists.save();
      }
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
        answer: 'The event will take place on Sunday, 20 December 2026, starting at 6:00 AM from Chinmaya Mission, Adoni, Andhra Pradesh.',
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
            title: 'ABOUT CHINMAYA MISSION, ADONI',
            subtitle: 'Timeless Wisdom. Inspired Youth. Meaningful Service.',
            intro: 'Chinmaya Mission, Adoni is a spiritual and cultural organisation dedicated to sharing timeless wisdom, nurturing human values and inspiring individuals to lead purposeful lives.',
            imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop'
          },
          whoWeAre: {
            heading: 'WHO ARE WE?',
            p1: 'Chinmaya Mission, Adoni, has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swami Shyamananda (Dr. Shyamala) under the guidance and blessings of Swami Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy. Inspired by the vision of Pujya Gurudev Swami Chinmayananda, the Mission has consistently worked to spread the timeless wisdom of the Bhagavad Gita, Upanishads and other scriptures while promoting Indian culture, values and character-building among children, youth and adults. Over the years, Chinmaya Mission, Adoni, has expanded its activities and has made significant contributions to the spiritual, cultural and social development of the region.',
            p2: 'We believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.'
          },
          ourStory: {
            heading: 'OUR STORY',
            p1: 'Chinmaya Mission, Adoni, has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swami Shyamananda (Dr. Shyamala) under the guidance and blessings of Swami Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy.',
            p2: 'Inspired by the vision of Pujya Gurudev Swami Chinmayananda, the Mission has consistently worked to spread the timeless wisdom of the Bhagavad Gita, Upanishads and other scriptures while promoting Indian culture, values and character-building among children, youth and adults. Over the years, Chinmaya Mission, Adoni, has expanded its activities and has made significant contributions to the spiritual, cultural and social development of the region.',
            timeline: [
              { year: '1992', title: 'Establishment of Chinmaya Mission, Adoni', desc: 'Established by Swami Shyamananda (Dr. Shyamala) under the guidance of Swami Sharadapriyananda.' },
              { year: '2001', title: 'Chinmaya Cultural Complex', desc: 'Inauguration of the Chinmaya Cultural Complex by Pujya Swami Tejomayanandaji.' },
              { year: '2006', title: 'Sri Chinmaya Sanjeevaraya Swami Temple', desc: 'Construction of the sacred Sanjeevaraya Swami temple.' },
              { year: '2019', title: 'Chinmaya Vani Inauguration', desc: 'Inauguration by Pujya Swami Swaroopanandaji.' },
              { year: '2026', title: 'Continuing Legacy & Geeta Chanting', desc: 'District-level Geeta Chanting competitions and youth leadership.' }
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
            heading: 'CHINMAYA YUVA KENDRA (CHYK), ADONI',
            p1: 'Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission, provides a platform for young people to explore spiritual knowledge, cultivate leadership qualities and participate in meaningful community initiatives.',
            p2: "CHYK, Adoni aims to connect the timeless teachings of Indian philosophy with the aspirations and challenges of today's generation. Through youth-led programmes, interactive activities, cultural initiatives and service-oriented projects, it encourages young people to become responsible leaders who combine knowledge with action and personal growth with social responsibility.",
            keywords: ['KNOWLEDGE', 'LEADERSHIP', 'DISCIPLINE', 'CONFIDENCE', 'SERVICE'],
            imageUrl: '/assets/images/chyk-youth-team.jpg'
          },
          spiritualityInAction: {
            heading: 'SPIRITUALITY IN ACTION',
            content: 'At Chinmaya Mission, Adoni, spirituality extends beyond individual practice into actions that benefit the wider community. The Mission seeks to bring people together through spiritual learning, cultural engagement, festivals and service initiatives, fostering a spirit of unity, compassion and collective responsibility.',
            flow: ['KNOWLEDGE', 'ACTION', 'SERVICE', 'COMMUNITY'],
            imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
          },
          ourActivities: {
            heading: 'OUR ACTIVITIES',
            intro: 'At Chinmaya Mission, Adoni, our activities bring together spirituality, devotion, cultural values, youth development and selfless service. Through our temples and dedicated groups, we strive to nurture spiritual awareness, strengthen community bonds and inspire individuals of all ages to live by timeless values.',
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
                content: 'Shanta Malleshwara Temple is an important centre of worship and devotion associated with Chinmaya Mission, Adoni. The temple provides a space for devotees to participate in religious observances, festivals and spiritual activities, fostering a sense of unity, devotion and community service.',
                imageUrl: '/assets/images/activity-shantamalleshwara.webp',
                badge: 'SACRED CENTRE'
              },
              {
                id: 'act-3',
                title: 'DEVI GROUP',
                content: "The Devi Group is dedicated to nurturing devotion, spiritual understanding and the preservation of cultural values. Through devotional gatherings, spiritual learning and collective participation in traditional activities, the group encourages members to deepen their spiritual connection and contribute to the Mission's broader vision.",
                imageUrl: '/assets/images/activity-devigroup.jpg',
                badge: 'DEVOTIONAL WING'
              },
              {
                id: 'act-4',
                title: 'CHINMAYA YUVA KENDRA (CHYK)',
                content: 'Chinmaya Yuva Kendra (CHYK) is the youth wing of Chinmaya Mission, providing a platform for young people to grow spiritually, develop leadership skills and engage in meaningful community initiatives. CHYK, Adoni encourages young minds to discover their potential and apply the wisdom of Indian philosophy to modern-day life. Through youth programmes, cultural activities, interactive initiatives and social service, CHYK inspires young people to become responsible leaders guided by knowledge, discipline, confidence and compassion.',
                imageUrl: '/assets/images/activity-chyk.jpg',
                badge: 'YOUTH WING',
                featured: true
              }
            ]
          },
          continuingLegacy: {
            heading: 'CONTINUING THE LEGACY',
            content: 'Guided by the principles of knowledge, devotion and selfless service, Chinmaya Mission, Adoni continues to share the vision and teachings of Pujya Gurudev Swami Chinmayananda, inspiring individuals, empowering youth and contributing to the spiritual and cultural enrichment of society.',
            highlights: ['1992', 'Knowledge', 'Devotion', 'Selfless Service', 'Youth', 'Community']
          },
          conclusion: {
            heading: 'Conclusion',
            paragraph1:
              'From its humble beginning in 1992, Chinmaya Mission, Adoni, has grown into a vibrant centre dedicated to spiritual growth, cultural preservation, value-based education and community service.',
            paragraph2:
              'Through its sustained Geeta Chanting Competitions, Balavihar, Youth Camps, temple development initiatives and numerous cultural programmes, the Mission has positively influenced thousands of children, youth and families over the past three decades.',
            paragraph3:
              "The journey of Chinmaya Mission, Adoni, reflects its unwavering commitment to preserving India's spiritual heritage while making eternal values meaningful and relevant for present and future generations. Guided by the ideals of Pujya Gurudev Swami Chinmayananda, the Mission continues to inspire individuals to lead lives of knowledge, devotion, discipline and selfless service, thereby contributing to the moral and cultural enrichment of society.",
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
          secondaryColor: '#FFF0C5',
          accentColor: '#F4511E',
          backgroundColor: '#FFF0C5',
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
            subtitle: 'WE RISE. WE RUN. WE RESIST.',
            description: 'RUN FOR LIFE. STAND AGAINST DRUGS',
            badgeText: 'CHINMAYA MISSION, ADONI & CHINMAYA YUVA KENDRA, ADONI',
            primaryButtonText: 'REGISTER NOW',
            primaryButtonLink: '/register',
            secondaryButtonText: 'EXPLORE THE MOVEMENT',
            secondaryButtonLink: '#about',
            imageUrl: '/assets/images/hero-runners-graphic.png',
            isEnabled: true,
            order: 1,
          },
          {
            sectionId: 'marathon-1',
            type: 'marathon',
            title: 'EVENT DETAILS & COUNTDOWN',
            subtitle: 'Sunday, 20 December 2026 • 6:00 AM Onwards',
            description: 'Starting from Chinmaya Mission, Adoni, Andhra Pradesh.',
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
            sectionId: 'cta-1',
            type: 'cta',
            title: 'BE PART OF THE MOVEMENT IN ADONI!',
            subtitle: 'CHINMAYA MISSION, ADONI & CHINMAYA YUVA KENDRA, ADONI',
            description: 'Register today individually or submit your school/college bulk student details. Receive your official marathon certificate & pass!',
            primaryButtonText: '',
            primaryButtonLink: '',
            isEnabled: true,
            order: 5,
          },
          {
            sectionId: 'faq-1',
            type: 'faq',
            title: 'FREQUENTLY ASKED QUESTIONS',
            subtitle: 'QUESTIONS & ANSWERS',
            description: 'Everything you need to know about participating, registrations, certificates, and event details.',
            isEnabled: true,
            order: 6,
          },
        ],
      });
      console.log('[Seed] Default HomePage CMS configuration created.');
    } else {
      const heroSection = homePageExists.sections?.find((s) => s.type === 'hero' || s.sectionId === 'hero-1');
      if (heroSection && (/YOUR LIFE/i.test(heroSection.subtitle) || /Run for a Drug-Free/i.test(heroSection.description))) {
        heroSection.subtitle = 'WE RISE. WE RUN. WE RESIST.';
        heroSection.description = 'RUN FOR LIFE. STAND AGAINST DRUGS';
        await homePageExists.save();
        console.log('[Seed] HomePage hero slogans updated.');
      }
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
          caption: 'WE RISE. WE RUN. WE RESIST. — Anti-Drug Movement 2026',
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
          caption: 'Chinmaya Mission, Adoni & Chinmaya Yuva Kendra, Adoni Movement',
          altText: 'Chinmaya Mission, Adoni Movement',
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
          description: 'Near Arts College Road of Chinmaya Mission, Adoni.',
          caption: 'Chinmaya Mission, Adoni',
          altText: 'Chinmaya Mission, Adoni Ashram Main Entrance',
          url: '/assets/images/about-ashram-hero.jpg',
          publicId: 'about_hero',
          mimeType: 'image/jpeg',
          fileSize: 422000,
          width: 1600,
          height: 1067,
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
          altText: 'Chinmaya Sanjeevaraya Temple, Adoni',
          url: '/assets/images/activity-sanjeevaraya.png',
          publicId: 'temple_sanjeevaraya',
          mimeType: 'image/png',
          fileSize: 841434,
          width: 1600,
          height: 1066,
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
          description: 'Sacred worship centre associated with Chinmaya Mission, Adoni.',
          caption: 'Shanta Malleshwara Temple • Sacred Centre of Worship',
          altText: 'Shanta Malleshwara Temple, Adoni',
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
          altText: 'Devi Group Devotional Wing Chinmaya Mission, Adoni',
          url: '/assets/images/activity-devigroup.jpg',
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
          caption: 'Chinmaya Yuva Kendra, Adoni • Youth Wing of Chinmaya Mission',
          altText: 'Chinmaya Yuva Kendra, Adoni Youth Wing Activity',
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
          title: 'Chinmaya Mission, Adoni Map Location',
          description: 'Near Arts College Road location map preview card for Chinmaya Mission, Adoni.',
          caption: 'Chinmaya Mission, Adoni • Near Arts College Road Location',
          altText: 'Chinmaya Mission, Adoni Near Arts College Road Map Location',
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
          description: 'Official brand emblem logo for Chinmaya Mission, Adoni.',
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

    // Seed Initial Community Thoughts for Story Board if empty
    const thoughtCount = await Thought.countDocuments();
    if (thoughtCount === 0) {
      const admin = await User.findOne({ role: 'admin' });
      const seedUserId = admin ? admin._id : null;

      if (seedUserId) {
        const initialThoughts = [
          {
            user: seedUserId,
            content: "Running for a drug-free generation! Adoni's youth have immense energy and potential. Let's channel it into sports, service, and spiritual strength. 🏃‍♂️🔥",
            color: 'yellow',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "Every step we take together in this marathon echoes a clear message: Health is true wealth! Proud to be part of Chinmaya Mission's initiative. ✨💪",
            color: 'mint',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "Discipline, dedication, and fitness. The marathon is not just a race; it's a movement to inspire every family in Adoni towards healthy living. 🌟",
            color: 'sky',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "Running with my friends from college! Clean minds, active bodies, and a united community. Say NO to drugs, YES to life! 🕊️❤️",
            color: 'coral',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "Early morning practice runs have taught me resilience. Excited to cross that finish line and celebrate with our community! 🏅🎉",
            color: 'lavender',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "A journey of five kilometers begins with a single resolute decision. Let's fill the streets with positivity, smiles, and triumph! 🌿🙏",
            color: 'peach',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "My children and I are participating together. Instilling moral values and active habits early is the greatest gift we can give them. 👨‍👩‍👧‍👦",
            color: 'cream',
            status: 'APPROVED',
            reviewedBy: seedUserId,
            reviewedAt: new Date(),
          },
          {
            user: seedUserId,
            content: "Looking forward to volunteering at the hydration station and cheering every single runner as they sprint to victory! 💧🙌",
            color: 'yellow',
            status: 'PENDING',
          },
        ];

        await Thought.insertMany(initialThoughts);
        console.log(`[Seed] Seeded ${initialThoughts.length} initial thoughts for Marathon Story Board.`);
      }
    }
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
};
