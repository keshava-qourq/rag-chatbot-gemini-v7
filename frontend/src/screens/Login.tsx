// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const PRODUCT = "RAG-chatbot-gemini-v7";
const SCREEN = "Log in";
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const thick = `3px solid ${brand.primaryColor}`;
  const hard = `8px 8px 0 ${brand.primaryColor}`;
  const field = { border: thick, borderRadius: brand.radius, height: 48, backgroundColor: "transparent", fontFamily: MONO };

  const submit = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk || password.length === 0) {
      setError(true);
      return;
    }
    setError(false);
    navigate('dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col px-12 py-8" style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}>
      <header className="flex items-center justify-between pb-4" style={{ borderBottom: thick, fontFamily: MONO }}>
        <p className="text-sm font-bold uppercase tracking-[0.25em]">{PRODUCT}</p>
        <p className="text-xs uppercase">Vol. 01 — Issue 10 — 2026</p>
      </header>

      <div className="grid flex-1 grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-14 py-10">
        <h1 data-wf="b-0-0" className="text-[120px] font-bold leading-[0.85] tracking-tight" style={{ fontFamily: brand.fontHeading }}>
          {SCREEN}
          <span style={{ color: brand.accentColor }}>.</span>
        </h1>

        <main className="space-y-6 p-8" style={{ border: thick, boxShadow: hard, borderRadius: brand.radius, backgroundColor: brand.backgroundColor }}>
          <form
            data-wf="b-1-0"
            noValidate
            className="space-y-6"
            onSubmit={(e) => { e.preventDefault(); submit(); }}
          >
            <h2 className="text-2xl font-bold" style={{ fontFamily: brand.fontHeading }}>Sign in to your account</h2>
            <div className="space-y-2">
              <label htmlFor="ed-email" className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>01 / Email address</label>
              <input data-wf="i-1-0-0" id="ed-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 text-sm outline-none" style={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="ed-password" className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>02 / Password</label>
              <input data-wf="i-1-0-1" id="ed-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 text-sm outline-none" style={field} />
            </div>
          </form>

          <button
            data-wf="b-2-0"
            type="button"
            onClick={() => navigate('dashboard')}
            className="h-14 w-full text-sm font-bold uppercase tracking-[0.25em] transition-transform active:translate-x-1 active:translate-y-1"
            style={{ backgroundColor: brand.primaryColor, color: brand.backgroundColor, border: thick, borderRadius: brand.radius, boxShadow: `4px 4px 0 ${brand.accentColor}`, fontFamily: MONO }}
          >
            Log in
          </button>

          <p
            data-wf="b-3-0"
            role="alert"
            className="text-xs font-bold uppercase"
            style={{ fontFamily: MONO, color: brand.accentColor, visibility: error ? "visible" : "hidden" }}
          >
            Email or password is incorrect
          </p>

          <p data-wf="b-4-0" className="text-xs leading-relaxed" style={{ fontFamily: MONO, color: brand.neutralColor, borderTop: `1px dashed ${brand.primaryColor}`, paddingTop: 16 }}>
            Password recovery requires being signed in: change your password from Account settings. No reset emails are sent in this version.
          </p>

          <p className="text-xs uppercase" style={{ fontFamily: MONO }}>
            <button data-wf="b-5-0" type="button" onClick={() => navigate('signup')} className="font-bold underline underline-offset-4">
              New here? Create an account
            </button>
          </p>
        </main>
      </div>

      <footer className="flex justify-between pt-3 text-xs uppercase" style={{ borderTop: thick, fontFamily: MONO }}>
        <span>© {PRODUCT}</span>
        <span>Privacy · Terms · Help</span>
      </footer>
    </div>
  );
}
