import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const ChinmayaMissionBadge = ({ className = '', size = 'medium' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/register') {
      const el = document.getElementById('marathon-map');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    } else {
      navigate('/register#marathon-map');
    }
  };

  const isSmall = size === 'small';

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--cyan)] shadow-md hover:shadow-cyan-500/20 hover:scale-105 transition-all text-decoration-none cursor-pointer ${className}`}
      title="Click to view 7KM Marathon Route Map at Chinmaya Mission Adoni"
    >
      <div className={`rounded-full bg-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)] ${isSmall ? 'w-5 h-5' : 'w-6 h-6'}`}>
        <MapPin className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </div>
      <span className={`font-extrabold text-[var(--text-primary)] tracking-wide ${isSmall ? 'text-xs' : 'text-sm'}`}>
        Chinmaya Mission Adoni
      </span>
    </button>
  );
};

export default ChinmayaMissionBadge;
