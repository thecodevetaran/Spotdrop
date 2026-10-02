import React, { useState } from 'react';
import { submitToWaitlist } from '../services/waitlist';
import { triggerConfetti } from '../utils/confetti';
import { formatReferralUrl } from '../utils/referral';

const QUESTIONS = [
  {
    time: 'SATURDAY / 8:00 AM',
    label: 'MORNING DISCOVERY',
    options: [
      {
        id: 'cafe-aesthetic',
        title: 'OVERCROWDED AESTHETIC CAFE',
        subtext: '45-minute wait for avocado toast & reel music',
        isSpotdropPick: false,
      },
      {
        id: 'cafe-roastery',
        title: 'UNMARKED ROASTERY IN AN ALLEY',
        subtext: 'Fresh roast smell before you even find the door',
        isSpotdropPick: true,
      },
    ],
  },
  {
    time: 'FRIDAY / 9:30 PM',
    label: 'NIGHT MOVES',
    options: [
      {
        id: 'night-posted',
        title: 'THE PLACE EVERYONE POSTED',
        subtext: 'Full house, booked tables, same stories on your feed',
        isSpotdropPick: false,
      },
      {
        id: 'night-hidden',
        title: 'THE PLACE YOUR FRIEND WON’T TELL YOU ABOUT',
        subtext: 'Low lighting, no sign outside, perfect sound system',
        isSpotdropPick: true,
      },
    ],
  },
  {
    time: 'SUNDAY / 4:00 PM',
    label: 'WEEKEND EXPLORATION',
    options: [
      {
        id: 'sunday-favourite',
        title: 'SAME OLD FAVOURITE',
        subtext: 'Safe choice. You know the menu by heart',
        isSpotdropPick: false,
      },
      {
        id: 'sunday-unknown',
        title: 'SOMEWHERE YOU’VE NEVER HEARD OF',
        subtext: 'A quiet corner of Hyderabad you missed for two years',
        isSpotdropPick: true,
      },
    ],
  },
];

