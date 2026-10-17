import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './GalleryPage.css';

// Comprehensive Registry of Temple & Mission Sacred Images
export const GALLERY_IMAGES = [
  // 1. Temple Lingams & Shrines
  {
    id: 'hero-lingam',
    src: '/assets/hero-lingam-new.jpeg',
    title: 'Sri Santha Malleswara Jyotirlinga (Hero Sanctum)',
    category: 'Temple & Sanctum',
    desc: 'Sacred Ishana Lingam representing the cosmic space element, consecrated with arrow marks from Kakatiya times.',
    tag: 'Principal Shrine',
  },
  {
    id: 'temple-real-clean',
    src: '/assets/temple-real-photo-clean.jpeg',
    title: 'Sanctum Sanctorum with Bilva & Sacred Chandan',
    category: 'Temple & Sanctum',
    desc: 'Authentic sanctum photograph of Lord Malleswara adorned with sacred Bilva leaves, Chandan, and Kumkum.',
    tag: 'Sanctum Photograph',
  },
  {
    id: 'temple-real-garland',
    src: '/assets/temple-real-photo-garland.jpeg',
    title: 'Jyotirlinga Adorned with Divine Garlands',
    category: 'Temple & Sanctum',
    desc: 'The divine deity adorned with floral garlands, sacred silver umbrella, and traditional temple offerings.',
    tag: 'Floral Alankara',
  },
  {
    id: 'temple-real-darshan',
    src: '/assets/temple-real-photo.jpeg',
    title: 'Panchamrita Abhisheka Darshan',
    category: 'Temple & Sanctum',
    desc: 'Sacred sanctum lingam receiving Vedic holy bath during morning Pratah Puja rituals.',
    tag: 'Abhisheka Darshan',
  },
  {
    id: 'temple-nandi',
    src: '/assets/temple-real-photo-nandi.jpeg',
    title: 'Sacred Nandi Vahana Guardian',
    category: 'Temple & Sanctum',
    desc: 'Ancient stone-carved Nandi bull facing the inner sanctum of Lord Shiva atop Navaratna Shikhara.',
    tag: 'Nandi Vahana',
  },
  {
    id: 'temple-hilltop-trishul',
    src: '/assets/temple-trishul-hilltop.jpeg',
    title: 'Sacred Golden Trishul on Hilltop',
    category: 'Temple & Sanctum',
    desc: 'The majestic golden trident erected on Navaratna Shikhara hill overlooking the town of Adoni.',
    tag: 'Sacred Trishul',
  },
  {
    id: 'temple-hilltop-panorama',
    src: '/assets/temple-hilltop-view.jpeg',
    title: 'Navaratna Shikhara Hilltop Sanctuary',
    category: 'Temple & Sanctum',
    desc: 'Panoramic hilltop view of the 12th-century Kakatiya temple complex built on multicolored strata rock.',
    tag: 'Hilltop View',
  },
  {
    id: 'jyotirlinga-shrine-hd',
    src: '/assets/jyotirlinga-shrine-full.png',
    title: 'Jyotirlinga Celestial Shrine Presentation',
    category: 'Temple & Sanctum',
    desc: 'Full high-definition digital representation of the glowing Shiva Jyotirlinga in cosmic glory.',
    tag: 'Digital Art',
  },
  {
    id: 'jyotirlinga-shrine-hd2',
    src: '/assets/jyotirlinga-shrine-full2.png',
    title: 'Jyotirlinga Shrine Celestial View II',
    category: 'Temple & Sanctum',
    desc: 'Alternate angle view of the illuminated celestial shrine and Shiva lingam.',
    tag: 'Digital Art',
  },
  {
    id: 'jyotirlinga-abhishekam-art',
    src: '/assets/jyotirlinga-abhishekam.png',
    title: 'Sacred Panchamrita Abhishekam Art',
    category: 'Temple & Sanctum',
    desc: 'Artistic representation of the eternal holy abhishekam to the cosmic Shiva Lingam.',
    tag: 'Abhishekam Art',
  },
  {
    id: 'hero-portrait',
    src: '/assets/hero.png',
    title: 'Sri Santha Malleswara Portrait Iconography',
    category: 'Temple & Sanctum',
    desc: 'Formal portrait presentation of the temple deity with celestial aura and holy Trishul.',
    tag: 'Iconography',
  },

  // 2. Sacred Deities (Pancha Lingas & Goddess)
  {
    id: 'bhogalingeswara',
    src: '/gallery/Bhogalingeswara_Shiva.jpeg',
    title: 'Sadyojata Linga — Bhogalingeswara Shiva',
    category: 'Sacred Deities',
    desc: 'West-facing lingam representing the Prithvi (Earth) element behind the principal shrine.',
    tag: 'Pancha Linga',
  },
  {
    id: 'tyagarajeswara',
    src: '/gallery/Tyagarajeswara_Shiva.jpeg',
    title: 'Vamadeva Linga — Tyagarajeswara Shiva',
    category: 'Sacred Deities',
    desc: 'North-facing lingam beside the holy spring pond, representing the Jala (Water) element.',
    tag: 'Pancha Linga',
  },
  {
    id: 'parvati-ammavaru',
    src: '/gallery/Parvati_Ammavaru.jpeg',
    title: 'Goddess Parvati Ammavaru',
    category: 'Sacred Deities',
    desc: 'The eternal Divine Mother Parvati, consort of Lord Shiva, worshipped with Sri Chakra Kumkumarchana.',
    tag: 'Divine Mother',
  },
  {
    id: 'shiva-parvati-kalyanam',
    src: '/assets/festivals/shiva-parvati-kalyanam.jpg',
    title: 'Shiva Parvati Kalyana Moorthulu',
    category: 'Sacred Deities',
    desc: 'Divine idols adorned for the holy celestial marriage ceremony of Lord Shiva and Goddess Parvati.',
    tag: 'Kalyanam',
  },
  {
    id: 'shivaya-darshan',
    src: '/gallery/Shivaya.jpeg',
    title: 'Sanctum Darshan & Devotion',
    category: 'Sacred Deities',
    desc: 'Sacred offering in the inner sanctum surrounded by brass lamps and camphor glow.',
    tag: 'Darshan',
  },
  {
    id: 'kalasha-sthapana',
    src: '/gallery/Kalasha.jpeg',
    title: 'Sacred Kalasha Sthapana',
    category: 'Sacred Deities',
    desc: 'Sacred Kalash filled with holy waters and mango leaves, embodying the divine supreme presence.',
    tag: 'Vedic Ritual',
  },
  {
    id: 'havan-sacred-fire',
    src: '/gallery/Havan.jpeg',
    title: 'Vedic Agni Havan Ritual',
    category: 'Sacred Deities',
    desc: 'Priests performing Vedic Agni homam with ghee offerings, chanting ancient mantras for cosmic peace.',
    tag: 'Havan',
  },
  {
    id: 'sevak-team',
    src: '/gallery/Sevak_Team.jpeg',
    title: 'Temple Sevak Team & Priests',
    category: 'Sacred Deities',
    desc: 'Chinmaya Mission sevaks and priests dedicated to preserving the heritage of Sri Santha Malleswara.',
    tag: 'Sevak Sangha',
  },

  // 3. Grand Festivals & Celebrations
  {
    id: 'maha-shivaratri-2027',
    src: '/assets/Maha_Shivaratri_upcome_2027.jpeg',
    title: 'Maha Shivaratri Mahotsavam 2027',
    category: 'Festivals & Homams',
    desc: 'Grand all-night vigil celebrating the Great Night of Shiva with continuous Rudrabhishekam.',
    tag: 'Grand Festival',
  },
  {
    id: 'maha-shivaratri-fest',
    src: '/assets/festival-maha-shivaratri.jpeg',
    title: 'Maha Shivaratri Temple Celebrations',
    category: 'Festivals & Homams',
    desc: 'Thousands of devotees joining the sacred vigil and chanting Om Namah Shivaya through the night.',
    tag: 'Maha Shivaratri',
  },
  {
    id: 'rudra-homam-upcome',
    src: '/assets/rudra_homam_upcome.jpeg',
    title: 'Maha Rudra Homam & Fire Ritual',
    category: 'Festivals & Homams',
    desc: 'Most sacred Vedic ritual invoking Lord Shiva in his fierce Rudra form to ward off negative energies.',
    tag: 'Vedic Homam',
  },
  {
    id: 'rudra-homam-fest',
    src: '/assets/festival-rudra-homam.jpeg',
    title: 'Nakshatra Homam Celebrations',
    category: 'Festivals & Homams',
    desc: 'Annual Vedic ritual balancing cosmic planetary influences for devotee peace and prosperity.',
    tag: 'Nakshatra Homam',
  },
  {
    id: 'kartika-deepam',
    src: '/assets/kartika_deepam_upcome.jpeg',
    title: 'Kartika Masa Deeparadhana',
    category: 'Festivals & Homams',
    desc: 'A sacred month-long ritual of lighting thousands of clay oil lamps across the temple sanctum.',
    tag: 'Deeparadhana',
  },
  {
    id: 'sopana-deepotsavam',
    src: '/assets/Sopana_deepa_upcome.jpeg',
    title: 'Kartika Sopana Deepotsavam',
    category: 'Festivals & Homams',
    desc: 'Illuminating every step of the Navaratna Shikhara hill path with golden lamps on Kartika Pournami.',
    tag: 'Deepotsavam',
  },
  {
    id: 'shiva-parvati-kalyanam-new',
    src: '/assets/Shiva_parvati_kalyanam_new_upcome.jpeg',
    title: 'Shiva Parvati Kalyanam Celebrations',
    category: 'Festivals & Homams',
    desc: 'Symbolizing the supreme union of pure consciousness (Shiva) and primordial energy (Shakti).',
    tag: 'Kalyanam',
  },
  {
    id: 'upcome-kalyanam',
    src: '/assets/upcome_shiva_parvati_kalyanam.jpeg',
    title: 'Divine Kalyana Mahotsavam Banner',
    category: 'Festivals & Homams',
    desc: 'Official temple banner for the celestial wedding festival of Lord Shiva and Goddess Parvati.',
    tag: 'Festival Banner',
  },
  {
    id: 'kumbha-abhishekam',
    src: '/assets/festival-kumbha-abhishekam.jpeg',
    title: 'Maha Kumbha Abhishekam Ceremony',
    category: 'Festivals & Homams',
    desc: 'Sanctification ritual rejuvenating the temple by empowering the gopuram spire and deities.',
    tag: 'Kumbha Abhishekam',
  },
  {
    id: 'kalasha-puja-mega',
    src: '/assets/Kalasha_puja_mega.jpeg',
    title: 'Mega Kalasha Puja Gathering',
    category: 'Festivals & Homams',
    desc: 'Devotees participating in collective Kalasha puja with chanting of Sri Rudram and Chamakam.',
    tag: 'Kalasha Puja',
  },
  {
    id: 'chinmaya-amrit-mahotsav',
    src: '/assets/Chinmaya_Amrit_Mahotsav.jpeg',
    title: 'Chinmaya Amrit Mahotsav (75 Years)',
    category: 'Festivals & Homams',
    desc: 'Special celebrations commemorating 75 years of Chinmaya Mission service to Vedic spirituality.',
    tag: 'Amrit Mahotsav',
  },
  {
    id: 'rajat-mahotsav',
    src: '/assets/rajat_mahotsav_past.jpeg',
    title: 'Rajata Mahotsav Silver Jubilee',
    category: 'Festivals & Homams',
    desc: 'Celebrating 25 years of temple revival and cultural heritage preservation in Adoni.',
    tag: 'Silver Jubilee',
  },

  // 4. Emblems, Icons & Badges
  {
    id: 'om-trishul-emblem',
    src: '/assets/om-trishul-icon.png',
    title: 'Sacred Om Trishul Temple Emblem',
    category: 'Emblems & Icons',
    desc: 'Official emblem combining the sacred sound ॐ with Lord Shiva’s trident and holy damaru.',
    tag: 'Temple Emblem',
  },
];

