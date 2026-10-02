import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenWaitlist }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWaitlist = (e) => {
    e?.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById('waitlist-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => (e) => {
    e?.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#F5F1E8]/90 backdrop-blur-md border-b border-[#111111]/10 shadow-sm'
          : 'py-5 bg-transparent'
      }`}
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: scrolled ? 'rgba(245, 241, 232, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(17, 17, 17, 0.08)' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <div className="site-wrapper flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Left */}
        <a
          href="#"
          className="flex items-center gap-2 group"
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              border: '1px solid rgba(17,17,17,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src="/images/logo.png"
              alt="Spotdrop Logo"
              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              color: '#111111',
            }}
          >
            SPOTDROP
          </span>
          <span
            style={{
              backgroundColor: 'rgba(17, 17, 17, 0.06)',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              color: '#77736C',
              marginLeft: '0.2rem',
            }}
          >
            HYD
          </span>
        </a>

        {/* Desktop Navigation Links Right */}
        <nav
          className="nav-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s ease',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#111111')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            INSTAGRAM
          </a>

          <a
            href="#city-intro"
            onClick={scrollToSection('city-intro')}
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s ease',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#111111')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            ABOUT
          </a>

          <button
            onClick={scrollToWaitlist}
            className="btn-tactile"
            style={{
              backgroundColor: 'var(--accent-lime)',
              color: '#111111',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              border: '1.5px solid #111111',
              boxShadow: '1.5px 2px 0px #111111',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            JOIN WAITLIST
          </button>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            padding: '0.4rem',
            border: '1px solid rgba(17,17,17,0.2)',
            borderRadius: '6px',
            backgroundColor: 'transparent',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#F5F1E8',
            borderBottom: '1px solid rgba(17, 17, 17, 0.1)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
          }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#111111',
              textTransform: 'uppercase',
            }}
          >
            INSTAGRAM
          </a>
          <a
            href="#city-intro"
            onClick={scrollToSection('city-intro')}
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#111111',
              textTransform: 'uppercase',
            }}
          >
            ABOUT
          </a>
          <button
            onClick={scrollToWaitlist}
            style={{
              backgroundColor: 'var(--accent-lime)',
              color: '#111111',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '0.75rem 1rem',
              borderRadius: '9999px',
              border: '1.5px solid #111111',
              boxShadow: '2px 2px 0px #111111',
              textAlign: 'center',
              textTransform: 'uppercase',
              width: '100%',
            }}
          >
            JOIN WAITLIST
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
