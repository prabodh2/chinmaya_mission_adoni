import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Flame,
  Heart,
  Sparkles,
  ChevronRight,
  Sun,
} from 'lucide-react';

export const ChinmayaSanjeevarayaTemplePage = () => {
  useEffect(() => {
    document.title = 'Chinmaya Sanjeevaraya Temple | Chinmaya Mission, Adoni';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
      desc: 'Month-long devotional observances with collective chanting, special devotional offerings, and spiritual talks drawing families across Adoni.',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      name: 'Saturday Satsangs',
      period: 'Every Saturday',
      desc: 'Devotees gather weekly for collective chanting of Sri Vishnu Sahasranamam, Sri Hanuman Chalisa, and bhajans accompanied by prasadam distribution.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
  ];

  const timelineMilestones = [
    {
      year: '2006',
      title: 'Sacred Pratishta (Consecration)',
      context: 'Vyaya Nama Samvatsaram',
      desc: 'Consecrated according to traditional Agama Shastras in line with the vision of Pujya Swamini Shyamananda (Founder, Chinmaya Mission, Adoni) and guided by Pujya Swami Pranavananda, with active patronage from Sri Vitta Bhadrayya, Sri B. V. R. Reddy, Sri Achyutha Mohan Reddy, and dedicated devotees.',
    },
    {
      year: '2012',
      title: 'Sacred Kumbhabhishekam & Havan',
      context: 'Sanctity Renewal & Silver Kavacham',
      desc: 'Kumbhabhishekam performed under the divine guidance of Pujya Swami Paratparananda and Pujya Swami Pranavananda. Devotees performed a sacred Havan and presented silver armour (Kavacham) and ornamental adornments for the Utsava Murtis.',
    },
    {
      year: 'Present',
      title: 'Thriving Devotional & Cultural Centre',
      context: 'Daily Worship & Community Service',
      desc: 'Continues to stand as a vibrant spiritual beacon in Adoni, serving daily seekers, Balavihar children, CHYK youth, and elders through prayer, cultural enrichment, and spiritual contemplation.',
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

  const pujaServices = [
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
              <span>SPIRITUALITY & DEVOTION • ADONI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight leading-tight">
              CHINMAYA SANJEEVARAYA TEMPLE
            </h1>

            <p className="text-amber-200/90 text-sm sm:text-base font-serif italic">
              "Sri Chinnaya Sanjeevarya Swamy Devasthanam — A sacred sanctuary of unwavering faith, strength, and timeless devotional heritage."
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Dedicated to Lord Hanuman (Sri Sanjeevaraya Swamy), Chinmaya Sanjeevaraya Temple is a premier devotional center under Chinmaya Mission, Adoni. Rooted in traditional Agama Shastras and energized by sacred Vedic rituals, the temple serves as an abode of peace, positive vibrations, and community unity for all seekers and devotees.
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
                  src="/assets/images/chinmaya-sanjeevaraya-temple.png"
                  alt="Sri Chinnaya Sanjeevaraya Swamy Devasthanam Adoni"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/activity-sanjeevaraya.png';
                  }}
                  className="w-full h-auto max-h-[460px] object-contain mx-auto my-auto block rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              <div className="text-center pt-3 pb-1 space-y-0.5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  Sri Chinnaya Sanjeevaraya Swamy
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  Presiding Deity • Chinmaya Mission, Adoni
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLE HISTORY & SPIRITUAL SIGNIFICANCE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
            SACRED HERITAGE & ORIGINS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight">
            History and Spiritual Significance
          </h2>
          <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Chronicle Narrative */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed">
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
              The Divine Inspiration Behind the Consecration
            </h3>
            
            <p className="text-sm sm:text-base text-slate-700">
              The <strong className="text-slate-900 font-semibold">Sri Chinnaya Sanjeevaraya Swamy Devasthanam</strong> in Adoni was consecrated in the year <strong className="text-slate-900 font-semibold">2006 (Vyaya Nama Samvatsaram)</strong>. The temple was established in accordance with the profound spiritual vision and inspiration of <strong className="text-[var(--orange)] font-semibold">Pujya Swamini Shyamananda</strong>, the revered founder of Chinmaya Mission, Adoni.
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              Under the sacred guidance of <strong className="text-slate-900 font-semibold">Pujya Swami Pranavananda</strong>, the Pratishta Mahotsavam was performed with strict adherence to traditional <em className="text-slate-900 font-medium">Agama Shastras</em>. This auspicious event brought the entire community together, deeply supported by committed patrons including <strong className="text-slate-900 font-semibold">Sri Vitta Bhadrayya</strong>, <strong className="text-slate-900 font-semibold">Sri B. V. R. Reddy</strong>, <strong className="text-slate-900 font-semibold">Sri Achyutha Mohan Reddy</strong>, and the devoted citizens of Adoni.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-l-4 border-[var(--orange)] space-y-2">
              <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                2012 Sacred Kumbhabhishekam & Silver Kavacham
              </h4>
              <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
                In 2012, to further renew the spiritual sanctity and divine energy of the temple, a sacred <strong className="font-semibold">Kumbhabhishekam</strong> ceremony was solemnized under the guidance of <strong className="font-semibold">Pujya Swami Paratparananda</strong> and <strong className="font-semibold">Pujya Swami Pranavananda</strong>. With enthusiastic community participation, a sacred Havan was conducted, silver armour (Kavacham) was ceremoniously adorned onto the presiding deity, and sacred ornamental pieces were dedicated for the Utsava Murtis.
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              Today, Sri Chinnaya Sanjeevaraya Swamy stands as the divine protector and guardian deity of the Chinmaya Mission, Adoni complex, radiating strength, fearlessness (abhaya), and selfless devotion.
            </p>
          </div>

          {/* Timeline Milestones Cards */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <h3 className="text-base font-extrabold uppercase tracking-wider text-slate-800 px-1">
              Key Chronological Milestones
            </h3>

            {timelineMilestones.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 hover:border-[var(--orange)]/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-black text-xs">
                    {item.year}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {item.context}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold font-heading text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVOTIONAL RITUALS & REGULAR SEVAS */}
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
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
              SACRED SEVAS & PUJAS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-[#f2c16b] tracking-tight">
              Puja Services &amp; Their Significance
            </h2>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-[#c5c5c5] font-medium pt-1">
              Explore our puja services and their spiritual significance.
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

      {/* 6. CALL TO ACTION / VISIT & CONNECT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-3xl bg-gradient-to-r from-[var(--navy,#0B2340)] via-[#122D50] to-[var(--navy,#0B2340)] text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-amber-300 font-extrabold text-xs uppercase tracking-widest border border-white/20">
              VISIT SANJEEVARAYA TEMPLE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Experience the Peace & Divine Presence
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Whether seeking blessings for strength, inner clarity, family well-being, or joining our regular spiritual discourses, all are warmly welcomed at Chinmaya Sanjeevaraya Temple.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/lets-connect"
              className="btn-primary text-xs sm:text-sm py-2.5 sm:py-3 px-6 font-bold shadow-md"
            >
              <span>CONNECT WITH ADONI TEMPLE</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/activities"
              className="btn-secondary text-xs sm:text-sm py-2.5 sm:py-3 px-6 font-bold bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <span>EXPLORE ALL ACTIVITIES</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
