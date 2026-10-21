import React, { useMemo } from 'react';
import '../styles/comingSoon.css';

export function ComingSoonPage() {
  // Generate random stars once
  const stars = useMemo(() => {
    return Array.from({ length: 46 }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(2)}%`,
      top: `${(Math.random() * 48).toFixed(2)}%`,
      opacity: (0.15 + Math.random() * 0.55).toFixed(2),
      size: Math.random() > 0.85 ? 3 : 2,
    }));
  }, []);

  return (
    <div className="coming-soon-root">
      <header className="dawn">
        <div className="stars" aria-hidden="true">
          {stars.map((s) => (
            <span
              key={s.id}
              style={{
                left: s.left,
                top: s.top,
                opacity: s.opacity,
                width: `${s.size}px`,
                height: `${s.size}px`,
              }}
            />
          ))}
        </div>

        <div className="title">
          <p className="telugu" lang="te">చిన్మయ మిషన్ ఆదోని</p>
          <h1>
            Chinmaya Mission<span className="place">Adoni</span>
          </h1>
          <p className="lede">
            Our new home on the web is being prepared. The lamp is lit — we'll open the doors soon.
          </p>
        </div>

        <div className="horizon">
          <div className="glow" aria-hidden="true" />
          <svg className="lamp" viewBox="0 0 220 170" role="img" aria-label="A lit oil lamp">
            <defs>
              <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3c26b" />
                <stop offset=".55" stopColor="#c98a35" />
                <stop offset="1" stopColor="#7a4a1c" />
              </linearGradient>
              <radialGradient id="fl" cx=".5" cy=".75" r=".7">
                <stop offset="0" stopColor="#fff6d6" />
                <stop offset=".45" stopColor="#ffd679" />
                <stop offset="1" stopColor="#ec9a3c" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* flame */}
            <path
              className="flame"
              d="M110 22 C122 48 132 66 126 84 C122 95 98 95 94 84 C88 66 99 48 110 22 Z"
              fill="url(#fl)"
            />
            <path
              className="flame-core"
              d="M110 56 C116 68 119 77 116 86 C113 92 107 92 104 86 C101 77 104 68 110 56 Z"
              fill="#fff8e4"
            />
            {/* wick */}
            <rect x="108.5" y="92" width="3" height="10" rx="1.5" fill="#3b2412" />
            {/* bowl */}
            <path d="M38 104 Q110 96 182 104 Q174 138 110 140 Q46 138 38 104 Z" fill="url(#brass)" />
            <path
              d="M38 104 Q110 112 182 104"
              fill="none"
              stroke="#ffe3a3"
              strokeOpacity=".6"
              strokeWidth="1.5"
            />
            {/* stem and base */}
            <path d="M98 139 L122 139 L118 152 L102 152 Z" fill="#a36a2b" />
            <ellipse cx="110" cy="158" rx="38" ry="7" fill="url(#brass)" />
          </svg>
          <div className="ground" aria-hidden="true" />
        </div>
      </header>
    </div>
  );
}

export default ComingSoonPage;
