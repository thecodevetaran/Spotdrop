import React, { useState, useEffect, useCallback } from 'react';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, referrals: 0 });
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Table filters & pagination state
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Notes editing state
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  };

  const fetchSignups = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort,
      });
      if (search.trim()) params.set('search', search.trim());
      if (source) params.set('source', source);
      if (status) params.set('status', status);

      const res = await fetch(`/api/admin/signups?${params.toString()}`);
      if (res.status === 401) {
        onLogout();
        return;
      }

      const data = await res.json();
      setSignups(data.signups || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (e) {
      setError('Failed to fetch waitlist entries.');
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, source, status, onLogout]);

  useEffect(() => {
    fetchStats();
    fetchSignups();
  }, [fetchSignups]);

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/signups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setSignups((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  // Handle notes save
  const handleSaveNotes = async (id) => {
    try {
      const res = await fetch(`/api/admin/signups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: tempNotes }),
      });

      if (res.ok) {
        setSignups((prev) =>
          prev.map((s) => (s.id === id ? { ...s, notes: tempNotes } : s))
        );
        setEditingNotesId(null);
      }
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  };

  // Handle CSV export
  const handleExportCsv = () => {
    window.location.href = '/api/admin/export';
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    onLogout();
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F1E8',
        color: '#111111',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.75rem',
            borderBottom: '2px solid #111111',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src="/images/logo.png" alt="Spotdrop" style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem' }}>
                  SPOTDROP
                </span>
                <span className="drop-badge">ADMIN</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                HYDERABAD WAITLIST SYSTEM
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid #111111',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                textDecoration: 'none',
              }}
            >
              ← VIEW SITE
            </a>

            <button
              onClick={handleLogout}
              className="btn-tactile"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid #111111',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* 4 Metric Stats Cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Total */}
          <div
            className="card-hover-tilt"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              boxShadow: '3px 4px 0px #111111',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: '#77736C', textTransform: 'uppercase', display: 'block' }}>
              TOTAL SIGNUPS
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#111111', display: 'block', marginTop: '0.2rem' }}>
              {stats.total}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All registered interest</span>
          </div>

          {/* Today */}
          <div
            className="card-hover-tilt"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              boxShadow: '3px 4px 0px #111111',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: '#77736C', textTransform: 'uppercase', display: 'block' }}>
              TODAY
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-orange)', display: 'block', marginTop: '0.2rem' }}>
              {stats.today}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Joined in last 24h</span>
          </div>

          {/* This Week */}
          <div
            className="card-hover-tilt"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              boxShadow: '3px 4px 0px #111111',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: '#77736C', textTransform: 'uppercase', display: 'block' }}>
              THIS WEEK
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#111111', display: 'block', marginTop: '0.2rem' }}>
              {stats.thisWeek}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Last 7 days velocity</span>
          </div>

          {/* Referrals */}
          <div
            className="card-hover-tilt"
            style={{
              backgroundColor: 'var(--accent-lime)',
              border: '2px solid #111111',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              boxShadow: '3px 4px 0px #111111',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: '#111111', textTransform: 'uppercase', display: 'block' }}>
              REFERRALS
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#111111', display: 'block', marginTop: '0.2rem' }}>
              {stats.referrals}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#111111', fontWeight: 600 }}>Invited by friends</span>
          </div>
        </section>

        {/* Controls Bar: Search, Filters, CSV Export */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '3px 4px 0px #111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Search & Filters */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search email or code..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.85rem',
                  border: '1.5px solid #111111',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F0',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            {/* Source Filter */}
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                border: '1.5px solid #111111',
                borderRadius: '8px',
                backgroundColor: '#FAF7F0',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">All Sources</option>
              <option value="direct">Direct</option>
              <option value="instagram">Instagram</option>
              <option value="story">Story</option>
              <option value="friend">Friend</option>
              <option value="creator">Creator</option>
              <option value="launch">Launch</option>
              <option value="referral">Referral</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                border: '1.5px solid #111111',
                borderRadius: '8px',
                backgroundColor: '#FAF7F0',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">All Statuses</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="invited">Invited</option>
              <option value="joined">Joined</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort Toggle */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                border: '1.5px solid #111111',
                borderRadius: '8px',
                backgroundColor: '#FAF7F0',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Action: Export CSV */}
          <button
            onClick={handleExportCsv}
            className="btn-tactile"
            style={{
              backgroundColor: 'var(--accent-lime)',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '9999px',
              padding: '0.6rem 1.35rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '1.5px 2px 0px #111111',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>EXPORT CSV</span>
            <span>↓</span>
          </button>
        </section>

        {/* Data Table */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '4px 5px 0px #111111',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF7F0', borderBottom: '2px solid #111111' }}>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    EMAIL
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    JOINED
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    SOURCE
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    REFERRAL CODE
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    REFERRED BY
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    STATUS
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    NOTES
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Loading waitlist...
                    </td>
                  </tr>
                ) : signups.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No signups matching filters.
                    </td>
                  </tr>
                ) : (
                  signups.map((s) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: '1px solid rgba(17, 17, 17, 0.08)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF7F0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Email */}
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.88rem' }}>
                        {s.email}
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(s.created_at)}
                      </td>

                      {/* Source */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            backgroundColor: 'rgba(17, 17, 17, 0.06)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            color: '#111111',
                          }}
                        >
                          {s.source}
                        </span>
                      </td>

                      {/* Referral Code */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem', color: '#111111' }}>
                          {s.referral_code}
                        </span>
                      </td>

                      {/* Referred By */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {s.referred_by ? (
                          <span className="sticker sticker-lime" style={{ fontSize: '0.65rem', padding: '0.2rem 0.45rem' }}>
                            {s.referred_by}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #111111',
                            cursor: 'pointer',
                            outline: 'none',
                            backgroundColor:
                              s.status === 'invited'
                                ? 'var(--accent-lime)'
                                : s.status === 'joined'
                                ? 'var(--accent-orange)'
                                : s.status === 'inactive'
                                ? '#EBE5D8'
                                : '#FFFFFF',
                            color: s.status === 'joined' ? '#FFFFFF' : '#111111',
                          }}
                        >
                          <option value="waitlisted">Waitlisted</option>
                          <option value="invited">Invited</option>
                          <option value="joined">Joined</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>

                      {/* Notes Inline Edit */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                        {editingNotesId === s.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <input
                              type="text"
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="Add note..."
                              autoFocus
                              style={{
                                padding: '0.25rem 0.45rem',
                                fontSize: '0.78rem',
                                border: '1px solid #111111',
                                borderRadius: '4px',
                                outline: 'none',
                              }}
                            />
                            <button
                              onClick={() => handleSaveNotes(s.id)}
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                backgroundColor: '#111111',
                                color: '#FFFFFF',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                cursor: 'pointer',
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              style={{ fontSize: '0.7rem', color: '#77736C', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(s.id);
                              setTempNotes(s.notes || '');
                            }}
                            style={{
                              cursor: 'pointer',
                              color: s.notes ? '#111111' : 'var(--text-muted)',
                              fontStyle: s.notes ? 'normal' : 'italic',
                            }}
                            title="Click to edit notes"
                          >
                            {s.notes || '+ note'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FAF7F0',
              borderTop: '2px solid #111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Showing {signups.length} of {totalCount} total signups
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: '1px solid #111111',
                  backgroundColor: '#FFFFFF',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: page <= 1 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>

              <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 0.5rem' }}>
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: '1px solid #111111',
                  backgroundColor: '#FFFFFF',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: page >= totalPages ? 0.5 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
