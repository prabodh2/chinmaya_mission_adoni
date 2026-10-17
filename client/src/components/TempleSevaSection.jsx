import React, { useState, useEffect } from 'react';
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

// ==========================================
// Unified Seva Booking Modal (No Payment!)
// ==========================================
export function UnifiedBookingModal({ service, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    gotra: '',
    nakshetra: '',
    whatsapp: '',
    email: '',
    date: '',
    address: '',
  });
  const [bookingReceipt, setBookingReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!service) return;
    if (service.options && service.options.length > 0) {
      setSelectedOption(service.options[0]);
    } else {
      setSelectedOption({
        name: service.name.replace('|', ' '),
        price: service.fixedAmount || 0,
      });
    }
  }, [service]);

  if (!service) return null;

  const currentAmount = selectedOption ? selectedOption.price : service.fixedAmount || 0;
  const serviceDisplayName = service.name.replace('|', ' ');

  const canContinueDetails =
    form.name.trim().length > 0 &&
    form.nakshetra.trim().length > 0 &&
    form.whatsapp.length === 10 &&
    isValidEmail(form.email) &&
    isFutureDate(form.date);

  const filteredOptions = service.options
    ? service.options.filter((o) => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Confirm Booking (WITHOUT PAYMENT)
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const prefix = service.refIdPrefix || 'SMT';
    const refId = genRefId(prefix);
    const bookingData = {
      refId,
      pujaName: selectedOption ? selectedOption.name : serviceDisplayName,
      serviceCategory: serviceDisplayName,
      pujaType: service.pujaType,
      templeName: service.templeName || 'Sri Santha Malleshwara Swami Temple',
      amount: currentAmount,
      name: form.name.trim(),
      gotra: form.gotra.trim(),
      nakshetra: form.nakshetra.trim(),
      phone: form.whatsapp.trim(),
      email: form.email.trim(),
      date: form.date,
      address: form.address.trim(),
      createdAt: new Date().toISOString(),
      status: 'Confirmed (Priest Sankalpa Scheduled)',
    };

    // 1. Save locally
    storeBooking(bookingData);

    // 2. Sync to Supabase in background
    savePujaToSupabase(bookingData).catch((err) => console.warn('Supabase sync:', err));

    // 3. Complete
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingReceipt(bookingData);
      setStep(4);
      if (onBookingSuccess) onBookingSuccess();
    }, 500);
  };

  return (
    <div className="seva-modal-backdrop" onClick={onClose}>
      <div className="seva-modal" onClick={(e) => e.stopPropagation()}>
        <button className="seva-modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span
            className="seva-eyebrow"
            style={{
              color: '#FFA048',
              fontWeight: 700,
              letterSpacing: '0.3em',
              fontSize: 12,
              textTransform: 'uppercase',
            }}
          >
            {step === 4 ? 'Divine Confirmation' : `Step ${step} of 3`}
          </span>
          <h2
            style={{
              marginTop: 12,
              fontSize: 32,
              color: '#FFFFFF',
              fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}
          >
            {step === 4 ? 'Sankalpa Received' : serviceDisplayName}
          </h2>
        </div>

        {/* Step Indicators */}
        {step < 4 && (
          <div style={{ marginBottom: 28, display: 'flex', gap: 8 }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: s <= step ? '#FF7A2E' : 'rgba(255, 255, 255, 0.16)',
                  boxShadow: s <= step ? '0 0 10px rgba(255, 122, 46, 0.6)' : 'none',
                  transition: 'background 0.4s ease, box-shadow 0.4s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* STEP 1: Select Seva Option */}
        {step === 1 && (
          <div>
            {service.options && service.options.length > 0 ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <label
                    className="seva-field-label"
                    style={{ marginBottom: 0, color: '#FFA048', fontWeight: 700 }}
                  >
                    Select Seva Package
                  </label>
                  {service.options.length > 6 && (
                    <input
                      type="text"
                      placeholder="Search seva..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="seva-input"
                      style={{ maxWidth: 220, padding: '8px 12px', fontSize: 13 }}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      service.options.length > 2
                        ? 'repeat(auto-fit, minmax(240px, 1fr))'
                        : '1fr',
                    gap: 12,
                    maxHeight: '340px',
                    overflowY: 'auto',
                    paddingRight: 6,
                    marginBottom: 24,
                  }}
                >
                  {filteredOptions.map((opt) => {
                    const isSelected = selectedOption && selectedOption.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        className={`seva-option-card-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedOption(opt)}
                        style={{
                          background: isSelected
                            ? 'rgba(255, 122, 46, 0.16)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isSelected
                            ? '1.5px solid #FF7A2E'
                            : '1px solid rgba(255, 255, 255, 0.18)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: isSelected ? '#FFA048' : '#FFFFFF',
                          }}
                        >
                          {opt.name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
                            fontSize: 20,
                            color: '#FF7A2E',
                            fontWeight: 700,
                          }}
                        >
                          ₹{opt.price.toLocaleString('en-IN')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: '1.5px solid rgba(255, 122, 46, 0.5)',
                  background: 'linear-gradient(180deg, rgba(255, 122, 46, 0.14) 0%, rgba(13, 21, 44, 0.85) 100%)',
                  padding: '36px 26px',
                  textAlign: 'center',
                  marginBottom: 28,
                  borderRadius: '12px',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(255, 122, 46, 0.1)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
                    fontSize: 24,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    marginBottom: 10,
                  }}
                >
                  {serviceDisplayName}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
                    fontSize: 42,
                    color: '#FFA048',
                    fontWeight: 800,
                    textShadow: '0 0 25px rgba(255, 122, 46, 0.5)',
                    marginBottom: 14,
                  }}
                >
                  ₹{(service.fixedAmount || currentAmount || 0).toLocaleString('en-IN')}
                </div>
                {(service.descriptionText || service.desc) && (
                  <p
                    style={{
                      marginTop: 14,
                      color: '#E2E8F0',
                      fontSize: 15.5,
                      fontFamily: 'var(--seva-f-serif, "Cormorant Garamond", serif)',
                      fontStyle: 'italic',
                      lineHeight: 1.65,
                      maxWidth: 520,
                      marginInline: 'auto',
                    }}
                  >
                    {service.descriptionText || service.desc}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                className="seva-btn solid"
                style={{
                  width: 'auto',
                  padding: '14px 36px',
                  background: 'linear-gradient(135deg, #FF7A2E 0%, #D95D16 100%)',
                  color: '#FFFFFF',
                  border: '1px solid #FFA048',
                  boxShadow: '0 4px 20px rgba(255, 122, 46, 0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.22em',
                }}
                onClick={() => setStep(2)}
              >
                Devotee Details <span className="arrow"></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Devotee Details */}
        {step === 2 && (
          <div>
            <div className="seva-modal-grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="seva-field-label">Devotee Full Name *</label>
                <input
                  type="text"
                  className="seva-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="As to be chanted in Sankalpa"
                  required
                />
              </div>
              <div>
                <label className="seva-field-label">Gotra (Lineage)</label>
                <input
                  type="text"
                  className="seva-input"
                  value={form.gotra}
                  onChange={(e) => setForm({ ...form, gotra: e.target.value })}
                  placeholder="e.g. Bharadwaja, Kashyapa, Shiva"
                />
              </div>
            </div>

            <div className="seva-modal-grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="seva-field-label">Janma Nakshatra (Star) *</label>
                <input
                  type="text"
                  className="seva-input"
                  value={form.nakshetra}
                  onChange={(e) => setForm({ ...form, nakshetra: e.target.value })}
                  placeholder="Birth Star (e.g. Rohini, Arudra)"
                  required
                />
              </div>
              <div>
                <label className="seva-field-label">WhatsApp Mobile * (10 Digits)</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="seva-input"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: sanitizePhone(e.target.value) })}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="seva-modal-grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="seva-field-label">Preferred Seva Date *</label>
                <input
                  className="seva-input seva-date-input"
                  type="date"
                  value={form.date}
                  min={todayStr()}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                  required
                />
                {form.date && !isFutureDate(form.date) && (
                  <div style={{ marginTop: 5, fontSize: 12, color: '#ff7675' }}>
                    Please select today or a future date
                  </div>
                )}
              </div>
              <div>
                <label className="seva-field-label">Email Address *</label>
                <input
                  type="email"
                  className="seva-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="For puja photos & confirmation"
                  required
                />
                {form.email && !isValidEmail(form.email) && (
                  <div style={{ marginTop: 5, fontSize: 12, color: '#ff7675' }}>
                    Please enter a valid email
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="seva-field-label">Address / Prayer Intention (Optional)</label>
              <textarea
                rows={2}
                className="seva-textarea"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Enter home address for prasadam or specific prayer intentions for the priests"
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 24,
              }}
            >
              <button
                className="seva-btn ghost"
                style={{ width: 'auto', padding: '12px 28px' }}
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                className="seva-btn solid"
                style={{
                  width: 'auto',
                  padding: '14px 34px',
                  opacity: canContinueDetails ? 1 : 0.45,
                }}
                disabled={!canContinueDetails}
                onClick={() => canContinueDetails && setStep(3)}
              >
                Review Sankalpa <span className="arrow"></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Sankalpa Summary & DIRECT CONFIRMATION */}
        {step === 3 && (
          <div>
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(255, 122, 46, 0.12) 0%, rgba(13, 21, 44, 0.85) 100%)',
                border: '1.5px solid rgba(255, 122, 46, 0.45)',
                padding: '28px 24px',
                marginBottom: 24,
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
                  fontSize: 12,
                  letterSpacing: '0.28em',
                  color: '#FFA048',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                Sacred Sankalpa Summary
              </div>

              <div className="seva-modal-grid-summary" style={{ fontSize: 15, color: '#FFFFFF' }}>
                <div style={{ color: '#94A3B8' }}>Seva Offering:</div>
                <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
                  {selectedOption ? selectedOption.name : serviceDisplayName}
                </div>

                <div style={{ color: '#94A3B8' }}>Devotee:</div>
                <div style={{ color: '#FFFFFF', fontWeight: 500 }}>
                  {form.name}{' '}
                  {form.gotra && <span style={{ color: '#FFA048' }}>({form.gotra} Gotra)</span>}
                </div>

                <div style={{ color: '#94A3B8' }}>Nakshatra:</div>
                <div style={{ color: '#FFFFFF' }}>{form.nakshetra}</div>

                <div style={{ color: '#94A3B8' }}>Seva Date:</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{form.date}</div>

                <div style={{ color: '#94A3B8' }}>WhatsApp:</div>
                <div style={{ color: '#FFFFFF' }}>{form.whatsapp}</div>

                <div style={{ color: '#94A3B8' }}>Email:</div>
                <div style={{ color: '#FFFFFF' }}>{form.email}</div>

                {form.address && (
                  <>
                    <div style={{ color: '#94A3B8' }}>Prayer / Address:</div>
                    <div style={{ color: '#FFFFFF' }}>{form.address}</div>
                  </>
                )}

                <div style={{ color: '#94A3B8' }}>Suggested Dakshina:</div>
                <div
                  style={{
                    color: '#FFA048',
                    fontFamily: 'var(--seva-f-display, "Cinzel", serif)',
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  ₹{currentAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* NO PAYMENT NOTICE */}
              <div className="seva-no-payment-badge">
                ✓ No Payment Required — Direct Priest Registration
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13.5,
                  color: '#CBD5E1',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                }}
              >
                Payment has been disabled as requested. Clicking "Confirm Booking" will directly submit
                your sacred Sankalpa to the temple priests.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                className="seva-btn ghost"
                style={{ width: 'auto', padding: '12px 28px' }}
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <button
                className="seva-btn solid"
                style={{ width: 'auto', padding: '14px 34px' }}
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Sankalpa...' : 'Confirm Booking'}{' '}
                <span className="arrow"></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success / Confirmation */}
        {step === 4 && bookingReceipt && (
          <div style={{ textAlign: 'center', padding: '14px 0' }}>
            <div className="seva-om-pulse-circle">ॐ</div>

            <p
              style={{
                fontFamily: 'var(--seva-f-script, "Playfair Display", serif)',
                fontStyle: 'italic',
                fontSize: 26,
                color: '#FFFFFF',
                marginBottom: 12,
              }}
            >
              Your divine offering is received, {bookingReceipt.name}.
            </p>

            <p
              style={{
                color: '#E2E8F0',
                maxWidth: 520,
                margin: '0 auto 20px',
                lineHeight: 1.6,
                fontSize: 16,
              }}
            >
              Our Vedic priests will perform{' '}
              <span style={{ color: '#FFA048', fontWeight: 600 }}>
                {bookingReceipt.pujaName}
              </span>{' '}
              in your name on{' '}
              <span style={{ color: '#FFA048', fontWeight: 600 }}>{bookingReceipt.date}</span> with full Vedic
              rituals and gotra chanting.
            </p>

            {/* Booking Receipt Card */}
            <div
              style={{
                background: 'rgba(5, 5, 5, 0.75)',
                border: '1px solid rgba(255, 122, 46, 0.45)',
                padding: '22px',
                maxWidth: '480px',
                margin: '0 auto 24px',
                textAlign: 'left',
                fontSize: 14.5,
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingBottom: 10,
                  marginBottom: 12,
                }}
              >
                <span style={{ color: '#94A3B8' }}>Booking Reference</span>
                <span
                  style={{
                    color: '#FFA048',
                    fontFamily: 'var(--seva-f-mono)',
                    fontWeight: 700,
                  }}
                >
                  {bookingReceipt.refId}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span style={{ color: '#94A3B8' }}>Devotee Name:</span>
                <span style={{ fontWeight: 600 }}>{bookingReceipt.name}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span style={{ color: '#94A3B8' }}>Nakshatra:</span>
                <span>{bookingReceipt.nakshetra}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span style={{ color: '#94A3B8' }}>Status:</span>
                <span style={{ color: '#2ecc71', fontWeight: 700 }}>Confirmed (No Payment)</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <button
                className="seva-btn"
                style={{ width: 'auto', padding: '12px 28px' }}
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="seva-btn solid"
                style={{ width: 'auto', padding: '12px 28px' }}
                onClick={() => {
                  window.print();
                }}
              >
                Print / Save Receipt
              </button>
            </div>
          </div>
        )}
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
          <span className="seva-temple-title">Sri Santha Malleshwara Swami Temple</span>
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
          <p>Sri Santha Malleshwara Swami Temple — Adoni Sanctuary</p>
          <p style={{ fontSize: 12, color: 'var(--seva-ivory-faint)' }}>
            All bookings are processed directly without payment. Sanctified priests conduct sevas with devotion.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TempleSevaSection;
