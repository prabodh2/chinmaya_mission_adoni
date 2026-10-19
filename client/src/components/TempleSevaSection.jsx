import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  QrCode,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import './TempleSevaSection.css';

// Supabase Configuration from existing temple app
const SUPABASE_URL = 'https://eybtrqwqaprfefwlgled.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YnRycXdxYXByZmVmd2xnbGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjA2NTAsImV4cCI6MjEwNDI5NjY1MH0.MFMPHC6B7le4adURWeHujyM4-EY5p1lKtn-CEsVWseE';

// Utilities
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isFutureDate(s) {
  return Boolean(s && s >= todayStr());
}

function sanitizePhone(v) {
  return (v || '').replace(/[^0-9]/g, '').slice(0, 10);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
}

function genRefId(prefix = 'SMT') {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${t.slice(-5)}-${r}`;
}

// Local Storage Booking Sync
function getStoredBookings() {
  try {
    const raw = localStorage.getItem('temple_seva_bookings');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function storeBooking(booking) {
  try {
    const list = getStoredBookings();
    list.unshift(booking);
    localStorage.setItem('temple_seva_bookings', JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

// Save to Supabase (REST API)
async function savePujaToSupabase(booking) {
  try {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    // Devotee upsert
    await fetch(`${SUPABASE_URL}/rest/v1/devotees?on_conflict=phone`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify({
        phone: booking.phone,
        name: booking.name,
        email: booking.email || null,
        gotra: booking.gotra || null,
        nakshetra: booking.nakshetra || null,
        address: booking.address || null,
      }),
    }).catch(() => null);

    // Puja booking insert
    const res = await fetch(`${SUPABASE_URL}/rest/v1/puja_bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: booking.phone,
        puja_name: booking.pujaName,
        puja_type: booking.pujaType || 'general',
        puja_date: booking.date,
        amount: booking.amount || 0,
        gotra: booking.gotra || null,
        nakshetra: booking.nakshetra || null,
        address: booking.address || null,
      }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Supabase online sync skipped (saved locally)', err);
    return null;
  }
}

