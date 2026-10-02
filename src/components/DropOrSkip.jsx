import React, { useState } from 'react';
import { triggerConfetti } from '../utils/confetti';

const PLACES = [
  {
    id: 1,
    title: 'The Concrete Roastery by the Glasshouse',
    location: 'Somewhere in Jubilee Hills',
    desc: 'Unmarked door, brutalist concrete counter, single-origin filter roasts, no WiFi so people actually talk.',
    image: '/images/drops/drop_001.jpg',
    tag: 'COFFEE / ARCHITECTURE',
    coordinates: '17.4325° N',
  },
  {
    id: 2,
    title: 'Granite Ridge Twilight Viewpoint',
    location: 'Somewhere in Khajaguda',
    desc: 'Sit on the highest granite boulder with your friends while the entire Cyberabad skyline lights up in amber.',
    image: '/images/drops/drop_002.jpg',
    tag: 'SUNSET / VIEW',
    coordinates: '17.4128° N',
  },
  {
    id: 3,
    title: 'Candlelit Deccan Bistro with Hidden Garden',
    location: 'Somewhere in Banjara Hills',
    desc: 'Only 7 tables. Curry leaf prawns, kokum gin fizzes, and old vinyl playing quietly through brass horns.',
    image: '/images/drops/drop_003.jpg',
    tag: 'DINNER / DATE',
    coordinates: '17.4180° N',
  },
  {
    id: 4,
    title: 'Heritage Bougainvillea Courtyard',
    location: 'Somewhere in Begumpet',
    desc: 'A secret 1960s bungalow gate hidden behind an overgrown alleyway. Teakwood benches and afternoon sun.',
    image: '/images/drops/drop_004.jpg',
    tag: 'HIDDEN / HERITAGE',
    coordinates: '17.4435° N',
  },
];

export default function DropOrSkip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'drop' | 'skip', text: string }
  const [animating, setAnimating] = useState(false);

  const currentPlace = PLACES[currentIndex % PLACES.length];

  const handleAction = (type) => {
    if (animating) return;

    setAnimating(true);
    if (type === 'drop') {
      const dropResponses = [
        "knew you'd get it.",
        'taste. dropping this for you.',
        'yeah, this is the one.',
        'you get the vision.',
      ];
      const randomText = dropResponses[Math.floor(Math.random() * dropResponses.length)];
      setFeedback({ type: 'drop', text: randomText });
      triggerConfetti();
    } else {
      const skipResponses = [
        'fair. next one.',
        'not for everyone. moving on.',
        'respect. we find what you like.',
        'skipped. next spot.',
      ];
      const randomText = skipResponses[Math.floor(Math.random() * skipResponses.length)];
      setFeedback({ type: 'skip', text: randomText });
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % PLACES.length);
      setFeedback(null);
      setAnimating(false);
    }, 1100);
  };

  return (
    <section
      id="drop-or-skip"
      style={{
        padding: '5.5rem 0 6.5rem 0',
        position: 'relative',
        backgroundColor: '#F5F1E8',
      }}
    >
      <div className="site-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <span className="drop-badge">INTERACTIVE TEST</span>
            <span className="meta-label" style={{ color: 'var(--text-secondary)' }}>
              SPOT TASTEMAKER
            </span>
          </div>

          <h2
            className="section-title"
            style={{
              color: '#111111',
              marginBottom: '0.75rem',
            }}
          >
            DROP OR SKIP
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            You decide what&apos;s worth dropping.
          </p>
        </div>

        {/* Interactive Place Card Showcase */}
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Card Frame */}
          <div
            className={`scrapbook-polaroid ${animating ? (feedback?.type === 'drop' ? 'card-swipe-right' : 'card-swipe-left') : ''}`}
            style={{
              borderRadius: '20px',
              border: '2px solid #111111',
              boxShadow: '6px 8px 0px #111111',
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              position: 'relative',
              transition: 'all 0.35s ease',
            }}
          >
            {/* Top Tape */}
            <div
              className="washi-tape"
              style={{
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%) rotate(-1deg)',
              }}
            />

            {/* Place Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#EBE5D8',
                aspectRatio: '4 / 3',
              }}
            >
              <img
                src={currentPlace.image}
                alt={currentPlace.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Badges on Image */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <span className="drop-badge" style={{ fontSize: '0.68rem' }}>
                  {currentPlace.tag}
                </span>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                }}
              >
                <span className="sticker sticker-white" style={{ fontSize: '0.65rem' }}>
                  {currentPlace.coordinates}
                </span>
              </div>

              {/* Feedback Overlay when clicked */}
              {feedback && (
                <div
                  className="animate-stamp"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor:
                      feedback.type === 'drop' ? 'rgba(216, 255, 69, 0.92)' : 'rgba(17, 17, 17, 0.88)',
                    color: feedback.type === 'drop' ? '#111111' : '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                    zIndex: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 900,
                      marginBottom: '0.5rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {feedback.type === 'drop' ? 'DROPPED ✓' : 'SKIPPED ✕'}
                  </span>
                  <p
                    className="handwriting"
                    style={{
                      fontSize: '1.75rem',
                      margin: 0,
                    }}
                  >
                    {feedback.text}
                  </p>
                </div>
              )}
            </div>

            {/* Place Details */}
            <div style={{ padding: '1.25rem 0.5rem 0.5rem 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--accent-orange)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {currentPlace.location}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  SPOT {currentIndex + 1} OF {PLACES.length}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  lineHeight: 1.25,
                  color: '#111111',
                  margin: '0 0 0.5rem 0',
                }}
              >
                {currentPlace.title}
              </h3>

              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.45,
                  color: 'var(--text-secondary)',
                  margin: '0 0 1.25rem 0',
                }}
              >
                {currentPlace.desc}
              </p>

              {/* Question: Would you go? */}
              <div
                style={{
                  borderTop: '1px dashed rgba(17,17,17,0.12)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <span
                  className="handwriting"
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#111111',
                  }}
                >
                  Would you go?
                </span>

                {/* Buttons: DROP and SKIP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleAction('skip')}
                    disabled={animating}
                    className="btn-tactile"
                    style={{
                      padding: '0.65rem 1.4rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      border: '1.5px solid #111111',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      letterSpacing: '0.06em',
                      cursor: animating ? 'not-allowed' : 'pointer',
                      boxShadow: '1.5px 2px 0px #111111',
                    }}
                  >
                    SKIP ✕
                  </button>

                  <button
                    onClick={() => handleAction('drop')}
                    disabled={animating}
                    className="btn-tactile"
                    style={{
                      padding: '0.65rem 1.6rem',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--accent-lime)',
                      color: '#111111',
                      border: '1.5px solid #111111',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 900,
                      fontSize: '0.82rem',
                      letterSpacing: '0.06em',
                      cursor: animating ? 'not-allowed' : 'pointer',
                      boxShadow: '2px 3px 0px #111111',
                    }}
                  >
                    DROP ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
