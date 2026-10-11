import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { footerService } from '../services/api';
import { MapPin, Phone, Mail, Globe, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL ||
  (import.meta.env.DEV ? 'http://localhost:5175' : 'https://marathon-chinmaya-mission-adoni.netlify.app');

const MAIN_SITE_FALLBACK_FOOTER = {
  isEnabled: true,
  disabledMessage: '',
  brand: {
    title: 'CHINMAYA MISSION ADONI',
    description:
      'A spiritual and cultural organisation established in 2001, dedicated to sharing timeless Vedic wisdom, human values, and inspiring individuals to lead purposeful lives.',
  },
  organizedBy: {
    heading: 'FOUNDED UNDER PUJYA GURUDEV:',
    text: 'Chinmaya Mission Adoni & Chinmaya Yuva Kendra (CHYK)',
  },
  quickNavigation: {
    heading: 'QUICK NAVIGATION',
    links: [
      { label: 'About Us', url: '/about', enabled: true, displayOrder: 1 },
      { label: 'Activities Gallery', url: '/activities', enabled: true, displayOrder: 2 },
      { label: "Let's Connect", url: '/lets-connect', enabled: true, displayOrder: 3 },
      { label: 'Marathon 2026 Portal', url: MARATHON_PORTAL_URL, enabled: true, displayOrder: 4, openInNewTab: true },
    ],
  },
  contact: {
    heading: 'ASHRAM LOCATION & CONTACT',
    address: {
      line1: 'Chinmaya Mission Ashrama',
      line2: 'Arts College Road',
      city: 'Adoni',
      pincode: '518301',
      state: 'Andhra Pradesh',
      country: 'India',
    },
    phoneNumbers: ['+91 98765 43210', '+91 85122 34567'],
    emails: ['contact@chinmayamissionadoni.org'],
    googleMapsUrl: '',
    whatsappNumber: '',
    websiteUrl: '',
  },
  pledge: {
    heading: 'OUR INSPIRATION',
    title: 'TO GIVE MAXIMUM HAPPINESS',
    description:
      '"To give maximum happiness to the maximum number of people for the maximum time is our motto." — Pujya Gurudev Swami Chinmayananda',
  },
  bottomFooter: {
    copyrightText: '© Chinmaya Mission Adoni. All Rights Reserved.',
    privacyPolicy: { label: 'Privacy Policy', url: '/privacy' },
    termsConditions: { label: 'Terms & Conditions', url: '/terms' },
  },
  appearance: {
    backgroundColor: '#0B2340',
    textColor: '#CBD5E1',
    headingColor: '#FFC107',
    accentColor: '#FF7B00',
    dividerColor: 'rgba(255, 255, 255, 0.1)',
    cardBackgroundColor: 'rgba(255, 255, 255, 0.05)',
    cardBorderColor: 'rgba(255, 255, 255, 0.1)',
  },
};

// Sanitizer for the Main Website Footer (removes all Marathon-specific texts & links)
function sanitizeMainSiteFooter(rawData) {
  if (!rawData || typeof rawData !== 'object') return MAIN_SITE_FALLBACK_FOOTER;

  const data = { ...rawData };

  // 1. Sanitize Brand Title & Description (No "ANTI-DRUG 2026")
  const brandTitle = data.brand?.title || '';
  if (!brandTitle || brandTitle.includes('ANTI-DRUG') || brandTitle.includes('2026')) {
    data.brand = {
      ...data.brand,
      title: 'CHINMAYA MISSION ADONI',
      description:
        'A spiritual and cultural organisation established in 2001, dedicated to sharing timeless Vedic wisdom, human values, and inspiring individuals to lead purposeful lives.',
    };
  }

  // 2. Sanitize Quick Navigation Links (Remove "What We Do" and "Marathon Registration")
  const rawLinks = data.quickNavigation?.links || MAIN_SITE_FALLBACK_FOOTER.quickNavigation.links;
  const filteredLinks = rawLinks.filter((link) => {
    if (!link || !link.label) return false;
    const lower = link.label.toLowerCase().trim();
    const url = (link.url || '').toLowerCase().trim();
    // Exclude unwanted links
    if (lower.includes('what we do') || url === '/what-we-do') return false;
    if (lower.includes('marathon registration') || url === '/register') return false;
    return true;
  });

  // Ensure Marathon 2026 Portal link exists
  const hasMarathonPortalLink = filteredLinks.some((l) =>
    l.label?.toLowerCase().includes('marathon')
  );
  if (!hasMarathonPortalLink) {
    filteredLinks.push({
      label: 'Marathon 2026 Portal',
      url: MARATHON_PORTAL_URL,
      enabled: true,
      openInNewTab: true,
      displayOrder: 99,
    });
  }

  data.quickNavigation = {
    heading: 'QUICK NAVIGATION',
    links: filteredLinks,
  };

  // 3. Sanitize Contact Heading (Ashram Location)
  if (data.contact) {
    data.contact = {
      ...data.contact,
      heading: 'ASHRAM LOCATION & CONTACT',
    };
  }

  // 4. Sanitize Pledge Section (Replace "THE MARATHON PLEDGE" with Gurudev's Motto)
  const pledgeHeading = data.pledge?.heading || '';
  const pledgeTitle = data.pledge?.title || '';
  if (
    pledgeHeading.includes('MARATHON') ||
    pledgeTitle.includes('DRUG-FREE') ||
    pledgeTitle.includes('MARATHON')
  ) {
    data.pledge = {
      heading: 'OUR INSPIRATION',
      title: 'TO GIVE MAXIMUM HAPPINESS',
      description:
        '"To give maximum happiness to the maximum number of people for the maximum time is our motto." — Pujya Gurudev Swami Chinmayananda',
    };
  }

  return data;
}

export const Footer = ({ overrideData = null }) => {
  const [footerData, setFooterData] = useState(() => {
    if (overrideData) return sanitizeMainSiteFooter(overrideData);
    try {
      const cached = localStorage.getItem('cached_main_footer_data');
      return cached ? sanitizeMainSiteFooter(JSON.parse(cached)) : MAIN_SITE_FALLBACK_FOOTER;
    } catch {
      return MAIN_SITE_FALLBACK_FOOTER;
    }
  });

  const loadFooter = () => {
    if (overrideData) {
      setFooterData(sanitizeMainSiteFooter(overrideData));
      return;
    }

    footerService
      .getPublicFooter()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const sanitized = sanitizeMainSiteFooter(res.data.data);
          setFooterData(sanitized);
          try {
            localStorage.setItem('cached_main_footer_data', JSON.stringify(sanitized));
          } catch {}
        }
      })
      .catch(() => {
        // Fallback to static main site footer on network error
        setFooterData(MAIN_SITE_FALLBACK_FOOTER);
      });
  };

  useEffect(() => {
    loadFooter();

    const handleCmsUpdate = (e) => {
      if (e.type === 'storage' && e.key && e.key !== 'cms_last_updated') return;
      loadFooter();
    };

    window.addEventListener('cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    window.addEventListener('focus', handleCmsUpdate);

    return () => {
      window.removeEventListener('cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
      window.removeEventListener('focus', handleCmsUpdate);
    };
  }, [overrideData]);

  // Handle Footer Disabled State
  if (footerData.isEnabled === false) {
    if (footerData.disabledMessage) {
      return (
        <footer className="bg-[var(--bg-dark-section)] text-slate-400 py-6 px-4 text-center text-xs font-semibold border-t border-[var(--border-color)]">
          <p>{footerData.disabledMessage}</p>
        </footer>
      );
    }
    return null;
  }

  const {
    brand = MAIN_SITE_FALLBACK_FOOTER.brand,
    organizedBy = MAIN_SITE_FALLBACK_FOOTER.organizedBy,
    quickNavigation = MAIN_SITE_FALLBACK_FOOTER.quickNavigation,
    contact = MAIN_SITE_FALLBACK_FOOTER.contact,
    pledge = MAIN_SITE_FALLBACK_FOOTER.pledge,
    bottomFooter = MAIN_SITE_FALLBACK_FOOTER.bottomFooter,
    appearance = MAIN_SITE_FALLBACK_FOOTER.appearance,
  } = footerData;

  // Sort active links
  const navLinks = (quickNavigation.links || [])
    .filter((link) => link.enabled !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const address = contact.address || {};
  const fullAddress = [
    address.line1,
    address.line2,
    address.city ? `${address.city} - ${address.pincode || ''}` : '',
    address.state,
  ]
    .filter(Boolean)
    .join(', ');

  const footerStyle = {
    backgroundColor: appearance?.backgroundColor || '#0B2340',
    color: appearance?.textColor || '#CBD5E1',
    borderColor: appearance?.dividerColor || 'rgba(255, 255, 255, 0.1)',
  };

  const headingStyle = {
    color: appearance?.headingColor || '#FFC107',
  };

  const accentStyle = {
    color: appearance?.accentColor || '#FF7B00',
  };

  const cardStyle = {
    backgroundColor: appearance?.cardBackgroundColor || 'rgba(255, 255, 255, 0.05)',
    borderColor: appearance?.cardBorderColor || 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <footer
      style={footerStyle}
      className="border-t pt-16 pb-12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-heading tracking-wider text-white">
                CHINMAYA <span style={accentStyle}>MISSION</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed font-medium opacity-90">
              {brand.description ||
                'A spiritual and cultural organisation established in 2001, dedicated to sharing timeless Vedic wisdom, human values, and inspiring purposeful lives.'}
            </p>

            <div className="text-xs font-bold pt-1">
              <span style={headingStyle}>{organizedBy.heading || 'FOUNDED UNDER GURUDEV:'}</span>
              <p className="text-white font-extrabold mt-0.5 leading-snug">
                {organizedBy.text || 'Chinmaya Mission Adoni & Chinmaya Yuva Kendra (CHYK)'}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Navigation (NO What We Do, NO Marathon Registration) */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {quickNavigation.heading || 'QUICK NAVIGATION'}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold list-none p-0">
              {navLinks.map((link, idx) => {
                const isExternal = link.url?.startsWith('http');
                const isMarathonLink = link.label?.toLowerCase().includes('marathon');

                return (
                  <li key={idx}>
                    {isExternal ? (
                      <a
                        href={link.url}
                        target={link.openInNewTab ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className={`transition-colors text-decoration-none inline-flex items-center gap-1.5 ${
                          isMarathonLink
                            ? 'font-black hover:underline'
                            : 'hover:text-white'
                        }`}
                        style={isMarathonLink ? accentStyle : undefined}
                      >
                        <span>{link.label}</span>
                        {isMarathonLink && <ExternalLink className="w-3 h-3" />}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="transition-colors text-decoration-none hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Ashram Location & Contact */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {contact.heading || 'ASHRAM LOCATION & CONTACT'}
            </h4>
            <div className="space-y-2.5 text-xs opacity-90">
              {fullAddress && (
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin style={accentStyle} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{fullAddress}</span>
                </p>
              )}

              {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{contact.phoneNumbers.join(' / ')}</span>
                </p>
              )}

              {contact.emails && contact.emails.length > 0 && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{contact.emails.join(', ')}</span>
                </p>
              )}

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {contact.googleMapsUrl ? (
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 text-decoration-none"
                  >
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span>View Map</span>
                  </a>
                ) : (
                  <Link
                    to="/lets-connect"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 text-decoration-none"
                  >
                    <MessageSquare className="w-3 h-3 text-cyan-400" />
                    <span>Contact Us</span>
                  </Link>
                )}
                {contact.whatsappNumber && (
                  <a
                    href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-decoration-none"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 4: Chinmaya Mission Inspiration (NO Marathon Pledge) */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {pledge.heading || 'OUR INSPIRATION'}
            </h4>
            <div style={cardStyle} className="p-4 rounded-2xl border text-xs space-y-2">
              <p className="text-white font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
                <span>{pledge.title || 'TO GIVE MAXIMUM HAPPINESS'}</span>
              </p>
              <p className="leading-relaxed opacity-90">
                {pledge.description ||
                  '"To give maximum happiness to the maximum number of people for the maximum time is our motto." — Pujya Gurudev Swami Chinmayananda'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Footer Section */}
        <div
          style={{ borderColor: appearance?.dividerColor || 'rgba(255, 255, 255, 0.1)' }}
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs opacity-75 gap-4"
        >
          <p>{bottomFooter.copyrightText || '© Chinmaya Mission Adoni. All Rights Reserved.'}</p>
          <div className="flex items-center gap-4">
            {bottomFooter.privacyPolicy?.url && (
              <Link to={bottomFooter.privacyPolicy.url} className="hover:text-white text-decoration-none">
                {bottomFooter.privacyPolicy.label || 'Privacy Policy'}
              </Link>
            )}
            <span>•</span>
            {bottomFooter.termsConditions?.url && (
              <Link to={bottomFooter.termsConditions.url} className="hover:text-white text-decoration-none">
                {bottomFooter.termsConditions.label || 'Terms & Conditions'}
              </Link>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