// 8 Seva Cards Data matching the reference specification
export const POOJA_SERVICES = [
  {
    id: 'nitya-pratah',
    name: 'Nitya Pratah|Puja',
    desc: 'The awakening of the deity with sacred chants',
    icon: '☀',
    pujaType: 'nitya_pratah',
    options: [
      { name: 'Nitya Deeparadhana Seva (1 Month)', price: 516 },
      { name: 'Visesa Dravya Abhishekam (1 Day)', price: 516 },
      { name: 'Somavara Visesha Puja (1 Month)', price: 2500 },
      { name: 'Nitya Archana Seva (1 Month)', price: 5116 },
      { name: 'Pournima Visesha Puja (1 Year)', price: 6000 },
      { name: 'Amavasya Visesha Puja (1 Year)', price: 6000 },
      { name: 'Masa Shivaratri Puja (1 Year)', price: 6000 },
      { name: 'Arudra Nakshatra Puja (1 Year)', price: 6000 },
    ],
  },
  {
    id: 'visesha-pujas',
    name: 'Visesha|Pujas',
    desc: 'Sacred bathing with special Dravyas',
    icon: '❖',
    pujaType: 'visesha_puja',
    options: [
      { name: 'Kartika Deeparadhana (1 Month)', price: 516 },
      { name: 'Pushalankara Seva', price: 999 },
      { name: 'Visesha Bhasmarchana Puja', price: 1001 },
      { name: 'Nandishwara Puja', price: 1111 },
      { name: 'Saravana Puja', price: 1111 },
      { name: 'Veerabhadra Puja', price: 1111 },
      { name: 'Kaala Bhairava Puja', price: 1111 },
      { name: 'Ganesha Puja', price: 1111 },
      { name: 'Graha Dosha Parihara Puja', price: 2116 },
      { name: 'Shani Tailabhisheka-Puja', price: 2116 },
      { name: 'Vastra Samarpana Seva (Shiva-Shakti)', price: 2499 },
      { name: 'Shiva-Shakti Aaradhana Puja', price: 5116 },
      { name: 'Birth Anniversary Seva with Rudrabhishekam', price: 5116 },
      { name: 'Vivaha Anniversary Seva with Rudrabhishekam', price: 5116 },
      { name: 'Navagrha Puja', price: 5116 },
      { name: 'Kartika Sopana Deepotsavam (Kartika Pournami)', price: 5116 },
      { name: 'Sahasra Bilvarchana Puja', price: 10008 },
      { name: 'Varuna Homam', price: 50001 },
      { name: 'Pancha Boota Shiva Puja', price: 50116 },
    ],
  },
  {
    id: 'rudrabhishekam',
    name: 'RudrAbhishekam',
    desc: 'Abhishekam with Sri Rudram Namakam Chamakam',
    icon: 'ॐ',
    pujaType: 'rudrabhishekam',
    fixedAmount: 2116,
    descriptionText:
      'Sacred Abhishekam with Sri Rudram Namakam Chamakam, performed in your name by our Vedic priests.',
  },
  {
    id: 'pradosha-puja',
    name: 'Pradosha|Puja',
    desc: 'Twilight worship to Lord Shiva',
    icon: '◇',
    pujaType: 'pradosha',
    fixedAmount: 2116,
    descriptionText:
      'Twilight worship to Lord Shiva, performed during the sacred Pradosha Kaalam. Abhishekam with Sri Rudram.',
  },
  {
    id: 'sri-chakra',
    name: 'Sri Chakra|KumkumArchana',
    desc: 'Kumkuma puja',
    icon: '✴',
    pujaType: 'sri_chakra_kumkumarchana',
    options: [
      { name: '1 Day Sacred Kumkumarchana', price: 516 },
      { name: '1 Month Divine Kumkumarchana', price: 15116 },
    ],
  },
  {
    id: 'sacred-homas',
    name: 'Sacred Homas',
    desc: 'Vedic fire rituals',
    icon: '🔥',
    pujaType: 'sacred_homa',
    fixedPrice: 15116,
    options: [
      { name: 'Rudra Homam', price: 15116 },
      { name: 'Maha Mrutyunjaya Homam', price: 15116 },
      { name: 'Kala Bhairava Homam', price: 15116 },
      { name: 'Sri Dakshina Murthy Homam', price: 15116 },
      { name: 'Durga Homam', price: 15116 },
      { name: 'Dhanvantari Homam', price: 15116 },
      { name: 'Nakshatra Homam', price: 15116 },
      { name: 'Navagraha Homam', price: 15116 },
      { name: 'Ganapathi Homam', price: 15116 },
      { name: 'Lalitha Homam', price: 15116 },
      { name: 'Pratyangira Homam', price: 15116 },
      { name: 'Chandi Homam', price: 15116 },
      { name: 'Pavamana Homam', price: 15116 },
      { name: 'Vaarahi Homam', price: 15116 },
      { name: 'Veerabhadra Homam', price: 15116 },
    ],
  },
  {
    id: 'nitya-naivedyam',
    name: 'Nitya Naivedyam',
    desc: 'Prasadam offering (Daily 1kg)',
    icon: '◐',
    pujaType: 'nitya_naivedyam',
    fixedAmount: 10000,
    descriptionText:
      'Daily 1 kg divine naivedyam will be prepared with pure ghee and grains, and offered to the deity in your name for one full month.',
  },
  {
    id: 'maha-shivaratri',
    name: 'Maha Shivaratri|Special',
    desc: 'Auspicious Maghamasa Pujas & Abhishekams (30 Days)',
    icon: '✶',
    pujaType: 'maha_shivaratri',
    isSpecial: true,
    options: [
      { name: 'Daily Sankalpa Rudrabhisheka Puja (30 Days) with Prasadam', price: 1221 },
      {
        name: 'Daily Sankalpa Rudrabhisheka Puja (30 Days) + Shiva Parvati Kalyana Seva',
        price: 10008,
      },
      {
        name: 'Daily Sankalpa Rudrabhisheka Puja (30 Days) + Shiva Parvati Kalyana Seva + Anna Prasada Seva',
        price: 15116,
      },
    ],
  },
];

