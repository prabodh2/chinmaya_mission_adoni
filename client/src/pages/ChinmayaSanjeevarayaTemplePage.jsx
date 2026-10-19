import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webContentService } from '../services/api';
import { UnifiedBookingModal, MyBookingsModal } from '../components/TempleSevaSection';
import {
  Landmark,
  Flame,
  Heart,
  Sparkles,
  ChevronRight,
  Sun,
  ArrowRight,
} from 'lucide-react';

const PUJA_SERVICES = [
  {
    number: '01',
    title: 'Panchamrutha Abhishekam',
    desc: 'A sacred ritual in which the deity is ceremonially bathed with Panchamrutham, a mixture of five traditional ingredients. It symbolizes purification, devotion, and prayers for health, prosperity, and divine blessings.',
    price: '₹151',
  },
  {
    number: '02',
    title: 'Vahana Puja',
    desc: 'A traditional ritual performed to seek divine blessings for a vehicle. Devotees pray for safe journeys, protection from harm, and the well-being of everyone travelling in it.',
    price: '₹150',
  },
  {
    number: '03',
    title: 'Sri Satyanarayana Swamy Puja',
    frequency: 'Every Pournami',
    desc: 'A devotional ritual dedicated to Lord Sri Satyanarayana Swamy to seek blessings for peace, prosperity, happiness, and family well-being. It is traditionally observed on Pournami (the full moon day).',
    price: '₹150',
  },
];

