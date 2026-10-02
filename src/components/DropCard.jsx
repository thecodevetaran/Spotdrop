import React, { useState } from 'react';

export default function DropCard({
  dropNumber,
  category,
  location,
  quote,
  note,
  imageSrc,
  imageAlt,
  distance,
  metadata = [],
  rotation = 0,
  featured = false,
  tapePosition = 'top-left', // 'top-left' | 'top-right' | 'top-center'
  handwrittenComment,
}) {
  const [saved, setSaved] = useState(false);

  return (
    <article
      className="drop-card card-hover-tilt"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid rgba(17, 17, 17, 0.12)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-polaroid)',
        transform: `rotate(${rotation}deg)`,
        '--hover-rot': '0deg',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Washi tape accent */}
      {tapePosition === 'top-left' && (
        <div className="washi-tape" style={{ top: '-10px', left: '15px', transform: 'rotate(-4deg)' }} />
      )}
      {tapePosition === 'top-right' && (
        <div className="washi-tape" style={{ top: '-10px', right: '15px', transform: 'rotate(5deg)' }} />
      )}
      {tapePosition === 'top-center' && (
        <div className="washi-tape" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(1deg)' }} />
      )}

      {/* Header Row: Drop Number & Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="drop-badge">{dropNumber}</span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#111111',
              textTransform: 'uppercase',
            }}
          >
            {category} / {location}
          </span>
        </div>

        {distance && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--text-secondary)',
              backgroundColor: 'rgba(17, 17, 17, 0.05)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
            }}
          >
            {distance}
          </span>
        )}
      </div>

      {/* Place Photograph Container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '10px',
          backgroundColor: '#EBE5D8',
          marginBottom: '1rem',
          flex: '1 1 auto',
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt || `${category} in ${location}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            minHeight: featured ? '360px' : '260px',
            maxHeight: featured ? '440px' : '320px',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Floating Quick Save Button */}
        <button
          onClick={() => setSaved(!saved)}
          aria-label={saved ? 'Remove from saved' : 'Save drop'}
          className="btn-tactile"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: saved ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.95)',
            color: '#111111',
            borderRadius: '9999px',
            padding: '0.4rem 0.75rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            border: '1px solid #111111',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          <span>{saved ? 'SAVED ✓' : 'SAVE SPOT'}</span>
        </button>
      </div>

      {/* Editorial Quote & Handwritten Annotation */}
      <div style={{ marginTop: 'auto' }}>
        <blockquote
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: featured ? '1.25rem' : '1.05rem',
            fontWeight: 600,
            lineHeight: 1.35,
            color: '#111111',
            margin: '0 0 0.5rem 0',
          }}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>

        {handwrittenComment && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <span
              className="handwriting"
              style={{
                fontSize: '1.25rem',
                color: 'var(--accent-orange)',
                fontWeight: 700,
              }}
            >
              ↳ {handwrittenComment}
            </span>
          </div>
        )}

        {/* Small metadata row */}
        {metadata.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginTop: '0.85rem',
              paddingTop: '0.65rem',
              borderTop: '1px dashed rgba(17, 17, 17, 0.1)',
              flexWrap: 'wrap',
            }}
          >
            {metadata.map((item, idx) => (
              <span
                key={idx}
                className="meta-label"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.68rem',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