const NAKSHATRAS = [
  'Ashwini (అశ్విని)',
  'Bharani (భరణి)',
  'Krittika (కృత్తిక)',
  'Rohini (రోహిణి)',
  'Mrigashira (మృగశిర)',
  'Ardra (ఆర్ద్ర)',
  'Punarvasu (పునర్వసు)',
  'Pushya (పుష్య)',
  'Ashlesha (ఆశ్లేష)',
  'Magha (మఖ)',
  'Purva Phalguni / Pubba (పూర్వ ఫల్గుని)',
  'Uttara Phalguni / Uttara (ఉత్తర ఫల్గుని)',
  'Hasta (హస్త)',
  'Chitra (చిత్ర)',
  'Swati (స్వాతి)',
  'Vishakha (విశాఖ)',
  'Anuradha (అనూరాధ)',
  'Jyeshtha (జ్యేష్ఠ)',
  'Mula (మూల)',
  'Purva Ashadha (పూర్వాషాఢ)',
  'Uttara Ashadha (ఉత్తరాషాఢ)',
  'Shravana (శ్రవణ)',
  'Dhanishta (ధనిష్ట)',
  'Shatabhisha (శతభిష)',
  'Purva Bhadrapada (పూర్వాభాద్ర)',
  'Uttara Bhadrapada (ఉత్తరాభాద్ర)',
  'Revati (రేవతి)',
  'Not Sure / Other',
];

