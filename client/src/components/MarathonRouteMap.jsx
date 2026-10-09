import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const TOTAL_KM = 3;

// Precise polyline connecting the 7 landmarks smoothly from Municipal School to CM
const PATH_D = "M580 180 L720 215 L750 240 L710 375 L670 480 L575 565 L480 630 L400 575 L320 500 L245 435 L190 350 L220 255 L270 190";

const CHECKPOINTS = [
  'Municipal School',
  'Mohan Reddy Traders',
  'VHP',
  'Anna Canteen',
  'Grameena Bank',
  'Reliance Digital',
  'CM (Finish)'
];

const CHECKPOINT_KMS = ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0'];

// Alternating label placement: some outside, some inside so all 7 are crystal clear without clipping
const CHECKPOINT_OFFSETS = [
  { ox: 0, oy: -34, anchor: 'middle', badge: 'START' },   // 1. Municipal School (Outside / Top)
  { ox: -30, oy: 20, anchor: 'end', badge: null },         // 2. Mohan Reddy Traders (Inside / Left)
  { ox: 30, oy: 5, anchor: 'start', badge: null },         // 3. VHP (Outside / Right)
  { ox: 0, oy: 38, anchor: 'middle', badge: null },        // 4. Anna Canteen (Outside / Bottom)
  { ox: 28, oy: -18, anchor: 'start', badge: null },       // 5. Grameena Bank (Inside / Upper Right)
  { ox: -28, oy: 5, anchor: 'end', badge: null },          // 6. Reliance Digital (Outside / Left)
  { ox: 0, oy: -34, anchor: 'middle', badge: 'FINISH' }    // 7. CM (Outside / Top)
];

const getCheckpointFraction = (i) => {
  if (i === 0) return 0;
  if (i === CHECKPOINTS.length - 1) return 1;
  return i / (CHECKPOINTS.length - 1);
};

