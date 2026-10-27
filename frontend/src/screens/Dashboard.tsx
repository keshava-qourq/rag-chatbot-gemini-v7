// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, ChevronRight, Home, FileText, Upload, ArrowRight, AlertCircle } = Icons;

export default function Screen() {
  const navigate = useNavigate();
  const INK = '#0a0a0a';
  const ACCENT = '#1d3fff';
  const NEUTRAL = '#55575c';
  const BG = '#f4f4f0';
  const HEAD = '"Didot", "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, serif';
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const BORDER = '3px solid ' + INK;
  const SHADOW = '6px 6px 0 ' + INK;

  const now = Date.now();
  const SAMPLE_CHATS = [
    { id: 'sample-1', name: 'Lease agreement Q&A', last_message_at: new Date(now - 2 * 3600 * 1000).toISOString(), created_at: new Date(now - 5 * 86400000).toISOString() },
    { id: 'sample-2', name: 'Research notes', last_message_at: new Date(now - 26 * 3600 * 1000).toISOString(), created_at: new Date(now - 9 * 86400000).toISOString() },
    { id: 'sample-3', name: 'New chat 27 Oct 2026', last_message_at: null, created_at: new Date(now).toISOString() }
  ];
  const SAMPLE_DOCS = [
    { id: 'sample-d1', filename: 'lease-agreement.pdf', format: 'pdf', status: 'ready', chunk_count: 42, created_at: new Date(now - 1 * 86400000).toISOString() },
    { id: 'sample-d2', filename: 'research-notes.md', format: 'md', status: 'ready', chunk_count: 7, created_at: new Date(now - 4 * 86400000).toISOString() },
    { id: 'sample-d3', filename: 'scan-2026.pdf', format: 'pdf', status: 'failed', chunk_count: 0, created_at: new Date(now - 5 * 86400000).toISOString() }
  ];

  const [chats, setChats] = useState(SAMPLE_CHATS);
  const [docs, setDocs] = useState(SAMPLE_DOCS);
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cr, dr] = await Promise.all([
          fetch('/api/chats', { credentials: 'include' }),
          fetch('/api/documents', { credentials: 'include' })
        ]);
        if (cr.status === 401 || dr.status === 401) {
          if (!cancelled) navigate('login');
          return;
        }
        if (!cr.ok || !dr.ok) throw new Error('bad response');
        const cj = await cr.json();
        const dj = await dr.json();
        if (cancelled) return;
        const cl = Array.isArray(cj) ? cj : (cj.chats || []);
        const dl = Array.isArray(dj) ? dj : (dj.documents || []);
        setChats(cl);
        setDocs(dl);
        setOffline(false);
      } catch (e) {
        if (!cancelled) setOffline(true);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function remember(key, val) {
    try { window.sessionStorage.setItem(key, val); } catch (e) {}
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
  }

  function rel(iso) {
    if (!iso) return 'no messages yet';
    const t = new Date(iso).getTime();
    if (isNaN(t)) return 'no messages yet';
    const diff = Date.now() - t;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'last message just now';
    if (min < 60) return 'last message ' + min + ' minute' + (min === 1 ? '' : 's') + ' ago';
    const hr = Math.floor(min / 60);
    if (hr < 24) return 'last message ' + hr + ' hour' + (hr === 1 ? '' : 's') + ' ago';
    const days = Math.floor(hr / 24);
    if (days === 1) return 'last message yesterday';
    if (days < 30) return 'last message ' + days + ' days ago';
    return 'last message ' + fmtDate(iso);
  }

  function docMeta(d) {
    const fmt = String(d.format || (d.filename || '').split('.').pop() || '').toUpperCase();
    const parts = [fmt, d.status];
    if (d.status === 'ready') parts.push((d.chunk_count || 0) + ' passages');
    return parts.join(' · ');
  }

  const sortedChats = chats.slice().sort((a, b) => {
    const ma = a.last_message_at ? new Date(a.last_message_at).getTime() : null;
    const mb = b.last_message_at ? new Date(b.last_message_at).getTime() : null;
    if (ma !== null && mb !== null) return mb - ma;
    if (ma !== null) return -1;
    if (mb !== null) return 1;
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });
  const sortedDocs = docs.slice().sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  const shownChats = sortedChats.slice(0, 5);
  const shownDocs = sortedDocs.slice(0, 5);

  async function newChat() {
    if (creating) return;
    setCreating(true);
    setCreateError('');
    try {
      const r = await fetch('/api/chats', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (r.status === 401) { setCreating(false); navigate('login'); return; }
      if (r.ok) {
        const c = await r.json();
        if (c && c.id) remember('activeChatId', String(c.id));
      }
    } catch (e) {
      setCreateError('Could not create the chat on the server. Opening chat anyway.');
    }
    setCreating(false);
    navigate('chat-detail');
  }

  function openChat(c) {
    remember('activeChatId', String(c.id));
    navigate('chat-detail');
  }
  function openDoc(d) {
    remember('activeDocumentId', String(d.id));
    navigate('library');
  }

  const css = `
    .bs-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 32px; }
    .bs-c6 { grid-column: span 6; }
    .bs-c3 { grid-column: span 3; }
    .bs-c12 { grid-column: span 12; }
    .bs-btn { font-family: ${MONO}; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; font-size: 13px; border: ${BORDER}; box-shadow: ${SHADOW}; border-radius: 0; cursor: pointer; padding: 18px 20px; min-height: 56px; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; box-sizing: border-box; transition: transform .08s, box-shadow .08s; }
    .bs-btn:hover { transform: translate(3px, 3px); box-shadow: 3px 3px 0 ${INK}; }
    .bs-btn:active { transform: translate(6px, 6px); box-shadow: 0 0 0 ${INK}; }
    .bs-btn:disabled { opacity: .6; cursor: wait; }
    .bs-btn:focus-visible, .bs-row:focus-visible, .bs-link:focus-visible { outline: 3px solid ${ACCENT}; outline-offset: 3px; }
    .bs-row { display: flex; width: 100%; box-sizing: border-box; text-align: left; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 24px; background: transparent; border: 0; border-top: 1px dashed ${INK}; cursor: pointer; font-family: ${MONO}; color: ${INK}; min-height: 72px; }
    .bs-row:first-child { border-top: 0; }
    .bs-row:hover { background: ${INK}; color: ${BG}; }
    .bs-row:hover .bs-sub { color: ${BG}; }
    .bs-link { font-family: ${MONO}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; background: none; border: 0; border-bottom: 3px solid ${INK}; padding: 10px 0; cursor: pointer; color: ${INK}; display: inline-flex; align-items: center; gap: 10px; min-height: 44px; }
    .bs-link:hover { color: ${ACCENT}; border-color: ${ACCENT}; }
    @media (max-width: 860px) {
      .bs-grid { gap: 24px; }
      .bs-c6, .bs-c3 { grid-column: span 12; }
    }
    @media (min-width: 861px) and (max-width: 1100px) {
      .bs-c3 { grid-column: span 6; }
      .bs-title { grid-column: span 12 !important; }
    }
  `;

  const label = { fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: NEUTRAL };
  const panel = { border: BORDER, boxShadow: SHADOW, background: BG };
  const panelHead = { padding: '24px 24px 20px', borderBottom: BORDER };
  const h2 = { fontFamily: HEAD, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, lineHeight: 1.05, margin: '8px 0 0', letterSpacing: '-0.01em', color: INK };

  function chatRow(c, wf) {
    if (!c) return null;
    return (
      <button type="button" key={c.id} className="bs-row" data-wf={wf} onClick={() => openChat(c)}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: HEAD, fontSize: 22, fontWeight: 700, lineHeight: 1.15, overflowWrap: 'anywhere' }}>{c.name}</span>
          <span className="bs-sub" style={{ display: 'block', marginTop: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: NEUTRAL }}>{rel(c.last_message_at)}</span>
        </span>
        <ChevronRight size={22} />
      </button>
    );
  }

  function docRow(d, wf) {
    if (!d) return null;
    return (
      <button type="button" key={d.id} className="bs-row" data-wf={wf} onClick={() => openDoc(d)}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} />
            <span style={{ fontSize: 15, fontWeight: 700, overflowWrap: 'anywhere' }}>{d.filename}</span>
          </span>
          <span className="bs-sub" style={{ display: 'block', marginTop: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: NEUTRAL }}>
            {docMeta(d)}{d.created_at ? ' · ' + fmtDate(d.created_at) : ''}
          </span>
        </span>
        <ChevronRight size={22} />
      </button>
    );
  }

  return (
    <div style={{ background: BG, color: INK, fontFamily: MONO, padding: 'clamp(20px, 4vw, 56px)', minHeight: '100%', boxSizing: 'border-box' }}>
      <style>{css}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Row 1 */}
        <div className="bs-grid" style={{ alignItems: 'end' }}>
          <div className="bs-c6 bs-title" data-wf="b-0-0">
            <div style={label}>Nº 01 — Home</div>
            <h1 style={{ fontFamily: HEAD, fontSize: 'clamp(56px, 10vw, 120px)', fontWeight: 900, lineHeight: 0.92, margin: '12px 0 0', letterSpacing: '-0.03em', color: INK }}>Dashboard</h1>
          </div>
          <div className="bs-c3">
            <button type="button" className="bs-btn" data-wf="b-0-1" disabled={creating} onClick={newChat} style={{ background: ACCENT, color: '#fff' }}>
              <Plus size={18} /> New chat
            </button>
          </div>
          <div className="bs-c3">
            <button type="button" className="bs-btn" data-wf="b-0-2" onClick={() => navigate('library')} style={{ background: BG, color: INK }}>
              <Plus size={18} /> Upload document
            </button>
          </div>
        </div>

        {(offline || createError) && (
          <div role="status" style={{ border: '3px dashed ' + INK, padding: '14px 18px', fontSize: 13, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertCircle size={18} />
            <span>{createError || 'Could not reach the server. Showing sample entries.'}</span>
          </div>
        )}

        {/* Row 2 */}
        <div className="bs-grid" style={{ alignItems: 'start' }}>
          <section className="bs-c6" data-wf="b-1-0" style={panel} aria-labelledby="chats-h">
            <div style={panelHead}>
              <div style={label}>§ 02 — Conversations</div>
              <h2 id="chats-h" style={h2}>Your chats ({chats.length})</h2>
            </div>
            <div>
              {!loaded && chats.length === 0 && (
                <div style={{ padding: 24, ...label }}>Loading…</div>
              )}
              {loaded && chats.length === 0 && (
                <div style={{ padding: 24, fontSize: 14, color: NEUTRAL }}>No chats yet. Start one with “New chat”.</div>
              )}
              {chatRow(shownChats[0], 'i-1-0-0')}
              {chatRow(shownChats[1], 'i-1-0-1')}
              {chatRow(shownChats[2], 'i-1-0-2')}
              {shownChats.slice(3).map((c) => chatRow(c, undefined))}
            </div>
          </section>

          <section className="bs-c6" data-wf="b-1-1" style={panel} aria-labelledby="lib-h">
            <div style={panelHead}>
              <div style={label}>§ 03 — Documents</div>
              <h2 id="lib-h" style={h2}>Your library ({docs.length})</h2>
            </div>
            <div>
              {!loaded && docs.length === 0 && (
                <div style={{ padding: 24, ...label }}>Loading…</div>
              )}
              {loaded && docs.length === 0 && (
                <div style={{ padding: 24, fontSize: 14, color: NEUTRAL }}>No documents yet. Upload a PDF, .txt or .md file.</div>
              )}
              {docRow(shownDocs[0], 'i-1-1-0')}
              {docRow(shownDocs[1], 'i-1-1-1')}
              {docRow(shownDocs[2], 'i-1-1-2')}
              {shownDocs.slice(3).map((d) => docRow(d, undefined))}
            </div>
          </section>
        </div>

        {/* Row 3 */}
        <div className="bs-grid" style={{ borderTop: '3px solid ' + INK, paddingTop: 24 }}>
          <div className="bs-c6">
            <button type="button" className="bs-link" data-wf="b-2-0" onClick={() => navigate('chat-detail')}>
              View all chats <ArrowRight size={18} />
            </button>
          </div>
          <div className="bs-c6">
            <button type="button" className="bs-link" data-wf="b-2-1" onClick={() => navigate('library')}>
              Go to document library <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Row 4 */}
        <section data-wf="b-3-0" style={{ border: BORDER, boxShadow: SHADOW, background: BG, padding: 'clamp(24px, 4vw, 48px)' }} aria-labelledby="start-h">
          <div style={label}>§ 04 — Guide</div>
          <h2 id="start-h" style={{ ...h2, fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 28 }}>Get started</h2>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {[
              'Upload a PDF, .txt or .md document',
              'Create a chat',
              'Attach the document',
              'Ask your first question'
            ].map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 20, alignItems: 'baseline', padding: '16px 0', borderTop: '1px dashed ' + INK }}>
                <span style={{ fontFamily: HEAD, fontSize: 40, fontWeight: 900, lineHeight: 1, minWidth: 48 }}>{i + 1}.</span>
                <span style={{ fontSize: 16 }}>{t}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Row 5 */}
        <div className="bs-grid" style={{ paddingBottom: 24 }}>
          <div className="bs-c6">
            <button type="button" className="bs-btn" data-wf="b-4-0" onClick={() => navigate('library')} style={{ background: INK, color: BG }}>
              <Upload size={18} /> Upload your first document
            </button>
          </div>
          <div className="bs-c6">
            <button type="button" className="bs-btn" data-wf="b-4-1" onClick={() => navigate('chat-detail')} style={{ background: BG, color: INK }}>
              <Plus size={18} /> Start your first chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
