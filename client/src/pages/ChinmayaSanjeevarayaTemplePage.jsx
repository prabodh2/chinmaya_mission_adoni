import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Heart,
  Sparkles,
  ChevronRight,
  Sun,
  Compass,
} from 'lucide-react';

export const ChinmayaSanjeevarayaTemplePage = () => {
  useEffect(() => {
    document.title = 'Chinmaya Sanjeevaraya Temple | Chinmaya Mission Adoni';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const templeTimings = [
    { day: 'Morning Darshan', time: '06:00 AM – 11:30 AM', note: 'Suprabhatam & Nitya Pooja' },
    { day: 'Evening Darshan', time: '05:30 PM – 08:30 PM', note: 'Sandhya Arati & Bhajan' },
    { day: 'Saturday Special', time: '06:00 AM – 12:30 PM & 05:00 PM – 09:00 PM', note: 'Special Abhishekam & Hanuman Chalisa' },
  ];

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
      desc: 'Consecrated according to traditional Agama Shastras in line with the vision of Pujya Swamini Shyamananda (Founder, Chinmaya Mission Adoni) and guided by Pujya Swami Pranavananda, with active patronage from Sri Vitta Bhadrayya, Sri B. V. R. Reddy, Sri Achyutha Mohan Reddy, and dedicated devotees.',
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
              Dedicated to Lord Hanuman (Sri Sanjeevaraya Swamy), Chinmaya Sanjeevaraya Temple is a premier devotional center under Chinmaya Mission Adoni. Rooted in traditional Agama Shastras and energized by sacred Vedic rituals, the temple serves as an abode of peace, positive vibrations, and community unity for all seekers and devotees.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Consecrated: 2006 (Vyaya Nama)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[var(--orange)]" />
                <span>Chinmaya Mission, Adoni</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Agama Shastra Sampradaya</span>
              </div>
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
                  Presiding Deity • Chinmaya Mission Adoni
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEMPLE TIMINGS & DAILY SATSANG */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {templeTimings.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-lg shadow-amber-950/5 border border-amber-900/10 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[var(--orange)] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold font-heading text-slate-900 uppercase tracking-wide">
                  {item.day}
                </h3>
              </div>
              <p className="text-base sm:text-lg font-black text-[var(--orange)] tracking-tight">
                {item.time}
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {item.note}
              </p>
            </div>
          ))}
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
              Today, Sri Chinnaya Sanjeevaraya Swamy stands as the divine protector and guardian deity of the Chinmaya Mission Adoni complex, radiating strength, fearlessness (abhaya), and selfless devotion.
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
