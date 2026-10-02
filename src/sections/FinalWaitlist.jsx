import React from 'react';
import WaitlistForm from '../components/WaitlistForm';

export default function FinalWaitlist() {
  return (
    <section
      id="waitlist-section"
      style={{
        padding: '7rem 0 7.5rem 0',
        position: 'relative',
        backgroundColor: '#F5F1E8',
        borderTop: '2px solid #111111',
        overflow: 'hidden',
      }}
    >
      {/* Background washi tape & stamp details */}
      <div
        className="washi-tape"
        style={{
          top: '-12px',
          left: '12%',
          transform: 'rotate(-3deg)',
        }}
      />
      <div
        className="washi-tape"
        style={{
          top: '-12px',
          right: '15%',
          transform: 'rotate(2deg)',
        }}
      />

      <div className="site-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Metadata pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.5rem',
            }}
          >
            <span className="drop-badge">WAVE 01 INVITATIONS</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              HYDERABAD EXCLUSIVE
            </span>
          </div>

          {/* Large Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8.5vw, 6.5rem)',
              lineHeight: 0.92,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: '0 0 1.25rem 0',
            }}
          >
            <span style={{ display: 'block' }}>BE IN</span>
            <span
              style={{
                display: 'inline-block',
                position: 'relative',
                color: '#111111',
              }}
            >
              THE FIRST DROP.
              <span
                style={{
                  position: 'absolute',
                  bottom: '4px',
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
          </h2>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
              color: 'var(--text-secondary)',
              margin: '0 0 2.5rem 0',
              fontWeight: 500,
            }}
          >
            Spotdrop is coming to Hyderabad.
          </p>

          {/* The Waitlist Input Component */}
          <WaitlistForm heading="" subtext="" variant="standard" />

          {/* Supporting Microcopy */}
          <p
            style={{
              marginTop: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            <span>🔒</span>
            <span>No spam. Just places worth going.</span>
          </p>

          {/* Small handwritten bottom note */}
          <div
            className="animate-float"
            style={{
              marginTop: '2rem',
              transform: 'rotate(-1.5deg)',
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
              early access drops directly to your inbox before the App Store launch
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
