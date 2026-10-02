import React, { useState } from 'react';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Incorrect password.');
      }

      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F1E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="card-hover-tilt"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          border: '2px solid #111111',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '6px 8px 0px #111111',
          position: 'relative',
        }}
      >
        {/* Washi tape at top */}
        <div
          className="washi-tape"
          style={{
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%) rotate(2deg)',
          }}
        />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1.5px solid #111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <img src="/images/logo.png" alt="Spotdrop" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>

          <span className="drop-badge" style={{ marginBottom: '0.65rem' }}>
            RESTRICTED AREA
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: '0.4rem 0 0.25rem 0',
            }}
          >
            ADMIN ACCESS
          </h1>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Enter your admin password to view the waitlist
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#111111',
                marginBottom: '0.4rem',
              }}
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              disabled={loading}
              autoFocus
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                fontFamily: 'var(--font-sans)',
                border: '2px solid #111111',
                borderRadius: '10px',
                backgroundColor: '#FAF7F0',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: 'var(--accent-orange)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-tactile"
            style={{
              width: '100%',
              backgroundColor: 'var(--accent-lime)',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '9999px',
              padding: '0.85rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 900,
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '2px 3px 0px #111111',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'UNLOCK DASHBOARD →'}
          </button>
        </form>

        {/* Back to site link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            ← Return to Spotdrop
          </a>
        </div>
      </div>
    </div>
  );
}
