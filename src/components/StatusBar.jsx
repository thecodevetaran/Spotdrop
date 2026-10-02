import React, { useState, useEffect } from 'react';
import { getLiveWaitlistCount } from '../services/waitlist';

export default function StatusBar() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getLiveWaitlistCount().then((liveCount) => {
      if (isMounted && typeof liveCount === 'number' && liveCount > 0) {
        setCount(liveCount);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside
      aria-label="Live system status indicator"
      style={{
        backgroundColor: '#111111',
        color: '#F5F1E8',
        fontSize: '0.68rem',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '0.35rem 1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Live indicator dot */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#D8FF45',
            fontWeight: 800,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#D8FF45',
              display: 'inline-block',
              boxShadow: '0 0 8px #D8FF45',
              animation: 'pulseGently 2s infinite ease-in-out',
            }}
          />
          [ LIVE / HYDERABAD ]
        </span>

        <span style={{ opacity: 0.4 }}>•</span>

        <span style={{ fontWeight: 600, color: '#FFFFFF' }}>WAVE 01</span>

        <span style={{ opacity: 0.4 }}>•</span>

        <span style={{ color: count ? '#D8FF45' : 'rgba(245, 241, 232, 0.85)', fontWeight: 700 }}>
          {count ? `${count} SPOTS CLAIMED` : 'ACCESS OPEN'}
        </span>
      </div>
    </aside>
  );
}
