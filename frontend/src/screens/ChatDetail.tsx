// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Check, X, ChevronRight, ChevronDown, Menu, FileText, Trash, Edit, Upload, ArrowLeft, ArrowRight, AlertCircle } = Icons;

export default function Screen(props) {
  const navigate = useNavigate();
  const { useState, useEffect, useRef } = React;

  const INK = '#0a0a0a';
  const PAPER = '#f4f4f0';
  const ACCENT = '#1d3fff';
  const NEUTRAL = '#55575c';
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const SERIF = '"Didot", "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, serif';

  const nav = (r) => {
    const fn = props && props.navigate;
    if (typeof fn === 'function') fn(r);
    else if (typeof navigate === 'function') navigate(r);
  };

  const initialId = () => {
    const p = props || {};
    const v = p.chatId || p.id || (p.params && (p.params.id || p.params.chatId)) ||
      (p.route && p.route.params && p.route.params.id);
    if (v) return String(v);
    try {
      const u = new URL(window.location.href);
      const q = u.searchParams.get('chat') || u.searchParams.get('id');
      if (q) return q;
      const h = u.hash.match(/chat[=/]([\w-]+)/);
      if (h) return h[1];
    } catch (e) {}
    return null;
  };

  const wide = () => (typeof window === 'undefined' ? true : window.innerWidth >= 900);

  const [chats, setChats] = useState([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [chatId, setChatId] = useState(initialId);
  const [chat, setChat] = useState(null);
  const [docs, setDocs] = useState([]);
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameFail, setNameFail] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteErr, setDeleteErr] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(wide);
  const [attachedOpen, setAttachedOpen] = useState(wide);
  const [isWide, setIsWide] = useState(wide);
  const [input, setInput] = useState('');
  const [stream, setStream] = useState(null);
  const [localFail, setLocalFail] = useState(null);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [busyDoc, setBusyDoc] = useState('');
  const [attachErr, setAttachErr] = useState('');
  const [noDocsPrompt, setNoDocsPrompt] = useState(false);

  const inputRef = useRef(null);
  const nameRef = useRef(null);
  const currentId = useRef(chatId);
  currentId.current = chatId;

  const api = async (method, path, body) => {
    const res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { nav('login'); throw new Error('auth'); }
    let data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      const err = new Error((data && (data.error || data.message || data.detail)) || 'Request failed');
      err.status = res.status;
      throw err;
    }
    return data;
  };

  const asList = (d, key) => (Array.isArray(d) ? d : (d && Array.isArray(d[key]) ? d[key] : []));

  const loadChats = async () => {
    try {
      const d = await api('GET', '/api/chats');
      const list = asList(d, 'chats');
      setChats(list);
      return list;
    } catch (e) { return []; }
    finally { setChatsLoaded(true); }
  };

  const loadDocs = async () => {
    try {
      const d = await api('GET', '/api/documents');
      setDocs(asList(d, 'documents'));
    } catch (e) {}
    finally { setDocsLoaded(true); }
  };

  const loadChat = async (id, quiet) => {
    if (!id) return;
    if (!quiet) setLoading(true);
    try {
      const [c, m] = await Promise.all([
        api('GET', '/api/chats/' + id),
        api('GET', '/api/chats/' + id + '/messages'),
      ]);
      if (currentId.current !== id) return;
      const cc = (c && c.chat) || c;
      setChat(cc);
      setNameInput(cc && cc.name ? cc.name : '');
      setMessages(asList(m, 'messages'));
      setLoadError('');
    } catch (e) {
      if (currentId.current !== id) return;
      if (e.message !== 'auth') {
        setLoadError(e.status === 404 || e.status === 403 ? 'This chat was not found.' : 'This chat could not be loaded. Please try again.');
      }
    } finally {
      if (currentId.current === id) setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const list = await loadChats();
      loadDocs();
      if (!currentId.current) {
        if (list.length) setChatId(String(list[0].id));
        else setLoading(false);
      }
    })();
    const onResize = () => setIsWide(wide());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setChat(null);
    setMessages([]);
    setStream(null);
    setLocalFail(null);
    setSelectedMsgId(null);
    setExpanded({});
    setNameError(false);
    setNameFail('');
    setNoDocsPrompt(false);
    if (chatId) loadChat(String(chatId));
    // eslint-disable-next-line
  }, [chatId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setShowAttach(false); setShowDelete(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ---------- derived ----------
  const attachedRaw = (chat && (chat.documents || chat.attached_documents)) || [];
  const attached = attachedRaw.map((d) => {
    const id = d.document_id || d.id;
    const lib = docs.find((x) => x.id === id) || {};
    return Object.assign({}, lib, d, { id });
  });
  const attachedIds = attached.map((d) => d.id);
  const readyAttached = attached.filter((d) => d.status === 'ready');

  const visibleMessages = messages.filter((m) => !(stream && stream.hideId === m.id));
  const lastMsg = messages.length ? messages[messages.length - 1] : null;

  let failedInfo = null;
  if (!stream) {
    if (localFail) failedInfo = { local: true, question: localFail.question };
    else if (lastMsg) {
      if (lastMsg.role === 'assistant' && lastMsg.turn_status && lastMsg.turn_status !== 'complete' && lastMsg.turn_status !== 'completed') {
        failedInfo = { id: lastMsg.id };
      } else if (lastMsg.role === 'user') {
        failedInfo = { id: lastMsg.id };
      }
    }
  }
  const isFailedAssistant = (m) => m.role === 'assistant' && m.turn_status && m.turn_status !== 'complete' && m.turn_status !== 'completed';

  const lastAssistant = (() => {
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === 'assistant') return messages[i];
    return null;
  })();
  const showNotInDocs = !stream && !failedInfo && lastMsg && lastMsg.role === 'assistant' &&
    /not/i.test(String(lastMsg.answer_kind || '')) && !(lastMsg.citations && lastMsg.citations.length);
  const isNotInDocsMsg = (m) => m === lastMsg && showNotInDocs;

  const citeMsg = (() => {
    const withC = (m) => m.role === 'assistant' && m.citations && m.citations.length && !isFailedAssistant(m);
    if (selectedMsgId) {
      const s = messages.find((m) => m.id === selectedMsgId);
      if (s && withC(s)) return s;
    }
    for (let i = messages.length - 1; i >= 0; i--) if (withC(messages[i])) return messages[i];
    return null;
  })();

  // ---------- actions ----------
  const refreshAfter = async () => {
    setSelectedMsgId(null);
    await Promise.all([loadChat(String(currentId.current), true), loadChats()]);
  };

  const runTurn = async (question, request, opts) => {
    setNoDocsPrompt(false);
    setLocalFail(null);
    setStream({ question, text: '', phase: 'searching', hideId: opts && opts.hideId, showUser: !(opts && opts.retry) });
    const push = (t) => setStream((s) => (s ? Object.assign({}, s, { text: s.text + t, phase: 'streaming' }) : s));
    const handle = (line) => {
      if (!line || !line.trim()) return;
      const t = line.trim();
      if (t.startsWith(':') || t.startsWith('event:') || t.startsWith('id:') || t.startsWith('retry:')) return;
      const raw = line.startsWith('data:') ? line.slice(5).replace(/^ /, '') : line;
      if (raw.trim() === '[DONE]') return;
      let o;
      try { o = JSON.parse(raw); } catch (e) { push(raw); return; }
      if (typeof o === 'string') { push(o); return; }
      if (!o || typeof o !== 'object') return;
      if (o.error || o.type === 'error') throw new Error(String(o.error || o.message || 'error'));
      const tok = o.token !== undefined ? o.token : o.delta !== undefined ? o.delta : o.text !== undefined ? o.text :
        (o.type === 'token' || o.type === 'delta') ? o.content : undefined;
      if (typeof tok === 'string') push(tok);
    };
    try {
      const res = await request();
      if (res.status === 401) { nav('login'); throw new Error('auth'); }
      if (!res.ok) throw new Error('failed');
      const ct = res.headers.get('content-type') || '';
      if (!res.body || ct.includes('application/json')) {
        let d = null;
        try { d = await res.json(); } catch (e) {}
        if (d && d.error) throw new Error(String(d.error));
      } else {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = '';
        const structured = ct.includes('event-stream') || ct.includes('ndjson');
        for (;;) {
          const r = await reader.read();
          if (r.done) break;
          buf += dec.decode(r.value, { stream: true });
          if (structured) {
            let i;
            while ((i = buf.indexOf('\n')) >= 0) { handle(buf.slice(0, i)); buf = buf.slice(i + 1); }
          } else { push(buf); buf = ''; }
        }
        if (structured && buf.trim()) handle(buf);
      }
    } catch (e) {
      if (e.message !== 'auth') setLocalFail({ question, serverTurn: !!(opts && opts.retry) });
    } finally {
      setStream(null);
      await refreshAfter();
    }
  };

  const ask = async (text) => {
    const q = (text || '').trim();
    if (!q) { if (inputRef.current) inputRef.current.focus(); return; }
    if (stream || !chatId) return;
    if (!readyAttached.length) { setNoDocsPrompt(true); return; }
    setInput('');
    await runTurn(q, () => fetch('/api/chats/' + chatId + '/messages', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ content: q }),
    }));
    if (inputRef.current) inputRef.current.focus();
  };

  const retryTurn = async () => {
    if (!failedInfo || stream) return;
    if (!readyAttached.length) { setNoDocsPrompt(true); return; }
    if (failedInfo.local) {
      await ask(failedInfo.question);
      return;
    }
    const id = failedInfo.id;
    const target = messages.find((m) => m.id === id);
    let question = '';
    if (target) {
      if (target.role === 'user') question = target.content;
      else {
        const parent = messages.find((m) => m.id === target.reply_to_id);
        if (parent) question = parent.content;
        else {
          const idx = messages.indexOf(target);
          for (let i = idx - 1; i >= 0; i--) if (messages[i].role === 'user') { question = messages[i].content; break; }
        }
      }
    }
    await runTurn(question, () => fetch('/api/chats/' + chatId + '/messages/' + id + '/retry', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { Accept: 'text/event-stream' },
    }), { retry: true, hideId: target && target.role === 'assistant' ? target.id : undefined });
  };

  const newChat = async () => {
    try {
      const name = 'New chat · ' + new Date().toISOString().slice(0, 10);
      const c = await api('POST', '/api/chats', { name });
      const cc = (c && c.chat) || c;
      await loadChats();
      if (cc && cc.id) { setChatId(String(cc.id)); if (!isWide) setSidebarOpen(false); }
    } catch (e) {}
  };

  const saveName = async () => {
    const name = nameInput.trim();
    setNameFail('');
    if (!name) { setNameError(true); return; }
    setNameError(false);
    try {
      await api('PATCH', '/api/chats/' + chatId, { name });
      setChat((c) => Object.assign({}, c, { name }));
      setChats((l) => l.map((x) => (String(x.id) === String(chatId) ? Object.assign({}, x, { name }) : x)));
      setNameInput(name);
    } catch (e) {
      if (e.message !== 'auth') setNameFail('The name could not be saved. Please try again.');
    }
  };

  const toggleAttach = async (doc) => {
    if (busyDoc) return;
    setBusyDoc(doc.id);
    setAttachErr('');
    try {
      const isOn = attachedIds.includes(doc.id);
      await api(isOn ? 'DELETE' : 'PUT', '/api/chats/' + chatId + '/documents/' + doc.id);
      await loadChat(String(chatId), true);
      setNoDocsPrompt(false);
    } catch (e) {
      if (e.message !== 'auth') setAttachErr('Could not update this attachment. Please try again.');
    } finally { setBusyDoc(''); }
  };

  const detach = async (doc) => {
    if (busyDoc) return;
    setBusyDoc(doc.id);
    try {
      await api('DELETE', '/api/chats/' + chatId + '/documents/' + doc.id);
      await loadChat(String(chatId), true);
    } catch (e) {} finally { setBusyDoc(''); }
  };

  const deleteChat = async () => {
    setDeleting(true);
    setDeleteErr('');
    try {
      await api('DELETE', '/api/chats/' + chatId);
      setShowDelete(false);
      nav('dashboard');
    } catch (e) {
      if (e.message !== 'auth') setDeleteErr('The chat could not be deleted. Please try again.');
    } finally { setDeleting(false); }
  };

  const openAttach = () => { setAttachErr(''); setShowAttach(true); loadDocs(); };

  const rel = (iso) => {
    if (!iso) return 'no messages';
    const t = new Date(iso).getTime();
    if (isNaN(t)) return '';
    const s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 172800) return 'yesterday';
    return Math.floor(s / 86400) + 'd ago';
  };

  const isDeletedCite = (c) => !c.document_id || c.document_deleted;
  const citeLoc = (c) => (c.page_number !== null && c.page_number !== undefined ? 'page ' + c.page_number : 'chunk ' + c.chunk_index);
  const citeKey = (m, c, i) => m.id + ':' + (c.ordinal !== undefined && c.ordinal !== null ? c.ordinal : i + 1);

  const openCite = (m, ord) => {
    setSelectedMsgId(m.id);
    const cs = m.citations || [];
    const idx = cs.findIndex((c, i) => (c.ordinal !== undefined && c.ordinal !== null ? c.ordinal : i + 1) === ord);
    if (idx >= 0) setExpanded((e) => Object.assign({}, e, { [citeKey(m, cs[idx], idx)]: true }));
  };

  const renderContent = (m) => {
    const parts = String(m.content || '').split(/(\[\d+\])/g);
    return parts.map((p, i) => {
      const mm = p.match(/^\[(\d+)\]$/);
      if (mm && m.citations && m.citations.length) {
        const ord = parseInt(mm[1], 10);
        return (
          <button key={i} type="button" onClick={() => openCite(m, ord)} aria-label={'Show citation ' + ord}
            style={{ font: 'inherit', fontWeight: 700, color: ACCENT, background: 'none', border: 'none', borderBottom: '2px solid ' + ACCENT, padding: '0 2px', margin: '0 1px', cursor: 'pointer' }}>
            {p}
          </button>
        );
      }
      return <span key={i}>{p}</span>;
    });
  };

  // ---------- styles ----------
  const css = `
  .cd-root{font-family:${MONO};color:${INK};max-width:1200px;margin:0 auto;padding:32px 20px 48px;display:flex;flex-direction:column;gap:28px;box-sizing:border-box}
  .cd-root *{box-sizing:border-box}
  .cd-grid{display:grid;gap:20px;align-items:stretch}
  .cd-r1{grid-template-columns:2fr 5fr 2fr 3fr;align-items:center}
  .cd-r2{grid-template-columns:9fr 3fr}
  .cd-r4{grid-template-columns:3fr 9fr;align-items:start}
  .cd-r4.nosb{grid-template-columns:1fr}
  .cd-r8,.cd-r9{grid-template-columns:8fr 4fr}
  .cd-r10{grid-template-columns:9fr 3fr}
  .cd-box{border:3px solid ${INK};box-shadow:6px 6px 0 ${INK};background:${PAPER};padding:24px}
  .cd-btn{font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:3px solid ${INK};background:${PAPER};color:${INK};padding:10px 16px;min-height:48px;cursor:pointer;box-shadow:4px 4px 0 ${INK};display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:0;text-align:center;width:100%}
  .cd-btn:hover:not(:disabled){transform:translate(2px,2px);box-shadow:2px 2px 0 ${INK}}
  .cd-btn:disabled{opacity:.45;cursor:not-allowed}
  .cd-btn.pri{background:${INK};color:${PAPER}}
  .cd-btn.acc{background:${ACCENT};color:#fff}
  .cd-btn.sm{min-height:44px;padding:6px 12px;font-size:12px;width:auto;box-shadow:3px 3px 0 ${INK}}
  .cd-btn:focus-visible,.cd-field:focus-visible,.cd-row:focus-visible{outline:3px solid ${ACCENT};outline-offset:3px}
  .cd-field{font-family:${MONO};font-size:16px;border:3px solid ${INK};background:#fff;color:${INK};padding:12px 14px;width:100%;min-height:48px;border-radius:0;resize:vertical;display:block}
  .cd-label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${NEUTRAL};font-weight:700}
  .cd-h{font-family:${SERIF};font-weight:700;letter-spacing:-.01em;margin:0;line-height:1.05}
  .cd-title{font-size:clamp(30px,5vw,56px);overflow-wrap:anywhere}
  .cd-row{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;text-align:left;font-family:${MONO};font-size:14px;background:${PAPER};color:${INK};border:none;border-top:2px dashed ${INK};padding:14px 4px;min-height:48px;cursor:pointer;border-radius:0}
  .cd-row.cur{font-weight:700;border-left:6px solid ${ACCENT};padding-left:10px}
  .cd-tag{display:inline-block;border:2px solid ${INK};padding:1px 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}
  .cd-msgs{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:24px}
  .cd-msg{border:3px solid ${INK};padding:16px 18px;max-width:100%;overflow-wrap:anywhere;white-space:pre-wrap;line-height:1.6;font-size:15px}
  .cd-msg.u{background:${PAPER};margin-right:12%}
  .cd-msg.a{background:#fff;box-shadow:6px 6px 0 ${INK};margin-left:12%}
  .cd-caret{display:inline-block;width:9px;height:1em;background:${ACCENT};vertical-align:text-bottom;margin-left:2px;animation:cdblink 1s steps(2) infinite}
  @keyframes cdblink{50%{opacity:0}}
  .cd-sticky{position:sticky;bottom:0;background:${PAPER};padding:14px 0 calc(14px + env(safe-area-inset-bottom));border-top:3px solid ${INK};z-index:5}
  .cd-overlay{position:fixed;inset:0;background:rgba(10,10,10,.55);display:flex;align-items:center;justify-content:center;padding:16px;z-index:50;overflow-y:auto}
  .cd-modal{background:${PAPER};border:3px solid ${INK};box-shadow:10px 10px 0 ${INK};width:100%;max-width:640px;max-height:90vh;overflow-y:auto;padding:28px}
  @media (max-width:899px){
    .cd-root{padding:20px 14px 32px;gap:22px}
    .cd-r1{grid-template-columns:1fr 1fr 1fr}
    .cd-r1 .cd-title{grid-column:1/-1;order:-1}
    .cd-r2{grid-template-columns:1fr}
    .cd-r4,.cd-r8,.cd-r9,.cd-r10{grid-template-columns:1fr}
    .cd-r10{grid-template-columns:1fr 128px;gap:10px}
    .cd-msg.u{margin-right:0}.cd-msg.a{margin-left:0}
    .cd-box{padding:18px}
    .cd-btn{font-size:12px;padding:8px 10px}
  }
  `;

  // ---------- blocks ----------
  const title = (chat && chat.name) || 'Lease agreement Q&A';
  const canAct = !!chat && !loadError;

  // Example rows fill any list slot the wireframe expects but the data has not supplied yet.
  const sampleChatRows = ['Lease agreement Q&A · 2h ago', 'Research notes · yesterday'];
  const sampleDocRows = [
    'lease-agreement.pdf · ready · attached',
    'research-notes.md · ready · attached',
    'handbook.txt · ready — attach',
    'invoice.pdf · processing — unavailable',
    'scan-2026.pdf · failed — unavailable',
  ];

  const renderSidebar = () => (
    <aside data-wf="b-3-0" className="cd-box" aria-label="Your chats">
      <div className="cd-label">01 — Your chats (most recently active)</div>
      <div style={{ margin: '16px 0 8px' }}>
        <button type="button" data-wf="i-3-0-0" className="cd-btn pri" onClick={newChat}>
          <Plus size={16} /> New chat
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
        {!chatsLoaded && <div className="cd-label" style={{ padding: '12px 0' }}>Loading chats…</div>}
        {chatsLoaded && chats.length === 0 && <div style={{ padding: '12px 0', fontSize: 13, color: NEUTRAL }}>No chats yet.</div>}
        {chats.map((c, i) => {
          const cur = String(c.id) === String(chatId);
          return (
            <button key={c.id} type="button" data-wf={i < 2 ? 'i-3-0-' + (i + 1) : undefined}
              className={'cd-row' + (cur ? ' cur' : '')} aria-current={cur ? 'true' : undefined}
              onClick={() => { setChatId(String(c.id)); if (!isWide) setSidebarOpen(false); }}>
              <span style={{ overflowWrap: 'anywhere' }}>{c.name}</span>
              <span style={{ fontSize: 11, color: NEUTRAL, whiteSpace: 'nowrap' }}>{rel(c.last_message_at || c.created_at)}</span>
            </button>
          );
        })}
        {sampleChatRows.map((label, i) => (i >= chats.length ? (
          <button key={'sample-chat-' + i} type="button" data-wf={'i-3-0-' + (i + 1)} className="cd-row"
            disabled aria-disabled="true" style={{ cursor: 'default', opacity: 0.6 }}>
            <span style={{ overflowWrap: 'anywhere' }}>{label}</span>
          </button>
        ) : null))}
      </div>
      <div style={{ borderTop: '2px dashed ' + INK, marginTop: 8, paddingTop: 16 }}>
        <button type="button" data-wf="i-3-0-3" className="cd-btn" onClick={() => nav('dashboard')}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>
      </div>
    </aside>
  );

  const renderAttached = () => (
    <section data-wf="b-3-1" className="cd-box" aria-label="Attached documents">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <div className="cd-label">02 — Sources</div>
          <h2 className="cd-h" style={{ fontSize: 26, marginTop: 6 }}>
            Attached documents ({attached.length}) <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 400, color: NEUTRAL }}>— answers can only draw on these</span>
          </h2>
        </div>
        {!isWide && (
          <button type="button" className="cd-btn sm" onClick={() => setAttachedOpen((o) => !o)} aria-expanded={attachedOpen}>
            {attachedOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />} {attachedOpen ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {(isWide || attachedOpen) && (
        <div style={{ marginTop: 16 }}>
          {attached.length === 0 && <div style={{ fontSize: 13, color: NEUTRAL, padding: '8px 0 16px' }}>Nothing attached to this chat yet.</div>}
          {attached.map((d, i) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderTop: '2px dashed ' + INK, padding: '14px 0' }}>
              <div style={{ fontSize: 14, overflowWrap: 'anywhere', minWidth: 0, flex: '1 1 200px' }}>
                <FileText size={16} /> <strong>{d.filename || 'Document'}</strong>{' · '}
                <span className="cd-tag">{d.status || 'unknown'}</span>{' · '}
                {d.chunk_count !== undefined && d.chunk_count !== null ? d.chunk_count + ' passages' : '— passages'}
              </div>
              <button type="button" data-wf={i < 2 ? 'i-3-1-' + i : undefined} className="cd-btn sm" disabled={busyDoc === d.id}
                onClick={() => detach(d)} aria-label={'Detach ' + (d.filename || 'document')}>
                <X size={14} /> Detach
              </button>
            </div>
          ))}
          <div style={{ borderTop: '2px dashed ' + INK, paddingTop: 16 }}>
            <button type="button" data-wf="i-3-1-2" className="cd-btn" style={{ width: 'auto' }} onClick={openAttach} disabled={!canAct}>
              <Plus size={16} /> Attach documents
            </button>
          </div>
        </div>
      )}
    </section>
  );

  const renderMessage = (m, idx) => {
    const isUser = m.role === 'user';
    const failed = isFailedAssistant(m);
    const dedupe = isNotInDocsMsg(m);
    return (
      <li key={m.id || idx} data-wf={idx < 4 ? 'i-4-0-' + idx : undefined}>
        <div className={'cd-msg ' + (isUser ? 'u' : 'a')}>
          <div className="cd-label" style={{ marginBottom: 8 }}>{isUser ? 'You' : 'Assistant'}</div>
          {isUser ? m.content : failed ? <em style={{ color: NEUTRAL }}>This answer was not completed.</em>
            : dedupe ? <em style={{ color: NEUTRAL }}>No supporting passages found — see the notice below.</em>
            : renderContent(m)}
          {!isUser && !failed && m.citations && m.citations.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {m.citations.map((c, i) => {
                const ord = c.ordinal !== undefined && c.ordinal !== null ? c.ordinal : i + 1;
                return (
                  <button key={i} type="button" className="cd-btn sm" style={{ minHeight: 44, minWidth: 44 }}
                    onClick={() => openCite(m, ord)} aria-label={'Open citation ' + ord}>[{ord}]</button>
                );
              })}
            </div>
          )}
        </div>
      </li>
    );
  };

  const msgOffset = visibleMessages.length;

  return (
    <div className="cd-root">
      <style>{css}</style>

      {/* Row 1 */}
      <div className="cd-grid cd-r1">
        <button type="button" data-wf="b-0-0" className="cd-btn" onClick={() => setSidebarOpen((o) => !o)} aria-expanded={sidebarOpen}>
          <Menu size={16} /> Chats
        </button>
        <h1 data-wf="b-0-1" className="cd-h cd-title">{title}</h1>
        <button type="button" data-wf="b-0-2" className="cd-btn" disabled={!canAct}
          onClick={() => { if (nameRef.current) { nameRef.current.focus(); nameRef.current.select(); } }}>
          <Edit size={16} /> Rename
        </button>
        <button type="button" data-wf="b-0-3" className="cd-btn" disabled={!canAct}
          onClick={() => { setDeleteErr(''); setShowDelete(true); }}>
          <Trash size={16} /> Delete chat
        </button>
      </div>

      {/* Row 2 */}
      <div className="cd-grid cd-r2" style={{ alignItems: 'end' }}>
        <div>
          <label className="cd-label" htmlFor="cd-name" style={{ display: 'block', marginBottom: 8 }}>Chat name</label>
          <input id="cd-name" ref={nameRef} data-wf="b-1-0" className="cd-field" value={nameInput} maxLength={120}
            placeholder="Chat name" aria-invalid={nameError} aria-describedby={nameError ? 'cd-name-err' : undefined}
            disabled={!canAct}
            onChange={(e) => { setNameInput(e.target.value); if (nameError) setNameError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') saveName(); }} />
        </div>
        <button type="button" data-wf="b-1-1" className="cd-btn pri" onClick={saveName} disabled={!canAct}>
          <Check size={16} /> Save name
        </button>
      </div>

      {/* Row 3 */}
      {(nameError || nameFail) && (
        <div data-wf="b-2-0" id="cd-name-err" role="alert" style={{ borderLeft: '6px solid ' + ACCENT, paddingLeft: 14, fontWeight: 700, fontSize: 14 }}>
          {nameError ? 'Chat name cannot be empty — previous name kept' : nameFail}
        </div>
      )}

      {/* Row 4 */}
      <div className={'cd-grid cd-r4' + (sidebarOpen ? '' : ' nosb')}>
        {sidebarOpen && renderSidebar()}
        {renderAttached()}
      </div>

      {loadError && (
        <div className="cd-box" role="alert">
          <div className="cd-label">Error</div>
          <p style={{ margin: '8px 0 0', fontSize: 15 }}>{loadError}</p>
        </div>
      )}
      {!chatId && !loading && chatsLoaded && (
        <div className="cd-box">
          <div className="cd-label">No chat open</div>
          <p style={{ margin: '8px 0 16px', fontSize: 15 }}>Pick a chat from the list or start a new one to ask questions about your documents.</p>
        </div>
      )}

      {/* Row 5 */}
      <section data-wf="b-4-0" className="cd-box" aria-label="Conversation" aria-live="polite">
        <div className="cd-label">03 — Conversation</div>
        <h2 className="cd-h" style={{ fontSize: 30, margin: '6px 0 20px' }}>Conversation</h2>
        {loading && <div className="cd-label">Loading messages…</div>}
        {!loading && visibleMessages.length === 0 && !stream && !localFail && (
          <div style={{ fontSize: 14, color: NEUTRAL }}>Nothing asked yet. Attach a ready document, then ask your first question.</div>
        )}
        <ol className="cd-msgs">
          {visibleMessages.map((m, i) => renderMessage(m, i))}
          {localFail && !stream && !localFail.serverTurn && (
            <li data-wf={msgOffset < 4 ? 'i-4-0-' + msgOffset : undefined}>
              <div className="cd-msg u">
                <div className="cd-label" style={{ marginBottom: 8 }}>You</div>
                {localFail.question}
              </div>
            </li>
          )}
          {stream && stream.showUser && (
            <li data-wf={msgOffset < 4 ? 'i-4-0-' + msgOffset : undefined}>
              <div className="cd-msg u">
                <div className="cd-label" style={{ marginBottom: 8 }}>You</div>
                {stream.question}
              </div>
            </li>
          )}
          {stream && (
            <li data-wf={(msgOffset + (stream.showUser ? 1 : 0)) < 4 ? 'i-4-0-' + (msgOffset + (stream.showUser ? 1 : 0)) : undefined}>
              <div className="cd-msg a">
                <div className="cd-label" style={{ marginBottom: 8 }}>Assistant · streaming</div>
                {stream.text ? <span>{stream.text}</span> : <span style={{ color: NEUTRAL }}>Searching your attached documents…</span>}
                <span className="cd-caret" aria-hidden="true" />
              </div>
            </li>
          )}
        </ol>
      </section>

      {/* Row 6 */}
      {citeMsg && (
        <section data-wf="b-5-0" className="cd-box" aria-label="Citations">
          <div className="cd-label">04 — Citations</div>
          <h2 className="cd-h" style={{ fontSize: 28, margin: '6px 0 8px' }}>Citations</h2>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: NEUTRAL, overflowWrap: 'anywhere' }}>
            {citeMsg.citations.map((c, i) => {
              const ord = c.ordinal !== undefined && c.ordinal !== null ? c.ordinal : i + 1;
              return '[' + ord + '] ' + (isDeletedCite(c) ? 'Deleted document' : c.document_name + ' · ' + citeLoc(c));
            }).join(' · ')}{' '}(tap to expand passage)
          </p>
          <div>
            {citeMsg.citations.map((c, i) => {
              const ord = c.ordinal !== undefined && c.ordinal !== null ? c.ordinal : i + 1;
              const key = citeKey(citeMsg, c, i);
              const open = !!expanded[key];
              const deleted = isDeletedCite(c);
              const text = c.passage_text || '';
              return (
                <div key={key} style={{ borderTop: '2px dashed ' + INK }}>
                  <button type="button" data-wf={i < 3 ? 'i-5-0-' + i : undefined} className="cd-row" style={{ border: 'none', alignItems: 'flex-start' }}
                    aria-expanded={open} onClick={() => setExpanded((e) => Object.assign({}, e, { [key]: !e[key] }))}>
                    <span style={{ overflowWrap: 'anywhere', minWidth: 0 }}>
                      <strong style={{ color: open ? ACCENT : INK }}>[{ord}]</strong>{' '}
                      {deleted ? (
                        <span><strong>Deleted document</strong> — passage no longer available</span>
                      ) : (
                        <span>
                          <strong>{c.document_name}</strong> · {citeLoc(c)}
                          {!open && text && <span style={{ color: NEUTRAL }}> — “{text.length > 90 ? text.slice(0, 90) + '…' : text}”</span>}
                        </span>
                      )}
                    </span>
                    {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  {open && (
                    <div style={{ borderLeft: '6px solid ' + INK, margin: '0 0 16px 8px', padding: '4px 0 4px 16px', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                      {deleted && <div className="cd-label" style={{ marginBottom: 6 }}>Was: {c.document_name || 'unknown'} — document deleted</div>}
                      {text ? text : 'Passage no longer available.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Row 7 */}
      {showNotInDocs && (
        <div data-wf="b-6-0" className="cd-box" role="status" style={{ borderLeft: '12px solid ' + ACCENT }}>
          <div className="cd-label">No match</div>
          <p className="cd-h" style={{ fontSize: 26, marginTop: 8 }}>The answer is not in the attached documents.</p>
        </div>
      )}

      {/* Row 8 */}
      {failedInfo && (
        <div className="cd-grid cd-r8">
          <div data-wf="b-7-0" className="cd-box" role="alert">
            <div className="cd-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertCircle size={14} /> Turn failed</div>
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5 }}>Something went wrong generating this answer. Your question is still here.</p>
          </div>
          <button type="button" data-wf="b-7-1" className="cd-btn pri" onClick={retryTurn} disabled={!!stream}>
            Retry this question
          </button>
        </div>
      )}

      {/* Row 9 */}
      {canAct && readyAttached.length === 0 && (
        <div className="cd-grid cd-r9" style={{ alignItems: 'center' }}>
          <div data-wf="b-8-0" className="cd-box" role={noDocsPrompt ? 'alert' : undefined}
            style={noDocsPrompt ? { borderLeft: '12px solid ' + ACCENT } : undefined}>
            <div className="cd-label">Nothing to search</div>
            <p className="cd-h" style={{ fontSize: 22, marginTop: 8 }}>
              No documents attached — attach at least one ready document before asking a question
            </p>
          </div>
          <button type="button" data-wf="b-8-1" className="cd-btn" onClick={openAttach}>
            <Plus size={16} /> Attach from library
          </button>
        </div>
      )}

      {/* Row 10 */}
      <form className="cd-sticky" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <div className="cd-grid cd-r10" style={{ alignItems: 'end' }}>
          <div>
            <label className="cd-label" htmlFor="cd-ask" style={{ display: 'block', marginBottom: 8 }}>Ask a question about your attached documents</label>
            <textarea id="cd-ask" ref={inputRef} data-wf="b-9-0" className="cd-field" rows={2} value={input}
              placeholder="Ask a question about your attached documents" disabled={!canAct}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }} />
          </div>
          <button type="submit" data-wf="b-9-1" className="cd-btn acc" disabled={!canAct || !!stream}>
            Send <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {/* Row 11 */}
      {showAttach && (
        <div className="cd-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAttach(false); }}>
          <div data-wf="b-10-0" className="cd-modal" role="dialog" aria-modal="true" aria-labelledby="cd-attach-h">
            <div className="cd-label">Library</div>
            <h2 id="cd-attach-h" className="cd-h" style={{ fontSize: 32, margin: '6px 0 18px' }}>Attach documents to this chat</h2>
            {!docsLoaded && <div className="cd-label">Loading library…</div>}
            {docsLoaded && docs.length === 0 && (
              <div style={{ fontSize: 14, color: NEUTRAL, padding: '8px 0 16px' }}>Your library is empty. Upload PDF, .txt or .md files from your document library first.</div>
            )}
            {attachErr && <div role="alert" style={{ borderLeft: '6px solid ' + ACCENT, paddingLeft: 12, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{attachErr}</div>}
            <div style={{ marginBottom: 20 }}>
              {docs.map((d, i) => {
                const on = attachedIds.includes(d.id);
                const ready = d.status === 'ready';
                const id = i < 5 ? 'i-10-0-' + i : undefined;
                return (
                  <button key={d.id} type="button" data-wf={id} className="cd-row" disabled={!ready || busyDoc === d.id}
                    style={{ opacity: ready ? 1 : 0.55, cursor: ready ? 'pointer' : 'not-allowed' }}
                    aria-pressed={ready ? on : undefined} onClick={() => ready && toggleAttach(d)}>
                    <span style={{ overflowWrap: 'anywhere', minWidth: 0 }}>
                      <strong>{d.filename}</strong> · {d.status}
                      {ready ? (on ? ' · attached' : ' — attach') : ' — unavailable'}
                      {d.status === 'failed' && d.failure_reason ? <span style={{ display: 'block', fontSize: 11, color: NEUTRAL }}>{d.failure_reason}</span> : null}
                    </span>
                    {ready && on ? <Check size={18} /> : null}
                  </button>
                );
              })}
              {sampleDocRows.map((label, i) => (i >= docs.length ? (
                <button key={'sample-doc-' + i} type="button" data-wf={'i-10-0-' + i} className="cd-row"
                  disabled aria-disabled="true" style={{ opacity: 0.55, cursor: 'not-allowed' }}>
                  <span style={{ overflowWrap: 'anywhere', minWidth: 0 }}>{label}</span>
                  {i < 2 ? <Check size={18} /> : null}
                </button>
              ) : null))}
            </div>
            <button type="button" data-wf="i-10-0-5" className="cd-btn pri" onClick={() => setShowAttach(false)}>Done</button>
          </div>
        </div>
      )}

      {/* Row 12 */}
      {showDelete && (
        <div className="cd-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !deleting) setShowDelete(false); }}>
          <div data-wf="b-11-0" className="cd-modal" role="alertdialog" aria-modal="true" aria-labelledby="cd-del-h">
            <div className="cd-label">Cannot be undone</div>
            <h2 id="cd-del-h" className="cd-h" style={{ fontSize: 30, margin: '6px 0 24px' }}>
              Delete this chat? Its messages and document attachments are removed. Your documents stay in your library.
            </h2>
            {deleteErr && <div role="alert" style={{ borderLeft: '6px solid ' + ACCENT, paddingLeft: 12, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{deleteErr}</div>}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button type="button" data-wf="i-11-0-0" className="cd-btn pri" style={{ flex: '1 1 160px' }} disabled={deleting} onClick={deleteChat}>
                <Trash size={16} /> {deleting ? 'Deleting…' : 'Delete chat'}
              </button>
              <button type="button" data-wf="i-11-0-1" className="cd-btn" style={{ flex: '1 1 160px' }} disabled={deleting} onClick={() => setShowDelete(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
