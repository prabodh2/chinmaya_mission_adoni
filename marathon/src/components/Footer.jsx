import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { footerService } from '../services/api';
import { MapPin, Phone, Mail, Globe, ExternalLink, MessageSquare } from 'lucide-react';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5176';

// Official Platform Social Media Logos
const YouTubeIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.3-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.235-.245-.589-.494-.509-.677-.518-.176-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.053 1.029-1.053 2.511 0 1.482 1.079 2.912 1.23 3.113.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.9-.12.58-.352 1.78-1.029 2.031-2.023.251-.994.251-1.846.176-2.024-.075-.177-.276-.277-.577-.428zM12.04 2C6.516 2 2.026 6.49 2.026 12.015c0 1.91.536 3.693 1.464 5.223L2 22.026l4.929-1.45a9.98 9.98 0 0 0 5.111 1.439h.004c5.523 0 10.014-4.49 10.014-10.015C22.058 6.49 17.564 2 12.04 2zm0 18.293h-.003a8.28 8.28 0 0 1-4.225-1.155l-.303-.18-3.14.924.939-3.06-.197-.314a8.27 8.27 0 0 1-1.27-4.493c0-4.57 3.72-8.29 8.296-8.29 2.215 0 4.298.864 5.864 2.43 1.567 1.567 2.43 3.65 2.43 5.865 0 4.572-3.72 8.273-8.496 8.273z" />
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SOCIAL_MEDIA_LINKS = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@ChinmayaMissionAdoni',
    ariaLabel: 'YouTube',
    icon: YouTubeIcon,
    hoverBg: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/chinmayamission_adoni?srtk=ZDNlZDc0MzIxNw==',
    ariaLabel: 'Instagram',
    icon: InstagramIcon,
    hoverBg: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent',
  },
  {
    name: 'WhatsApp',
    url: 'https://chat.whatsapp.com/Hd0DpUk36qSGIQ6UTULvke?mode=hq2tcli',
    ariaLabel: 'WhatsApp Community',
    icon: WhatsAppIcon,
    hoverBg: 'hover:bg-[#25D366] hover:border-[#25D366]',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/1CLMkw18LN/?mibextid=wwXIfr',
    ariaLabel: 'Facebook',
    icon: FacebookIcon,
    hoverBg: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
];

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
      { label: 'Your Thoughts & Stories', url: '/your-thoughts', openInNewTab: false, enabled: true, displayOrder: 3 },
      {
        label: 'Main Mission Site',
        url: 'https://chinmaya-mission-adoni.vercel.app/',
        openInNewTab: true,
        enabled: true,
        displayOrder: 4,
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
    { label: 'Your Thoughts & Stories', url: '/your-thoughts', openInNewTab: false, enabled: true, displayOrder: 3 },
    {
      label: 'Main Mission Site',
      url: 'https://chinmaya-mission-adoni.vercel.app/',
      openInNewTab: true,
      enabled: true,
      displayOrder: 4,
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

  // Ensure Home, FAQs, Your Thoughts, and Main Mission Site are the quick navigation links
  const navLinks = rawLinks.length === 0 || rawLinks.every((l) => ['home', 'faqs', 'your thoughts', 'your thoughts & stories', 'main mission site'].includes(l.label?.toLowerCase().trim()))
    ? defaultMarathonLinks
    : [
        ...defaultMarathonLinks,
        ...rawLinks.filter(
          (l) =>
            l.url !== '/' &&
            l.url !== '/faqs' &&
            l.url !== '/your-thoughts' &&
            !l.url?.includes('chinmaya-mission-adoni.vercel.app') &&
            l.label?.toLowerCase() !== 'home' &&
            l.label?.toLowerCase() !== 'faqs' &&
            !l.label?.toLowerCase().includes('thoughts') &&
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
          
          {/* Column 1: Quick Navigation */}
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

          {/* Column 2: Event Location & Contact */}
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

          {/* Column 3: Connect With Us */}
          <div className="space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              CONNECT WITH US
            </h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Follow our movement updates, announcements, marathon media, and community stories.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {SOCIAL_MEDIA_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    title={item.ariaLabel}
                    className={`group w-10 h-10 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${item.hoverBg} focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:ring-offset-2 focus:ring-offset-[#0B2340]`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
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