export const GalleryPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'All',
    'Temple & Sanctum',
    'Sacred Deities',
    'Festivals & Homams',
    'Emblems & Icons',
  ];

  // Filtered Images
  const filteredImages = useMemo(() => {
    return GALLERY_IMAGES.filter((img) => {
      const matchCat = category === 'All' || img.category === category;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        img.title.toLowerCase().includes(q) ||
        img.desc.toLowerCase().includes(q) ||
        img.tag.toLowerCase().includes(q) ||
        img.src.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  // Category counts
  const counts = useMemo(() => {
    const c = { All: GALLERY_IMAGES.length };
    GALLERY_IMAGES.forEach((img) => {
      c[img.category] = (c[img.category] || 0) + 1;
    });
    return c;
  }, []);

  // Copy Image Path to Clipboard
  const handleCopyPath = (src, id) => {
    navigator.clipboard.writeText(src).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev + 1) % filteredImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredImages]);

  // Lock background scroll when lightbox is open
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeLightboxIndex]);

  const currentLightboxImg = activeLightboxIndex !== null ? filteredImages[activeLightboxIndex] : null;

  return (
    <div className="gallery-page-container">
      <div className="gallery-content-wrap">
        {/* Sub-navigation bar */}
        <div className="gallery-subnav">
          <div className="gallery-subnav-left">
            <span className="gallery-subnav-om">ॐ</span>
            <span className="gallery-subnav-title">Sri Santha Malleshwara Temple Visual Archive</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/sri-shantha-mamleshwara-swami-temple" className="gallery-subnav-back">
              ← Temple Sanctuary & Sevas
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="gallery-hero">
          <span className="gallery-eyebrow">Visual Heritage</span>
          <h1 className="gallery-hero-title">The Sacred Image Archive</h1>
          <p className="gallery-hero-subtitle">
            Every sacred sanctum photograph, deity darshan, Vedic havan, festival celebration, and ceremonial seal of Sri Santha Malleshwara Swami Temple and Chinmaya Mission.
          </p>
        </section>
      </div>

      {/* Controls Bar: Search & Category Pills (Sticky) */}
      <div className="gallery-controls-bar">
        <div className="gallery-content-wrap">
          <div className="gallery-controls-flex">
            {/* Search Input */}
            <div className="gallery-search-box">
              <span className="gallery-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search images by deity, ritual, festival..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="gallery-clear-search"
                  onClick={() => setSearch('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="gallery-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`gallery-pill-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="gallery-pill-count">({counts[cat] || 0})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Images */}
      <div className="gallery-content-wrap">
        {filteredImages.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-om">ॐ</div>
            <h3 className="gallery-empty-title">No Images Found</h3>
            <p>No sacred images matched your query "{search}". Try searching for "Lingam", "Shivaratri", or "Kalasha".</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="gallery-subnav-back"
              style={{ marginTop: 20 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="gallery-images-grid">
            {filteredImages.map((img, idx) => (
              <article key={img.id} className="gallery-image-card">
                {/* Thumbnail Wrap */}
                <div
                  className="gallery-thumb-wrap"
                  onClick={() => setActiveLightboxIndex(idx)}
                  title="Click to view high-resolution image"
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    loading="lazy"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = '1';
                        // Fallback to relative assets if needed
                        e.target.src = '/assets/images/temple-seva-shiva-kalyanam.jpg';
                      }
                    }}
                  />
                  <div className="gallery-thumb-overlay">
                    <span className="gallery-zoom-badge">Full View 🔍</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="gallery-card-body">
                  <div>
                    <span className="gallery-category-badge">
                      {img.tag} · {img.category}
                    </span>
                    <h2 className="gallery-card-title">{img.title}</h2>
                    <p className="gallery-card-desc">{img.desc}</p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="gallery-card-footer">
                    <span className="gallery-card-path" title={img.src}>
                      {img.src}
                    </span>

                    <div className="gallery-card-actions">
                      <button
                        className="gallery-action-btn"
                        onClick={() => handleCopyPath(img.src, img.id)}
                        title="Copy image link"
                      >
                        {copiedId === img.id ? '✓ Copied' : '📋 Path'}
                      </button>
                      <a
                        href={img.src}
                        download
                        className="gallery-action-btn"
                        title="Download original file"
                      >
                        ⬇
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentLightboxImg && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setActiveLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="gallery-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="gallery-lightbox-close"
              onClick={() => setActiveLightboxIndex(null)}
              aria-label="Close image lightbox"
            >
              ×
            </button>

            {/* Left Navigation Arrow */}
            <button
              className="gallery-nav-arrow left"
              onClick={() =>
                setActiveLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
              }
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* Right Navigation Arrow */}
            <button
              className="gallery-nav-arrow right"
              onClick={() =>
                setActiveLightboxIndex((prev) => (prev + 1) % filteredImages.length)
              }
              aria-label="Next image"
            >
              ›
            </button>

            {/* Main Lightbox Image View */}
            <div className="gallery-lightbox-image-area">
              <img
                src={currentLightboxImg.src}
                alt={currentLightboxImg.title}
              />
            </div>

            {/* Details Bar */}
            <div className="gallery-lightbox-info">
              <div>
                <span className="gallery-category-badge">
                  {currentLightboxImg.tag} · {currentLightboxImg.category}
                </span>
                <h2 className="gallery-lightbox-title">{currentLightboxImg.title}</h2>
                <p className="gallery-lightbox-desc">{currentLightboxImg.desc}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--ivory-faint)' }}>
                  {activeLightboxIndex + 1} / {filteredImages.length}
                </span>
                <a
                  href={currentLightboxImg.src}
                  download
                  className="gallery-download-btn"
                >
                  Download Image ⬇
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sacred Sanskrit Banner at Bottom */}
      <footer className="gallery-sacred-footer-banner">
        <div className="gallery-content-wrap">
          <div className="gallery-mantra">ॐ नमः शिवाय</div>
          <p className="gallery-mantra-sub">Sri Santha Malleshwara Swami Temple — Adoni Sanctuary</p>
          <p className="gallery-mantra-count">
            Navaratna Shikhara Sacred Heritage · {GALLERY_IMAGES.length} Images Archived
          </p>
        </div>
      </footer>
    </div>
  );
};
