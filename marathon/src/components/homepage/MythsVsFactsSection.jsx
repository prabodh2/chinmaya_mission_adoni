import React, { useState, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import './MythsVsFactsSection.css';

// Exact 16 cards data (Card 1 is the intro card, Cards 2-16 are the 15 Myth vs Fact pairs)
const CARDS_DATA = [
  {
    id: 1,
    type: 'intro',
  },
  {
    id: 2,
    type: 'content',
    myth: 'Everyone in college tries drugs.',
    fact: 'Many students choose not to use drugs. You do not need to follow the crowd to belong.',
  },
  {
    id: 3,
    type: 'content',
    myth: 'Drugs make you look cool on social media.',
    fact: 'Online trends do not show the full consequences of drug use. Your health matters more than likes.',
  },
  {
    id: 4,
    type: 'content',
    myth: 'Trying drugs once cannot hurt you.',
    fact: 'Even one use can cause poisoning, accidents, or other serious health problems.',
  },
  {
    id: 5,
    type: 'content',
    myth: 'Drugs help students study better and score higher marks.',
    fact: 'Misusing drugs can harm memory, concentration, sleep, and learning.',
  },
  {
    id: 6,
    type: 'content',
    myth: 'I can stop whenever I want because I am in control.',
    fact: 'Repeated drug use can lead to addiction, making it difficult to stop without support.',
  },
  {
    id: 7,
    type: 'content',
    myth: 'Drugs help me deal with exam stress and personal problems.',
    fact: 'Drug use can worsen emotional and mental health problems. Seek healthy support and professional help when needed.',
  },
  {
    id: 8,
    type: 'content',
    myth: 'If my friends use drugs, they must be safe.',
    fact: 'A friend\'s experience cannot guarantee your safety. Unknown substances may contain dangerous ingredients.',
  },
  {
    id: 9,
    type: 'content',
    myth: 'Saying no to drugs means I am scared or weak.',
    fact: 'Making your own decisions despite peer pressure shows confidence and self-respect.',
  },
  {
    id: 10,
    type: 'content',
    myth: '“I am young, so drugs cannot harm me much.”',
    fact: 'Drugs can harm the developing brain and affect your future.',
  },
  {
    id: 11,
    type: 'content',
    myth: 'Only people with bad lives become addicted.',
    fact: 'Addiction can affect people from all backgrounds, including students and successful professionals.',
  },
  {
    id: 12,
    type: 'content',
    myth: 'Natural drugs are safe because they come from plants.',
    fact: 'Plant-based substances can also affect the brain, harm health, and cause dependence.',
  },
  {
    id: 13,
    type: 'content',
    myth: 'Prescription medicines are safe to take without medical advice.',
    fact: 'Misusing medicines or taking someone else\'s prescription can cause serious harm.',
  },
  {
    id: 14,
    type: 'content',
    myth: '“Drugs affect only my body, not my dreams.”',
    fact: 'Drug problems can affect your education, career, relationships, finances, and goals.',
  },
  {
    id: 15,
    type: 'content',
    myth: 'People with addiction can never recover.',
    fact: 'Recovery is possible with appropriate treatment, professional care, and ongoing support.',
  },
  {
    id: 16,
    type: 'content',
    myth: 'My drug use affects only me.',
    fact: 'Drug-related harm can affect your family, friendships, education, career, and wider community.',
  },
];

export const MythsVsFactsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartXRef = useRef(null);

  const totalCards = CARDS_DATA.length;
  const currentCard = CARDS_DATA[currentIndex];

  const triggerSlide = useCallback((nextIndex, direction) => {
    if (nextIndex < 0 || nextIndex >= totalCards) return;
    setSlideDirection(direction);
    setIsTransitioning(true);
    setCurrentIndex(nextIndex);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 320);
  }, [totalCards]);

  const handlePrev = () => {
    if (currentIndex > 0 && !isTransitioning) {
      triggerSlide(currentIndex - 1, 'prev');
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1 && !isTransitioning) {
      triggerSlide(currentIndex + 1, 'next');
    }
  };

  const handleDotClick = (index) => {
    if (index === currentIndex || isTransitioning) return;
    const direction = index > currentIndex ? 'next' : 'prev';
    triggerSlide(index, direction);
  };

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    // Minimum swipe threshold of 45px
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Format counter (e.g. 01 / 16, 02 / 16, ..., 16 / 16)
  const formattedCounter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;

  return (
    <section id="myths-vs-facts" className="mvf-section" aria-label="Myths vs Facts Awareness Slider">
      <div className="mvf-container">
        {/* Section Heading */}
        <div className="mvf-header">
          <div className="mvf-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Drug Awareness & Truth</span>
          </div>
          <h2 className="mvf-title">
            MYTH's VS FACT's
          </h2>
          <p className="mvf-subtitle">
            Know the truth. Make the right choice.
          </p>
        </div>

        {/* Slider Controls & Card Viewport */}
        <div className="mvf-slider-wrapper">
          {/* Previous Arrow Button */}
          <button
            type="button"
            className="mvf-nav-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous card"
            title="Previous card"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Card Viewport */}
          <div
            className="mvf-card-viewport"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              key={currentCard.id}
              className={`mvf-card-inner ${
                slideDirection === 'next' ? 'mvf-slide-enter-next' : 'mvf-slide-enter-prev'
              }`}
            >
              {currentCard.type === 'intro' ? (
                /* Card 1 — Introductory Card */
                <div className="mvf-intro-card">
                  <div className="mvf-intro-glow" />
                  
                  <div className="mvf-intro-badge-top">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFD12D]" />
                    <span>Anti-Drug Movement Campaign</span>
                  </div>

                  <div className="mvf-intro-typography">
                    <div className="mvf-intro-myths">MYTH'S</div>
                    <div className="mvf-intro-vs-badge">VS</div>
                    <div className="mvf-intro-facts">FACT'S</div>
                  </div>

                  <p className="mvf-intro-tagline">
                    Separate harmful misconceptions from medical and psychological realities. Break the cycle of misinformation.
                  </p>

                  <button
                    type="button"
                    className="mvf-intro-action-btn"
                    onClick={handleNext}
                  >
                    <span>START EXPLORING</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Cards 2-16 — Myth & Fact Content Cards */
                <div>
                  <div className="mvf-card-grid">
                    {/* MYTH Block */}
                    <div className="mvf-block-myth">
                      <div className="mvf-block-header">
                        <span className="mvf-block-badge mvf-badge-myth">
                          <XCircle className="w-4 h-4 mvf-block-icon-myth" />
                          <span>MYTH</span>
                        </span>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      </div>
                      <p className="mvf-block-text">
                        {currentCard.myth}
                      </p>
                    </div>

                    {/* FACT Block */}
                    <div className="mvf-block-fact">
                      <div className="mvf-block-header">
                        <span className="mvf-block-badge mvf-badge-fact">
                          <CheckCircle2 className="w-4 h-4 mvf-block-icon-fact" />
                          <span>FACT</span>
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="mvf-block-text">
                        {currentCard.fact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Footer: Counter & Metadata */}
              <div className="mvf-card-footer">
                <span className="mvf-card-category">
                  {currentCard.type === 'intro' ? 'Overview' : `Myth & Fact #${currentIndex}`}
                </span>
                <span className="mvf-counter" aria-live="polite">
                  {formattedCounter}
                </span>
              </div>
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className="mvf-nav-btn"
            onClick={handleNext}
            disabled={currentIndex === totalCards - 1}
            aria-label="Next card"
            title="Next card"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator Dots */}
        <div className="mvf-progress-container">
          <div className="mvf-progress-track" role="tablist" aria-label="Card selection pagination">
            {CARDS_DATA.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Go to Card ${idx + 1}`}
                onClick={() => handleDotClick(idx)}
                className={`mvf-progress-dot ${idx === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MythsVsFactsSection;
