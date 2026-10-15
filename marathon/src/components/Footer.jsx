import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { footerService } from '../services/api';
import { MapPin, Phone, Mail, Globe, ExternalLink, MessageSquare } from 'lucide-react';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5176';

const FALLBACK_FOOTER = {
  isEnabled: true,
  disabledMessage: '',
  brand: {
    title: 'ANTI-DRUG 2026',
    description:
      '"WE RISE. WE RUN. WE RESIST." — A youth-focused anti-drug movement inspiring health, strength, purpose, and clean living across Adoni.',
  },
  organizedBy: {
    heading: 'ORGANIZED BY:',
    text: 'Chinmaya Mission, Adoni & Chinmaya Yuva Kendra, Adoni',
  },
  initiativeBy: {
    heading: 'AN INITIATIVE BY',
    text: 'Chinmaya Yuva Kendra, Adoni',
  },
  quickNavigation: {
    heading: 'QUICK NAVIGATION',
    links: [
      { label: 'Home', url: '/', openInNewTab: false, enabled: true, displayOrder: 1 },
      { label: 'FAQs', url: '/faqs', openInNewTab: false, enabled: true, displayOrder: 2 },
      {
        label: 'Main Mission Site',
        url: 'https://chinmaya-mission-adoni.vercel.app/',
        openInNewTab: true,
        enabled: true,
        displayOrder: 3,
      },
    ],
  },
  contact: {
    heading: 'LOCATION & CONTACT',
    address: {
      line1: 'Chinmaya Mission Cultural Complex , Adoni',
      line2: 'Near Arts College Road',
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
    heading: 'Our Motto',
    title: 'TO GIVE MAXIMUM HAPPINESS',
    description:
      '"To give maximum happiness to the maximum number of people for the maximum time is our motto." — Pujya Gurudev Swami Chinmayananda',
  },
  bottomFooter: {
    copyrightText: '© Chinmaya Mission, Adoni.',
    privacyPolicy: { label: 'Privacy Policy', url: '/privacy' },
    termsConditions: { label: 'Terms & Conditions', url: '/terms' },
  },
  appearance: {
    backgroundColor: '#0B2340',
    textColor: '#CBD5E1',
    headingColor: '#FFC107',
    accentColor: '#F4511E',
    dividerColor: 'rgba(255, 255, 255, 0.1)',
    cardBackgroundColor: 'rgba(255, 255, 255, 0.05)',
    cardBorderColor: 'rgba(255, 255, 255, 0.1)',
  },
};

export const Footer = ({ overrideData = null }) => {
  const [footerData, setFooterData] = useState(() => {
    if (overrideData) return overrideData;
    try {
      const cached = localStorage.getItem('cached_footer_data');
      return cached ? JSON.parse(cached) : FALLBACK_FOOTER;
    } catch {
      return FALLBACK_FOOTER;
    }
  });

  const loadFooter = () => {
    if (overrideData) {
      setFooterData(overrideData);
      return;
    }

    footerService
      .getPublicFooter()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setFooterData(res.data.data);
          try {
            localStorage.setItem('cached_footer_data', JSON.stringify(res.data.data));
          } catch {}
        }
      })
      .catch(() => {
        // keep fallback or existing state
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
    brand = FALLBACK_FOOTER.brand,
    organizedBy = FALLBACK_FOOTER.organizedBy,
    initiativeBy = FALLBACK_FOOTER.initiativeBy,
    quickNavigation = FALLBACK_FOOTER.quickNavigation,
    contact = FALLBACK_FOOTER.contact,
    pledge = FALLBACK_FOOTER.pledge,
    bottomFooter = FALLBACK_FOOTER.bottomFooter,
    appearance = FALLBACK_FOOTER.appearance,
  } = footerData;

  // Quick Navigation links for Marathon
  // Replace old main site links (About Us, Activities Gallery, What We Do, Let's Connect)
  // with Home, FAQs, and Main Mission Site
  const unwantedLabels = ['about us', 'activities gallery', 'what we do', "let's connect", 'lets connect'];
  const unwantedUrls = ['/about', '/activities', '/what-we-do', '/lets-connect'];

  const defaultMarathonLinks = [
    { label: 'Home', url: '/', openInNewTab: false, enabled: true, displayOrder: 1 },
    { label: 'FAQs', url: '/faqs', openInNewTab: false, enabled: true, displayOrder: 2 },
    {
      label: 'Main Mission Site',
      url: 'https://chinmaya-mission-adoni.vercel.app/',
      openInNewTab: true,
      enabled: true,
      displayOrder: 3,
    },
  ];

  const rawLinks = (quickNavigation.links || []).filter((link) => {
    if (!link || link.enabled === false) return false;
    const lower = (link.label || '').toLowerCase().trim();
    const url = (link.url || '').toLowerCase().trim();
    if (unwantedLabels.some((u) => lower.includes(u))) return false;
    if (unwantedUrls.includes(url)) return false;
    return true;
  });

  // Ensure Home, FAQs, and Main Mission Site are the quick navigation links
  const navLinks = rawLinks.length === 0 || rawLinks.every((l) => ['home', 'faqs', 'main mission site'].includes(l.label?.toLowerCase().trim()))
    ? defaultMarathonLinks
    : [
        ...defaultMarathonLinks,
        ...rawLinks.filter(
          (l) =>
            l.url !== '/' &&
            l.url !== '/faqs' &&
            !l.url?.includes('chinmaya-mission-adoni.vercel.app') &&
            l.label?.toLowerCase() !== 'home' &&
            l.label?.toLowerCase() !== 'faqs' &&
            !l.label?.toLowerCase().includes('main mission')
        ),
      ];

  const contactHeading =
    !contact.heading || contact.heading === 'EVENT LOCATION & CONTACT'
      ? 'LOCATION & CONTACT'
      : contact.heading;

  const address = contact.address || {};
  let line1 = address.line1 || 'Chinmaya Mission Cultural Complex , Adoni';
  if (line1 === 'Chinmaya Mission Adoni' || line1 === 'Chinmaya Mission, Adoni' || !line1.includes('Cultural Complex')) {
    line1 = 'Chinmaya Mission Cultural Complex , Adoni';
  }
  const line2 = address.line2 || 'Near Arts College Road';
  const cityPin = address.city ? `${address.city} - ${address.pincode || '518301'}` : 'Adoni - 518301';
  const stateStr = address.state || 'Andhra Pradesh';

  const fullAddress = [
    line1,
    line2,
    cityPin,
    stateStr,
  ]
    .filter(Boolean)
    .join(', ');

  const pledgeHeading =
    pledge.heading === 'THE MARATHON PLEDGE' || !pledge.heading
      ? 'Our Motto'
      : pledge.heading;

  const pledgeTitle =
    pledge.title === 'RUN FOR A DRUG-FREE FUTURE' || !pledge.title
      ? 'TO GIVE MAXIMUM HAPPINESS'
      : pledge.title;

  const pledgeDescription =
    pledge.description?.includes('I pledge to reject') || !pledge.description
      ? '"To give maximum happiness to the maximum number of people for the maximum time is our motto." — Pujya Gurudev Swami Chinmayananda'
      : pledge.description;

  const footerStyle = {
    backgroundColor: appearance?.backgroundColor || '#0B2340',
    color: appearance?.textColor || '#CBD5E1',
    borderColor: appearance?.dividerColor || 'rgba(255, 255, 255, 0.1)',
  };

  const headingStyle = {
    color: appearance?.headingColor || '#FFC107',
  };

  const accentStyle = {
    color: appearance?.accentColor || '#F4511E',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-black font-heading tracking-wider text-white">
                {brand.title?.includes('2026') ? (
                  <>
                    {brand.title.replace('2026', '')}
                    <span style={accentStyle}>2026</span>
                  </>
                ) : (
                  brand.title || 'ANTI-DRUG 2026'
                )}
              </span>
            </div>

            <p className="text-xs leading-relaxed font-medium opacity-90">
              {brand.description}
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {quickNavigation.heading || 'QUICK NAVIGATION'}
            </h4>
            <ul className="space-y-2 text-xs font-semibold list-none p-0">
              {navLinks.map((link, idx) => {
                const isHighlight =
                  link.url === '/register' || link.label?.toLowerCase().includes('marathon');
                return (
                  <li key={idx}>
                    {link.url?.startsWith('http') ? (
                      <a
                        href={link.url}
                        target={link.openInNewTab ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="hover:underline transition-colors text-decoration-none"
                        style={isHighlight ? accentStyle : undefined}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        target={link.openInNewTab ? '_blank' : '_self'}
                        className={`transition-colors text-decoration-none ${
                          isHighlight ? 'font-extrabold hover:underline' : 'hover:text-white'
                        }`}
                        style={isHighlight ? accentStyle : undefined}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Event Location & Contact */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {contactHeading}
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

              {/* Optional Contact Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {contact.googleMapsUrl && (
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 text-decoration-none"
                  >
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span>View Map</span>
                  </a>
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

          {/* Column 4: An Initiative By */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {initiativeBy?.heading || 'AN INITIATIVE BY'}
            </h4>
            <p className="text-white font-extrabold text-xs sm:text-sm leading-snug">
              {initiativeBy?.text || 'Chinmaya Yuva Kendra, Adoni'}
            </p>
          </div>

        </div>

        {/* Bottom Footer Section */}
        <div
          style={{ borderColor: appearance?.dividerColor || 'rgba(255, 255, 255, 0.1)' }}
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs opacity-75 gap-4"
        >
          <p>{bottomFooter.copyrightText || '© Chinmaya Mission, Adoni.'}</p>
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
