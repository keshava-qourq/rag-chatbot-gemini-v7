// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check } = Icons;

export default function Screen() {
  const navigate = useNavigate();
  const { useState } = React;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [taken, setTaken] = useState(false);
  const [busy, setBusy] = useState(false);

  const INK = '#0a0a0a';
  const ACCENT = '#1d3fff';
  const NEUTRAL = '#55575c';
  const BG = '#f4f4f0';
  const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const serif = '"Didot", "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, serif';

  const labelStyle = {
    display: 'block',
    fontFamily: mono,
    fontSize: 12,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: INK,
    marginBottom: 10,
  };
  const inputStyle = (bad) => ({
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: mono,
    fontSize: 16,
    color: INK,
    background: '#fff',
    border: `3px solid ${bad ? ACCENT : INK}`,
    borderRadius: 0,
    padding: '16px 14px',
    outline: 'none',
    minHeight: 54,
  });
  const errStyle = {
    fontFamily: mono,
    fontSize: 13,
    color: ACCENT,
    fontWeight: 700,
    marginTop: 8,
    display: 'block',
  };

  async function submit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (busy) return;
    setFormError('');
    setTaken(false);
    const trimmed = email.trim();
    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Email address: enter a valid email address.');
      ok = false;
    } else setEmailError('');
    if (password.length < 8) {
      setPasswordError('Password: must be at least 8 characters.');
      ok = false;
    } else setPasswordError('');
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: trimmed, password }),
      });
      if (res.status === 409) {
        setTaken(true);
      } else if (res.status === 400 || res.status === 422) {
        let data = {};
        try { data = await res.json(); } catch (_) {}
        const f = data && (data.field || (data.errors && Object.keys(data.errors)[0]));
        if (f === 'email') setEmailError('Email address: enter a valid email address.');
        else if (f === 'password') setPasswordError('Password: must be at least 8 characters.');
        else setFormError('We could not create your account. Check the fields and try again.');
      } else if (res.ok) {
        navigate('dashboard');
      } else {
        setFormError('Something went wrong creating your account. Please try again.');
      }
    } catch (_) {
      setFormError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        color: INK,
        fontFamily: mono,
        padding: 'clamp(20px, 5vw, 64px)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `3px solid ${INK}`,
            borderBottom: `1px dashed ${INK}`,
            padding: '10px 0',
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(24px, 5vw, 48px)',
          }}
        >
          <span>No. 01 — New account</span>
          <span style={{ color: ACCENT, fontWeight: 700 }}>Sign up</span>
        </div>

        <div data-wf="b-0-0" style={{ marginBottom: 'clamp(28px, 5vw, 56px)' }}>
          <h1
            style={{
              fontFamily: serif,
              fontWeight: 900,
              fontSize: 'clamp(48px, 11vw, 104px)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              margin: 0,
              color: INK,
            }}
          >
            Create your account
          </h1>
        </div>

        <form
          id="signup-form"
          data-wf="b-1-0"
          onSubmit={submit}
          noValidate
          style={{
            background: '#fff',
            border: `3px solid ${INK}`,
            boxShadow: `8px 8px 0 ${INK}`,
            padding: 'clamp(20px, 4vw, 40px)',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              borderBottom: `3px solid ${INK}`,
              paddingBottom: 14,
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, letterSpacing: '0.12em' }}>01</span>
            <h2 style={{ fontFamily: serif, fontSize: 34, fontWeight: 800, margin: 0, lineHeight: 1 }}>
              Sign up
            </h2>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label htmlFor="signup-email" style={labelStyle}>Email address</label>
            <input
              id="signup-email"
              data-wf="i-1-0-0"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setTaken(false); }}
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              style={inputStyle(!!emailError)}
            />
            {emailError && <span role="alert" style={errStyle}>{emailError}</span>}
          </div>

          <div>
            <label htmlFor="signup-password" style={labelStyle}>Password (at least 8 characters)</label>
            <input
              id="signup-password"
              data-wf="i-1-0-1"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!passwordError}
              style={inputStyle(!!passwordError)}
            />
            {passwordError && <span role="alert" style={errStyle}>{passwordError}</span>}
          </div>

          {formError && (
            <div role="alert" style={{ ...errStyle, marginTop: 20 }}>{formError}</div>
          )}
        </form>

        <button
          data-wf="b-2-0"
          type="submit"
          form="signup-form"
          disabled={busy}
          onClick={submit}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: INK,
            color: BG,
            border: `3px solid ${INK}`,
            borderRadius: 0,
            boxShadow: `6px 6px 0 ${ACCENT}`,
            fontFamily: mono,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '20px 24px',
            minHeight: 60,
            cursor: busy ? 'wait' : 'pointer',
            opacity: busy ? 0.7 : 1,
            marginBottom: 32,
          }}
        >
          {busy ? 'Creating…' : 'Create account'}
        </button>

        <div
          data-wf="b-3-0"
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: NEUTRAL,
            borderTop: `1px dashed ${INK}`,
            paddingTop: 16,
            marginBottom: 24,
          }}
        >
          Enter a valid email address · Password must be at least 8 characters
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '8fr 4fr',
            gap: 16,
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div
            data-wf="b-4-0"
            role={taken ? 'alert' : undefined}
            style={{
              fontSize: 14,
              fontWeight: taken ? 700 : 400,
              color: taken ? ACCENT : NEUTRAL,
              border: taken ? `3px solid ${ACCENT}` : '3px solid transparent',
              padding: '10px 12px',
              lineHeight: 1.5,
            }}
          >
            {taken ? 'That email address is already registered.' : 'Already registered? Your account is waiting.'}
          </div>
          <div style={{ textAlign: 'right' }}>
            <a
              data-wf="b-4-1"
              href="#login"
              onClick={(e) => { e.preventDefault(); navigate('login'); }}
              style={{
                color: INK,
                fontFamily: mono,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'underline',
                textUnderlineOffset: 5,
                textDecorationThickness: 3,
                cursor: 'pointer',
              }}
            >
              Log in instead
            </a>
          </div>
        </div>

        <div
          data-wf="b-5-0"
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: NEUTRAL,
            borderTop: `3px solid ${INK}`,
            paddingTop: 16,
          }}
        >
          No email verification is required — you are signed in straight away.
        </div>
      </div>
    </div>
  );
}
