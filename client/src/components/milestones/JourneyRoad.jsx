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
 * JourneyRoad Component (Straight Vertical Highway)
 * Renders a completely straight vertical road through the center of the timeline with
 * horizontal milestone connectors, station nodes, asphalt layers, dashed center line, and roadside greenery.
 * 
 * @param {object} props
 * @param {string} props.pathD - SVG straight line path string ("M 500 0 L 500 totalHeight")
 * @param {number} props.totalHeight - Total height of the road track in px
 * @param {Array} props.stopPoints - Array of {x, y, id, year, side} coordinate points along the straight road
 * @param {number} props.activeStopIndex - Index of currently active milestone
 * @param {Function} props.onStopClick - Callback when a road node is clicked
 * @param {React.RefObject} props.pathRef - Ref to the main straight SVG path
 */
export const JourneyRoad = ({
  pathD,
  totalHeight = 3600,
  stopPoints = [],
  activeStopIndex = 0,
  onStopClick,
  pathRef,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
      <svg
        className="w-full h-full overflow-hidden"
        viewBox={`0 0 1000 ${totalHeight}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="straightRoadShadow" x="-30%" y="-5%" width="160%" height="110%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.04   0 0 0 0 0.14   0 0 0 0 0.25  0 0 0 0.18 0"
            />
          </filter>
        </defs>

        {/* 1. Road Deep Ground Shadow */}
        <path
          d={pathD}
          stroke="#0B2340"
          strokeWidth="76"
          strokeLinecap="round"
          filter="url(#straightRoadShadow)"
          opacity="0.35"
        />

        {/* 2. Road Outer Curbs / Concrete Shoulder */}
        <path
          d={pathD}
          stroke="#64748B"
          strokeWidth="60"
          strokeLinecap="round"
        />

        {/* 3. Main Asphalt Highway Surface (Straight Dark Slate/Charcoal) */}
        <path
          d={pathD}
          stroke="#1E293B"
          strokeWidth="50"
          strokeLinecap="round"
        />

        {/* 4. White Highway Lane Boundary Edge Stripes */}
        <path
          d={pathD}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="44"
          strokeLinecap="round"
        />
        {/* Core Asphalt Inner Layer */}
        <path
          d={pathD}
          stroke="#1E293B"
          strokeWidth="38"
          strokeLinecap="round"
        />

        {/* 5. Center Dashed Highway Dividing Line (Yellow, Perfectly Vertical) */}
        <path
          ref={pathRef}
          id="straight-road-path"
          d={pathD}
          stroke="#FBBF24"
          strokeWidth="2.8"
          strokeDasharray="16 14"
          strokeLinecap="round"
        />

        {/* 6. Horizontal Milestone Road Connectors (Straight horizontal lines: Road -> Milestone) */}
        {stopPoints.map((pt, idx) => {
          const isActive = activeStopIndex === idx;
          const isPassed = activeStopIndex > idx;
          const isLeft = pt.side === 'left';
          const connectorEndX = isLeft ? 380 : 620;

          return (
            <g key={`connector-${idx}`} className="transition-opacity duration-300">
              {/* Horizontal Connecting Line */}
              <line
                x1="500"
                y1={pt.y}
                x2={connectorEndX}
                y2={pt.y}
                stroke={isActive ? '#F4511E' : isPassed ? '#FFC107' : '#CBD5E1'}
                strokeWidth={isActive ? '3' : '2'}
                strokeDasharray={isActive ? 'none' : '4 4'}
                className="transition-colors duration-300"
              />

              {/* Small Connector Endpoint Circle near Milestone Card */}
              <circle
                cx={connectorEndX}
                cy={pt.y}
                r={isActive ? '4' : '3'}
                fill={isActive ? '#F4511E' : isPassed ? '#FFC107' : '#94A3B8'}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* 7. Roadside Natural Landscape Scatter (Trees & Heritage Lamps on Left and Right) */}
        {stopPoints.map((pt, idx) => {
          const showTreeLeft = idx % 2 === 0;
          const showTreeRight = idx % 2 !== 0;
          const offset = 40;

          return (
            <g key={`decor-${idx}`}>
              {showTreeLeft && (
                <LandscapeTree x={425} y={pt.y - offset} flip={idx % 4 === 0} />
              )}
              {showTreeRight && (
                <LandscapeTree x={545} y={pt.y + offset} flip={idx % 4 !== 0} />
              )}
              {idx % 3 === 0 && (
                <HeritageLamp x={540} y={pt.y - 30} active={activeStopIndex >= idx} />
              )}
            </g>
          );
        })}

        {/* 8. Road Stop Station Node Beacons on the Center Road */}
        {stopPoints.map((pt, idx) => {
          const isActive = activeStopIndex === idx;
          const isPassed = activeStopIndex > idx;

          return (
            <g
              key={`node-${idx}`}
              transform={`translate(500, ${pt.y})`}
              className="pointer-events-auto cursor-pointer"
              onClick={() => onStopClick && onStopClick(idx)}
            >
              {/* Outer Pulse Wave when Active */}
              {isActive && (
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill="#F4511E"
                  opacity="0.3"
                  className="animate-ping"
                />
              )}

              {/* Station Outer Ring / Base */}
              <circle
                cx="0"
                cy="0"
                r={isActive ? '15' : '11'}
                fill={isActive ? '#F4511E' : isPassed ? '#FFC107' : '#FFFFFF'}
                stroke={isActive ? '#FFFFFF' : '#0B2340'}
                strokeWidth={isActive ? '3' : '2'}
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))"
              />

              {/* Stop Number text */}
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
