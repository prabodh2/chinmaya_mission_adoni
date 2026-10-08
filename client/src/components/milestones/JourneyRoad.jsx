import React from 'react';

/**
 * Landscape Tree Decorative SVG
 */
const LandscapeTree = ({ x, y, flip = false }) => (
  <g transform={`translate(${x}, ${y}) scale(0.9)`} className="pointer-events-none select-none">
    <rect x="13" y="24" width="4" height="12" rx="2" fill="#78350F" />
    <path
      d="M15 2 C23 2 29 8 28 15 C27 22 21 26 15 26 C9 26 3 22 2 15 C1 8 7 2 15 2 Z"
      fill={flip ? '#15803D' : '#16A34A'}
      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
    />
    <circle cx="12" cy="11" r="5" fill="#22C55E" opacity="0.6" />
  </g>
);

/**
 * Landscape Heritage Lamp Post SVG
 */
const HeritageLamp = ({ x, y, active = false }) => (
  <g transform={`translate(${x}, ${y}) scale(0.85)`} className="pointer-events-none select-none">
    <path d="M10 36 L10 10 Q10 4 16 4" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="7" r="3" fill={active ? '#FBBF24' : '#E2E8F0'} stroke="#334155" strokeWidth="1.2" />
    {active && (
      <circle cx="16" cy="7" r="7" fill="#FEF08A" opacity="0.45" filter="blur(1px)" />
    )}
  </g>
);

/**
 * JourneyRoad Component
 * Renders the continuous SVG zig-zag road with asphalt surfaces, lane markings, and roadside landscape.
 * 
 * @param {object} props
 * @param {string} props.pathD - SVG path d string for the continuous winding road
 * @param {number} props.totalHeight - Total height of the road track in px
 * @param {Array} props.stopPoints - Array of {x, y, id, year} coordinate points along the road
 * @param {number} props.activeStopIndex - Index of currently active milestone
 * @param {Function} props.onStopClick - Callback when a road node is clicked
 * @param {React.RefObject} props.pathRef - Ref to the main SVG path for tangent calculations
 */
export const JourneyRoad = ({
  pathD,
  totalHeight = 3800,
  stopPoints = [],
  activeStopIndex = 0,
  onStopClick,
  pathRef,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 1000 ${totalHeight}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="roadShadow" x="-20%" y="-10%" width="140%" height="120%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.04   0 0 0 0 0.14   0 0 0 0 0.25  0 0 0 0.16 0"
            />
          </filter>
        </defs>

        {/* 1. Road Deep Ground Shadow */}
        <path
          d={pathD}
          stroke="#0B2340"
          strokeWidth="74"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#roadShadow)"
          opacity="0.3"
        />

        {/* 2. Road Kerbs / Outer Gravel Shoulder */}
        <path
          d={pathD}
          stroke="#64748B"
          strokeWidth="60"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Main Asphalt Road Surface (Dark Charcoal/Slate Highway) */}
        <path
          d={pathD}
          stroke="#1E293B"
          strokeWidth="50"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. White Highway Lane Boundary Edge Stripes */}
        <path
          d={pathD}
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Core Asphalt Layer to isolate edge stripes */}
        <path
          d={pathD}
          stroke="#1E293B"
          strokeWidth="38"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Center Dashed Highway Line (Golden Yellow) */}
        <path
          ref={pathRef}
          id="zig-zag-road-path"
          d={pathD}
          stroke="#FBBF24"
          strokeWidth="2.8"
          strokeDasharray="14 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Roadside Landscape Elements Placed Along Natural Bends */}
        <LandscapeTree x={190} y={120} flip={false} />
        <HeritageLamp x={780} y={410} active={activeStopIndex >= 1} />
        <LandscapeTree x={180} y={690} flip={true} />
        <LandscapeTree x={810} y={970} flip={false} />
        <HeritageLamp x={190} y={1250} active={activeStopIndex >= 4} />
        <LandscapeTree x={800} y={1530} flip={true} />
        <LandscapeTree x={190} y={1810} flip={false} />
        <HeritageLamp x={810} y={2090} active={activeStopIndex >= 7} />
        <LandscapeTree x={180} y={2370} flip={true} />
        <LandscapeTree x={800} y={2650} flip={false} />
        <HeritageLamp x={200} y={2930} active={activeStopIndex >= 10} />
        <LandscapeTree x={800} y={3210} flip={true} />

        {/* 7. Road Stop Station Node Markers */}
        {stopPoints.map((pt, idx) => {
          const isActive = activeStopIndex === idx;
          const isPassed = activeStopIndex > idx;

          return (
            <g
              key={idx}
              transform={`translate(${pt.x}, ${pt.y})`}
              className="pointer-events-auto cursor-pointer"
              onClick={() => onStopClick && onStopClick(idx)}
            >
              {/* Outer Pulse Ring when Active */}
              {isActive && (
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill="#F4511E"
                  opacity="0.25"
                  className="animate-ping"
                />
              )}

              {/* Station Outer Ring */}
              <circle
                cx="0"
                cy="0"
                r={isActive ? '15' : '11'}
                fill={isActive ? '#F4511E' : isPassed ? '#FFC107' : '#FFFFFF'}
                stroke={isActive ? '#FFFFFF' : '#0B2340'}
                strokeWidth={isActive ? '3' : '2'}
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))"
              />

              {/* Station Stop Number */}
              <text
                x="0"
                y="3.5"
                textAnchor="middle"
                fontSize={isActive ? '10' : '8'}
                fontWeight="900"
                fill={isActive ? '#FFFFFF' : '#0B2340'}
                fontFamily="sans-serif"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default JourneyRoad;
