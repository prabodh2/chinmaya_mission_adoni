import React, { useState, useEffect, useRef } from 'react';
import { MILESTONES_DATA } from './milestonesData';
import { JourneyIntro } from './JourneyIntro';
import { JourneyRoad } from './JourneyRoad';
import { JourneyBus } from './JourneyBus';
import { MilestoneCard } from './MilestoneCard';
import { RoadSign } from './RoadSign';
import { FinalDestination } from './FinalDestination';

const SPACING_Y = 270;
const START_Y = 140;

// Generate smooth S-Curve coordinate geometry
const generatePathGeometry = () => {
  const points = [];
  MILESTONES_DATA.forEach((item, idx) => {
    let x = 500;
    if (item.side === 'left') x = 320;
    else if (item.side === 'right') x = 680;
    else x = 500;

    const y = START_Y + idx * SPACING_Y;
    points.push({ ...item, x, y, idx });
  });

  const finishY = START_Y + MILESTONES_DATA.length * SPACING_Y + 80;
  const finishPoint = { x: 500, y: finishY };
  const totalSvgHeight = finishY + 60;

  // Build continuous cubic Bézier SVG path d
  let d = `M 500 0 `;
  let prevX = 500;
  let prevY = 0;

  points.forEach((pt) => {
    const midY = (prevY + pt.y) / 2;
    d += `C ${prevX} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y} `;
    prevX = pt.x;
    prevY = pt.y;
  });

  // Straight line to finish terminal
  d += `L 500 ${finishY}`;

  return { points, finishPoint, totalSvgHeight, pathD: d };
};

const { points: STOP_POINTS, finishPoint: FINISH_POINT, totalSvgHeight: TOTAL_SVG_HEIGHT, pathD: PATH_D } = generatePathGeometry();

/**
 * OurMilestones Main Master Component
 * Visual Bus Journey along a continuous winding Zig-Zag SVG road through Chinmaya Mission Adoni history.
 */
