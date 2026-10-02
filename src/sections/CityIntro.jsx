import React from 'react';

export default function CityIntro() {
  return (
    <section
      id="city-intro"
      style={{
        padding: '5.5rem 0 6rem 0',
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(17, 17, 17, 0.08)',
      }}
    >
      <div className="site-wrapper">
        {/* Editorial Section Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem' }}>
          <span className="drop-badge">01 / PERSPECTIVE</span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            HYDERABAD BEYOND THE FEED
          </span>
        </div>

        {/* Two-Column Scrapbook Layout */}
        <div
          className="city-intro-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Text Block */}
          <div>
            <h2
              className="section-title"
              style={{
                color: '#111111',
                marginBottom: '1.75rem',
              }}
            >
              <span style={{ display: 'block' }}>THE CITY IS BIGGER</span>
              <span
                style={{
                  display: 'block',
                  color: '#111111',
                  letterSpacing: '-0.04em',
                }}
              >
                THAN YOUR SAVED PLACES.
              </span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                lineHeight: 1.55,
                color: '#3B3833',
                marginBottom: '2rem',
                maxWidth: '560px',
              }}
            >
              There are cafés you&apos;ve never noticed, restaurants you haven&apos;t heard about,
              corners you&apos;ve never explored, and things happening around you that somehow
              never make it into your feed.
            </p>

            {/* Handwritten callout */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'rgba(216, 255, 69, 0.25)',
                borderLeft: '3px solid #111111',
                padding: '0.75rem 1.25rem',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <span
                className="handwriting"
                style={{
                  fontSize: '1.35rem',
                  color: '#111111',
                  fontWeight: 700,
                }}
              >
                &ldquo;the algorithm keeps sending everyone to the exact same three cafes.&rdquo;
              </span>
            </div>
          </div>

          {/* Right Collage Element: Irani Chai & Hyderabad Culture Photo */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {/* Washi Tape */}
            <div
              className="washi-tape"
              style={{
                top: '-10px',
                right: '25%',
                transform: 'rotate(6deg)',
              }}
            />

            {/* Polaroid with Irani Chai photo */}
            <div
              className="scrapbook-polaroid card-hover-tilt"
              style={{
                width: '100%',
                maxWidth: '380px',
                transform: 'rotate(-2.5deg)',
                '--hover-rot': '0deg',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  backgroundColor: '#EBE5D8',
                }}
              >
                <img
                  src="/images/drops/city_chai.jpg"
                  alt="Classic Irani chai and Osmania biscuits on a marble table in Hyderabad"
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                  }}
                >
                  <span className="drop-badge">OLD CITY / 06:45 AM</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  className="handwriting"
                  style={{
                    fontSize: '1.25rem',
                    color: '#111111',
                    fontWeight: 700,
                  }}
                >
                  two cutting chai, fresh osmania
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'var(--accent-orange)',
                    textTransform: 'uppercase',
                  }}
                >
                  UNMARKED
                </span>
              </div>
            </div>

            {/* Floating scribble sticker */}
            <div
              className="animate-float"
              style={{
                position: 'absolute',
                bottom: '-16px',
                right: '-10px',
                zIndex: 15,
                transform: 'rotate(5deg)',
              }}
            >
              <span className="sticker sticker-lime" style={{ fontSize: '0.72rem' }}>
                worth the drive across town
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .city-intro-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