// ==========================================
// Unified Seva Booking Modal (Exact Image 1 Theme)
// ==========================================
export function UnifiedBookingModal({ service, onClose, onBookingSuccess }) {
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'confirmed'
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dob: '',
    gotram: '',
    nakshatra: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [bookingReceipt, setBookingReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize selected option
  useEffect(() => {
    if (!service) return;
    if (service.options && service.options.length > 0) {
      setSelectedOption(service.options[0]);
    } else {
      setSelectedOption({
        name: (service.name || service.title || 'Sacred Seva').replace('|', ' '),
        price: service.fixedAmount || 0,
      });
    }
  }, [service]);

  // Lock body scroll and set up escape key listener
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!service) return null;

  const currentAmount = selectedOption ? selectedOption.price : service.fixedAmount || 0;
  const serviceDisplayName = (service.name || service.title || 'Sacred Seva').replace('|', ' ');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^[0-9+-\s()]{7,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email ID';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewClick = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep('review');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Confirm Seva Booking
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const prefix = service.refIdPrefix || 'SMT';
    const refId = genRefId(prefix);
    const bookingData = {
      refId,
      pujaName: selectedOption ? selectedOption.name : serviceDisplayName,
      serviceCategory: serviceDisplayName,
      pujaType: service.pujaType || 'seva',
      templeName: service.templeName || 'Shri Shantamalleshwara Swami Temple',
      amount: currentAmount,
      name: formData.name.trim(),
      gotra: formData.gotram.trim(),
      nakshetra: formData.nakshatra.trim(),
      phone: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      date: formData.dob || todayStr(),
      address: formData.address.trim(),
      createdAt: new Date().toISOString(),
      status: 'Confirmed (Priest Sankalpa Scheduled)',
    };

    // 1. Save to temple_seva_bookings
    storeBooking(bookingData);

    // 2. Also save to devotee_donations_history for unified records
    try {
      const existing = JSON.parse(localStorage.getItem('devotee_donations_history') || '[]');
      existing.unshift({
        ...formData,
        sevaName: bookingData.pujaName,
        templeName: bookingData.templeName,
        amount: currentAmount,
        refId,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('devotee_donations_history', JSON.stringify(existing.slice(0, 50)));
    } catch (_) {}

    // 3. Sync to Supabase in background
    savePujaToSupabase(bookingData).catch((err) => console.warn('Supabase sync:', err));

    // 4. Update UI to Confirmed Step
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingReceipt(bookingData);
      setStep('confirmed');
      if (onBookingSuccess) onBookingSuccess();
    }, 450);
  };

  // Dynamic values for single-page print receipt
  const activeTempleName =
    bookingReceipt?.templeName ||
    service?.templeName ||
    (service?.refIdPrefix === 'CST'
      ? 'Chinmaya Sanjeevaraya Temple'
      : 'Shri Shantamalleshwara Swami Temple');

  const printRefId =
    bookingReceipt?.refId ||
    `${service?.refIdPrefix || 'SMT'}-${Date.now().toString(36).slice(-5).toUpperCase()}`;

  const printPujaName =
    bookingReceipt?.pujaName ||
    (selectedOption ? selectedOption.name : serviceDisplayName);

  const printDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const printDobStr = formData.dob
    ? new Date(formData.dob).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'As Scheduled by Priest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Print-specific style ensuring ONLY the 1-page Official Receipt prints */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden !important;
          }
          #temple-seva-printable-receipt,
          #temple-seva-printable-receipt * {
            visibility: visible !important;
          }
          #temple-seva-printable-receipt {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 190mm !important;
            margin: 0 auto !important;
            padding: 4mm 6mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            color: #0f172a !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* DEDICATED 1-PAGE PRINTABLE TEMPLE RECEIPT */}
      <div id="temple-seva-printable-receipt" className="hidden" aria-hidden="true">
        <div style={{ border: '2px solid #b45309', padding: '14px 18px', borderRadius: '8px', background: '#ffffff' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #d97706', paddingBottom: '10px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.25em', color: '#b45309', textTransform: 'uppercase' }}>
              ॥ श्री चिन्मय मिशन आधोनी ॥
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '4px 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activeTempleName}
            </h1>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
              Chinmaya Mission, Adoni, Andhra Pradesh
            </div>
            <div style={{ display: 'inline-block', marginTop: '6px', padding: '3px 12px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', color: '#92400e', textTransform: 'uppercase' }}>
              Official Seva & Sankalpa Registration Receipt
            </div>
          </div>

          {/* Reference & Date Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '7px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#64748b', fontWeight: '600' }}>Booking Ref ID: </span>
              <strong style={{ fontFamily: 'monospace', fontSize: '13px', color: '#b45309' }}>{printRefId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: '600' }}>Registration Date: </span>
              <strong>{printDateStr}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: '600' }}>Status: </span>
              <strong style={{ color: '#16a34a' }}>✓ Confirmed with Priest</strong>
            </div>
          </div>

          {/* Seva Offering Highlight Box */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '6px', padding: '10px 14px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.08em' }}>
                  Sacred Seva Offering
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                  {printPujaName}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                  Temple: <strong>{activeTempleName}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.08em' }}>
                  Offering Amount
                </div>
                <div style={{ fontSize: '17px', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                  ₹{Number(currentAmount).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700' }}>
                  ✓ Voluntary Religious Contribution
                </div>
              </div>
            </div>
          </div>

          {/* Devotee Sankalpa Details (Structured 2-column Grid) */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
              Devotee & Sankalpa Information
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '4px 6px', width: '22%', color: '#64748b', fontWeight: '600' }}>Devotee Name:</td>
                  <td style={{ padding: '4px 6px', width: '38%', fontWeight: '700', color: '#0f172a' }}>{formData.name || '—'}</td>
                  <td style={{ padding: '4px 6px', width: '18%', color: '#64748b', fontWeight: '600' }}>Gotram:</td>
                  <td style={{ padding: '4px 6px', width: '22%', fontWeight: '700', color: '#0f172a' }}>{formData.gotram || 'Not Specified'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: '600' }}>Phone Number:</td>
                  <td style={{ padding: '4px 6px', fontWeight: '700', color: '#0f172a' }}>{formData.phoneNumber || '—'}</td>
                  <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: '600' }}>Nakshatra:</td>
                  <td style={{ padding: '4px 6px', fontWeight: '700', color: '#0f172a' }}>{formData.nakshatra || 'Not Specified'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: '600' }}>Email Address:</td>
                  <td style={{ padding: '4px 6px', fontWeight: '600', color: '#0f172a' }}>{formData.email || '—'}</td>
                  <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: '600' }}>Sankalpa Date:</td>
                  <td style={{ padding: '4px 6px', fontWeight: '600', color: '#0f172a' }}>{printDobStr}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 6px', color: '#64748b', fontWeight: '600' }}>Residential Address:</td>
                  <td colSpan="3" style={{ padding: '4px 6px', color: '#334155' }}>{formData.address || 'Not Specified'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sacred Blessing & Agamic Notice */}
          <div style={{ background: '#f8fafc', borderLeft: '3px solid #b45309', padding: '7px 10px', borderRadius: '4px', marginBottom: '12px', fontSize: '10px', lineHeight: '1.45', color: '#475569' }}>
            <strong style={{ color: '#0f172a' }}>Hari Om! </strong>
            Your sacred Gotram, Nakshatra, and family sankalpa have been recorded in the temple records. The Archana and Vedic rituals will be performed by the temple purohits according to Agamic traditions. May divine grace illuminate your life with health, happiness, and peace.
          </div>

          {/* Footer & Signature Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '10px', color: '#64748b' }}>
            <div>
              <div><strong>Chinmaya Mission, Adoni</strong></div>
              <div>Near Arts College / Hilltop Shrine, Adoni, AP - 518301</div>
              <div>Helpline: +91 94402 85859 | Web: chinmayamissionadoni.org</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '130px', borderBottom: '1px dashed #94a3b8', height: '30px', marginBottom: '3px' }}></div>
              <div style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>Authorized Temple Seal / Signature</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#061527]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#EAE0CE] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden z-10 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C1A30] via-[#142845] to-[#0C1A30] text-white p-5 sm:p-6 relative border-b border-[#C89B59]/30 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C89B59]/20 border border-[#C89B59]/40 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#E6BF70] fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-spiritual-heading text-white tracking-wide">
                  {step === 'review'
                    ? 'Review Details & Contribution'
                    : step === 'confirmed'
                    ? 'Sankalpa Registered'
                    : 'EXPLORE CONTRIBUTION OPTIONS'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#F4E8D3]/80">
                  {step === 'review'
                    ? 'Verify your sacred details before offering seva'
                    : step === 'confirmed'
                    ? 'May the presiding deity bless you and your family'
                    : 'Pooja Sankalpa, Devotee Details & Contribution Record'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Pill */}
          {step !== 'confirmed' && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#E6BF70]">
                <span className="w-5 h-5 rounded-full bg-[#C89B59] text-[#0C1A30] font-bold flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Devotee Details</span>
              </span>
              <div className="h-0.5 flex-1 mx-3 bg-white/20">
                <div
                  className={`h-full bg-[#C89B59] transition-all duration-300 ${
                    step === 'review' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'review' ? 'text-[#E6BF70]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                    step === 'review'
                      ? 'bg-[#C89B59] text-[#0C1A30]'
                      : 'bg-white/20 text-slate-300'
                  }`}
                >
                  2
                </span>
                <span>Review & QR</span>
              </span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#FAF7F2]">
          {/* ========================================================= */}
          {/* STEP 1: FORM INPUTS                                       */}
          {/* ========================================================= */}
          {step === 'form' && (
            <form onSubmit={handleReviewClick} className="space-y-5">
              {/* Sacred Information Callout */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] text-xs sm:text-sm text-[#4A5568] leading-relaxed shadow-sm">
                <p className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B59] shrink-0 mt-0.5" />
                  <span>
                    Please provide your sacred details for the <strong>Pooja Sankalpa</strong>,
                    temple blessings, and formal donation acknowledgement.
                  </span>
                </p>
              </div>

              {/* Seva Offering Selection / Summary */}
              {service.options && service.options.length > 1 ? (
                <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                      Select Seva Package <span className="text-[#C89B59]">({serviceDisplayName})</span>
                    </label>
                    <span className="text-sm font-black text-[#B8860B]">
                      ₹{currentAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedOption?.name}
                      onChange={(e) => {
                        const opt = service.options.find((o) => o.name === e.target.value);
                        if (opt) setSelectedOption(opt);
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#D9CEBA] text-xs sm:text-sm text-[#0C1A30] font-medium focus:outline-none focus:ring-2 focus:ring-[#C89B59] cursor-pointer"
                    >
                      {service.options.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name} — ₹{opt.price.toLocaleString('en-IN')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EAE0CE] shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Selected Seva Offering
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0C1A30]">
                      {selectedOption?.name || serviceDisplayName}
                    </span>
                    {service.templeName && (
                      <span className="text-xs text-[#C89B59] font-medium block">
                        {service.templeName}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Seva Price
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#B8860B]">
                      ₹{currentAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {/* Devotee Sacred Form Fields (Matching Image 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Ramesh Kummar"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                {/* 2. Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g., +91 98765 43210"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500 font-medium">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* 3. Email ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., rameshkummar@gmail.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* 4. Date of Birth */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Date of Birth (DOB)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all"
                    />
                  </div>
                </div>

                {/* 5. Gotram */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Gotram (గోత్రం)
                  </label>
                  <div className="relative">
                    <Flame className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="gotram"
                      value={formData.gotram}
                      onChange={handleChange}
                      placeholder="e.g., Bharadwaja, Kaundinya, Kashya"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all"
                    />
                  </div>
                </div>

                {/* 6. Nakshatra */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Nakshatra (నక్షత్రం)
                  </label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      name="nakshatra"
                      value={formData.nakshatra}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all cursor-pointer appearance-none"
                    >
                      <option value="">-- Select Birth Star / Nakshatra --</option>
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak} value={nak}>
                          {nak}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 7. Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Address (నివాసం)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Door No, Street, City, State, Pincode"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-seva-register px-6 py-2.5 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Review Details</span>
                  <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2: REVIEW DETAILS VIEW                               */}
          {/* ========================================================= */}
          {step === 'review' && (
            <div className="space-y-6">
              {/* Review Card */}
              <div className="bg-white rounded-2xl border-2 border-[#C89B59]/40 shadow-sm p-5 sm:p-6 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#EAE0CE] pb-3">
                  <div className="flex items-center gap-2 text-[#0C1A30]">
                    <ShieldCheck className="w-5 h-5 text-[#C89B59]" />
                    <h4 className="font-spiritual-heading font-bold text-base sm:text-lg">
                      Sankalpa &amp; Seva Summary
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#B8860B] hover:text-[#8B6508] bg-[#FAF5EA] px-3 py-1.5 rounded-lg border border-[#C89B59]/30 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Seva Offering
                    </span>
                    <span className="font-bold text-[#0C1A30] text-base">
                      {selectedOption ? selectedOption.name : serviceDisplayName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Seva Price / Dakshina
                    </span>
                    <span className="font-bold text-[#B8860B] text-base">
                      ₹{currentAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Devotee Name
                    </span>
                    <span className="font-bold text-[#0C1A30] text-base">
                      {formData.name || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.phoneNumber || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email Address
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.email || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date of Birth
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.dob
                        ? new Date(formData.dob).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Not Specified'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Gotram
                    </span>
                    <span className="font-semibold text-[#0C1A30]">
                      {formData.gotram || 'Not Specified'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nakshatra (Birth Star)
                    </span>
                    <span className="font-semibold text-[#0C1A30]">
                      {formData.nakshatra || 'Not Specified'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Residential Address
                    </span>
                    <span className="font-medium text-slate-700 leading-relaxed">
                      {formData.address || 'Not Specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-gradient-to-br from-[#FAF5EA] to-[#F3E8D0] rounded-2xl border-2 border-dashed border-[#C89B59] p-6 text-center space-y-3 shadow-inner">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#C89B59]/40 flex items-center justify-center mx-auto text-[#0C1A30] shadow-sm">
                  <QrCode className="w-8 h-8 text-[#C89B59]" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-spiritual-heading font-bold text-base text-[#0C1A30]">
                    Payment QR Code
                  </h5>
                  <p className="text-xs sm:text-sm text-[#4A5568] max-w-md mx-auto">
                    The official seva payment QR code will be displayed here for direct UPI / Net Banking transfer.
                  </p>
                </div>
                <div className="inline-block px-3.5 py-1.5 rounded-full bg-white/80 border border-[#C89B59]/40 text-xs font-bold text-[#8B6508]">
                  ✨ QR Code will be printed / activated here shortly
                </div>
              </div>

              {/* Bottom Review Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-4 py-2.5 rounded-xl border border-[#C89B59] text-[#0C1A30] hover:bg-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Print Devotee Summary"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="btn-seva-register px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0A192F]" />
                    <span>{isSubmitting ? 'Registering...' : 'Confirm & Finish'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CONFIRMED VIEW                                    */}
          {/* ========================================================= */}
          {step === 'confirmed' && (
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl sm:text-2xl font-bold font-spiritual-heading text-[#0C1A30]">
                  Sankalpa Registered With Gratitude!
                </h4>
                <p className="text-sm text-[#4A5568] leading-relaxed">
                  Hari Om, <strong>{formData.name}</strong>. Thank you for booking{' '}
                  <strong className="text-[#0C1A30]">{bookingReceipt?.pujaName}</strong> at{' '}
                  <strong>{bookingReceipt?.templeName}</strong>. Your sacred details have been recorded for Vedic archana and priest sankalpa.
                </p>
              </div>

              {bookingReceipt && (
                <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] max-w-md mx-auto text-xs text-slate-700 space-y-2 shadow-sm text-left">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Booking Reference</span>
                    <span className="font-mono font-bold text-[#B8860B] text-xs">{bookingReceipt.refId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Seva Offering:</span>
                    <span className="font-bold text-[#0C1A30]">{bookingReceipt.pujaName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Devotee Name:</span>
                    <span className="font-medium text-slate-800">{bookingReceipt.name}</span>
                  </div>
                  {bookingReceipt.nakshetra && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Nakshatra:</span>
                      <span className="font-medium text-slate-800">{bookingReceipt.nakshetra}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold text-emerald-600">✓ Confirmed with Priest</span>
                  </div>
                </div>
              )}

              {/* Receipt / QR notice */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] max-w-md mx-auto text-xs text-slate-600 leading-relaxed shadow-sm">
                <p>
                  Official receipt and tax exemption acknowledgement will be shared on <strong>{formData.email}</strong> once your donation is received via the upcoming QR code or bank transfer.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-seva-register px-8 py-2.5 text-sm font-bold cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Devotee Bookings Drawer / Modal
// ==========================================
export function MyBookingsModal({ open, onClose }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (open) {
      setBookings(getStoredBookings());
    }
  }, [open]);

  if (!open) return null;

  const clearAll = () => {
    if (window.confirm('Clear all stored booking records from this browser?')) {
      localStorage.removeItem('temple_seva_bookings');
      setBookings([]);
    }
  };

  return (
    <div className="seva-modal-backdrop" onClick={onClose}>
      <div
        className="seva-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680 }}
      >
        <button className="seva-modal-close" onClick={onClose}>
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span
            className="seva-eyebrow"
            style={{ color: '#FFA048', fontWeight: 700, letterSpacing: '0.28em' }}
          >
            Your Records
          </span>
          <h2
            style={{
              marginTop: 12,
              fontSize: 30,
              color: '#FFFFFF',
              fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
              fontWeight: 600,
            }}
          >
            Registered Sevas
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#E2E8F0' }}>
            <p style={{ fontStyle: 'italic', fontSize: 18, marginBottom: 16, color: '#FFFFFF' }}>
              No sevas booked yet in this session.
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>
              Click "Book Seva" on any seva below to register your sacred intention.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--seva-ivory-faint)' }}>
                Total Bookings: {bookings.length}
              </span>
              <button
                onClick={clearAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff7675',
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear History
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                maxHeight: 400,
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              {bookings.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 122, 46, 0.04)',
                    border: '1px solid var(--seva-line-soft)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--seva-gold)',
                        fontSize: 16,
                      }}
                    >
                      {b.pujaName}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--seva-f-mono)',
                        fontSize: 11,
                        color: 'var(--seva-ivory-faint)',
                      }}
                    >
                      {b.refId}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      color: 'var(--seva-ivory-dim)',
                    }}
                  >
                    <span>
                      Devotee: {b.name} {b.gotra ? `(${b.gotra} gotra)` : ''}
                    </span>
                    <span>Date: {b.date}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      color: 'var(--seva-ivory-faint)',
                      marginTop: 4,
                    }}
                  >
                    <span>Nakshatra: {b.nakshetra}</span>
                    <span style={{ color: '#2ecc71' }}>✓ Direct Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button
            className="seva-btn"
            style={{ width: 'auto', padding: '10px 30px' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Exported Component: The Hours of Devotion & Seva
// ==========================================
export const TempleSevaSection = () => {
  const [activeService, setActiveService] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  const refreshCount = () => {
    setBookingsCount(getStoredBookings().length);
  };

  useEffect(() => {
    refreshCount();
  }, []);

  return (
    <div className="temple-seva-wrapper">
      {/* Top Bar with Brand & My Bookings Action */}
      <header className="seva-top-bar">
        <a href="#services" className="seva-temple-brand">
          <span className="seva-temple-om">ॐ</span>
          <span className="seva-temple-title">Shri Shantamalleshwara Swami Temple</span>
        </a>

        <div className="seva-top-actions">
          <button className="seva-my-bookings-btn" onClick={() => setMyBookingsOpen(true)}>
            <span>My Bookings</span>
            {bookingsCount > 0 && <span className="seva-booking-badge">{bookingsCount}</span>}
          </button>
        </div>
      </header>

      {/* Seva Section */}
      <section id="services" className="seva-section" data-screen-label="03 Pooja Timings">
        <div className="seva-ambient-glow-bottom"></div>

        <div className="seva-container">
          {/* Header */}
          <div className="seva-header-block">
            <span className="seva-eyebrow">Daily Rhythm</span>
            <h2 style={{ marginTop: 24 }}>
              The Hours of <span className="seva-serif-display" style={{ color: 'var(--seva-gold)' }}>Devotion &amp; Seva</span>
            </h2>
            <p className="seva-header-description">
              Sacred services mark our days — each a returning to silence, each an offering of light.
              Choose a seva, name the divine intention, and our priests will perform it in your name.
            </p>
          </div>

          {/* 8 Cards Grid (4x2 on Desktop) */}
          <div className="seva-grid">
            {POOJA_SERVICES.map((p) => {
              const isShivaratri = p.id === 'maha-shivaratri';
              return (
                <div
                  key={p.id}
                  className={`seva-card seva-pooja-card ${
                    isShivaratri ? 'seva-maha-shivaratri-card' : ''
                  }`}
                >
                  {isShivaratri && <div className="seva-shivaratri-glow"></div>}

                  {/* Icon */}
                  <div className="seva-pooja-card-icon">{p.icon}</div>

                  {/* Name */}
                  <h3>
                    {p.name.includes('|') ? (
                      p.name.split('|').map((line, li) => (
                        <React.Fragment key={li}>
                          {line}
                          {li === 0 && <br />}
                        </React.Fragment>
                      ))
                    ) : (
                      p.name
                    )}
                  </h3>

                  {/* Description */}
                  <div className="seva-pooja-card-desc">{p.desc}</div>

                  {/* Book Now Action */}
                  <button
                    className="seva-btn"
                    onClick={() => setActiveService(p)}
                    aria-label={`Book ${p.name.replace('|', ' ')}`}
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Unified Booking Modal */}
      {activeService && (
        <UnifiedBookingModal
          service={activeService}
          onClose={() => setActiveService(null)}
          onBookingSuccess={refreshCount}
        />
      )}

      {/* Devotee's Bookings Drawer / List */}
      <MyBookingsModal open={myBookingsOpen} onClose={() => setMyBookingsOpen(false)} />

      {/* Sacred Seva Closing Footer */}
      <footer className="seva-temple-footer">
        <div className="seva-container">
          <div
            style={{
              fontFamily: 'var(--seva-f-sanskrit)',
              fontSize: 32,
              color: 'var(--seva-gold)',
            }}
          >
            ॐ नमः शिवाय
          </div>
          <p>Shri Shantamalleshwara Swami Temple Sanctuary</p>
          <p style={{ fontSize: 12, color: 'var(--seva-ivory-faint)' }}>
            All bookings are processed directly without payment. Sanctified priests conduct sevas with devotion.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TempleSevaSection;