export const OurMilestones = () => {
  const containerRef = useRef(null);
  const roadContainerRef = useRef(null);
  const pathRef = useRef(null);

  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [busPosition, setBusPosition] = useState({ x: 500, y: 140, angle: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const pathLengthRef = useRef(0);

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      try {
        pathLengthRef.current = pathRef.current.getTotalLength();
      } catch (err) {
        pathLengthRef.current = 4000;
      }
    }
  }, []);

  // Track scroll and drive bus along the SVG curve
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!roadContainerRef.current || !pathRef.current) return;

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      animationFrameId = requestAnimationFrame(() => {
        const roadRect = roadContainerRef.current.getBoundingClientRect();
        const roadTop = roadRect.top;
        const roadHeight = roadRect.height;
        const windowHeight = window.innerHeight;

        // Viewport trigger line (near vertical center of screen)
        const triggerY = windowHeight * 0.45;

        // Scroll progress from 0 (start) to 1 (finish)
        let progress = (triggerY - roadTop) / roadHeight;
        progress = Math.max(0, Math.min(1, progress));

        const totalLength = pathLengthRef.current || pathRef.current.getTotalLength();
        const currentDistance = progress * totalLength;

        // Get coordinates and tangent angle from SVG path
        const p1 = pathRef.current.getPointAtLength(currentDistance);
        const lookAheadDist = Math.min(totalLength, currentDistance + 8);
        const p2 = pathRef.current.getPointAtLength(lookAheadDist);

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;

        // Tangent angle in degrees relative to downward motion (0 = straight down)
        // dx > 0 means moving right (positive angle)
        // dx < 0 means moving left (negative angle)
        const rad = Math.atan2(dx, dy);
        const angleDeg = (rad * 180) / Math.PI;

        setBusPosition({
          x: p1.x,
          y: p1.y,
          angle: angleDeg,
        });

        // Determine active milestone based on closest stop point along Y
        let closestIndex = 0;
        let minDiff = Infinity;

        STOP_POINTS.forEach((pt, idx) => {
          const diff = Math.abs(pt.y - p1.y);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        setActiveStopIndex(closestIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Smooth scroll to a specific milestone
  const scrollToMilestone = (idx) => {
    if (!roadContainerRef.current) return;
    const pt = STOP_POINTS[idx];
    if (!pt) return;

    const roadRect = roadContainerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + roadRect.top;
    const roadHeight = roadRect.height;

    // Relative Y ratio
    const ratio = pt.y / TOTAL_SVG_HEIGHT;
    const targetPixelY = containerTop + ratio * roadHeight;
    const offset = window.innerHeight * 0.4;

    window.scrollTo({
      top: targetPixelY - offset,
      behavior: 'smooth',
    });
    setActiveStopIndex(idx);
  };

  const handleRestartJourney = () => {
    scrollToMilestone(0);
  };

  const currentMilestone = MILESTONES_DATA[activeStopIndex] || MILESTONES_DATA[0];

  return (
    <section
      ref={containerRef}
      id="our-milestones"
      className="relative py-16 sm:py-24 bg-[var(--bg-primary)] overflow-hidden transition-colors"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 15%, rgba(244, 81, 30, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 90% 85%, rgba(255, 193, 7, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(255, 240, 197, 0.4) 0%, transparent 60%)
        `,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        
        {/* 1. HERO / INTRO HEADER */}
        <JourneyIntro />

        {/* Quick Nav Timeline Jump Ribbon */}
        <div className="hidden lg:flex items-center justify-center gap-1.5 mb-14 overflow-x-auto pb-2 scrollbar-none">
          {MILESTONES_DATA.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollToMilestone(idx)}
              type="button"
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all shrink-0 ${
                activeStopIndex === idx
                  ? 'bg-[#F4511E] text-white shadow-md scale-105'
                  : idx <= activeStopIndex
                  ? 'bg-[#0B2340]/10 text-[#0B2340] hover:bg-[#0B2340]/20'
                  : 'bg-white/80 text-[#3D607E] hover:text-[#0B2340] border border-[#EBD6A2]'
              }`}
            >
              {item.year.includes('Summer') ? 'Summer' : item.year}
            </button>
          ))}
        </div>

        {/* 2. ZIG-ZAG ROAD & BUS JOURNEY CONTAINER */}
        <div
          ref={roadContainerRef}
          className="relative"
          style={{ height: `${TOTAL_SVG_HEIGHT}px` }}
        >
          {/* Continuous Winding SVG Zig-Zag Road */}
          <JourneyRoad
            pathD={PATH_D}
            totalHeight={TOTAL_SVG_HEIGHT}
            stopPoints={STOP_POINTS}
            activeStopIndex={activeStopIndex}
            onStopClick={scrollToMilestone}
            pathRef={pathRef}
          />

          {/* Steerable Traveling Bus Following Road Tangent Angle */}
          <div
            className="absolute z-40 transition-transform duration-100 ease-out pointer-events-none"
            style={{
              left: `${(busPosition.x / 1000) * 100}%`,
              top: `${busPosition.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <JourneyBus
              angle={busPosition.angle}
              isMoving={isScrolling}
              currentYear={currentMilestone.year}
            />
          </div>

          {/* 3. ALTERNATING MILESTONE STOPS ALONG THE ZIG-ZAG ROAD */}
          {STOP_POINTS.map((pt, idx) => {
            const milestone = MILESTONES_DATA[idx];
            const isActive = activeStopIndex === idx;
            const isPassed = activeStopIndex > idx;
            const isLeft = milestone.side === 'left';
            const isCenter = milestone.side === 'center';

            return (
              <div
                key={milestone.id}
                className="absolute w-full flex items-center z-20 pointer-events-none"
                style={{
                  top: `${pt.y}px`,
                  transform: 'translateY(-50%)',
                }}
              >
                {/* Desktop Layout: Left Card, Right Card, or Centered */}
                <div className="w-full flex flex-col md:flex-row items-center px-2 sm:px-4">
                  
                  {/* Left Column Area */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col ${
                      isLeft ? 'items-start md:items-end' : 'hidden md:flex'
                    } ${isLeft ? 'pointer-events-auto' : ''} md:pr-14 lg:pr-20`}
                  >
                    {isLeft && (
                      <div className="space-y-2 w-full max-w-md">
                        {/* Road Sign Beside Turn */}
                        <div className="flex md:justify-end justify-start mb-1">
                          <RoadSign
                            year={milestone.year}
                            isActive={isActive}
                            isPassed={isPassed}
                            side="left"
                          />
                        </div>
                        {/* Destination Card */}
                        <MilestoneCard
                          milestone={milestone}
                          position="left"
                          isActive={isActive}
                          isPassed={isPassed}
                          onClick={() => scrollToMilestone(idx)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column Area */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col ${
                      !isLeft && !isCenter ? 'items-start' : 'hidden md:flex'
                    } ${!isLeft && !isCenter ? 'pointer-events-auto' : ''} md:pl-14 lg:pl-20 mt-4 md:mt-0`}
                  >
                    {!isLeft && !isCenter && (
                      <div className="space-y-2 w-full max-w-md">
                        {/* Road Sign Beside Turn */}
                        <div className="flex justify-start mb-1">
                          <RoadSign
                            year={milestone.year}
                            isActive={isActive}
                            isPassed={isPassed}
                            side="right"
                          />
                        </div>
                        {/* Destination Card */}
                        <MilestoneCard
                          milestone={milestone}
                          position="right"
                          isActive={isActive}
                          isPassed={isPassed}
                          onClick={() => scrollToMilestone(idx)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Center Milestone Area (Stop #13: 2025–26) */}
                  {isCenter && (
                    <div className="w-full flex flex-col items-center pointer-events-auto z-30">
                      <div className="space-y-2 w-full max-w-lg">
                        <div className="flex justify-center mb-1">
                          <RoadSign
                            year={milestone.year}
                            isActive={isActive}
                            isPassed={isPassed}
                            side="center"
                          />
                        </div>
                        <MilestoneCard
                          milestone={milestone}
                          position="center"
                          isActive={isActive}
                          isPassed={isPassed}
                          onClick={() => scrollToMilestone(idx)}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* 4. FINAL DESTINATION TERMINAL */}
        <FinalDestination onRestartJourney={handleRestartJourney} />

      </div>
    </section>
  );
};

export default OurMilestones;
