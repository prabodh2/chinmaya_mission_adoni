import React, { useState, useEffect, useRef } from 'react';
import { MILESTONES_DATA } from './milestonesData';
import { JourneyIntro } from './JourneyIntro';
import { Road } from './Road';
import { Bus } from './Bus';
import { MilestoneCard } from './MilestoneCard';
import { FinalDestination } from './FinalDestination';

/**
 * MilestoneJourney Main Master Component
 * Renders the vertical road, scroll-driven animated bus, alternating milestone stops, and final terminal.
 */
export const MilestoneJourney = () => {
  const containerRef = useRef(null);
  const roadTrackRef = useRef(null);
  const milestoneItemRefs = useRef([]);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [busY, setBusY] = useState(40);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  // Initialize refs array
  milestoneItemRefs.current = [];
  const addToItemRefs = (el) => {
    if (el && !milestoneItemRefs.current.includes(el)) {
      milestoneItemRefs.current.push(el);
    }
  };

  // Scroll handler to track bus position along the road
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!roadTrackRef.current || milestoneItemRefs.current.length === 0) return;

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      animationFrameId = requestAnimationFrame(() => {
        const roadRect = roadTrackRef.current.getBoundingClientRect();
        const roadTop = roadRect.top;
        const roadHeight = roadRect.height;
        const windowHeight = window.innerHeight;

        // Viewport trigger line (near vertical center of screen)
        const triggerY = windowHeight * 0.45;

        // Calculate progress through the road
        // When roadTop is triggerY, progress is 0. When roadTop + roadHeight is triggerY, progress is 1.
        let progress = (triggerY - roadTop) / roadHeight;
        progress = Math.max(0, Math.min(1, progress));

        // Find positions of individual milestone markers relative to roadTrack
        const milestonePositions = milestoneItemRefs.current.map((itemEl) => {
          if (!itemEl) return 0;
          const itemRect = itemEl.getBoundingClientRect();
          // Center of the milestone item relative to road top
          return itemRect.top - roadTop + itemRect.height / 2;
        });

        // Determine which milestone is currently closest to the trigger
        let closestIndex = 0;
        let minDiff = Infinity;
        const currentTargetY = progress * roadHeight;

        milestonePositions.forEach((pos, idx) => {
          const diff = Math.abs(pos - currentTargetY);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        setActiveStopIndex(closestIndex);

        // Calculate target bus Y position
        // Clamp bus within the top of first milestone and bottom of last milestone
        const firstMilestonePos = milestonePositions[0] || 40;
        const lastMilestonePos = milestonePositions[milestonePositions.length - 1] || (roadHeight - 60);

        let calculatedBusY = firstMilestonePos + (lastMilestonePos - firstMilestonePos) * progress;
        // Keep bus nicely on the track
        calculatedBusY = Math.max(firstMilestonePos - 20, Math.min(lastMilestonePos + 40, calculatedBusY));

        setBusY(calculatedBusY);
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
    const targetEl = milestoneItemRefs.current[idx];
    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const offset = window.innerHeight * 0.35;
      const targetScroll = window.scrollY + targetRect.top - offset;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setActiveStopIndex(idx);
    }
  };

  // Return to start
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
          radial-gradient(circle at 10% 20%, rgba(244, 81, 30, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(255, 193, 7, 0.05) 0%, transparent 40%)
        `,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        
        {/* 1. HERO / INTRO SECTION */}
        <JourneyIntro />

        {/* Quick Nav Timeline Stops Ribbon */}
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

        {/* 2. THE ROAD JOURNEY TRACK */}
        <div ref={roadTrackRef} className="relative pb-12">
          
          {/* Continuous Highway Roadway Graphic */}
          <Road
            milestones={MILESTONES_DATA}
            activeStopIndex={activeStopIndex}
            onStopClick={scrollToMilestone}
          />

          {/* Traveling Bus Along the Road */}
          <div
            className="absolute left-6 md:left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ease-out pointer-events-none"
            style={{
              top: `${busY}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Bus
              isMoving={isScrolling}
              currentYear={currentMilestone.year}
            />
          </div>

          {/* 3. MILESTONES (ALTERNATING LEFT & RIGHT) */}
          <div className="space-y-16 sm:space-y-24 relative z-10">
            {MILESTONES_DATA.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              const position = isEven ? 'left' : 'right';
              const isActive = activeStopIndex === idx;
              const isPassed = activeStopIndex > idx;

              return (
                <div
                  key={milestone.id}
                  ref={addToItemRefs}
                  className="relative flex items-center"
                >
                  {/* Desktop Layout: Alternating Left & Right Grid */}
                  <div className="w-full flex flex-col md:flex-row items-center">
                    
                    {/* LEFT SLOT (On Mobile: Hidden if right, or cards aligned on right of road) */}
                    <div className="w-full md:w-1/2 pl-16 sm:pl-20 md:pl-0 md:pr-16 lg:pr-20">
                      {isEven ? (
                        <MilestoneCard
                          milestone={milestone}
                          position="left"
                          isActive={isActive}
                          isPassed={isPassed}
                          onClick={() => scrollToMilestone(idx)}
                        />
                      ) : (
                        /* Empty Spacer on Desktop when card is on the right */
                        <div className="hidden md:block" />
                      )}
                    </div>

                    {/* Central Road Stop Station Node Marker */}
                    <div
                      onClick={() => scrollToMilestone(idx)}
                      className="absolute left-6 md:left-1/2 -translate-x-1/2 cursor-pointer z-20 group"
                      title={`Stop #${milestone.id}: ${milestone.year}`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[11px] sm:text-xs transition-all duration-300 shadow-md ${
                          isActive
                            ? 'bg-[#F4511E] text-white scale-125 ring-4 ring-[#F4511E]/30 animate-pulse'
                            : isPassed
                            ? 'bg-[#FFC107] text-[#0B2340] border-2 border-white'
                            : 'bg-white text-[#0B2340] border-2 border-[#CBD5E1] group-hover:border-[#F4511E]'
                        }`}
                      >
                        {milestone.id}
                      </div>
                    </div>

                    {/* RIGHT SLOT */}
                    <div className="w-full md:w-1/2 pl-16 sm:pl-20 md:pl-16 lg:pl-20 mt-4 md:mt-0">
                      {!isEven ? (
                        <MilestoneCard
                          milestone={milestone}
                          position="right"
                          isActive={isActive}
                          isPassed={isPassed}
                          onClick={() => scrollToMilestone(idx)}
                        />
                      ) : (
                        /* On mobile, if isEven, we already rendered on the top container. On desktop, show empty spacer */
                        <div className="hidden md:block" />
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 4. FINAL DESTINATION TERMINAL */}
        <FinalDestination onRestartJourney={handleRestartJourney} />

      </div>
    </section>
  );
};

export default MilestoneJourney;