export default function TasteGatekeeper({ id = 'gatekeeper' }) {
  const [step, setStep] = useState(0); // 0, 1, 2 = questions, 3 = verdict/form
  const [answers, setAnswers] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Email form state
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'duplicate' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [errorSubtext, setErrorSubtext] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSelectOption = (option) => {
    if (isTransitioning) return;
    setSelectedOptionId(option.id);
    setIsTransitioning(true);

    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
        setSelectedOptionId(null);
        setIsTransitioning(false);
      } else {
        // All 3 answered -> reveal verdict
        setStep(3);
        setSelectedOptionId(null);
        setIsTransitioning(false);
      }
    }, 320);
  };

  const handleResetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setSelectedOptionId(null);
    setFormStatus('idle');
    setErrorMessage('');
    setEmail('');
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email || formStatus === 'loading') return;

    setFormStatus('loading');
    setErrorMessage('');
    setErrorSubtext('');

    try {
      const res = await submitToWaitlist(email.trim(), honeypot);
      setSubmittedEmail(res.email || email.trim());
      setReferralCode(res.referralCode || '');

      if (res.status === 'duplicate') {
        setFormStatus('duplicate');
      } else {
        setFormStatus('success');
        triggerConfetti();
      }
      setEmail('');
    } catch (err) {
      setFormStatus('error');
      setErrorMessage(err.message || 'SOMETHING WENT WRONG.');
      setErrorSubtext(err.subtext || 'TRY AGAIN IN A SECOND.');
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

  const currentQ = QUESTIONS[step];

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        padding: '3.5rem 0 4.5rem 0',
        backgroundColor: '#F5F1E8',
        borderTop: '2px solid #111111',
        borderBottom: '2px solid #111111',
        overflow: 'hidden',
      }}
    >
      {/* Visual background washi details */}
      <div
        className="washi-tape"
        style={{
          top: '-12px',
          right: '18%',
          transform: 'rotate(2.5deg)',
        }}
      />
      <div
        className="washi-tape"
        style={{
          bottom: '-12px',
          left: '10%',
          transform: 'rotate(-3deg)',
        }}
      />

      <div className="site-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          
          {/* Header pill / tracker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.75rem',
              paddingBottom: '1rem',
              borderBottom: '1px dashed var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="drop-badge">TASTE GATEKEEPER</span>
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                {step < 3 ? `[ CHOICE 0${step + 1} / 03 ]` : '[ VERDICT COMPLETE ]'}
              </span>
            </div>

            {step > 0 && (
              <button
                type="button"
                onClick={handleResetQuiz}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: '1px',
                }}
              >
                ↺ START OVER
              </button>
            )}
          </div>

          {/* ==============================================================
              STAGE 1: BINARY QUESTIONS (STEPS 0, 1, 2)
              ============================================================== */}
          {step < 3 && (
            <div className="animate-pop-in" key={step}>
              {/* Question metadata header */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    color: 'var(--accent-orange)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  {currentQ.time}
                </span>

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                    lineHeight: 0.95,
                    fontWeight: 900,
                    letterSpacing: '-0.035em',
                    color: '#111111',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  LET’S SEE IF YOU GET IT.
                </h2>
              </div>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.98rem',
                  marginBottom: '2rem',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Pick your natural spot. There are no right answers—only Spotdrop taste.
              </p>

              {/* Binary Choice Cards Container */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'stretch',
                }}
              >
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      disabled={isTransitioning}
                      className="card-hover-tilt"
                      style={{
                        textAlign: 'left',
                        backgroundColor: isSelected ? 'var(--accent-lime)' : '#FFFFFF',
                        border: '2px solid #111111',
                        borderRadius: '16px',
                        padding: '1.75rem 1.5rem',
                        boxShadow: isSelected ? '2px 2px 0px #111111' : '5px 5px 0px #111111',
                        transform: isSelected
                          ? 'translate(3px, 3px)'
                          : idx === 0
                          ? 'rotate(-0.6deg)'
                          : 'rotate(0.6deg)',
                        cursor: isTransitioning ? 'default' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                        minHeight: '210px',
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <div>
                        {/* Option Tag */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: '#111111',
                              backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-primary)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              border: '1px solid rgba(17, 17, 17, 0.2)',
                            }}
                          >
                            OPTION 0{idx + 1}
                          </span>

                          <span
                            className="arrow-icon"
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              color: '#111111',
                              transform: isSelected ? 'translateX(4px)' : 'none',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            →
                          </span>
                        </div>

                        {/* Large Title */}
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                            color: '#111111',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {option.title}
                        </h3>

                        {/* Subtext description */}
                        <p
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.88rem',
                            color: isSelected ? '#111111' : 'var(--text-secondary)',
                            lineHeight: 1.4,
                            margin: 0,
                          }}
                        >
                          {option.subtext}
                        </p>
                      </div>

                      {/* Small tactile tap cue */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          borderTop: '1px solid rgba(17, 17, 17, 0.1)',
                          paddingTop: '0.75rem',
                        }}
                      >
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            border: '1.5px solid #111111',
                            backgroundColor: isSelected ? '#111111' : 'transparent',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#111111',
                          }}
                        >
                          {isSelected ? 'SELECTED' : 'SELECT THIS'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress step dots */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '2rem',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: i === step ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      backgroundColor: i === step ? '#111111' : 'rgba(17, 17, 17, 0.2)',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              STAGE 2: VERDICT & EXCLUSIVE INVITE CLAIM (STEP 3)
              ============================================================== */}
          {step === 3 && (
            <div
              className="animate-pop-in"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #111111',
                borderRadius: '24px',
                padding: 'clamp(1.75rem, 4vw, 3rem)',
                boxShadow: '6px 6px 0px #111111',
                position: 'relative',
              }}
            >
              {/* Top Stamp / Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <span className="drop-badge">VERDICT: YOU GET IT</span>
                <span
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--accent-orange)',
                    textTransform: 'uppercase',
                  }}
                >
                  ★ 3/3 TASTE MATCH
                </span>
              </div>

              {/* Large Headline */}
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
                  lineHeight: 0.95,
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  color: '#111111',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                }}
              >
                YOUR TASTE ALIGNS WITH WAVE 01.
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-handwriting)',
                  fontSize: '1.55rem',
                  color: 'var(--accent-orange)',
                  fontWeight: 700,
                  margin: '0 0 1.25rem 0',
                  transform: 'rotate(-0.8deg)',
                  display: 'inline-block',
                }}
              >
                Wave 01 access unlocked. You don’t do basic places.
              </p>

              {/* Supporting instruction */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.98rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '2rem',
                  lineHeight: 1.45,
                  maxWidth: '520px',
                }}
              >
                Enter your email to claim your invite before the public release drops in Hyderabad.
              </p>

              {/* ==========================================================
                  FORM INTERACTION
                  ========================================================== */}
              
              {/* SUCCESS STATE */}
              {formStatus === 'success' && (
                <div
                  className="animate-pop-in"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid #111111',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '3px 3px 0px #111111',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontSize: '1.5rem',
                        color: '#111111',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      YOU’RE IN <span style={{ color: 'var(--accent-orange)' }}>✓</span>
                    </span>
                    <span className="drop-badge">HYD / WAVE 01</span>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-handwriting)',
                      fontSize: '1.55rem',
                      color: 'var(--text-primary)',
                      margin: '0.2rem 0',
                      fontWeight: 700,
                    }}
                  >
                    Don’t make plans.
                  </p>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px dashed var(--border-subtle)',
                      paddingTop: '0.65rem',
                      margin: 0,
                    }}
                  >
                    We saved your spot for <strong style={{ color: '#111111' }}>{submittedEmail}</strong>. Keep an eye on your inbox.
                  </p>

                  {/* Referral link box */}
                  {referralCode && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #111111',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#77736C', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                          YOUR WAVE 01 INVITE CODE
                        </span>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111111', fontFamily: 'monospace' }}>
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
                          borderRadius: '8px',
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {copied ? 'COPIED ✓' : 'COPY INVITE LINK'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* DUPLICATE STATE */}
              {formStatus === 'duplicate' && (
                <div
                  className="animate-pop-in"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid #111111',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '3px 3px 0px #111111',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontSize: '1.4rem',
                        color: '#111111',
                      }}
                    >
                      YOU’RE ALREADY IN 👀
                    </span>
                    <span className="drop-badge">SPOT SECURED</span>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-handwriting)',
                      fontSize: '1.45rem',
                      color: 'var(--text-primary)',
                      margin: '0.1rem 0',
                      fontWeight: 700,
                    }}
                  >
                    We saved your spot. You’re good.
                  </p>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    We already have <strong style={{ color: '#111111' }}>{submittedEmail}</strong> registered for Wave 01.
                  </p>

                  {referralCode && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #111111',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#77736C', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                          YOUR INVITE CODE
                        </span>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111111', fontFamily: 'monospace' }}>
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
                          borderRadius: '8px',
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {copied ? 'COPIED ✓' : 'COPY INVITE LINK'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* INPUT FORM STATE */}
              {formStatus !== 'success' && formStatus !== 'duplicate' && (
                <form onSubmit={handleSubmitEmail} noValidate style={{ maxWidth: '580px' }}>
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="b_gatekeeper"
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
                      boxShadow: '4px 4px 0px #111111',
                      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                    }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your email to claim invite"
                      autoComplete="email"
                      disabled={formStatus === 'loading'}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.98rem',
                        fontFamily: 'var(--font-sans)',
                        color: '#111111',
                        padding: '0.5rem 0',
                        minWidth: '160px',
                      }}
                    />

                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="btn-tactile animate-wiggle-hover"
                      style={{
                        backgroundColor: 'var(--accent-lime)',
                        color: '#111111',
                        border: '1.5px solid #111111',
                        borderRadius: '9999px',
                        padding: '0.85rem 1.45rem',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: formStatus === 'loading' ? 0.8 : 1,
                        whiteSpace: 'nowrap',
                        boxShadow: '1px 2px 0px #111111',
                      }}
                    >
                      {formStatus === 'loading' ? (
                        'CLAIMING...'
                      ) : (
                        <>
                          JOIN THE FIRST DROP <span className="arrow-icon">→</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* ERROR NOTIFICATION WITH RETRY */}
                  {formStatus === 'error' && (
                    <div
                      className="animate-pop-in"
                      style={{
                        marginTop: '1rem',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#FFF0ED',
                        border: '1.5px solid var(--accent-orange)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
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
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {errorMessage}
                        </p>
                        <p
                          style={{
                            color: '#77736C',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            margin: '2px 0 0',
                          }}
                        >
                          {errorSubtext}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'loading'}
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

                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.85rem',
                      paddingLeft: '0.5rem',
                    }}
                  >
                    Wave 01 invites are prioritized in order of receipt. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