const formatTime = (minutes) => {
  if (isNaN(minutes) || minutes < 0) return '0:00';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}:${String(mins).padStart(2, '0')}`;
};

export const MarathonRouteMap = ({ className = '' }) => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
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

  // Control SVG animations pause/unpause
  useEffect(() => {
    if (svgRef.current) {
      try {
        if (isPlaying) {
          if (typeof svgRef.current.unpauseAnimations === 'function') {
            svgRef.current.unpauseAnimations();
          }
        } else {
          if (typeof svgRef.current.pauseAnimations === 'function') {
            svgRef.current.pauseAnimations();
          }
        }
      } catch (err) {
        // Fallback
      }
    }
  }, [isPlaying]);

  // Animation Loop
  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setFraction((prev) => {
        const next = prev + delta / 18000;
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
    if (!pathRef.current || pathLength <= 0) return { x: 580, y: 180 };
    const clampedF = Math.max(0, Math.min(1, f));
    return pathRef.current.getPointAtLength(clampedF * pathLength);
  }, [pathLength]);

  // Current runner position
  const runnerPos = useMemo(() => {
    return getPointAtFraction(fraction);
  }, [fraction, getPointAtFraction]);

  // Runner facing direction (flip horizontally when running left vs right)
  const runnerDir = useMemo(() => {
    if (!pathRef.current || pathLength <= 0) return 1;
    const q2 = getPointAtFraction(Math.min(1, fraction + 0.005));
    const q3 = getPointAtFraction(Math.max(0, fraction - 0.005));
    return q2.x >= q3.x ? 1 : -1;
  }, [fraction, pathLength, getPointAtFraction]);

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
      const offsetConfig = CHECKPOINT_OFFSETS[i] || { ox: 0, oy: 30, anchor: 'middle' };
      const ox = q.x + offsetConfig.ox;
      const oy = q.y + offsetConfig.oy;
      const textAnchor = offsetConfig.anchor;
      const kmLabel = CHECKPOINT_KMS[i] || `${(i * 0.5).toFixed(1)}`;
      return { index: i, name, fraction: f, x: q.x, y: q.y, ox, oy, textAnchor, badge: offsetConfig.badge, kmLabel };
    });
  }, [pathLength]);

  // Calculations for stats
  const kmCovered = fraction * TOTAL_KM;
  const kmRemaining = Math.max(0, TOTAL_KM - kmCovered);
  const elapsedTimeStr = formatTime(kmCovered * pace);
  const finishTimeStr = formatTime(TOTAL_KM * pace);

  // Checkpoint Info Box Logic
  const closestCheckpointIndex = Math.min(
    CHECKPOINTS.length - 1,
    Math.round(fraction * (CHECKPOINTS.length - 1))
  );
  const isAtCheckpoint =
    Math.abs(fraction - getCheckpointFraction(closestCheckpointIndex)) < 0.04 ||
    (fraction > 0.96 && closestCheckpointIndex === CHECKPOINTS.length - 1);
  const nextCheckpointIndex = Math.min(
    CHECKPOINTS.length - 1,
    Math.ceil(fraction * (CHECKPOINTS.length - 1)) || 1
  );

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
    <div id="marathon-map" className={`marathon-route-container w-full max-w-5xl mx-auto ${className}`}>
      <style>{`
        .marathon-route-container {
          --bg: #fbf3e4;
          --card: #fffaf0;
          --ink: #2b1a0e;
          --mut: #7a6650;
          --route: #e8872b;
          --route2: #c0392b;
          --acc: #1f6f5c;
          --line: #e6d5b5;
          font-family: Georgia, 'Times New Roman', serif;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .marathon-route-container {
            --bg: #17120d;
            --card: #221a12;
            --ink: #f6ead6;
            --mut: #b8a48a;
            --route: #ffa13d;
            --route2: #ff6b57;
            --acc: #52d1b0;
            --line: #3a2d1f;
          }
        }
        :root[data-theme="dark"] .marathon-route-container {
          --bg: #17120d;
          --card: #221a12;
          --ink: #f6ead6;
          --mut: #b8a48a;
          --route: #ffa13d;
          --route2: #ff6b57;
          --acc: #52d1b0;
          --line: #3a2d1f;
        }
        .marathon-route-container .fig path {
          fill: none;
          stroke: var(--route2);
          stroke-width: 4.5;
          stroke-linecap: round;
        }
        .marathon-route-container .fig .hd {
          fill: var(--route2);
        }
        .marathon-route-container #runner {
          filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff);
        }
      `}</style>

      <div className="bg-[var(--card)] text-[var(--ink)] border-2 sm:border-3 border-[var(--ink)] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--route)]/15 border border-[var(--route)]/30 text-[var(--route2)] text-xs font-bold font-sans uppercase mb-2">
            <span>OFFICIAL 3 KM MARATHON ROUTE</span>
          </div>
          <h2 className="m-0 text-xl sm:text-2xl md:text-3xl font-normal tracking-wide text-[var(--ink)]">
            🏃 ANTI-DRUG MOVEMENT MARATHON - 3KM
          </h2>
          <p className="text-[var(--mut)] my-1 font-sans text-xs sm:text-sm">
            Interactive route map with 7 key landmarks from Municipal School to CM. Tap any checkpoint or drag the runner.
          </p>
        </div>

        {/* SVG Route Board */}
        <div className="bg-[var(--card)] border-2 sm:border-3 border-[var(--ink)] rounded-xl p-2 sm:p-3 relative overflow-hidden shadow-inner">
          <svg
            id="m"
            ref={svgRef}
            viewBox="0 0 960 760"
            role="img"
            aria-label="3 KM Marathon Route Map"
            className="w-full h-auto block select-none"
          >
            <defs>
              <pattern id="g-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="var(--line)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="960" height="760" fill="url(#g-pattern)" />

            {/* Central Watermark */}
            <text x="480" y="380" textAnchor="middle" fontSize="42" fontWeight="700" fill="var(--line)" fontFamily="Georgia, serif">
              3 KM
            </text>
            <text x="480" y="415" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--mut)" fontFamily="system-ui, sans-serif" letterSpacing="2">
              MARATHON ROUTE
            </text>

            {/* Path outline background */}
            <path
              id="p"
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="20"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity=".15"
            />

            {/* Done (completed) path */}
            {completedPathD && (
              <path
                id="done"
                d={completedPathD}
                fill="none"
                stroke="var(--route2)"
                strokeWidth="11"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Main track path */}
            <path
              id="trk"
              d={PATH_D}
              fill="none"
              stroke="var(--route)"
              strokeWidth="11"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity=".65"
            />

            {/* Landmark text labels */}
            <g id="lms">
              {checkpointsData.map((item) => (
                <g
                  key={`lm-${item.index}`}
                  className="cursor-pointer"
                  onClick={() => handleCheckpointClick(item.fraction)}
                >
                  <text
                    x={item.ox}
                    y={item.oy}
                    textAnchor={item.textAnchor}
                    fontSize="14"
                    fontWeight="800"
                    fill="var(--ink)"
                    stroke="var(--card)"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    style={{ paintOrder: 'stroke fill' }}
                    fontFamily="system-ui, sans-serif"
                  >
                    {item.name}
                  </text>
                </g>
              ))}
            </g>

            {/* Checkpoint KM Circles */}
            <g id="kms">
              {checkpointsData.map((item) => {
                const isStart = item.index === 0;
                const isFinish = item.index === CHECKPOINTS.length - 1;
                const isCrossed = item.index > 0 && fraction >= item.fraction;
                return (
                  <g
                    key={`km-${item.index}`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    transform={`translate(${item.x},${item.y})`}
                    onClick={() => handleCheckpointClick(item.fraction)}
                  >
                    <ellipse
                      rx="22"
                      ry="13"
                      fill={
                        isStart
                          ? 'var(--acc)'
                          : isFinish && isCrossed
                          ? 'var(--route2)'
                          : isCrossed
                          ? 'var(--route)'
                          : 'var(--card)'
                      }
                      stroke="var(--ink)"
                      strokeWidth="1.8"
                      style={{ transition: 'fill 0.25s ease' }}
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fontSize="11"
                      fontWeight="800"
                      fill={
                        isStart || isCrossed
                          ? '#fff'
                          : 'var(--ink)'
                      }
                      fontFamily="system-ui, sans-serif"
                      style={{ transition: 'fill 0.25s ease' }}
                    >
                      {item.index + 1}/7
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Kinematic Animated Runner Figure */}
            {pathLength > 0 && (
              <g id="runner" transform={`translate(${runnerPos.x},${runnerPos.y - 17})`}>
                <ellipse cy="17" rx="18" ry="4" fill="#000" opacity=".25" />
                <g id="dir" transform={`scale(${runnerDir}, 1)`}>
                  <g className="fig" transform="scale(1.7)">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0;0 -3;0 0"
                      dur=".25s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <g>
                      <path d="M0 -12 L0 -1" />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-55 0 -12;35 0 -12;-55 0 -12"
                        dur=".5s"
                        begin="-0.25s"
                        repeatCount="indefinite"
                      />
                      <g>
                        <path d="M0 -1 L0 10" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="30 0 -1;115 0 -1;30 0 -1"
                          dur=".5s"
                          begin="-0.25s"
                          repeatCount="indefinite"
                        />
                      </g>
                    </g>
                    <g transform="rotate(18 0 -12)">
                      <g>
                        <path d="M0 -26 L0 -17" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="55 0 -26;-55 0 -26;55 0 -26"
                          dur=".5s"
                          begin="-0.25s"
                          repeatCount="indefinite"
                        />
                        <g>
                          <path d="M0 -17 L0 -8" />
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="-80 0 -17;-100 0 -17;-80 0 -17"
                            dur=".5s"
                            begin="-0.25s"
                            repeatCount="indefinite"
                          />
                        </g>
                      </g>
                      <path d="M0 -28 L0 -12" />
                      <circle cx="0" cy="-35" r="6" className="hd" />
                      <g>
                        <path d="M0 -26 L0 -17" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="55 0 -26;-55 0 -26;55 0 -26"
                          dur=".5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                        <g>
                          <path d="M0 -17 L0 -8" />
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="-80 0 -17;-100 0 -17;-80 0 -17"
                            dur=".5s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                        </g>
                      </g>
                    </g>
                    <g>
                      <path d="M0 -12 L0 -1" />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-55 0 -12;35 0 -12;-55 0 -12"
                        dur=".5s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <g>
                        <path d="M0 -1 L0 10" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="30 0 -1;115 0 -1;30 0 -1"
                          dur=".5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 font-sans text-sm">
          <button
            type="button"
            onClick={handlePlayToggle}
            className="bg-[var(--ink)] text-[var(--bg)] border-0 rounded-lg py-2.5 px-4 font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            {fraction >= 1 ? '🏁 Restart' : isPlaying ? '⏸ Pause' : '▶ Run'}
          </button>

          <input
            type="range"
            min="0"
            max="1000"
            value={Math.round(fraction * 1000)}
            onChange={(e) => {
              setIsPlaying(false);
              setFraction(Number(e.target.value) / 1000);
            }}
            className="flex-1 min-w-[160px] accent-[var(--route)] cursor-pointer"
            aria-label="Runner Position"
          />

          <label className="flex items-center gap-2 font-medium">
            Pace (min/km)
            <input
              type="number"
              min="3"
              max="12"
              step="0.5"
              value={pace}
              onChange={(e) => setPace(Math.max(3, Math.min(12, Number(e.target.value) || 6)))}
              className="w-[70px] p-1.5 rounded-md border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] text-sm"
            />
          </label>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-sans">
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2.5">
            <b className="block text-2xl text-[var(--route2)] font-sans">{kmCovered.toFixed(1)}</b>
            <span className="text-xs text-[var(--mut)]">km covered</span>
          </div>
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2.5">
            <b className="block text-2xl text-[var(--route2)] font-sans">{kmRemaining.toFixed(1)}</b>
            <span className="text-xs text-[var(--mut)]">km remaining</span>
          </div>
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2.5">
            <b className="block text-2xl text-[var(--route2)] font-sans">{elapsedTimeStr}</b>
            <span className="text-xs text-[var(--mut)]">elapsed (h:mm)</span>
          </div>
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2.5">
            <b className="block text-2xl text-[var(--route2)] font-sans">{finishTimeStr}</b>
            <span className="text-xs text-[var(--mut)]">finish time at pace</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[var(--card)] border-l-4 border-[var(--route)] rounded-lg p-3 font-sans text-sm min-h-[60px] flex items-center">
          {isAtCheckpoint ? (
            <div>
              <b>Checkpoint {closestCheckpointIndex + 1}/7 · {CHECKPOINTS[closestCheckpointIndex]} ({CHECKPOINT_KMS[closestCheckpointIndex]} KM)</b>
              <br />
              {closestCheckpointIndex === 0
                ? 'Start Line (Municipal School) – Warm up and get ready for flag off!'
                : closestCheckpointIndex === CHECKPOINTS.length - 1
                ? `Finish Line (CM)! Total distance 3.0 KM completed in ${finishTimeStr} at your pace.`
                : `${kmCovered.toFixed(1)} km completed, ${kmRemaining.toFixed(1)} km to go. Next Landmark: ${CHECKPOINTS[closestCheckpointIndex + 1]}.`}
            </div>
          ) : (
            <div>
              <b>{kmCovered.toFixed(1)} KM covered</b> · Heading towards Landmark {nextCheckpointIndex + 1}: {CHECKPOINTS[nextCheckpointIndex]} ({CHECKPOINT_KMS[nextCheckpointIndex]} KM)
            </div>
          )}
        </div>

        {/* Checkpoint Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-sans">
          {CHECKPOINTS.map((n, i) => {
            const f = getCheckpointFraction(i);
            const at = Math.abs(fraction - f) < 0.04;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleCheckpointClick(f)}
                className={`text-left p-2 rounded-lg font-normal cursor-pointer border transition-colors ${
                  at
                    ? 'border-[var(--route2)] bg-[var(--bg)]'
                    : 'border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--route2)] hover:bg-[var(--bg)]'
                }`}
              >
                <b className="text-[var(--route2)] text-[12px] block">{CHECKPOINT_KMS[i]} km</b>
                <span className="text-[11px] block truncate font-medium">{n}</span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[var(--mut)] m-0 pt-1 font-sans text-center">
          3.0 KM Official Marathon Course • Flag off at Municipal School and Finish at CM.
        </p>

      </div>
    </div>
  );
};

export default MarathonRouteMap;
