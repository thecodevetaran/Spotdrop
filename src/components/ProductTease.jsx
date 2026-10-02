import React, { useState } from 'react';

export default function ProductTease() {
  const [activeTab, setActiveTab] = useState('DISCOVER');

  const tabs = [
    { id: 'DISCOVER', label: 'DISCOVER', desc: 'Curated drops within your radius every week.' },
    { id: 'SAVE', label: 'SAVE', desc: 'A personal scrapbook of spots you’ll actually visit.' },
    { id: 'DROP', label: 'DROP', desc: 'Drop your own secret places for the inner circle.' },
    { id: 'GO', label: 'GO', desc: 'Instant navigation, opening hours & best timing.' },
  ];

  return (
    <section
      id="product"
      style={{
        padding: '6rem 0 6.5rem 0',
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(17, 17, 17, 0.08)',
        borderBottom: '1px solid rgba(17, 17, 17, 0.08)',
      }}
    >
      <div className="site-wrapper">
        <div
          className="product-tease-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Copy & Interactive Pills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <span className="drop-badge">SNEAK PEEK</span>
              <span className="meta-label" style={{ color: 'var(--text-secondary)' }}>
                THE APP / LAUNCHING 2026
              </span>
            </div>

            <h2
              className="section-title"
              style={{
                color: '#111111',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ display: 'block' }}>THE PART AFTER</span>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--accent-orange)',
                }}
              >
                &ldquo;WHERE SHOULD WE GO?&rdquo;
              </span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                lineHeight: 1.55,
                color: '#3B3833',
                marginBottom: '2.5rem',
                maxWidth: '520px',
              }}
            >
              Spotdrop helps you discover places worth going to — from hidden cafés and new restaurants
              to unexpected things happening around your city.
            </p>

            {/* Interactive Mode Pills */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="btn-tactile"
                    style={{
                      padding: '0.6rem 1.15rem',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      letterSpacing: '0.08em',
                      border: '1.5px solid #111111',
                      backgroundColor: activeTab === tab.id ? 'var(--accent-lime)' : '#FFFFFF',
                      color: '#111111',
                      boxShadow: activeTab === tab.id ? '2px 2px 0px #111111' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Description */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(17, 17, 17, 0.1)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  maxWidth: '460px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p style={{ fontSize: '0.95rem', color: '#111111', margin: 0, fontWeight: 500 }}>
                  {tabs.find((t) => t.id === activeTab)?.desc}
                </p>
              </div>
            </div>

            {/* Handwritten stamp */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className="handwriting"
                style={{
                  fontSize: '1.25rem',
                  color: 'var(--text-secondary)',
                }}
              >
                ↳ no 500-word essays from angry reviewers
              </span>
            </div>
          </div>

          {/* Right Column: Sleek Physical Mobile Mockup */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Washi tape on mobile top */}
            <div
              className="washi-tape"
              style={{
                top: '-14px',
                right: '25%',
                transform: 'rotate(4deg)',
              }}
            />

            {/* Smartphone Hardware Frame */}
            <div
              className="card-hover-tilt"
              style={{
                width: '100%',
                maxWidth: '340px',
                backgroundColor: '#111111',
                borderRadius: '44px',
                padding: '12px',
                boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                position: 'relative',
                transform: 'rotate(1.5deg)',
                '--hover-rot': '0deg',
              }}
            >
              {/* Screen Area */}
              <div
                style={{
                  backgroundColor: '#F5F1E8',
                  borderRadius: '34px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(0,0,0,0.1)',
                  minHeight: '560px',
                  position: 'relative',
                }}
              >
                {/* Hardware Speaker Notch & Status Bar */}
                <div
                  style={{
                    padding: '10px 18px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#111111',
                  }}
                >
                  <span>09:41</span>
                  <div
                    style={{
                      width: '80px',
                      height: '18px',
                      backgroundColor: '#111111',
                      borderRadius: '12px',
                    }}
                  />
                  <span>5G ●</span>
                </div>

                {/* In-App Header */}
                <div
                  style={{
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(17,17,17,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <img src="/images/logo.png" alt="logo" style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem' }}>
                      SPOTDROP
                    </span>
                  </div>
                  <span className="drop-badge" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>
                    HYD LIVE
                  </span>
                </div>

                {/* In-App Content depending on active tab */}
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeTab === 'DISCOVER' && (
                    <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#77736C' }}>
                          TODAY&apos;S DROP / 04:30 PM
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                          ● 8 LEFT
                        </span>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '1.5px solid #111111',
                          boxShadow: '2px 2px 0px #111111',
                        }}
                      >
                        <img
                          src="/images/drops/drop_001.jpg"
                          alt="Specialty Roastery"
                          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
                                THE CONCRETE STUDIO
                              </h4>
                              <p style={{ fontSize: '0.72rem', color: '#77736C', margin: '2px 0 0' }}>
                                JUBILEE HILLS • 1.2 KM
                              </p>
                            </div>
                            <span className="sticker sticker-lime" style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem' }}>
                              NEW
                            </span>
                          </div>
                          <p style={{ fontSize: '0.75rem', margin: '8px 0 0', color: '#333333', lineHeight: 1.35 }}>
                            &ldquo;Unmarked door next to the gallery. Exceptional espresso.&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'SAVE' && (
                    <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#77736C' }}>
                        YOUR SCRAPBOOK (3 PLACES)
                      </span>
                      {['Khajaguda Rock Viewpoint', 'Subko Hyderabad', 'Old City Midnight Chai'].map((place, i) => (
                        <div
                          key={i}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            border: '1px solid rgba(17,17,17,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block' }}>{place}</span>
                            <span style={{ fontSize: '0.65rem', color: '#77736C' }}>Added this week</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-orange)' }}>★</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'DROP' && (
                    <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '2px dashed #111111',
                          borderRadius: '16px',
                          padding: '24px 16px',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '8px' }}>📍</span>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          DROP A SECRET SPOT
                        </h4>
                        <p style={{ fontSize: '0.72rem', color: '#77736C', marginTop: '4px' }}>
                          Found a place nobody knows yet? Drop the pin.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'GO' && (
                    <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div
                        style={{
                          backgroundColor: '#111111',
                          color: '#FFFFFF',
                          borderRadius: '16px',
                          padding: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="drop-badge">BEST TIME: NOW</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-lime)' }}>14 MINS AWAY</span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '10px 0 4px' }}>
                          EVENING TWILIGHT DECK
                        </h4>
                        <p style={{ fontSize: '0.72rem', color: '#A9A499' }}>
                          Quiet tables available right now before 6:30 PM crowd.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* In-App Bottom Navigation Bar */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderTop: '1px solid rgba(17,17,17,0.1)',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: activeTab === 'DISCOVER' ? '#111111' : '#A9A499' }}>EXPLORE</span>
                  <span style={{ color: activeTab === 'SAVE' ? '#111111' : '#A9A499' }}>SAVED</span>
                  <span style={{ color: activeTab === 'DROP' ? '#111111' : '#A9A499' }}>DROP</span>
                  <span style={{ color: activeTab === 'GO' ? '#111111' : '#A9A499' }}>PROFILE</span>
                </div>
              </div>
            </div>

            {/* Small floating annotation on Mockup */}
            <div
              className="animate-float"
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '5%',
                zIndex: 25,
                transform: 'rotate(-5deg)',
              }}
            >
              <span className="sticker sticker-lime" style={{ fontSize: '0.7rem' }}>
                sneak peek: iOS &amp; Android
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-tease-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
