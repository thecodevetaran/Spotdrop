import React, { useState } from 'react';
import { submitToWaitlist } from '../services/waitlist';
import { triggerConfetti } from '../utils/confetti';
import { formatReferralUrl } from '../utils/referral';

export default function WaitlistForm({
  heading = 'wanna know when we drop?',
  subtext,
  variant = 'standard', // 'standard' | 'minimal' | 'hero'
  className = '',
}) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'duplicate' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await submitToWaitlist(email.trim(), honeypot);
      setSubmittedEmail(res.email || email.trim());
      setReferralCode(res.referralCode || '');

      if (res.status === 'duplicate') {
        setStatus('duplicate');
      } else {
        setStatus('success');
        triggerConfetti();
      }
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'something went wrong. Try again in a second.');
    }
  };

  const handleCopyLink = () => {
    if (!referralCode) return;
    const url = formatReferralUrl(referralCode);
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
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

      {/* Success State */}
      {status === 'success' && (
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
            gap: '0.5rem',
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
              YOU&apos;RE IN <span style={{ color: 'var(--accent-orange)' }}>✓</span>
            </span>
            <span className="drop-badge">HYD / WAVE 01</span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.4rem',
              color: 'var(--text-primary)',
              margin: '0.1rem 0',
              fontWeight: 600,
            }}
          >
            Don&apos;t make plans.
          </p>

          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              borderTop: '1px dashed var(--border-subtle)',
              paddingTop: '0.5rem',
              marginTop: '0.2rem',
            }}
          >
            We&apos;ll email <strong style={{ color: '#111111' }}>{submittedEmail}</strong> before the public launch.
          </p>

          {/* Referral Link Box */}
          {referralCode && (
            <div
              style={{
                backgroundColor: '#F5F1E8',
                border: '1px solid rgba(17, 17, 17, 0.12)',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                marginTop: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#77736C', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  YOUR REFERRAL LINK
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111111', fontFamily: 'monospace' }}>
                  {referralCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-tactile"
                style={{
                  backgroundColor: copied ? '#111111' : 'var(--accent-lime)',
                  color: copied ? '#FFFFFF' : '#111111',
                  border: '1px solid #111111',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? 'COPIED ✓' : 'COPY LINK'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Duplicate State */}
      {status === 'duplicate' && (
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
            gap: '0.5rem',
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
              you&apos;re already in 👀
            </span>
            <span className="drop-badge">SAVED SPOT</span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.35rem',
              color: 'var(--text-primary)',
              margin: '0.1rem 0',
              fontWeight: 600,
            }}
          >
            We saved your spot. You&apos;re good.
          </p>

          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              borderTop: '1px dashed var(--border-subtle)',
              paddingTop: '0.5rem',
              marginTop: '0.2rem',
            }}
          >
            We already have <strong style={{ color: '#111111' }}>{submittedEmail}</strong> on the early drop list.
          </p>

          {/* Referral Link Box */}
          {referralCode && (
            <div
              style={{
                backgroundColor: '#F5F1E8',
                border: '1px solid rgba(17, 17, 17, 0.12)',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                marginTop: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#77736C', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  YOUR REFERRAL LINK
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111111', fontFamily: 'monospace' }}>
                  {referralCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-tactile"
                style={{
                  backgroundColor: copied ? '#111111' : 'var(--accent-lime)',
                  color: copied ? '#FFFFFF' : '#111111',
                  border: '1px solid #111111',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? 'COPIED ✓' : 'COPY LINK'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Default Form Input State */}
      {status !== 'success' && status !== 'duplicate' && (
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            position: 'relative',
          }}
        >
          {/* Honeypot field for bot spam prevention */}
          <input
            type="text"
            name="b_pot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              border: 0,
            }}
          />

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
            <label
              htmlFor="waitlist-email"
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                border: 0,
              }}
            >
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
                opacity: status === 'loading' ? 0.8 : 1,
                whiteSpace: 'nowrap',
                boxShadow: '1px 2px 0px #111111',
              }}
            >
              {status === 'loading' ? (
                'JOINING...'
              ) : (
                <>
                  JOIN THE DROP <span className="arrow-icon">→</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message with Retry */}
          {status === 'error' && (
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFF0ED',
                border: '1.5px solid var(--accent-orange)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p
                  style={{
                    color: 'var(--accent-orange)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {errorMessage || 'SOMETHING WENT WRONG.'}
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    margin: '2px 0 0',
                  }}
                >
                  TRY AGAIN IN A SECOND.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                RETRY
              </button>
            </div>
          )}

          {/* Privacy Note */}
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '0.65rem',
              paddingLeft: '0.5rem',
            }}
          >
            By joining, you agree to receive occasional Spotdrop updates.
          </p>
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
