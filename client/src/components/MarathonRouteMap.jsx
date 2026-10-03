import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, MapPin, Flag, Timer, Navigation, Award, Sparkles } from 'lucide-react';

const TOTAL_KM = 7;
const PATH_D = "M300 153 L350 168 L590 150 L750 190 L865 196 L860 250 L750 460 L650 640 L530 775 L350 625 L90 425 L65 410 L90 260 L135 205 Z";

const CHECKPOINTS = [
  'Chinmaya Mission',
  'Auditorium Front',
  'Basaveshwara Circle – Brindavan Lodge',
  'Vimala Residency',
  'VRK Mall',
  'Bus Stand',
  'YMG Circle – Devi Nursing Home',
  'Reliance Digital'
];

const getCheckpointFraction = (i) => (i === TOTAL_KM ? 0.965 : i / TOTAL_KM);

const formatTime = (minutes) => {
  if (isNaN(minutes) || minutes < 0) return '0:00';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}:${String(mins).padStart(2, '0')}`;
};

export const MarathonRouteMap = ({ className = '' }) => {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [fraction, setFraction] = useState(0); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);
  const [pace, setPace] = useState(6); // min / km
  const lastTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      try {
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
      } catch (err) {
        console.error("Error measuring path length:", err);
      }
    }
  }, []);

  // Animation Loop
  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setFraction((prev) => {
        const next = prev + delta / 24000;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tick);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, tick]);

  // Point lookup helper
  const getPointAtFraction = useCallback((f) => {
    if (!pathRef.current || pathLength <= 0) return { x: 300, y: 153 };
    const clampedF = Math.max(0, Math.min(1, f));
    return pathRef.current.getPointAtLength(clampedF * pathLength);
  }, [pathLength]);

  // Current runner position
  const runnerPos = useMemo(() => {
    return getPointAtFraction(fraction);
  }, [fraction, getPointAtFraction]);

  // Path traced so far by runner
  const completedPathD = useMemo(() => {
    if (!pathRef.current || pathLength <= 0) return '';
    let d = '';
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const stepF = (fraction * i) / steps;
      const pt = pathRef.current.getPointAtLength(stepF * pathLength);
      d += `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
    }
    return d;
  }, [fraction, pathLength]);

  // Checkpoints position coordinates & SVG text alignment calculation
  const checkpointsData = useMemo(() => {
    if (!pathRef.current || pathLength <= 0) return [];
    return CHECKPOINTS.map((name, i) => {
      const f = getCheckpointFraction(i);
      const q = pathRef.current.getPointAtLength(f * pathLength);
      const dx = q.x - 480;
      const dy = q.y - 420;
      const m = Math.hypot(dx, dy) || 1;
      const ox = q.x + (dx / m) * 34;
      const oy = q.y + (dy / m) * 30;
      const textAnchor = dx > 60 ? 'start' : dx < -60 ? 'end' : 'middle';
      const parts = name.length > 22 ? name.split(' – ') : [name];
      return { index: i, name, fraction: f, x: q.x, y: q.y, ox, oy, textAnchor, parts };
    });
  }, [pathLength]);

  // Calculations for stats
  const kmCovered = fraction * TOTAL_KM;
  const kmRemaining = Math.max(0, TOTAL_KM - kmCovered);
  const elapsedTimeStr = formatTime(kmCovered * pace);
  const finishTimeStr = formatTime(TOTAL_KM * pace);

  // Checkpoint Info Box Logic
  const closestIndex = Math.min(TOTAL_KM, Math.round(kmCovered));
  const isAtCheckpoint = Math.abs(kmCovered - closestIndex) < 0.12 || (closestIndex === TOTAL_KM && fraction > 0.94);
  const nextCheckpointIndex = Math.ceil(kmCovered);

  const handleCheckpointClick = (f) => {
    setIsPlaying(false);
    setFraction(f);
  };

  const handlePlayToggle = () => {
    if (fraction >= 1) {
      setFraction(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="marathon-map" className={`w-full max-w-5xl mx-auto space-y-6 ${className}`}>
      
      {/* Header Badge & Title */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-4 text-center sm:text-left relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-wider uppercase border border-[var(--orange)]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL 7KM LOOP MARATHON ROUTE MAP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
              🏃 ANTI-DRUG MOVEMENT MARATHON - 7KM
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">
              Interactive Route Simulator • Tap any checkpoint or drag slider to simulate the runner's progress.
            </p>
          </div>

          {/* Interactive Chinmaya Mission Adoni Badge */}
          <button
            onClick={() => handleCheckpointClick(0)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--card)] text-[var(--ink)] border-2 border-[var(--cyan)] shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all font-bold text-xs group cursor-pointer"
            title="Jump to Start Point: Chinmaya Mission Adoni"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)] group-hover:bg-[var(--cyan)] group-hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[var(--text-primary)]">Chinmaya Mission Adoni</span>
          </button>
        </div>

        {/* SVG BOARD */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-inner p-2 sm:p-4">
          <svg
            id="m"
            viewBox="0 0 960 820"
            role="img"
            aria-label="7KM Loop Route Map"
            className="w-full h-auto select-none"
          >
            <defs>
              <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="currentColor" className="text-[var(--border-color)] opacity-40" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid background */}
            <rect width="960" height="820" fill="url(#g)" />

            {/* Watermark Text */}
            <text x="480" y="395" textAnchor="middle" fontSize="42" fontWeight="800" fill="currentColor" className="text-[var(--text-muted)] opacity-20 font-heading">
              7 KM
            </text>
            <text x="480" y="430" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor" className="text-[var(--text-muted)] opacity-30 font-sans tracking-widest">
              LOOP RACE ROUTE
            </text>

            {/* Reference Path (Hidden element for getTotalLength calculations) */}
            <path
              ref={pathRef}
              id="p"
              d={PATH_D}
              fill="none"
              stroke="currentColor"
              className="text-[var(--text-primary)] opacity-15"
              strokeWidth="20"
              strokeLinejoin="round"
            />

            {/* Path completed so far (highlighted in vivid red/coral) */}
            {completedPathD && (
              <path
                id="done"
                d={completedPathD}
                fill="none"
                stroke="var(--route2, #ef4444)"
                strokeWidth="12"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Main Track line */}
            <path
              id="trk"
              d={PATH_D}
              fill="none"
              stroke="var(--orange, #f97316)"
              strokeWidth="11"
              strokeLinejoin="round"
              strokeDasharray="4 2"
              opacity="0.75"
            />

            {/* Landmarks Text Labels */}
            <g id="lms">
              {checkpointsData.map((item) => (
                <g
                  key={`lm-${item.index}`}
                  className="cursor-pointer group"
                  onClick={() => handleCheckpointClick(item.fraction)}
                >
                  <text
                    x={item.ox}
                    y={item.oy + (item.y > 420 ? 10 : 0) - (item.parts.length - 1) * 8}
                    textAnchor={item.textAnchor}
                    fontSize="13"
                    fontWeight="800"
                    fill="currentColor"
                    className="text-[var(--text-primary)] hover:fill-[var(--orange)] transition-colors font-sans"
                  >
                    {item.parts.map((s, j) => (
                      <tspan key={j} x={item.ox} dy={j ? 16 : 0}>
                        {s}
                      </tspan>
                    ))}
                  </text>
                </g>
              ))}
            </g>

            {/* KM Checkpoint Circles */}
            <g id="kms">
              {checkpointsData.map((item) => {
                const isStart = item.index === 0;
                const isFinish = item.index === TOTAL_KM;
                const isCurrent = closestIndex === item.index;
                return (
                  <g
                    key={`km-${item.index}`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    transform={`translate(${item.x},${item.y})`}
                    onClick={() => handleCheckpointClick(item.fraction)}
                  >
                    <ellipse
                      rx="24"
                      ry="14"
                      fill={
                        isStart
                          ? '#059669' // Teal/Green for Start
                          : isFinish
                          ? '#dc2626' // Red for Finish
                          : isCurrent
                          ? '#f97316' // Orange active
                          : 'var(--bg-secondary, #1e293b)'
                      }
                      stroke={isCurrent ? '#ffffff' : 'var(--border-color, #475569)'}
                      strokeWidth={isCurrent ? '2.5' : '1.8'}
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fontSize="11"
                      fontWeight="800"
                      fill={isStart || isFinish || isCurrent ? '#ffffff' : 'var(--text-primary)'}
                    >
                      {item.index}/{TOTAL_KM}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Runner Marker with Pulse Animation */}
            {pathLength > 0 && (
              <g id="runner" transform={`translate(${runnerPos.x},${runnerPos.y})`}>
                <circle r="18" fill="#ef4444" opacity="0.35">
                  <animate attributeName="r" values="14;24;14" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
              </g>
            )}
          </svg>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-4 bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)]">
          <button
            onClick={handlePlayToggle}
            className="btn-primary py-2.5 px-6 text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg"
          >
            {fraction >= 1 ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>🏁 RUN AGAIN</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>RUN SIMULATION</span>
              </>
            )}
          </button>

          {/* Position Slider */}
          <div className="flex-1 min-w-[200px] flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Start</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={Math.round(fraction * 1000)}
              onChange={(e) => {
                setIsPlaying(false);
                setFraction(Number(e.target.value) / 1000);
              }}
              className="w-full accent-[var(--orange)] cursor-pointer h-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]"
              aria-label="Runner Position"
            />
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Finish</span>
          </div>

          {/* Pace Selector */}
          <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)]">
            <Timer className="w-4 h-4 text-[var(--orange)]" />
            <span>Pace (min/km):</span>
            <input
              type="number"
              min="3"
              max="12"
              step="0.5"
              value={pace}
              onChange={(e) => setPace(Math.max(3, Math.min(12, Number(e.target.value) || 6)))}
              className="w-16 py-1 px-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
            />
          </div>
        </div>

        {/* LIVE STATS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">COVERED</span>
            <b className="text-2xl font-black text-[var(--orange)]">{kmCovered.toFixed(1)} <span className="text-xs font-normal">km</span></b>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">REMAINING</span>
            <b className="text-2xl font-black text-red-500">{kmRemaining.toFixed(1)} <span className="text-xs font-normal">km</span></b>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">ELAPSED TIME</span>
            <b className="text-2xl font-black text-[var(--cyan)]">{elapsedTimeStr} <span className="text-xs font-normal">hrs</span></b>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">EST. FINISH</span>
            <b className="text-2xl font-black text-emerald-500">{finishTimeStr} <span className="text-xs font-normal">hrs</span></b>
          </div>
        </div>

        {/* CHECKPOINT INFO BANNER */}
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border-l-4 border-[var(--orange)] border border-[var(--border-color)] space-y-1">
          {isAtCheckpoint ? (
            <div>
              <p className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-wider">
                POINT {closestIndex}/{TOTAL_KM} • {CHECKPOINTS[closestIndex]}
              </p>
              <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] mt-1">
                {closestIndex === 0
                  ? '📍 Start line at Chinmaya Mission Ashrama – Warm up and flag off!'
                  : closestIndex === TOTAL_KM
                  ? `🏁 Finish line reached! Completed in approx. ${finishTimeStr} hrs at your ${pace} min/km pace.`
                  : `${closestIndex} km completed, ${TOTAL_KM - closestIndex} km remaining. ETA ${formatTime(closestIndex * pace)} at ${pace} min/km. Next: ${CHECKPOINTS[closestIndex + 1] || 'Finish'}.`}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-extrabold text-[var(--cyan)] uppercase tracking-wider">
                ROUTE IN PROGRESS • {kmCovered.toFixed(1)} KM
              </p>
              <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] mt-1">
                Heading towards Point {nextCheckpointIndex}: <span className="text-[var(--orange)]">{CHECKPOINTS[nextCheckpointIndex]}</span>
              </p>
            </div>
          )}
        </div>

        {/* CHECKPOINT SELECTION BUTTONS */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Quick Jump to Checkpoint:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHECKPOINTS.map((name, i) => {
              const f = getCheckpointFraction(i);
              const isActive = closestIndex === i && isAtCheckpoint;
              return (
                <button
                  key={i}
                  onClick={() => handleCheckpointClick(f)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    isActive
                      ? 'bg-[var(--orange)]/15 border-[var(--orange)] text-[var(--orange)] font-extrabold shadow-md'
                      : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:border-[var(--orange)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <span className="font-extrabold text-[var(--orange)] block text-[11px]">
                    KM {i}
                  </span>
                  <span className="truncate block font-semibold">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] font-medium italic text-center sm:text-left pt-2">
          * Note: Checkpoints are spaced evenly at 1 km intervals along the 7KM traced loop route in Adoni. Please confirm exact positions with marathon organizers.
        </p>
      </div>
    </div>
  );
};

export default MarathonRouteMap;
