import React from 'react';

export default function Hero({ onOpenWaitlist }) {
  const scrollToWaitlist = (e) => {
    e?.preventDefault();
    const el = document.getElementById('waitlist-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToExplore = (e) => {
    e?.preventDefault();
    const el = document.getElementById('city-intro');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        paddingTop: '2.5rem',
        paddingBottom: '4.5rem',
        overflow: 'hidden',
      }}
    >
      <div className="site-wrapper">
        {/* Top Metadata Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: '1.75rem',
            borderBottom: '1px solid rgba(17, 17, 17, 0.08)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#111111',
              }}
            >
              HYDERABAD, INDIA
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>/</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
              }}
            >
              17.3850° N, 78.4867° E
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="drop-badge">DROP / 001</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#111111',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#E25732',
                  display: 'inline-block',
                }}
              />
              SPRING &apos;26 CURATION
            </span>
          </div>
        </div>

        {/* Hero Grid Container */}
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
            gap: '2.5rem',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Left Column: Bold Typography & CTAs */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Small handwritten teaser */}
            <div
              className="animate-float"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                transform: 'rotate(-2deg)',
              }}
            >
              <span
                className="handwriting"
                style={{
                  fontSize: '1.35rem',
                  color: 'var(--accent-orange)',
                  fontWeight: 700,
                }}
              >
                new here? don&apos;t tell everyone
              </span>
              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                <path
                  d="M2 14 C12 18, 24 18, 36 8 M30 4 C34 6, 36 8, 38 12"
                  stroke="var(--accent-orange)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Main Headline */}
            <h1
              className="hero-title"
              style={{
                color: '#111111',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ display: 'block' }}>FIND SOMEWHERE</span>
              <span
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  fontStyle: 'normal',
                  color: '#111111',
                }}
              >
                WORTH GOING.
                {/* Yellow-lime subtle highlight stroke underneath */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '-2%',
                    width: '104%',
                    height: '14px',
                    backgroundColor: 'var(--accent-lime)',
                    zIndex: -1,
                    transform: 'rotate(-0.8deg)',
                    opacity: 0.85,
                    borderRadius: '4px',
                  }}
                />
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              className="hero-subtitle"
              style={{
                fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                marginBottom: '2.25rem',
                maxWidth: '460px',
              }}
            >
              Hyderabad has places you haven&apos;t found yet.
            </p>

            {/* Primary & Secondary CTAs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <button
                onClick={scrollToWaitlist}
                className="btn-primary animate-wiggle-hover"
                style={{ cursor: 'pointer' }}
              >
                JOIN THE WAITLIST <span className="arrow-icon">→</span>
              </button>

              <button
                onClick={scrollToExplore}
                className="btn-secondary"
                style={{ cursor: 'pointer' }}
              >
                WHERE ARE WE GOING? ↓
              </button>
            </div>

            {/* Micro annotations underneath CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-lime)',
                    boxShadow: '0 0 0 2px #111111',
                  }}
                />
                <span className="meta-label" style={{ color: 'var(--text-secondary)' }}>
                  NO SPONSORED LISTS
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-orange)',
                    boxShadow: '0 0 0 2px #111111',
                  }}
                />
                <span className="meta-label" style={{ color: 'var(--text-secondary)' }}>
                  100% CURATED IN PERSON
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hyderabad Photography Scrapbook */}
          <div
            className="hero-media-wrapper"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {/* Scrapbook Tape Top */}
            <div
              className="washi-tape"
              style={{
                top: '-12px',
                left: '20%',
                transform: 'rotate(-4deg)',
              }}
            />

            {/* Main Polaroid Frame with Real Hyderabad Photography */}
            <div
              className="scrapbook-polaroid card-hover-tilt"
              style={{
                width: '100%',
                maxWidth: '480px',
                transform: 'rotate(2deg)',
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
                  src="/images/hero/hero_main.jpg"
                  alt="Aesthetic courtyard cafe in Jubilee Hills Hyderabad"
                  fetchPriority="high"
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Overlaid Badges on Image */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 5,
                  }}
                >
                  <span className="drop-badge">JUBILEE HILLS / 08:30 AM</span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    zIndex: 5,
                  }}
                >
                  <span className="sticker sticker-lime" style={{ fontSize: '0.65rem' }}>
                    12 MIN AWAY
                  </span>
                </div>
              </div>

              {/* Caption under photograph */}
              <div
                style={{
                  marginTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(17, 17, 17, 0.08)',
                  paddingTop: '0.65rem',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#111111',
                      display: 'block',
                    }}
                  >
                    THE SECRET COURTYARD
                  </span>
                  <span
                    className="handwriting"
                    style={{
                      fontSize: '1.05rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    you&apos;d actually go here on a Sunday
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#77736C',
                  }}
                >
                  SPOT #01
                </span>
              </div>
            </div>

            {/* Floating Annotation Sticker 1: "you'd actually go here" */}
            <div
              className="animate-float"
              style={{
                position: 'absolute',
                bottom: '-24px',
                left: '-16px',
                zIndex: 25,
                transform: 'rotate(-6deg)',
              }}
            >
              <div
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span
                  className="handwriting"
                  style={{
                    fontSize: '1.25rem',
                    color: 'var(--accent-lime)',
                    fontWeight: 700,
                  }}
                >
                  ★ actually good coffee
                </span>
              </div>
            </div>

            {/* Floating Stamp Right */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '-18px',
                zIndex: 25,
                transform: 'rotate(12deg)',
              }}
            >
              <div
                style={{
                  border: '2px dashed var(--accent-orange)',
                  borderRadius: '50%',
                  width: '68px',
                  height: '68px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(245, 241, 232, 0.95)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  color: 'var(--accent-orange)',
                  fontSize: '0.55rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  textAlign: 'center',
                }}
              >
                <span>VERIFIED</span>
                <span>SPOT</span>
                <span style={{ fontSize: '0.45rem', opacity: 0.8 }}>HYD &apos;26</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .hero-media-wrapper {
            margin-top: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
