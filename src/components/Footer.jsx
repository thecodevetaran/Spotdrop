import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(17, 17, 17, 0.12)',
        padding: '5rem 0 3.5rem 0',
      }}
    >
      <div className="site-wrapper">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.6fr)',
            gap: '3rem',
            alignItems: 'start',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1.5px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img src="/images/logo.png" alt="Spotdrop" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.35rem',
                  letterSpacing: '-0.02em',
                  color: '#111111',
                }}
              >
                SPOTDROP
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 3vw, 2.25rem)',
                fontWeight: 800,
                color: '#111111',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '1rem',
                maxWidth: '460px',
              }}
            >
              Find somewhere worth going.
            </p>

            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              HYDERABAD / INDIA &bull; 17.3850&deg; N, 78.4867&deg; E
            </p>
          </div>

          {/* Links Right */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <span className="drop-badge">DISPATCHES</span>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#111111',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-orange)')}
              onMouseLeave={(e) => (e.target.style.color = '#111111')}
            >
              INSTAGRAM &rarr;
            </a>

            <a
              href="mailto:drops@spotdrop.app"
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#111111',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-orange)')}
              onMouseLeave={(e) => (e.target.style.color = '#111111')}
            >
              CONTACT &rarr;
            </a>

            <span
              className="handwriting"
              style={{
                fontSize: '1.25rem',
                color: 'var(--text-secondary)',
                marginTop: '0.5rem',
              }}
            >
              curating Hyderabad since day one
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(17, 17, 17, 0.08)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>&copy; 2026 Spotdrop. All rights reserved.</span>
          <span>Designed with care in Hyderabad.</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
