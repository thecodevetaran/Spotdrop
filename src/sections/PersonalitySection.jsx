import React, { useState } from 'react';

export default function PersonalitySection() {
  const [clickedTags, setClickedTags] = useState({});

  const toggleTag = (id) => {
    setClickedTags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      className="personality-section"
      style={{
        padding: '7rem 0 7.5rem 0',
        position: 'relative',
        backgroundColor: '#111111',
        color: '#F5F1E8',
        overflow: 'hidden',
      }}
    >
      {/* Background paper texture & subtle warm amber ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(216, 255, 69, 0.08) 0%, rgba(226, 87, 50, 0.04) 50%, transparent 80%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="site-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        {/* Floating Mock "Saved" Bookmarks Around the Canvas */}
        
        {/* Top Left Saved Tag */}
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '-2.5rem',
            left: '2%',
            transform: 'rotate(-8deg)',
            '--rot': '-8deg',
            zIndex: 15,
          }}
        >
          <button
            onClick={() => toggleTag('tag1')}
            style={{
              backgroundColor: '#1F1E1B',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#A9A499',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            }}
          >
            <span>🔖</span>
            <span>{clickedTags['tag1'] ? 'buried in archive' : '“saved” — 11 months ago'}</span>
          </button>
        </div>

        {/* Top Right Saved Tag */}
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '-1rem',
            right: '5%',
            transform: 'rotate(7deg)',
            '--rot': '7deg',
            zIndex: 15,
          }}
        >
          <button
            onClick={() => toggleTag('tag2')}
            style={{
              backgroundColor: '#1F1E1B',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#A9A499',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            }}
          >
            <span>🔖</span>
            <span>{clickedTags['tag2'] ? 'never opened again' : '“saved” — 324 reels ago'}</span>
          </button>
        </div>

        {/* Mid Left Saved Tag */}
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '6%',
            transform: 'rotate(5deg)',
            '--rot': '5deg',
            zIndex: 15,
          }}
        >
          <div
            style={{
              backgroundColor: '#1F1E1B',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#A9A499',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🔖</span>
            <span>“saved”</span>
          </div>
        </div>

        {/* Bottom Right "Actually Went" Big Neon Sticker */}
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '4%',
            transform: 'rotate(-4deg)',
            '--rot': '-4deg',
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--accent-lime)',
              color: '#111111',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: '2px solid #111111',
              boxShadow: '3px 4px 0px #FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              ACTUALLY WENT ✓
            </span>
            <span
              className="handwriting"
              style={{
                fontSize: '1.25rem',
                color: '#111111',
                fontWeight: 700,
              }}
            >
              finally. 10/10 evening
            </span>
          </div>
        </div>

        {/* Central Bold Typography Statement */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '2rem 1rem',
          }}
        >
          <span
            className="handwriting"
            style={{
              fontSize: '1.8rem',
              color: 'var(--accent-lime)',
              marginBottom: '1rem',
              display: 'inline-block',
              transform: 'rotate(-2deg)',
            }}
          >
            be honest with yourself:
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              lineHeight: 0.95,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              textTransform: 'lowercase',
              marginBottom: '1.5rem',
              color: '#F5F1E8',
            }}
          >
            <span style={{ display: 'block' }}>you&apos;ve got enough</span>
            <span
              style={{
                display: 'block',
                color: '#88847D',
                textDecoration: 'line-through',
                textDecorationColor: 'var(--accent-orange)',
                textDecorationThickness: '4px',
              }}
            >
              saved posts.
            </span>
          </h2>

          <div style={{ margin: '2rem 0' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 9.5vw, 7.5rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.05em',
                textTransform: 'lowercase',
                color: 'var(--accent-lime)',
                display: 'inline-block',
                position: 'relative',
                textShadow: '0 0 40px rgba(216, 255, 69, 0.25)',
              }}
            >
              go somewhere.
            </span>
          </div>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#A9A499',
              lineHeight: 1.5,
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            The best spots in Hyderabad aren&apos;t in a sponsored reel. They&apos;re down the lane
            you haven&apos;t turned into yet.
          </p>
        </div>
      </div>
    </section>
  );
}
