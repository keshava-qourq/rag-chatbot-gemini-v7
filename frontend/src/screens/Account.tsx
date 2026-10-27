// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { useNavigate } from "@/lib/navigate";

export default function Screen(props) {
  const navigate = useNavigate();
  const nav = (route) => {
    if (props && typeof props.navigate === 'function') return props.navigate(route);
    if (typeof navigate === 'function') return navigate(route);
  };

  const INK = '#0a0a0a';
  const ACCENT = '#1d3fff';
  const NEUTRAL = '#55575c';
  const BG = '#f4f4f0';
  const HEAD = '"Didot", "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, serif';
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

  const [me, setMe] = React.useState(null);
  const [meState, setMeState] = React.useState('loading');
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState({ kind: 'idle', text: '' });
  const [busy, setBusy] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => {
        if (r.status === 401) { nav('login'); throw new Error('unauth'); }
        if (!r.ok) throw new Error('fail');
        return r.json();
      })
      .then((d) => { if (alive) { setMe(d && d.user ? d.user : d); setMeState('ready'); } })
      .catch((e) => { if (alive && e.message !== 'unauth') setMeState('error'); });
    return () => { alive = false; };
  }, []);

  const fmt = (v) => {
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  };

  const submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (busy) return;
    const errs = {};
    if (!current) errs.current = 'Enter your current password.';
    if (next.length < 8) errs.next = 'New password must be at least 8 characters.';
    if (confirm !== next) errs.confirm = 'Confirmation does not match the new password.';
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ kind: 'idle', text: '' });
      return;
    }
    setBusy(true);
    setStatus({ kind: 'idle', text: '' });
    try {
      const r = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      if (r.ok) {
        setStatus({ kind: 'ok', text: 'Your password was changed' });
        setCurrent(''); setNext(''); setConfirm('');
        setMe((m) => (m ? { ...m, password_changed_at: new Date().toISOString() } : m));
      } else if (r.status === 401) {
        nav('login');
      } else if (r.status === 400 || r.status === 403 || r.status === 422) {
        let body = null;
        try { body = await r.json(); } catch (_) {}
        if (body && body.field === 'new_password') {
          setErrors({ next: 'New password must be at least 8 characters.' });
        } else {
          setStatus({ kind: 'error', text: 'Current password is wrong — your existing password is still in force' });
        }
      } else {
        setStatus({ kind: 'error', text: 'Something went wrong — your existing password is still in force. Please try again.' });
      }
    } catch (_) {
      setStatus({ kind: 'error', text: 'Could not reach the server — your existing password is still in force. Please try again.' });
    }
    setBusy(false);
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch (_) {}
    nav('login');
  };

  const box = { border: '3px solid ' + INK, boxShadow: '6px 6px 0 ' + INK, background: '#fff', padding: 32 };
  const label = { display: 'block', fontFamily: MONO, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: INK, marginBottom: 8 };
  const input = (bad) => ({
    width: '100%', boxSizing: 'border-box', fontFamily: MONO, fontSize: 15, padding: '14px 14px',
    border: '3px solid ' + (bad ? ACCENT : INK), borderRadius: 0, background: BG, color: INK, outline: 'none',
  });
  const errText = { fontFamily: MONO, fontSize: 12, color: ACCENT, marginTop: 8, fontWeight: 700 };
  const kicker = { fontFamily: MONO, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: NEUTRAL };

  const created = me ? fmt(me.created_at) : null;
  const changed = me ? fmt(me.password_changed_at) : null;
  const cardLabel = 'Signed in as ' + (meState === 'ready' && me && me.email ? me.email : 'alex@example.com');

  return (
    <div style={{ background: BG, color: INK, fontFamily: MONO, padding: '48px 24px 96px', minHeight: '100%' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

        <div data-wf="b-0-0">
          <div style={kicker}>Account · 01</div>
          <h1 style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 'clamp(44px, 9vw, 92px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: '12px 0 0', borderBottom: '3px solid ' + INK, paddingBottom: 20 }}>
            Account settings
          </h1>
        </div>

        <div data-wf="b-1-0" role="group" aria-label={cardLabel} style={box}>
          <div style={{ ...kicker, marginBottom: 14, borderBottom: '1px dashed ' + INK, paddingBottom: 10 }}>01 — Identity</div>
          {meState === 'loading' && <div style={{ fontSize: 14 }}>Loading your account…</div>}
          {meState === 'error' && <div style={{ fontSize: 14, color: ACCENT, fontWeight: 700 }}>Could not load your account details. Refresh to try again.</div>}
          {meState === 'ready' && me && (
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8 }}>
              Signed in as <strong style={{ fontFamily: HEAD, fontSize: 24, color: ACCENT, wordBreak: 'break-all' }}>{me.email}</strong>
              {' — '}account created <strong>{created || '—'}</strong>
              {' · '}password last changed <strong>{changed || 'never'}</strong>
            </p>
          )}
        </div>

        <form data-wf="b-2-0" onSubmit={submit} noValidate style={box}>
          <div style={{ ...kicker, marginBottom: 14, borderBottom: '1px dashed ' + INK, paddingBottom: 10 }}>02 — Credentials</div>
          <h2 style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 40, lineHeight: 1, margin: '0 0 8px' }}>Change password</h2>
          <p style={{ margin: '0 0 28px', fontSize: 13, color: NEUTRAL, lineHeight: 1.6 }}>
            Confirm your current password first. There is no email reset, so keep your new password safe.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div>
              <label htmlFor="acc-current" style={label}>Current password</label>
              <input id="acc-current" data-wf="i-2-0-0" type="password" autoComplete="current-password"
                value={current} onChange={(e) => setCurrent(e.target.value)} style={input(errors.current)}
                aria-invalid={!!errors.current} />
              {errors.current && <div style={errText}>{errors.current}</div>}
            </div>
            <div>
              <label htmlFor="acc-new" style={label}>New password (at least 8 characters)</label>
              <input id="acc-new" data-wf="i-2-0-1" type="password" autoComplete="new-password"
                value={next} onChange={(e) => setNext(e.target.value)} style={input(errors.next)}
                aria-invalid={!!errors.next} />
              {errors.next && <div style={errText}>{errors.next}</div>}
            </div>
            <div>
              <label htmlFor="acc-confirm" style={label}>Confirm new password</label>
              <input id="acc-confirm" data-wf="i-2-0-2" type="password" autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} style={input(errors.confirm)}
                aria-invalid={!!errors.confirm} />
              {errors.confirm && <div style={errText}>{errors.confirm}</div>}
            </div>
          </div>
        </form>

        <button data-wf="b-3-0" type="button" onClick={submit} disabled={busy}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '20px 24px', fontFamily: MONO, fontSize: 15, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: ACCENT,
            border: '3px solid ' + INK, borderRadius: 0, boxShadow: '6px 6px 0 ' + INK,
            cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1,
          }}>
          {busy ? 'Updating…' : 'Update password'}
        </button>

        <div data-wf="b-4-0" role="status" aria-live="polite"
          style={{
            border: '3px ' + (status.kind === 'idle' ? 'dashed' : 'solid') + ' ' + INK,
            padding: '20px 24px', fontSize: 14, lineHeight: 1.6, fontWeight: status.kind === 'idle' ? 400 : 700,
            color: status.kind === 'idle' ? NEUTRAL : INK,
            background: status.kind === 'ok' ? '#fff' : 'transparent',
            boxShadow: status.kind === 'idle' ? 'none' : '6px 6px 0 ' + (status.kind === 'error' ? ACCENT : INK),
            borderColor: status.kind === 'error' ? ACCENT : INK,
          }}>
          {status.kind === 'idle' && 'No changes made yet. Result of your password update appears here.'}
          {status.kind === 'ok' && '✓ ' + status.text}
          {status.kind === 'error' && '✕ ' + status.text}
        </div>

        <div style={{ borderTop: '1px dashed ' + INK, paddingTop: 32 }}>
          <div style={{ ...kicker, marginBottom: 14 }}>03 — Session</div>
          <button data-wf="b-5-0" type="button" onClick={logout} disabled={loggingOut}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '20px 24px', fontFamily: MONO, fontSize: 15, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: INK, background: '#fff',
              border: '3px solid ' + INK, borderRadius: 0, boxShadow: '6px 6px 0 ' + INK,
              cursor: loggingOut ? 'wait' : 'pointer',
            }}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
