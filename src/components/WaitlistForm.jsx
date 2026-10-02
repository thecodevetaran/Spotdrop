import React, { useState } from 'react';
import { submitToWaitlist } from '../services/waitlist';
import { triggerConfetti } from '../utils/confetti';

export default function WaitlistForm({
  heading = 'wanna know when we drop?',
  subtext,
  variant = 'standard', // 'standard' | 'minimal' | 'hero'
  className = '',
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await submitToWaitlist(email.trim());
      setSubmittedEmail(email.trim());
      setStatus('success');
      setEmail('');
      triggerConfetti();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Drop a real email address so we can reach you.');
    }
  };

  return (
    <div
      className={`waitlist-form-container ${className}`}
      style={{
        maxWidth: variant === 'minimal' ? '460px' : '520px',
        width: '100%',
      }}
    >
      {heading && (
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: variant === 'hero' ? '1.35rem' : '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            color: '#111111',
            textTransform: 'lowercase',
          }}
        >
          {heading}
        </h3>
      )}

      {subtext && (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.92rem',
            marginBottom: '1rem',
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </p>
      )}

      {status === 'success' ? (
        <div
          className="animate-pop-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            boxShadow: '4px 4px 0px #111111',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#111111',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              YOU'RE IN <span style={{ color: 'var(--accent-orange)' }}>✓</span>
            </span>
            <span className="drop-badge">HYD / WAVE 01</span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.4rem',
              color: 'var(--text-primary)',
              margin: '0.2rem 0',
              fontWeight: 600,
            }}
          >
            Don't make plans.
          </p>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              borderTop: '1px dashed var(--border-subtle)',
              paddingTop: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            We'll email <strong style={{ color: '#111111' }}>{submittedEmail}</strong> before the public launch.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            position: 'relative',
          }}
        >
          <div
            className="form-input-row"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              backgroundColor: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '9999px',
              padding: '0.35rem 0.35rem 0.35rem 1.25rem',
              boxShadow: '3px 4px 0px #111111',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            }}
          >
            <label htmlFor="waitlist-email" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              autoComplete="email"
              disabled={status === 'loading'}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.98rem',
                fontFamily: 'var(--font-sans)',
                color: '#111111',
                padding: '0.5rem 0',
                minWidth: '120px',
              }}
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-tactile animate-wiggle-hover"
              style={{
                backgroundColor: 'var(--accent-lime)',
                color: '#111111',
                border: '1.5px solid #111111',
                borderRadius: '9999px',
                padding: '0.75rem 1.35rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '1px 2px 0px #111111',
              }}
            >
              {status === 'loading' ? (
                'DROPPING IN...'
              ) : (
                <>
                  JOIN THE DROP <span className="arrow-icon">→</span>
                </>
              )}
            </button>
          </div>

          {status === 'error' && (
            <p
              style={{
                color: 'var(--accent-orange)',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginTop: '0.5rem',
                paddingLeft: '0.5rem',
              }}
            >
              {errorMessage}
            </p>
          )}
        </form>
      )}

      <style>{`
        @media (max-width: 520px) {
          .form-input-row {
            flex-direction: column !important;
            border-radius: 18px !important;
            padding: 0.6rem !important;
            gap: 0.5rem !important;
          }
          .form-input-row input {
            padding: 0.6rem 0.5rem !important;
          }
          .form-input-row button {
            width: 100% !important;
            justify-content: center !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
