import React from 'react';
import DropCard from './DropCard';

export default function DropsSection() {
  const dropsData = [
    {
      dropNumber: 'DROP 001',
      category: 'CAFÉ',
      location: 'JUBILEE HILLS',
      imageSrc: '/images/drops/drop_001.jpg',
      imageAlt: 'Quiet specialty coffee sanctuary with concrete walls and warm morning light in Jubilee Hills',
      quote: "The kind of place you don't tell the group chat about.",
      handwrittenComment: 'ask for the cold brew on tap',
      distance: '12 MIN AWAY',
      rotation: -1.2,
      featured: true,
      tapePosition: 'top-left',
      metadata: ['17.4325° N', '8 SEATS ONLY', 'ROASTED IN-HOUSE', 'NO SIGNBOARD'],
    },
    {
      dropNumber: 'DROP 002',
      category: 'SUNSET',
      location: 'HYDERABAD',
      imageSrc: '/images/drops/drop_002.jpg',
      imageAlt: 'Golden hour twilight over granite rocks overlooking the Hyderabad city horizon',
      quote: 'Yeah, Hyderabad actually looks like this.',
      handwrittenComment: 'sit on the second boulder',
      distance: '24 MIN AWAY',
      rotation: 1.8,
      featured: false,
      tapePosition: 'top-right',
      metadata: ['KHAJAGUDA HILLS', 'GOLDEN HOUR', 'WINDY', 'BRING CHAI'],
    },
    {
      dropNumber: 'DROP 003',
      category: 'DINNER',
      location: 'BANJARA HILLS',
      imageSrc: '/images/drops/drop_003.jpg',
      imageAlt: 'Candlelit dinner table with contemporary small plates and cocktail glasses',
      quote: 'For when nobody can decide where to eat.',
      handwrittenComment: 'get the curry leaf prawns first',
      distance: '8 MIN AWAY',
      rotation: -1.8,
      featured: false,
      tapePosition: 'top-center',
      metadata: ['ROAD NO. 10', 'DIM LIGHTING', 'RESERVATIONS ONLY'],
    },
    {
      dropNumber: 'DROP 004',
      category: 'HIDDEN',
      location: 'HYDERABAD',
      imageSrc: '/images/drops/drop_004.jpg',
      imageAlt: 'Heritage stone archway with blooming magenta bougainvillea and a teal door',
      quote: 'You have probably walked past this.',
      handwrittenComment: 'push the green door gently',
      distance: '18 MIN AWAY',
      rotation: 1.5,
      featured: true,
      tapePosition: 'top-left',
      metadata: ['BEGUMPET BY-LANE', 'EST. 1968', 'SECRET COURTYARD'],
    },
  ];

  return (
    <section
      id="drops"
      style={{
        padding: '5.5rem 0 6.5rem 0',
        position: 'relative',
        backgroundColor: '#EFEAE0',
        borderTop: '1px solid rgba(17, 17, 17, 0.08)',
        borderBottom: '1px solid rgba(17, 17, 17, 0.08)',
      }}
    >
      <div className="site-wrapper">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className="drop-badge">COLLECTIBLE ENTRIES</span>
              <span className="meta-label" style={{ color: 'var(--text-secondary)' }}>
                DROP FEED / ARCHIVE
              </span>
            </div>

            <h2 className="section-title" style={{ color: '#111111', margin: 0 }}>
              THE DROPS
            </h2>
            <p
              style={{
                fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
                color: 'var(--text-secondary)',
                marginTop: '0.5rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              A few places worth knowing about.
            </p>
          </div>

          {/* Handwritten Annotation on Top Right */}
          <div
            className="animate-float"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transform: 'rotate(2deg)',
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
              updated weekly by real humans
            </span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-lime)',
                border: '1.5px solid #111111',
              }}
            />
          </div>
        </div>

        {/* Asymmetrical Scrapbook Grid */}
        <div
          className="drops-asymmetric-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2.5rem 2rem',
            alignItems: 'start',
          }}
        >
          {/* Item 1: Large Featured Coffee Card (Takes 7 cols) */}
          <div className="drop-col-1" style={{ gridColumn: 'span 7' }}>
            <DropCard {...dropsData[0]} />
          </div>

          {/* Item 2: Medium Sunset Card (Takes 5 cols, offset) */}
          <div
            className="drop-col-2"
            style={{
              gridColumn: 'span 5',
              marginTop: '1.5rem',
            }}
          >
            <DropCard {...dropsData[1]} />
          </div>

          {/* Item 3: Dinner Card (Takes 5 cols) */}
          <div
            className="drop-col-3"
            style={{
              gridColumn: 'span 5',
            }}
          >
            <DropCard {...dropsData[2]} />
          </div>

          {/* Item 4: Large Hidden Courtyard Card (Takes 7 cols) */}
          <div
            className="drop-col-4"
            style={{
              gridColumn: 'span 7',
              marginTop: '-1.5rem',
            }}
          >
            <DropCard {...dropsData[3]} />
          </div>
        </div>

        {/* Bottom Note */}
        <div
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <span className="washi-tape" style={{ position: 'static', width: '40px', height: '14px' }} />
          <span
            className="handwriting"
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
            }}
          >
            more drops unlocking for waitlist members first
          </span>
          <span className="washi-tape" style={{ position: 'static', width: '40px', height: '14px' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .drops-asymmetric-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 2.5rem !important;
          }
          .drop-col-1, .drop-col-2, .drop-col-3, .drop-col-4 {
            grid-column: auto !important;
            margin-top: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
