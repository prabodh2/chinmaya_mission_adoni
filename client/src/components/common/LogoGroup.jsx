import React from 'react';
import { Link } from 'react-router-dom';

const LOGO_1 = '/assets/logos/logo-1.png';

// Official Chinmaya Mission Logo Component
export const LeftLogo = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`flex items-center group text-decoration-none focus:outline-none ${className}`}
      aria-label="Chinmaya Mission Adoni"
    >
      <img
        src={LOGO_1}
        alt="Chinmaya Mission Adoni"
        loading="eager"
        decoding="async"
        className="h-7 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm shrink-0"
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    </Link>
  );
};

export const LogoGroup = LeftLogo;

export default LogoGroup;

