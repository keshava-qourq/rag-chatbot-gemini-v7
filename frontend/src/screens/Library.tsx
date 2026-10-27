// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, FileText, Trash, Upload, AlertCircle } = Icons;

export default function Screen(props) {
  const { useState, useEffect, useRef, useCallback } = React;
  const nav = (props && props.navigate) || (typeof navigate !== 'undefined' ? navigate : function () {});
  const MAX_MB = 20;
  const MAX_BYTES = MAX_MB * 1024 * 1024;
  const EXTS = ['pdf', 'txt', 'md'];
  const INK = '#0a0a0a';
  const ACCENT = '#1d3fff';
  const BORDER = '3px solid ' + INK;
  const SHADOW = '6px 6px 0 ' + INK;
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const SERIF = '"Didot", "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, serif';

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState([]);
  const [upload, setUpload] = useState(null); // {name, pct, phase}
  const [pending, setPending] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [busyIds, setBusyIds] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(async function () {
    try {
      const res = await fetch('/api/documents', { headers: { Accept: 'application/json' } });
      if (res.status === 401) { nav('login'); return; }
      if (!res.ok) throw new Error('load');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.documents || data.items || []);
      setDocs(list);
      setLoadError('');
    } catch (e) {
      setLoadError('Could not load your documents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function () { load(); }, [load]);

  const anyProcessing = docs.some(function (d) { return d.status === 'processing'; });
  useEffect(function () {
    if (!anyProcessing) return undefined;
    const t = setInterval(load, 2500);
    return function () { clearInterval(t); };
  }, [anyProcessing, load]);

  function extOf(name) {
    const i = name.lastIndexOf('.');
    return i < 0 ? '' : name.slice(i + 1).toLowerCase();
  }
  function fmtSize(b) {
    if (b == null) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(1) + ' MB';
  }
  function fmtDate(s) {
    if (!s) return '—';
    const d = new Date(s);
    if (isNaN(d.getTime())) return String(s);
    const p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function chatsOf(d) {
    const c = d.attached_chats || d.chats || [];
    return Array.isArray(c) ? c : [];
  }

  function sendOne(file) {
    return new Promise(function (resolve) {
      const fd = new FormData();
      fd.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/documents');
      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          const pct = Math.min(100, Math.round((e.loaded / e.total) * 100));
          setUpload({ name: file.name, pct: pct, phase: pct >= 100 ? 'processing' : 'sending' });
        }
      };
      xhr.upload.onload = function () { setUpload({ name: file.name, pct: 100, phase: 'processing' }); };
      xhr.onload = function () {
        if (xhr.status === 401) { nav('login'); resolve(); return; }
        if (xhr.status < 200 || xhr.status >= 300) {
          let msg = 'Upload of ' + file.name + ' failed.';
          try {
            const j = JSON.parse(xhr.responseText);
            if (j && (j.error || j.message || j.detail)) msg = String(j.error || j.message || j.detail);
          } catch (e) {}
          setErrors(function (p) { return p.concat([msg]); });
        }
        resolve();
      };
      xhr.onerror = function () {
        setErrors(function (p) { return p.concat(['Upload of ' + file.name + ' failed. Check your connection and try again.']); });
        resolve();
      };
      setUpload({ name: file.name, pct: 0, phase: 'sending' });
      xhr.send(fd);
    });
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const msgs = [];
    const ok = [];
    files.forEach(function (f) {
      if (EXTS.indexOf(extOf(f.name)) < 0) {
        msgs.push('Unsupported file type: only .pdf, .txt and .md can be uploaded (' + f.name + ')');
      } else if (f.size > MAX_BYTES) {
        msgs.push('File is larger than the ' + MAX_MB + ' MB limit (' + f.name + ')');
      } else if (f.size === 0) {
        msgs.push('File is empty (' + f.name + ')');
      } else {
        ok.push(f);
      }
    });
    setErrors(msgs);
    for (let i = 0; i < ok.length; i++) {
      const f = ok[i];
      const tempId = 'tmp-' + Date.now() + '-' + i;
      setPending(function (p) { return [{ id: tempId, filename: f.name, format: extOf(f.name), size_bytes: f.size }].concat(p); });
      await sendOne(f);
      await load();
      setPending(function (p) { return p.filter(function (x) { return x.id !== tempId; }); });
    }
    setUpload(null);
  }

  // Opens the native file picker without rendering a file field in the page.
  function openPicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.txt,.md';
    input.style.display = 'none';
    input.onchange = function () { handleFiles(input.files); };
    input.click();
  }

  async function retry(d) {
    setBusyIds(function (b) { return Object.assign({}, b, { [d.id]: true }); });
    setDocs(function (list) { return list.map(function (x) { return x.id === d.id ? Object.assign({}, x, { status: 'processing', failure_reason: null }) : x; }); });
    try {
      const res = await fetch('/api/documents/' + d.id + '/retry', { method: 'POST' });
      if (res.status === 401) { nav('login'); return; }
      if (!res.ok) setErrors(['Retry of ' + d.filename + ' failed. Please try again.']);
    } catch (e) {
      setErrors(['Retry of ' + d.filename + ' failed. Please try again.']);
    }
    await load();
    setBusyIds(function (b) { const n = Object.assign({}, b); delete n[d.id]; return n; });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/documents/' + deleteTarget.id, { method: 'DELETE' });
      if (res.status === 401) { nav('login'); return; }
      if (!res.ok && res.status !== 404) throw new Error('del');
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setDeleteError('Could not delete the document. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  async function openFile(d) {
    try {
      const res = await fetch('/api/documents/' + d.id + '/file-url');
      if (!res.ok) throw new Error('x');
      const j = await res.json();
      const url = j.url || j.file_url;
      if (url) window.open(url, '_blank', 'noopener');
    } catch (e) {
      setErrors(['Could not open ' + d.filename + '.']);
    }
  }

  const q = query.trim().toLowerCase();
  const pendingRows = pending.map(function (p) {
    return Object.assign({}, p, { status: 'processing', chunk_count: null, created_at: new Date().toISOString(), _pending: true });
  });
  const allRows = pendingRows.concat(docs.filter(function (d) { return !pendingRows.some(function () { return false; }); }));
  const rows = allRows.filter(function (d) {
    if (filter !== 'all' && d.status !== filter) return false;
    if (q && String(d.filename || '').toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
  const failedDocs = docs.filter(function (d) { return d.status === 'failed'; });
  const failedDoc = failedDocs[0];
  const totalDocs = docs.length + pending.length;

  const label = { fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55575c' };
  const block = { border: BORDER, boxShadow: SHADOW, background: '#fff', borderRadius: 0 };

  function statusBadge(d) {
    const s = d.status;
    const st = { fontFamily: MONO, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, padding: '3px 8px', border: '2px solid ' + INK, borderRadius: 0, display: 'inline-block', fontWeight: 700 };
    if (s === 'ready') return <span style={Object.assign({}, st, { background: INK, color: '#f4f4f0' })}>Ready</span>;
    if (s === 'failed') return <span style={Object.assign({}, st, { background: '#fff', color: INK, textDecoration: 'line-through' })}>Failed</span>;
    return <span style={Object.assign({}, st, { background: '#f4f4f0', color: ACCENT, borderStyle: 'dashed' })}>Processing</span>;
  }

  const filters = [
    { id: 'all', label: 'All', wf: 'i-4-0-0' },
    { id: 'ready', label: 'Ready', wf: 'i-4-0-1' },
    { id: 'processing', label: 'Processing', wf: 'i-4-0-2' },
    { id: 'failed', label: 'Failed', wf: 'i-4-0-3' }
  ];
  const heads = [
    ['Filename', 'i-5-0-0'], ['Format', 'i-5-0-1'], ['Size', 'i-5-0-2'], ['Uploaded', 'i-5-0-3'],
    ['Status', 'i-5-0-4'], ['Passages', 'i-5-0-5'], ['Attached chats', 'i-5-0-6'], ['Actions (Retry / Delete)', 'i-5-0-7']
  ];

  const css = '' +
    '.lib-wrap{max-width:1200px;margin:0 auto;padding:40px 24px 80px;font-family:' + MONO + ';color:' + INK + ';background:#f4f4f0}' +
    '.lib-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;margin-bottom:40px;align-items:start}' +
    '.lib-8{grid-column:span 8}.lib-4{grid-column:span 4}.lib-12{grid-column:span 12}.lib-6{grid-column:span 6}.lib-3{grid-column:span 3}' +
    '.lib-table{width:100%;border-collapse:collapse;font-family:' + MONO + ';font-size:13px}' +
    '.lib-table th{border-bottom:3px solid ' + INK + ';text-align:left;padding:14px 12px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}' +
    '.lib-table td{border-bottom:1px dashed ' + INK + ';padding:16px 12px;vertical-align:top;word-break:break-word}' +
    '.lib-btn{border-radius:0 !important;font-family:' + MONO + ' !important;text-transform:uppercase;letter-spacing:.08em;min-height:44px}' +
    '.lib-link{background:none;border:0;padding:0;font:inherit;color:' + INK + ';text-decoration:underline;cursor:pointer;text-align:left}' +
    '@media (max-width:820px){' +
      '.lib-wrap{padding:24px 16px 64px}' +
      '.lib-8,.lib-4,.lib-6,.lib-3{grid-column:span 12}' +
      '.lib-row{gap:16px;margin-bottom:28px}' +
      '.lib-table thead{position:absolute;left:-9999px}' +
      '.lib-table,.lib-table tbody,.lib-table tr,.lib-table td{display:block;width:100%}' +
      '.lib-table tr{border-bottom:3px solid ' + INK + ';padding:12px 0}' +
      '.lib-table td{border-bottom:0;display:flex;justify-content:space-between;gap:16px;padding:8px 12px;text-align:right}' +
      '.lib-table td::before{content:attr(data-label);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#55575c;text-align:left;flex:none}' +
    '}';

  return (
    <div className="lib-wrap">
      <style>{css}</style>

      <div className="lib-row" style={{ alignItems: 'end', marginBottom: 32 }}>
        <div className="lib-8" data-wf="b-0-0">
          <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(44px, 8vw, 92px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>Document library</h1>
        </div>
        <div className="lib-4" style={{ textAlign: 'right' }}>
          <Button data-wf="b-0-1" className="lib-btn" onClick={openPicker}
            style={{ background: ACCENT, color: '#fff', border: BORDER, boxShadow: SHADOW, borderRadius: 0, padding: '14px 22px', fontWeight: 700, width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plus size={18} /> Upload document
          </Button>
        </div>
      </div>

      <div className="lib-row">
        <div className="lib-12" data-wf="b-1-0"
          onDragOver={function (e) { e.preventDefault(); setDragOver(true); }}
          onDragLeave={function () { setDragOver(false); }}
          onDrop={function (e) { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          style={Object.assign({}, block, { padding: '48px 24px', textAlign: 'center', borderStyle: dragOver ? 'dashed' : 'solid', background: dragOver ? '#f4f4f0' : '#fff' })}>
          <Upload size={28} />
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3.4vw,34px)', fontWeight: 700, margin: '14px 0 10px', lineHeight: 1.15 }}>
            Drag a file here or <button type="button" className="lib-link" style={{ fontFamily: SERIF, fontSize: 'inherit', fontWeight: 700, color: ACCENT }} onClick={openPicker}>browse</button>
          </p>
          <div style={label}>supported formats: .pdf, .txt, .md · maximum {MAX_MB} MB per file</div>
        </div>
      </div>

      <div className="lib-row" style={{ marginBottom: 16 }}>
        <div className="lib-12" data-wf="b-2-0" aria-live="polite">
          {upload ? (
            <div>
              <div style={{ fontSize: 14, marginBottom: 10 }}>
                Uploading {upload.name} — {upload.phase === 'processing' ? 'processing: extracting text, chunking and embedding' : 'sending file'} ({upload.pct}%)
              </div>
              <div style={{ border: BORDER, height: 20, background: '#fff' }}>
                <div style={{ width: upload.pct + '%', height: '100%', background: ACCENT, transition: 'width .2s' }} />
              </div>
            </div>
          ) : (
            <div style={label}>No upload in progress.</div>
          )}
        </div>
      </div>

      <div className="lib-row" style={{ marginBottom: 40 }}>
        <div className="lib-12" data-wf="b-3-0" role="alert">
          {errors.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: '12px 16px', border: BORDER, borderStyle: 'dashed', fontSize: 13 }}>
              {errors.map(function (m, i) {
                return <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 0' }}><AlertCircle size={16} /> <span>{m}</span></li>;
              })}
            </ul>
          ) : (
            <div style={label}>Only .pdf, .txt and .md · up to {MAX_MB} MB · text-based PDFs only (no OCR)</div>
          )}
        </div>
      </div>

      <div className="lib-row" style={{ marginBottom: 24 }}>
        <div className="lib-12" data-wf="b-4-0" style={{ borderTop: BORDER, borderBottom: '1px dashed ' + INK, padding: '20px 0', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <span style={label}>Status</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {filters.map(function (f) {
              const on = filter === f.id;
              return (
                <button key={f.id} type="button" data-wf={f.wf} aria-pressed={on} onClick={function () { setFilter(f.id); }}
                  style={{ fontFamily: MONO, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', border: '3px solid ' + INK, borderRadius: 0, padding: '10px 14px', minHeight: 44, cursor: 'pointer', background: on ? INK : '#fff', color: on ? '#f4f4f0' : INK, boxShadow: on ? 'none' : '3px 3px 0 ' + INK }}>
                  {f.label}
                </button>
              );
            })}
          </div>
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}><Search size={16} /></span>
            <Input data-wf="i-4-0-4" value={query} placeholder="Search filenames" aria-label="Search filenames"
              onChange={function (e) { setQuery(e.target.value); }}
              style={{ paddingLeft: 36, border: BORDER, borderRadius: 0, fontFamily: MONO, minHeight: 44, width: '100%', background: '#fff' }} />
          </div>
        </div>
      </div>

      <div className="lib-row">
        <div className="lib-12" data-wf="b-5-0" style={Object.assign({}, block, { padding: 0 })}>
          <div style={{ padding: '24px 24px 16px', borderBottom: BORDER }}>
            <div style={label}>№ 02 — Index</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(26px,4vw,40px)', margin: '6px 0 0', fontWeight: 800 }}>My documents <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#55575c' }}>(most recent first)</span></h2>
          </div>
          {loadError && <div style={{ padding: 16, fontSize: 13 }}>{loadError} <button type="button" className="lib-link" onClick={load}>Retry loading</button></div>}
          <table className="lib-table">
            <thead>
              <tr>
                {heads.map(function (h) { return <th key={h[1]} data-wf={h[1]}>{h[0]}</th>; })}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} style={{ padding: 24 }}>Loading documents…</td></tr>}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 24, color: '#55575c' }}>{totalDocs === 0 ? 'Nothing here yet.' : 'No documents match this filter.'}</td></tr>
              )}
              {rows.map(function (d) {
                const chats = chatsOf(d);
                const busy = !!busyIds[d.id] || d._pending;
                return (
                  <tr key={d.id}>
                    <td data-label="Filename" style={{ fontWeight: 700 }}>
                      {d._pending || d.status !== 'ready' ? d.filename : <button type="button" className="lib-link" style={{ fontWeight: 700 }} onClick={function () { openFile(d); }}>{d.filename}</button>}
                    </td>
                    <td data-label="Format" style={{ textTransform: 'uppercase' }}>{d.format || extOf(d.filename || '')}</td>
                    <td data-label="Size">{fmtSize(d.size_bytes)}</td>
                    <td data-label="Uploaded">{fmtDate(d.created_at)}</td>
                    <td data-label="Status">
                      <div>{statusBadge(d)}</div>
                      {d.status === 'failed' && d.failure_reason && <div style={{ fontSize: 12, marginTop: 6, color: '#55575c' }}>{d.failure_reason}</div>}
                    </td>
                    <td data-label="Passages">{d.status === 'ready' ? (d.chunk_count != null ? d.chunk_count : 0) : '—'}</td>
                    <td data-label="Attached chats">
                      {chats.length === 0 ? '—' : (
                        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, alignItems: 'inherit' }}>
                          {chats.map(function (c, i) {
                            return <button key={c.id || i} type="button" className="lib-link" onClick={function () { nav('chat-detail'); }}>{c.name || String(c)}</button>;
                          })}
                        </span>
                      )}
                    </td>
                    <td data-label="Actions">
                      <span style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {d.status === 'failed' && (
                          <Button className="lib-btn" disabled={busy} onClick={function () { retry(d); }}
                            style={{ border: '2px solid ' + INK, borderRadius: 0, background: '#fff', color: INK, padding: '8px 12px' }}>Retry</Button>
                        )}
                        <Button className="lib-btn" disabled={d._pending} onClick={function () { setDeleteError(''); setDeleteTarget(d); }}
                          style={{ border: '2px solid ' + INK, borderRadius: 0, background: '#fff', color: INK, padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Trash size={14} /> Delete</Button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lib-row" style={{ alignItems: 'stretch' }}>
        <div className="lib-6" data-wf="b-6-0" style={Object.assign({}, block, { padding: 24 })}>
          <div style={label}>№ 03 — Needs attention{failedDocs.length > 1 ? ' (+' + (failedDocs.length - 1) + ' more failed)' : ''}</div>
          {failedDoc ? (
            <p style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.25, margin: '10px 0 0', fontWeight: 700 }}>
              {failedDoc.filename} — failed: <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 400 }}>{failedDoc.failure_reason || 'ingestion did not complete'}</span>
            </p>
          ) : (
            <p style={{ fontFamily: MONO, fontSize: 14, margin: '10px 0 0' }}>No failed documents.</p>
          )}
        </div>
        <div className="lib-3">
          <Button data-wf="b-6-1" className="lib-btn" disabled={!failedDoc || !!busyIds[failedDoc && failedDoc.id]} onClick={function () { failedDoc && retry(failedDoc); }}
            style={{ width: '100%', border: BORDER, boxShadow: SHADOW, borderRadius: 0, background: ACCENT, color: '#fff', padding: '14px 12px', fontWeight: 700 }}>Retry ingestion</Button>
        </div>
        <div className="lib-3">
          <Button data-wf="b-6-2" className="lib-btn" disabled={!failedDoc} onClick={function () { if (failedDoc) { setDeleteError(''); setDeleteTarget(failedDoc); } }}
            style={{ width: '100%', border: BORDER, boxShadow: SHADOW, borderRadius: 0, background: '#fff', color: INK, padding: '14px 12px', fontWeight: 700 }}>Delete</Button>
        </div>
      </div>

      {!loading && totalDocs === 0 && !loadError && (
        <div className="lib-row">
          <div className="lib-12" data-wf="b-7-0" style={Object.assign({}, block, { padding: '48px 24px', textAlign: 'center', borderStyle: 'dashed' })}>
            <FileText size={32} />
            <p style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3.4vw,32px)', fontWeight: 700, margin: '14px auto 8px', maxWidth: 640, lineHeight: 1.2 }}>No documents yet — upload a PDF, .txt or .md file to start asking questions about it</p>
            <div style={Object.assign({}, label, { marginBottom: 20 })}>Upload → create a chat → attach the document → ask</div>
            <Button className="lib-btn" onClick={openPicker}
              style={{ border: BORDER, boxShadow: SHADOW, borderRadius: 0, background: ACCENT, color: '#fff', padding: '14px 22px', fontWeight: 700, display: 'inline-flex', gap: 8, alignItems: 'center' }}><Upload size={16} /> Choose a file</Button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div data-wf="b-8-0" role="dialog" aria-modal="true" aria-labelledby="del-title" style={Object.assign({}, block, { padding: 32, maxWidth: 560, width: '100%', background: '#f4f4f0' })}>
            <div style={label}>Confirm deletion</div>
            <h2 id="del-title" style={{ fontFamily: SERIF, fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, margin: '8px 0 14px', lineHeight: 1.1, wordBreak: 'break-word' }}>Delete {deleteTarget.filename}?</h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
              This removes the file, its passages and vectors, and detaches it from {chatsOf(deleteTarget).length} chat{chatsOf(deleteTarget).length === 1 ? '' : 's'}. This cannot be undone.
            </p>
            {deleteError && <p role="alert" style={{ fontSize: 13, margin: '0 0 16px', display: 'flex', gap: 8 }}><AlertCircle size={16} /> {deleteError}</p>}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Button data-wf="i-8-0-0" className="lib-btn" disabled={deleting} onClick={confirmDelete}
                style={{ border: BORDER, boxShadow: SHADOW, borderRadius: 0, background: INK, color: '#f4f4f0', padding: '14px 20px', fontWeight: 700, flex: '1 1 160px' }}>{deleting ? 'Deleting…' : 'Delete document'}</Button>
              <Button data-wf="i-8-0-1" className="lib-btn" disabled={deleting} onClick={function () { setDeleteTarget(null); }}
                style={{ border: BORDER, boxShadow: SHADOW, borderRadius: 0, background: '#fff', color: INK, padding: '14px 20px', fontWeight: 700, flex: '1 1 120px' }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
