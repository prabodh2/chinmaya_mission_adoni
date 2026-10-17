import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webContentService } from '../services/api';
import {
  Landmark,
  Flame,
  Heart,
  Sparkles,
  ChevronRight,
  Sun,
  Clock,
  MapPin,
  Calendar,
  Compass,
} from 'lucide-react';

export const SriShanthaMamleshwaraSwamiTemplePage = () => {
  const [pageData, setPageData] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cms_shantamalleshwara_temple');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    document.title = 'Sri Shantha Mamleshwara Swami Temple | Chinmaya Mission, Adoni';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    webContentService
      .getPublicPage('chinmaya', 'shantamalleshwara_temple')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem(
              'cached_cms_shantamalleshwara_temple',
              JSON.stringify(res.data.data)
            );
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const f = pageData?.fieldsMap || {};

  const festivals = [
    {
      name: 'Maha Shivaratri Mahotsavam',
      period: 'Magha Bahula Chaturdashi',
      desc: 'The grandest annual celebration where 3,000 to 4,000+ devotees ascend the hilltop shrine for night-long Jagaran, Laghu Rudra Abhishekam, and Rudram Homam performed by Veda Purohits.',
      icon: <Flame className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      name: 'Shiva-Parvati Kalyana Mahotsavam',
      period: 'Magha Masa (Post-Shivaratri Monday)',
      desc: 'A divine celestial wedding ceremony celebrating the cosmic union of Lord Shiva and Goddess Parvati, drawing 600 to 1,000 devotees, followed by community Annadanam and Mahaprasadam.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
    {
      name: 'Karthika Deepotsavam',
      period: 'Karthika Masa (Every Monday)',
      desc: 'The hilltop sanctum is illuminated with hundreds of sacred earthen lamps (deepams), offering a magnificent radiant spectacle across Adoni with special evening deeparadhana.',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      name: 'Magha Masa Special Daily Pujas',
      period: 'Month of Magha',
      desc: 'Month-long daily special abhishekams and sacred archanas supported by hundreds of community devotee sponsors, culminating in the joyous celebrations of Mahashivaratri.',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
  ];

  const devotionalRituals = [
    {
      title: '1. Daily Bilvarchana & Rudrabhishekam',
      badge: 'Every Day',
      desc: 'Sacred Vedic abhishekam performed with holy water, panchamrutham, and fresh sacred Bilva (bael) leaves, accompanied by recitations of Sri Rudram and Om Namah Shivaya for peace and inner purification.',
      image: '/assets/images/temple-seva-rudrabhishekam.jpg',
    },
    {
      title: '2. Pradosha Vrata Deeparadhana',
      badge: 'Every Pradosham & Monday',
      desc: 'Observed during the sacred twilight Pradosha Kala with special abhishekams, lighting of tiered brass deepas, and collective chanting of Shiva Stotrams for peace, health, and freedom from obstacles.',
      image: '/assets/images/temple-seva-pradosha.jpg',
    },
    {
      title: '3. Maha Shivaratri & Shiva-Parvati Kalyanam',
      badge: 'Annual Festival & Magha Masa',
      desc: 'The grand annual observance featuring night-long Mahashivaratri Jagaran, sacred Laghu Rudra Abhishekam, Rudram Homam by Veda Purohits, and the divine celestial wedding ceremony followed by Mahaprasadam.',
      image: '/assets/images/temple-seva-shiva-kalyanam.jpg',
    },
  ];

  const pujaServices = [
    {
      number: '01',
      title: 'Panchamrutha Rudrabhishekam',
      desc: 'A sacred Vedic ritual where the Shivalingam is ceremonially bathed with Panchamrutham (milk, curd, honey, ghee, and jaggery) alongside fragrant holy waters. It symbolizes purification, vitality, peace, and divine grace.',
      price: '₹151',
    },
    {
      number: '02',
      title: 'Bilvarchana & Sankalpa Archana',
      frequency: 'Every Monday & Pradosham',
      desc: 'Devotional offering of sacred trifoliate Bilva leaves chanting the divine names of Lord Shiva. According to Shaivite tradition, Bilvarchana brings peace of mind, removes obstacles, and bestows spiritual wisdom.',
      price: '₹150',
    },
    {
      number: '03',
      title: 'Maha Mrityunjaya & Laghu Rudra Pooja',
      frequency: 'Special Occasions & Shivaratri',
      desc: 'A powerful Vedic chanting of the Maha Mrityunjaya mantra and Rudra Prashna to ward off negative energies and illness, praying for longevity, holistic health, and spiritual liberation.',
      price: '₹251',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[var(--text-primary)] transition-colors duration-300">
      {/* 1. HERO BANNER: SACRED TEMPLE PRESENTATION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C160C] via-[#241B0E] to-[#120E08] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Sacred Title & Overview */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-widest">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>SPIRITUALITY &amp; DEVOTION • ADONI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight leading-tight">
              {f.temple_hero?.title || 'SRI SHANTHA MAMLESHWARA SWAMI TEMPLE'}
            </h1>

            <p className="text-amber-200/90 text-sm sm:text-base font-serif italic">
              "{f.temple_hero?.subtitle ||
                'Shri Shantamalleshwara Swami Devasthanam — A revered hilltop sanctuary of peace, divine grace, and timeless Shaivite heritage in Adoni.'}"
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {f.temple_hero?.intro ||
                'Dedicated to Lord Shiva (Shri Shantamalleshwara Swamy), this sanctified hilltop shrine stands majestically atop the hillock near Ramanjaneya Nagar in Adoni. Nurtured and maintained with profound devotion by the Chinmaya Mission Adoni Committee for over 25 years, the temple serves as an abode of profound silence, positive spiritual energy, and community harmony for all seekers and devotees.'}
            </p>

            {/* Quick Highlights / Visiting Pills */}
            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-amber-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Morning: 6:00 AM – 12:00 PM</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-amber-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Evening: 5:00 PM – 8:30 PM</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-amber-200 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Ramanjaneya Nagar, Adoni</span>
              </span>
            </div>
          </div>

          {/* Right Column: Full Deity Image (100% Uncropped & Highlighted) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-black/80 via-slate-950 to-black border-2 border-amber-500/40 shadow-2xl shadow-amber-950/50 p-2 sm:p-3 group max-w-sm w-full">
              {/* Soft Golden Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-transparent blur-xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
                {/* Full Uncropped Deity Image */}
                <img
                  src={
                    f.temple_hero?.imageUrl ||
                    '/assets/images/shri-shantamalleshwara-shiva.jpg'
                  }
                  alt={
                    f.temple_hero?.deityName ||
                    'Lord Shiva devotional image — Shri Shantamalleshwara Swami'
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      '/assets/images/activity-shantamalleshwara.webp';
                  }}
                  className="w-full h-auto max-h-[460px] object-contain mx-auto my-auto block rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              <div className="text-center pt-3 pb-1 space-y-0.5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  {f.temple_hero?.deityName || 'Shri Shantamalleshwara Swamy'}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  Presiding Deity (Lord Shiva) • Chinmaya Mission, Adoni
                </p>
                <p className="text-[10px] text-amber-200/60 font-sans tracking-wide pt-0.5">
                  Lord Shiva Devotional Representation • Hilltop Sanctum, Adoni
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TEMPLE HISTORY & SPIRITUAL SIGNIFICANCE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight">
            {f.temple_history?.heading || 'Sri Shantha Mamleshwara Swami Temple'}
          </h2>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--orange)]">
            {f.temple_history?.location ||
              'Ramanjaneya Nagar, Shanta Mallappa Konda, Adoni'}
          </p>
          <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Section 1: History and Spiritual Significance */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed flex flex-col justify-start">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {f.temple_history?.historyTitle || 'History and Spiritual Legacy'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP1 ||
                'The Sri Shantha Mamleshwara Swami Temple (also known as Shri Shantamalleshwara Swamy Devasthanam) in Adoni is an ancient and sanctified hilltop seat of Lord Shiva, revered for generations as an abode of profound peace, meditation, and spiritual grace.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP2 ||
                'The development and continuous preservation of this sacred shrine commenced in 1996 under the spiritual guidance and vision of Chinmaya Mission, Adoni. For over 25 years, the Chinmaya Mission Adoni Committee has diligently nurtured, protected, and managed the temple precinct.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP3 ||
                'To facilitate easy, safe, and comfortable passage for thousands of pilgrims ascending the rocky hillock, Chinmaya Mission constructed vital infrastructure, including the primary temple access bridge in 2003 and the dedicated pedestrian footpath bridge in 2004.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP4 ||
                'In 2025, the grand Maha Kumbhabhishekam was successfully solemnized with sacred Vedic rituals and Agama Shastras. A permanent metal Omkara (ॐ) symbol installed on the summit is illuminated each night, standing as an uplifting spiritual beacon across the city of Adoni.'}
            </p>
          </div>

          {/* Section 2: Daily Worship and Annual Celebrations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed flex flex-col justify-start">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {f.temple_history?.worshipTitle ||
                  'Daily Worship and Sacred Observances'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP1 ||
                'Daily poojas and abhishekams are performed with devotion and reverent chanting to Lord Shiva (Shri Shantamalleshwara Swamy), invoking tranquility, good health, and spiritual clarity for all devotees and their families.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP2 ||
                'During the holy month of Magha, extended daily special pujas are conducted with active sponsorship and participation from hundreds of devotee families, culminating in the festive celebrations of Maha Shivaratri.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP3 ||
                'The Devasthanam celebrates Maha Shivaratri, Lord Shiva-Parvati Kalyana Mahotsavam, Karthika Deepotsavam, and Pradosha Vratam with profound Vedic fervour, bringing the entire community together in devotional unity, Annadanam, and cultural preservation.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. DEVOTIONAL RITUALS & REGULAR SEVAS */}
      <section className="bg-[#090909] text-white py-12 sm:py-16 border-y border-[#2d2723]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {devotionalRituals.map((ritual, idx) => (
            <div
              key={idx}
              className={`flex flex-row items-center gap-4 sm:gap-7 pb-6 sm:pb-8 ${
                idx < devotionalRituals.length - 1 ? 'border-b border-[#2d2723]' : ''
              }`}
            >
              <img
                src={ritual.image}
                alt={ritual.title}
                className="w-24 sm:w-36 md:w-40 aspect-[3/4] object-cover rounded-xl shrink-0 shadow-lg border border-white/5"
              />
              <div className="space-y-2 sm:space-y-2.5 text-left">
                <h3 className="text-base sm:text-xl font-bold font-heading text-[#f5c46a]">
                  {ritual.title}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full bg-[#1f1f23] text-[#e0e0e0] text-xs sm:text-sm font-medium border border-white/5">
                  {ritual.badge}
                </span>
                <p className="text-slate-200 text-xs sm:text-base leading-relaxed">
                  {ritual.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Sacred Footer Closing */}
          <div className="pt-4 border-t border-[#2d2723] text-center space-y-1.5">
            <div className="text-lg sm:text-2xl font-bold text-[#f5c46a] tracking-widest font-serif">
              ॥ ॐ नमः शिवाय ॥
            </div>
            <p className="text-xs sm:text-sm text-[#b8afa2]">
              With devotion, peace, and the divine grace of Lord Shiva (Shri Shantamalleshwara Swamy)
            </p>
          </div>
        </div>
      </section>

      {/* 4. PUJA SERVICES & THEIR SIGNIFICANCE */}
      <section className="bg-[#0b0b0b] text-[#f5f5f5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#393027]/60">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
              SACRED SEVAS &amp; PUJAS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-[#f2c16b] tracking-tight">
              Puja Services &amp; Their Significance
            </h2>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-[#c5c5c5] font-medium pt-1">
              Explore our traditional Vedic puja services and their spiritual significance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pujaServices.map((puja, idx) => (
              <div
                key={idx}
                className="bg-[#151515] border border-[#403326] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-lg shadow-black/40 hover:-translate-y-1.5 hover:border-[var(--orange)]/80 hover:shadow-2xl transition-all duration-300 text-left group"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#3b2b18] border border-amber-500/20 text-[#f2c16b] font-bold text-base flex items-center justify-center mb-5 group-hover:bg-[var(--orange)] group-hover:text-white transition-colors duration-200">
                    {puja.number}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-heading text-[#f2c16b] leading-snug mb-2 group-hover:text-amber-300 transition-colors">
                    {puja.title}
                  </h3>

                  {puja.frequency && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#302417] text-[#f2c16b] border border-amber-900/40 text-xs font-semibold mb-3">
                      {puja.frequency}
                    </span>
                  )}

                  <p className="text-sm text-[#d0d0d0] leading-relaxed font-normal mb-6">
                    {puja.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#393027] mt-auto">
                  <span className="text-sm text-[#bdbdbd] font-medium">Seva Price</span>
                  <strong className="text-2xl font-black font-heading text-[#f2c16b] tracking-tight">
                    {puja.price}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ANNUAL FESTIVALS & SPECIAL CELEBRATIONS */}
      <section className="bg-gradient-to-b from-amber-50/50 to-white py-12 sm:py-16 border-y border-amber-900/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
              DEVOTIONAL JOY &amp; CELEBRATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight">
              Annual Festivals &amp; Observances
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Throughout the year, thousands of devotees ascend the hillock to celebrate auspicious Shaivite festivals and participate in sacred community rituals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {festivals.map((fest, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col justify-between hover:shadow-md hover:border-[var(--orange)]/40 transition-all text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-3">
                    {fest.icon}
                  </div>
                  <h3 className="text-base font-extrabold font-heading text-slate-900 mb-1">
                    {fest.name}
                  </h3>
                  <span className="inline-block text-[11px] font-bold text-[var(--orange)] mb-2 uppercase tracking-wide">
                    {fest.period}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {fest.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VISITOR INFORMATION & PILGRIM ACCESS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[var(--orange)] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">
              Temple Darshan Timings
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Morning:</strong> 6:00 AM – 12:00 PM<br />
              <strong>Evening:</strong> 5:00 PM – 8:30 PM<br />
              <span className="text-[11px] text-slate-500 italic">
                Special Deeparadhana performed daily at 6:30 PM. Extended hours on Pradosham and Maha Shivaratri.
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[var(--orange)] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">
              Pilgrim Pathway &amp; Bridge
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The hilltop shrine is reached via the dedicated devotee bridge and footpath bridge constructed by Chinmaya Mission in 2003–2004, offering convenient and safe access for devotees of all ages.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[var(--orange)] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">
              Location &amp; Shrine Address
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Sri Shantha Mamleshwara Swami Temple</strong><br />
              Shanta Mallappa Konda, Near Ramanjaneya Nagar / Arts College Road<br />
              Adoni – 518301, Andhra Pradesh, India.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SriShanthaMamleshwaraSwamiTemplePage;