export const ChinmayaSanjeevarayaTemplePage = () => {
  const [selectedPujaService, setSelectedPujaService] = useState(null);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('temple_seva_bookings') || '[]');
      return list.length;
    } catch {
      return 0;
    }
  });

  const refreshBookingsCount = () => {
    try {
      const list = JSON.parse(localStorage.getItem('temple_seva_bookings') || '[]');
      setBookingsCount(list.length);
    } catch {}
  };

  const handleBookPuja = (puja) => {
    const numericPrice = parseInt(puja.price.replace(/[^\d]/g, ''), 10) || 150;
    const serviceObj = {
      name: puja.title,
      desc: puja.desc,
      descriptionText: puja.desc,
      fixedAmount: numericPrice,
      pujaType: puja.title.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      refIdPrefix: 'CST',
      templeName: 'Chinmaya Sanjeevaraya Temple',
      options: PUJA_SERVICES.map((p) => ({
        name: p.title,
        price: parseInt(p.price.replace(/[^\d]/g, ''), 10) || 150,
        desc: p.desc,
      })),
    };

    setSelectedPujaService(serviceObj);
  };

  const [pageData, setPageData] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cms_chinmaya_temple');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    document.title = 'Chinmaya Sanjeevaraya Temple | Chinmaya Mission';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    webContentService
      .getPublicPage('chinmaya', 'temple')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem('cached_cms_chinmaya_temple', JSON.stringify(res.data.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const f = pageData?.fieldsMap || {};

  const festivals = [
    {
      name: 'Hanuman Jayanti',
      period: 'Chaitra Pournami / Vaisakha',
      desc: 'Grand celebrations featuring special Pavamana Abhishekam, floral alankaram, continuous Hanuman Chalisa recitations, and community Annadanam.',
      icon: <Flame className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      name: 'Karthika Deepotsavam',
      period: 'Karthika Masa',
      desc: 'The entire temple precinct is illuminated with hundreds of sacred clay oil lamps (Deepams), invoking divine grace, wisdom, and inner peace.',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      name: 'Shravana Masa Poojas',
      period: 'Shravana Masa',
      desc: 'Month-long devotional observances with collective chanting, special devotional offerings, and spiritual talks drawing families from all communities.',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      name: 'Saturday Satsangs',
      period: 'Every Saturday',
      desc: 'Devotees gather weekly for collective chanting of Sri Vishnu Sahasranamam, Sri Hanuman Chalisa, and bhajans accompanied by prasadam distribution.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
  ];

  const devotionalRituals = [
    {
      title: '1. Daily Hanuman Chalisa',
      badge: 'Every Day',
      desc: 'Hanuman Chalisa is recited every day with devotion and prayer.',
      image: '/assets/images/temple-seva-hanuman-chalisa.png',
    },
    {
      title: '2. Saturday Palaki Seva',
      badge: 'Every Saturday',
      desc: 'Palaki Seva is performed every Saturday with devotion to Lord Hanuman.',
      image: '/assets/images/temple-seva-palaki.png',
    },
    {
      title: '3. Special Hanuman Chalisa – 11 Times',
      badge: 'Last Saturday of Every Month',
      desc: 'On the last Saturday of every month, Hanuman Chalisa is recited 11 times with devotion, seeking the blessings of Lord Hanuman.',
      image: '/assets/images/temple-seva-11-chalisa.png',
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
              <span>SPIRITUALITY & DEVOTION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight leading-tight">
              {f.temple_hero?.title || 'CHINMAYA SANJEEVARAYA TEMPLE'}
            </h1>

            <p className="text-amber-200/90 text-sm sm:text-base font-serif italic">
              "{f.temple_hero?.subtitle || 'Sri Chinnaya Sanjeevarya Swamy Devasthanam — A sacred sanctuary of unwavering faith, strength, and timeless devotional heritage.'}"
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {f.temple_hero?.intro || 'Dedicated to Lord Hanuman (Sri Sanjeevaraya Swamy), Chinmaya Sanjeevaraya Temple is a premier devotional center under Chinmaya Mission. Rooted in traditional Agama Shastras and energized by sacred Vedic rituals, the temple serves as an abode of peace, positive vibrations, and community unity for all seekers and devotees.'}
            </p>
          </div>

          {/* Right Column: Full Deity Image (100% Uncropped & Highlighted) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-black/80 via-slate-950 to-black border-2 border-amber-500/40 shadow-2xl shadow-amber-950/50 p-2 sm:p-3 group max-w-sm w-full">
              {/* Soft Golden Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-transparent blur-xl pointer-events-none" />
              
              <div className="relative rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
                {/* Full Uncropped Deity Image */}
                <img
                  src={f.temple_hero?.imageUrl || '/assets/images/chinmaya-sanjeevaraya-temple.png'}
                  alt={f.temple_hero?.deityName || 'Sri Chinnaya Sanjeevaraya Swamy Devasthanam'}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/activity-sanjeevaraya.png';
                  }}
                  className="w-full h-auto max-h-[460px] object-contain mx-auto my-auto block rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              <div className="text-center pt-3 pb-1 space-y-0.5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  {f.temple_hero?.deityName || 'Sri Chinnaya Sanjeevaraya Swamy'}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  Presiding Deity • Chinmaya Mission
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLE HISTORY & SPIRITUAL SIGNIFICANCE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight">
            {f.temple_history?.heading || 'Sri Chinnaya Sanjeevarya Swamy Devasthanam'}
          </h2>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--orange)]">
            {f.temple_history?.location ? f.temple_history.location.replace(/,\s*Adoni/gi, '').replace(/\bAdoni\b/gi, '').trim() || 'Sacred Heritage Shrine' : 'Sacred Heritage Shrine'}
          </p>
          <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Section 1: History and Spiritual Significance */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed flex flex-col justify-start">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {f.temple_history?.historyTitle || 'History and Spiritual Significance'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP1 || 'The Sri Chinmaya Sanjeevaraya Swamy Devasthanam was consecrated in 2006 (Vyaya Nama Samvatsaram), in accordance with the vision and spiritual inspiration of Pujya Swamini Shyamananda, the founder of Chinmaya Mission.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP2 || 'The consecration ceremony was performed in accordance with the traditional Agama Shastras, under the guidance of Pujya Swami Pranavananda, with the support and cooperation of Sri Vitta Bhimayasetty, Sri B. V. R. Reddy, Sri Adapa Mohan Reddy, and the devoted community.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP3 || 'In 2012, a sacred Kumbhabhishekam ceremony was performed to renew the spiritual sanctity of the temple, under the guidance of Pujya Swami Paratparananda and Pujya Swami Pranavananda.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP4 || 'With the whole hearted participation of devotees, a sacred Havan was conducted. Silver armour was offered to the presiding deity, and two ornamental pieces were provided for the festival deities (Utsava Murtis), reflecting the devotion and reverence of the community.'}
            </p>
          </div>

          {/* Section 2: Daily Worship and Annual Celebrations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed flex flex-col justify-start">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {f.temple_history?.worshipTitle || 'Daily Worship and Annual Celebrations'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP1 || 'Daily poojas are performed with devotion and reverence to the presiding deity. Special rituals and religious observances are conducted on auspicious days and during important festivals throughout the year.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP2 || 'The temple celebrates Shravana Masa, Hanuman Jayanti, and Karthika Deepotsavam with great devotion and spiritual fervour. These sacred observances bring devotees together in prayer, worship, and the celebration of their spiritual traditions.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP3 || 'The Devasthanam continues to serve as a place of worship and devotion, preserving religious traditions and nurturing the spiritual aspirations of its devotees.'}
            </p>
          </div>
        </div>
      </section>

      {/* DEVOTIONAL RITUALS & REGULAR SEVAS */}
      <section className="bg-[#090909] text-white py-12 sm:py-16 border-y border-[#2d2723]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {devotionalRituals.map((ritual, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-[#2d2723] rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/40 hover:border-[#f5c46a]/60 hover:-translate-y-1 transition-all duration-300 text-left group"
              >
                <div className="w-full h-48 sm:h-52 overflow-hidden bg-black/40 relative">
                  <img
                    src={ritual.image}
                    alt={ritual.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-2.5">
                  <span className="inline-block self-start px-3 py-1 rounded-full bg-[#1f1f23] text-[#e0e0e0] text-xs font-medium border border-white/5">
                    {ritual.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-[#f5c46a] leading-snug group-hover:text-amber-300 transition-colors">
                    {ritual.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal pt-1">
                    {ritual.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sacred Footer Closing */}
          <div className="pt-6 border-t border-[#2d2723] text-center space-y-1.5">
            <div className="text-lg sm:text-2xl font-bold text-[#f5c46a] tracking-widest font-serif">
              ॥ जय श्री राम ॥
            </div>
            <p className="text-xs sm:text-sm text-[#b8afa2]">
              With devotion, prayer and the blessings of Lord Hanuman
            </p>
          </div>
        </div>
      </section>

      {/* PUJA SERVICES & THEIR SIGNIFICANCE */}
      <section className="bg-[#0b0b0b] text-[#f5f5f5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#393027]/60">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="text-left space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
                SACRED SEVAS &amp; PUJAS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-[#f2c16b] tracking-tight">
                Puja Services &amp; Their Significance
              </h2>
              <div className="w-16 h-1 bg-[var(--orange)] rounded-full mt-2" />
              <p className="text-xs sm:text-sm text-[#c5c5c5] font-medium pt-1">
                Explore our traditional puja services and their spiritual significance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMyBookingsOpen(true)}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              title="View your registered seva bookings"
            >
              <span>My Bookings</span>
              {bookingsCount > 0 && (
                <span className="bg-amber-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                  {bookingsCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PUJA_SERVICES.map((puja, idx) => (
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

                <div className="pt-4 border-t border-[#393027] mt-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#bdbdbd] font-medium">Seva Price</span>
                    <strong className="text-2xl font-black font-heading text-[#f2c16b] tracking-tight">
                      {puja.price}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookPuja(puja)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--orange)] to-amber-600 hover:from-amber-600 hover:to-[var(--orange)] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Seva</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
              DEVOTIONAL JOY & CELEBRATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight">
              Annual Festivals & Observances
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Throughout the year, devotees gather in thousands to participate in sacred religious observances and festivals.
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

      {/* Unified Seva Booking Modal */}
      {selectedPujaService && (
        <UnifiedBookingModal
          service={selectedPujaService}
          onClose={() => setSelectedPujaService(null)}
          onBookingSuccess={refreshBookingsCount}
        />
      )}

      {/* Devotee's Bookings Drawer / List */}
      <MyBookingsModal
        open={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
      />
    </div>
  );
};
