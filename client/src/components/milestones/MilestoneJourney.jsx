import React, { useState, useEffect, useRef } from 'react';
import { MILESTONES_DATA } from './milestonesData';
import { JourneyIntro } from './JourneyIntro';
import { JourneyRoad } from './JourneyRoad';
import { JourneyBus } from './JourneyBus';
import { MilestoneCard } from './MilestoneCard';
import { RoadSign } from './RoadSign';
import { FinalDestination } from './FinalDestination';

const SPACING_Y = 260;
const START_Y = 130;

// Generate Straight Vertical Road Geometry
const generateStraightPathGeometry = () => {
  const points = MILESTONES_DATA.map((item, idx) => {
    const y = START_Y + idx * SPACING_Y;
    return {
      ...item,
      x: 500,
      y,
      idx,
    };
  });

  const finishY = START_Y + MILESTONES_DATA.length * SPACING_Y + 90;
  const totalSvgHeight = finishY + 60;
  const pathD = `M 500 0 L 500 ${totalSvgHeight}`;

  return { points, finishPoint: { x: 500, y: finishY }, totalSvgHeight, pathD };
};

const { points: STOP_POINTS, totalSvgHeight: TOTAL_SVG_HEIGHT, pathD: PATH_D } = generateStraightPathGeometry();

/**
 * MilestoneJourney Master Component (Straight Vertical Highway)
 * Single source of truth: 100% straight vertical SVG road through the center.
 * Features an animated coach travelling strictly down the straight road with alternating left/right milestones.
 */
export const MilestoneJourney = () => {
  const containerRef = useRef(null);
  const roadContainerRef = useRef(null);
  const pathRef = useRef(null);

  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [busPosition, setBusPosition] = useState({ x: 500, y: START_Y });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const pathLengthRef = useRef(0);

  // Measure straight path length on mount
  useEffect(() => {
    if (pathRef.current) {
      try {
        pathLengthRef.current = pathRef.current.getTotalLength();
      } catch (err) {
        pathLengthRef.current = TOTAL_SVG_HEIGHT;
      }
    }
  }, []);

  // Track scroll and drive bus strictly along the straight SVG path
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

        // Exact point along the straight SVG path (single source of truth)
        const currentPoint = pathRef.current.getPointAtLength(currentDistance);

        setBusPosition({
          x: currentPoint.x,
          y: currentPoint.y,
        });

        // Determine active milestone based on closest stop point along Y
        let closestIndex = 0;
        let minDiff = Infinity;

        STOP_POINTS.forEach((pt, idx) => {
          const diff = Math.abs(pt.y - currentPoint.y);
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

    // Relative Y ratio along straight road
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
      className="relative py-16 sm:py-24 bg-[var(--bg-primary,#FFFDF7)] overflow-hidden transition-colors"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 15%, rgba(244, 81, 30, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 90% 85%, rgba(255, 193, 7, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(255, 240, 197, 0.35) 0%, transparent 60%)
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

        {/* 2. STRAIGHT CENTRAL ROAD & BUS JOURNEY CONTAINER */}
        <div
          ref={roadContainerRef}
          className="relative"
          style={{ height: `${TOTAL_SVG_HEIGHT}px` }}
        >
          {/* Straight Vertical Highway (SVG Single Source of Truth) */}
          <JourneyRoad
            pathD={PATH_D}
            totalHeight={TOTAL_SVG_HEIGHT}
            stopPoints={STOP_POINTS}
            activeStopIndex={activeStopIndex}
            onStopClick={scrollToMilestone}
            pathRef={pathRef}
          />

          {/* Traveling Bus Strictly Centered on the Straight Road */}
          <div
            className="absolute z-40 pointer-events-none transition-transform duration-75 ease-out"
            style={{
              left: '50%',
              top: `${busPosition.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <JourneyBus
              isMoving={isScrolling}
              currentYear={currentMilestone.year}
            />
          </div>

          {/* 3. ALTERNATING LEFT AND RIGHT MILESTONE STATIONS */}
          {STOP_POINTS.map((pt, idx) => {
            const milestone = MILESTONES_DATA[idx];
            const isActive = activeStopIndex === idx;
            const isPassed = activeStopIndex > idx;
            const isLeft = milestone.side === 'left';

            return (
              <div
                key={milestone.id}
                className="absolute w-full flex items-center z-20 pointer-events-none"
                style={{
                  top: `${pt.y}px`,
                  transform: 'translateY(-50%)',
                }}
              >
                {/* 2-Column Desktop Grid with Straight Road in Center */}
                <div className="w-full flex flex-col md:flex-row items-center px-2 sm:px-4">
                  
                  {/* LEFT Column */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col ${
                      isLeft ? 'items-start md:items-end' : 'hidden md:flex'
                    } ${isLeft ? 'pointer-events-auto' : ''} md:pr-14 lg:pr-20`}
                  >
                    {isLeft && (
                      <div className="space-y-2 w-full max-w-md">
                        {/* Road Sign Beside Road */}
                        <div className="flex md:justify-end justify-start mb-1">
                          <RoadSign
                            year={milestone.year}
                            isActive={isActive}
                            isPassed={isPassed}
                            side="left"
                          />
                        </div>
                        {/* Milestone Destination Card */}
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

                  {/* RIGHT Column */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col ${
                      !isLeft ? 'items-start' : 'hidden md:flex'
                    } ${!isLeft ? 'pointer-events-auto' : ''} md:pl-14 lg:pl-20 mt-4 md:mt-0`}
                  >
                    {!isLeft && (
                      <div className="space-y-2 w-full max-w-md">
                        {/* Road Sign Beside Road */}
                        <div className="flex justify-start mb-1">
                          <RoadSign
                            year={milestone.year}
                            isActive={isActive}
                            isPassed={isPassed}
                            side="right"
                          />
                        </div>
                        {/* Milestone Destination Card */}
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

export const OurMilestones = MilestoneJourney;
export default MilestoneJourney;
