import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { footerService } from '../services/api';
import { MapPin, Phone, Mail, Globe, ExternalLink, MessageSquare } from 'lucide-react';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL || 'https://marathon-chinmaya-mission-adoni.vercel.app/';

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

const MAIN_SITE_FALLBACK_FOOTER = {
  isEnabled: true,
  disabledMessage: '',
  brand: {
    title: 'CHINMAYA MISSION, ADONI',
    description:
      'A spiritual and cultural organisation established in 1992, dedicated to sharing timeless Vedic wisdom, human values, and inspiring individuals to lead purposeful lives.',
  },
  organizedBy: {
    heading: 'FOUNDED UNDER PUJYA GURUDEV:',
    text: 'Chinmaya Mission, Adoni & Chinmaya Yuva Kendra, Adoni',
  },
  quickNavigation: {
    heading: 'QUICK NAVIGATION',
    links: [
      { label: 'Home', url: '/', enabled: true, displayOrder: 1 },
      { label: 'About Us', url: '/about', enabled: true, displayOrder: 2 },
      { label: 'Events', url: '/events', enabled: true, displayOrder: 3 },
      { label: 'Chinmaya Sanjeevaraya Temple', url: '/chinmaya-sanjeevaraya-temple', enabled: true, displayOrder: 4 },
      { label: 'Shri Shantamalleshwara Swami Temple', url: '/shri-shantamalleshwara-swami-temple', enabled: true, displayOrder: 5 },
      { label: 'Sacred Image Gallery', url: '/gallery', enabled: true, displayOrder: 6 },
      { label: 'Who Are We', url: '/who-are-we', enabled: true, displayOrder: 7 },
      { label: "Let's Connect", url: '/lets-connect', enabled: true, displayOrder: 8 },
      { label: 'Marathon 2026 Portal', url: MARATHON_PORTAL_URL, enabled: true, displayOrder: 9, openInNewTab: true },
    ],
  },
  contact: {
    heading: 'LOCATION & CONTACT',
    address: {
      line1: 'Chinmaya Cultural Complex,',
      line2: 'Near Arts College Road,',
      city: 'Adoni',
      pincode: '518301.',
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
    copyrightText: '© Chinmaya Mission, Adoni. All Rights Reserved.',
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
      title: 'CHINMAYA MISSION, ADONI',
      description:
        'A spiritual and cultural organisation established in 1992, dedicated to sharing timeless Vedic wisdom, human values, and inspiring individuals to lead purposeful lives.',
    };
  }

  // 2. Sanitize Quick Navigation Links (Remove "Home", "What We Do" and "Marathon Registration")
  const rawLinks = data.quickNavigation?.links || MAIN_SITE_FALLBACK_FOOTER.quickNavigation.links;
  const filteredLinks = rawLinks
    .filter((link) => {
      if (!link || !link.label) return false;
      const lower = link.label.toLowerCase().trim();
      const url = (link.url || '').toLowerCase().trim();
      // Exclude unwanted links
      if (lower.includes('what we do') || url === '/what-we-do') return false;
      if (lower.includes('marathon registration') || url === '/register') return false;
      return true;
    })
    .map((link) => {
      const lower = link.label.toLowerCase().trim();
      if (lower.includes('about')) {
        return { ...link, url: '/about' };
      }
      if (lower.includes('activities') || url === '/activities') {
        return { ...link, label: 'Events', url: '/events' };
      }
      if (
        lower.includes('mamleshwara') ||
        lower.includes('malleshwara') ||
        lower.includes('shantamalleshwara') ||
        lower.includes('shantha') ||
        url.includes('mamleshwara') ||
        url.includes('malleshwara')
      ) {
        return {
          ...link,
          label: 'Shri Shantamalleshwara Swami Temple',
          url: '/shri-shantamalleshwara-swami-temple',
        };
      }
      return link;
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

  // 3. Sanitize Contact Heading & Address
  if (data.contact) {
    const addr = data.contact.address || {};
    data.contact = {
      ...data.contact,
      heading: 'LOCATION & CONTACT',
      address: {
        ...addr,
        line1: (addr.line1 && addr.line1 !== 'Chinmaya Mission Cultural Complex , Adoni' && addr.line1 !== 'Chinmaya Mission Adoni')
          ? addr.line1
          : 'Chinmaya Cultural Complex,',
        line2: (addr.line2 === 'Arts College Road' || !addr.line2) ? 'Near Arts College Road,' : addr.line2,
        city: addr.city || 'Adoni',
        pincode: addr.pincode || '518301.',
      },
    };
  }

  // 3b. Sanitize Organized By
  if (data.organizedBy && data.organizedBy.text?.includes('(CHYK)')) {
    data.organizedBy.text = 'Chinmaya Mission, Adoni & Chinmaya Yuva Kendra, Adoni';
  }

  // 4. Sanitize Pledge Section (Replace "THE MARATHON PLEDGE" / "OUR INSPIRATION" with Gurudev's Motto)
  const pledgeHeading = data.pledge?.heading || '';
  const pledgeTitle = data.pledge?.title || '';
  if (
    pledgeHeading.includes('MARATHON') ||
    pledgeTitle.includes('DRUG-FREE') ||
    pledgeTitle.includes('MARATHON') ||
    pledgeHeading.includes('INSPIRATION')
  ) {
    data.pledge = {
      heading: 'Our Motto',
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
      localStorage.removeItem('cached_main_footer_data');
      const cached = localStorage.getItem('cached_main_footer_data_v3');
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
            localStorage.setItem('cached_main_footer_data_v3', JSON.stringify(sanitized));
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

  const midPoint = Math.ceil(navLinks.length / 2);
  const col1Links = navLinks.slice(0, midPoint);
  const col2Links = navLinks.slice(midPoint);

  const address = contact.address || {};
  const addressLines = [
    address.line1 && address.line1 !== 'Chinmaya Mission Cultural Complex , Adoni' && address.line1 !== 'Chinmaya Mission Adoni'
      ? (address.line1.endsWith(',') ? address.line1 : `${address.line1},`)
      : 'Chinmaya Cultural Complex,',
    address.line2 && address.line2 !== 'Arts College Road'
      ? (address.line2.endsWith(',') ? address.line2 : `${address.line2},`)
      : 'Near Arts College Road,',
    address.city
      ? `${address.city} - ${(address.pincode || '518301').replace(/\.$/, '')}.`
      : 'Adoni - 518301.',
  ];

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

  const renderNavLink = (link, key) => {
    const isExternal = link.url?.startsWith('http');
    const isMarathonLink = link.label?.toLowerCase().includes('marathon');

    return (
      <li key={key} className="leading-snug">
        {isExternal ? (
          <a
            href={link.url}
            target={link.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className={`transition-colors text-decoration-none inline-flex items-center gap-1.5 ${
              isMarathonLink
                ? 'font-bold hover:underline'
                : 'hover:text-white'
            }`}
            style={isMarathonLink ? accentStyle : undefined}
          >
            <span>{link.label}</span>
            {isMarathonLink && <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />}
          </a>
        ) : (
          <Link
            to={link.url}
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="transition-colors text-decoration-none hover:text-white hover:underline block"
          >
            {link.label}
          </Link>
        )}
      </li>
    );
  };

  return (
    <footer
      style={footerStyle}
      className="border-t pt-8 pb-7 transition-colors duration-300 w-full"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-7 items-start">
          
          {/* Column 1: Quick Navigation (Compact 2 columns) */}
          <div className="md:col-span-2 lg:col-span-5 space-y-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {quickNavigation.heading || 'QUICK NAVIGATION'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-[13px] font-medium">
              <ul className="space-y-2 list-none p-0 m-0">
                {col1Links.map((link, idx) => renderNavLink(link, idx))}
              </ul>
              <ul className="space-y-2 list-none p-0 m-0">
                {col2Links.map((link, idx) => renderNavLink(link, idx + midPoint))}
              </ul>
            </div>
          </div>

          {/* Column 2: Location & Contact */}
          <div className="space-y-3 lg:col-span-4">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              {contact.heading || 'LOCATION & CONTACT'}
            </h4>
            <div className="space-y-3 text-xs sm:text-[13px] opacity-90">
              <div className="flex items-start gap-2.5 leading-relaxed">
                <MapPin style={accentStyle} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="font-medium text-slate-300 space-y-0.5">
                  {addressLines.map((line, idx) => (
                    <p key={idx} className="m-0 leading-normal">{line}</p>
                  ))}
                </div>
              </div>

              {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
                <p className="flex items-center gap-2.5 m-0">
                  <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-semibold tracking-wide text-white">{contact.phoneNumbers.join(' / ')}</span>
                </p>
              )}

              {contact.emails && contact.emails.length > 0 && (
                <p className="flex items-center gap-2.5 m-0">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-slate-300">{contact.emails.join(', ')}</span>
                </p>
              )}

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {contact.googleMapsUrl ? (
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors text-decoration-none shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Map</span>
                  </a>
                ) : (
                  <Link
                    to="/lets-connect"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors text-decoration-none shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Contact Us</span>
                  </Link>
                )}
                {contact.whatsappNumber && (
                  <a
                    href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-decoration-none shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Connect With Us */}
          <div className="space-y-3 lg:col-span-3">
            <h4
              style={headingStyle}
              className="text-xs sm:text-sm font-extrabold tracking-wider uppercase font-heading"
            >
              CONNECT WITH US
            </h4>
            <p className="text-xs sm:text-[13px] text-slate-300 font-normal leading-relaxed m-0">
              Stay connected with Chinmaya Mission, Adoni. Follow our official channels for daily updates, satsangs, and youth programs.
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
                    className={`group w-9 h-9 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${item.hoverBg} focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:ring-offset-2 focus:ring-offset-[#0B2340]`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Footer Section */}
        <div
          style={{ borderColor: appearance?.dividerColor || 'rgba(255, 255, 255, 0.1)' }}
          className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs opacity-75 gap-2 sm:gap-3"
        >
          <p className="m-0">{bottomFooter.copyrightText || '© Chinmaya Mission, Adoni. All Rights Reserved.'}</p>
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
