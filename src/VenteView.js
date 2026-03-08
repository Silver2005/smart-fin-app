import React, { useState } from 'react';
import { Share } from '@capacitor/share';

const venteStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --navy-950:  #050d1a;
    --surface:   #0c1a2e;
    --surface-2: #0f2040;
    --blue-500:  #2563eb;
    --blue-400:  #3b82f6;
    --blue-300:  #93c5fd;
    --success:   #10b981;
    --danger:    #ef4444;
    --border:         rgba(255,255,255,0.07);
    --border-focus:   rgba(59,130,246,0.4);
    --text-primary:   #f1f5f9;
    --text-secondary: #64748b;
    --text-muted:     #334155;
  }

  /* ── CARD ── */
  .vt-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    animation: vtIn 0.3s ease both;
  }
  @keyframes vtIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── CARD HEADER ── */
  .vt-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
  }
  .vt-card-header-left { display: flex; align-items: center; gap: 10px; }
  .vt-card-icon {
    width: 32px; height: 32px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: var(--success);
  }
  .vt-card-icon svg { width: 15px; height: 15px; }
  .vt-card-title {
    font-size: 14px; font-weight: 600;
    color: var(--text-primary); letter-spacing: -0.01em;
  }
  .vt-card-subtitle { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
  .vt-card-badge {
    font-size: 10px; font-weight: 500;
    color: var(--success);
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.15);
    padding: 3px 9px; border-radius: 20px;
  }

  /* ── FORM BODY ── */
  .vt-form-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  /* ── FIELD ── */
  .vt-field { display: flex; flex-direction: column; gap: 6px; }
  .vt-label {
    font-size: 11px; font-weight: 500;
    color: var(--text-secondary); letter-spacing: 0.01em;
  }
  .vt-input, .vt-select {
    width: 100%;
    background: rgba(5,13,26,0.6);
    border: 1px solid var(--border);
    border-radius: 9px;
    padding: 10px 13px;
    font-family: 'Inter', sans-serif;
    font-size: 13px; color: var(--text-primary);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    -webkit-appearance: none; appearance: none;
  }
  .vt-input::placeholder { color: var(--text-muted); font-size: 12px; }
  .vt-input:focus, .vt-select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
    background: rgba(5,13,26,0.9);
  }
  .vt-select option { background: #0c1a2e; color: var(--text-primary); }

  /* Select wrapper */
  .vt-select-wrap { position: relative; }
  .vt-select-chevron {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: var(--text-muted); pointer-events: none;
  }
  .vt-select-chevron svg { width: 13px; height: 13px; display: block; }

  /* Stock indicator */
  .vt-stock-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 10px; font-weight: 500;
    width: fit-content;
    transition: all 0.2s;
  }
  .vt-stock-pill.ok  { background: rgba(16,185,129,0.08); color: var(--success); border: 1px solid rgba(16,185,129,0.15); }
  .vt-stock-pill.low { background: rgba(245,158,11,0.08);  color: #f59e0b;        border: 1px solid rgba(245,158,11,0.15); }
  .vt-stock-pill.out { background: rgba(239,68,68,0.08);   color: var(--danger);  border: 1px solid rgba(239,68,68,0.15); }
  .vt-stock-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* ── ROW ── */
  .vt-row { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; }

  /* ── TOTAL BOX ── */
  .vt-total-box {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px;
    background: rgba(16,185,129,0.05);
    border: 1px solid rgba(16,185,129,0.12);
    border-radius: 10px;
  }
  .vt-total-left { display: flex; flex-direction: column; gap: 2px; }
  .vt-total-label {
    font-size: 10px; font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .vt-total-desc { font-size: 11px; color: var(--text-secondary); }
  .vt-total-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px; font-weight: 500;
    color: var(--success); letter-spacing: -0.02em;
  }

  /* ── DIVIDER ── */
  .vt-divider { height: 1px; background: var(--border); margin: 0 -20px; }

  /* ── SUBMIT ── */
  .vt-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px;
    background: #059669;
    border: none; border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    color: white; cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 2px 12px rgba(16,185,129,0.2);
    letter-spacing: -0.01em;
  }
  .vt-submit svg { width: 15px; height: 15px; }
  .vt-submit:hover:not(:disabled) {
    background: #047857;
    box-shadow: 0 4px 20px rgba(16,185,129,0.3);
  }
  .vt-submit:active:not(:disabled) { transform: scale(0.99); }
  .vt-submit:disabled {
    background: var(--surface-2, #0f2040);
    color: var(--text-muted);
    box-shadow: none; cursor: not-allowed;
  }

  /* ════════════════════════
     REÇU
  ════════════════════════ */
  .vt-receipt-page {
    display: flex; flex-direction: column; gap: 16px;
    animation: vtIn 0.3s ease both;
  }

  /* Header du reçu */
  .vt-receipt-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 4px;
  }
  .vt-receipt-topbar-title {
    font-size: 13px; font-weight: 600;
    color: var(--text-primary); letter-spacing: -0.01em;
  }
  .vt-receipt-topbar-sub { font-size: 11px; color: var(--text-secondary); }
  .vt-receipt-status {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.15);
    font-size: 10px; font-weight: 600; color: var(--success);
  }
  .vt-receipt-status-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--success);
  }

  /* Reçu card */
  .vt-receipt-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }

  .vt-receipt-head {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .vt-receipt-brand {
    font-size: 15px; font-weight: 700;
    color: var(--text-primary); letter-spacing: -0.02em;
  }
  .vt-receipt-brand span { color: var(--blue-400); }
  .vt-receipt-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: var(--text-muted);
  }

  .vt-receipt-body { padding: 20px; display: flex; flex-direction: column; gap: 0; }

  .vt-receipt-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .vt-receipt-row:last-of-type { border-bottom: none; }
  .vt-receipt-key { color: var(--text-secondary); font-size: 12px; }
  .vt-receipt-val { color: var(--text-primary); font-weight: 500; }
  .vt-receipt-val.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: -0.01em;
  }

  .vt-receipt-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 20px;
    background: rgba(16,185,129,0.05);
    border-top: 1px solid rgba(16,185,129,0.12);
  }
  .vt-receipt-total-label {
    font-size: 11px; font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .vt-receipt-total-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px; font-weight: 500;
    color: var(--success); letter-spacing: -0.02em;
  }

  .vt-receipt-footer {
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    font-size: 10px; color: var(--text-muted);
    text-align: center; letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* ── ACTION BUTTONS ── */
  .vt-actions { display: flex; flex-direction: column; gap: 8px; }

  .vt-action-primary {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px;
    background: #059669;
    border: none; border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    color: white; cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 12px rgba(16,185,129,0.2);
  }
  .vt-action-primary svg { width: 14px; height: 14px; }
  .vt-action-primary:hover { background: #047857; box-shadow: 0 4px 20px rgba(16,185,129,0.3); }

  .vt-action-ghost {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--text-secondary); cursor: pointer;
    transition: all 0.15s;
  }
  .vt-action-ghost svg { width: 13px; height: 13px; }
  .vt-action-ghost:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.12);
    color: var(--text-primary);
  }

  @media print {
    body * { visibility: hidden; }
    .receipt-to-print, .receipt-to-print * { visibility: visible; }
    .receipt-to-print { position: absolute; left: 0; top: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`;

/* ── SVG Icons ── */
const Icons = {
  vente:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  share:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  print:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  back:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

const VenteView = ({ articles, onAddVente }) => {
  const [saleData, setSaleData] = useState({ contact_nom: '', article_id: '', quantite: 1, prix_unitaire: '' });
  const [receipt, setReceipt]   = useState(null);

  const isMobile    = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const selectedArt = articles.find(a => a.id === Number(saleData.article_id));
  const total       = Number(saleData.quantite) * Number(saleData.prix_unitaire);
  const stockInsuff = selectedArt && selectedArt.quantite_stock < Number(saleData.quantite);
  const set         = (key) => (e) => setSaleData(s => ({ ...s, [key]: e.target.value }));

  const stockStatus = (art) => {
    if (!art) return null;
    if (art.quantite_stock === 0)  return { type: 'out', label: 'Rupture de stock' };
    if (art.quantite_stock <= 3)   return { type: 'low', label: `${art.quantite_stock} unités restantes` };
    return { type: 'ok', label: `${art.quantite_stock} unités disponibles` };
  };
  const stock = stockStatus(selectedArt);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!saleData.article_id || stockInsuff) return;
    const art = articles.find(a => a.id === Number(saleData.article_id));
    const montantTotal = Number(saleData.quantite) * Number(saleData.prix_unitaire);
    onAddVente({ ...saleData, prix_vente: montantTotal });
    setReceipt({
      ...saleData,
      article_nom: art?.nom || 'Article',
      prix_total: montantTotal,
      ref: `SF-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    setSaleData({ contact_nom: '', article_id: '', quantite: 1, prix_unitaire: '' });
  };

  const handleShare = async () => {
    const msg = `REÇU — SILVERFIN\nRéf: ${receipt.ref}\nDate: ${receipt.date}\nClient: ${receipt.contact_nom}\nProduit: ${receipt.article_nom}\nQté: ×${receipt.quantite} · Prix unit: ${Number(receipt.prix_unitaire).toLocaleString('fr-FR')} F\nTOTAL: ${Number(receipt.prix_total).toLocaleString('fr-FR')} F\n\nSilver's Design © 2026`;
    try { await Share.share({ title: 'Reçu de vente', text: msg, dialogTitle: 'Partager le reçu' }); }
    catch (e) { console.error(e); }
  };

  /* ── REÇU ── */
  if (receipt) return (
    <>
      <style>{venteStyle}</style>
      <div className="vt-receipt-page">

        <div className="vt-receipt-topbar">
          <div>
            <div className="vt-receipt-topbar-title">Reçu de vente</div>
            <div className="vt-receipt-topbar-sub">Transaction enregistrée</div>
          </div>
          <div className="vt-receipt-status">
            <div className="vt-receipt-status-dot" />
            Confirmé
          </div>
        </div>

        <div className="vt-receipt-card receipt-to-print">
          <div className="vt-receipt-head">
            <span className="vt-receipt-brand">Silver<span>Fin</span></span>
            <span className="vt-receipt-id">Réf. {receipt.ref}</span>
          </div>

          <div className="vt-receipt-body">
            <div className="vt-receipt-row">
              <span className="vt-receipt-key">Date</span>
              <span className="vt-receipt-val mono">{receipt.date}</span>
            </div>
            <div className="vt-receipt-row">
              <span className="vt-receipt-key">Client</span>
              <span className="vt-receipt-val">{receipt.contact_nom}</span>
            </div>
            <div className="vt-receipt-row">
              <span className="vt-receipt-key">Produit</span>
              <span className="vt-receipt-val">{receipt.article_nom}</span>
            </div>
            <div className="vt-receipt-row">
              <span className="vt-receipt-key">Quantité</span>
              <span className="vt-receipt-val mono">× {receipt.quantite}</span>
            </div>
            <div className="vt-receipt-row">
              <span className="vt-receipt-key">Prix unitaire</span>
              <span className="vt-receipt-val mono">{Number(receipt.prix_unitaire).toLocaleString('fr-FR')} F</span>
            </div>
          </div>

          <div className="vt-receipt-total-row">
            <span className="vt-receipt-total-label">Total encaissé</span>
            <span className="vt-receipt-total-val">{Number(receipt.prix_total).toLocaleString('fr-FR')} F</span>
          </div>

          <div className="vt-receipt-footer">
            Merci de votre confiance · Silver's Design © 2026
          </div>
        </div>

        <div className="vt-actions no-print">
          {isMobile ? (
            <button className="vt-action-primary" onClick={handleShare}>
              {Icons.share} Partager le reçu
            </button>
          ) : (
            <button className="vt-action-primary" onClick={() => window.print()}>
              {Icons.print} Générer PDF
            </button>
          )}
          <button className="vt-action-ghost" onClick={() => setReceipt(null)}>
            {Icons.back} Nouvelle vente
          </button>
        </div>

      </div>
    </>
  );

  /* ── FORMULAIRE ── */
  return (
    <>
      <style>{venteStyle}</style>
      <div className="vt-card">

        <div className="vt-card-header">
          <div className="vt-card-header-left">
            <div className="vt-card-icon">{Icons.vente}</div>
            <div>
              <div className="vt-card-title">Nouvelle vente</div>
              <div className="vt-card-subtitle">Enregistrer une sortie de stock</div>
            </div>
          </div>
          <span className="vt-card-badge">Stock · Out</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vt-form-body">

            <div className="vt-field">
              <label className="vt-label">Article</label>
              <div className="vt-select-wrap">
                <select
                  className="vt-select"
                  value={saleData.article_id}
                  onChange={set('article_id')} required
                >
                  <option value="">— Sélectionner un produit —</option>
                  {articles.map(art => (
                    <option key={art.id} value={art.id} disabled={art.quantite_stock <= 0}>
                      {art.nom} · {art.quantite_stock} en stock
                    </option>
                  ))}
                </select>
                <span className="vt-select-chevron">{Icons.chevron}</span>
              </div>
              {stock && (
                <div className={`vt-stock-pill ${stock.type}`}>
                  <div className="vt-stock-dot" />
                  {stock.label}
                </div>
              )}
            </div>

            <div className="vt-field">
              <label className="vt-label">Client</label>
              <input
                className="vt-input" type="text"
                placeholder="Nom complet du client"
                value={saleData.contact_nom}
                onChange={set('contact_nom')} required
              />
            </div>

            <div className="vt-row">
              <div className="vt-field">
                <label className="vt-label">Quantité</label>
                <input
                  className="vt-input" type="number"
                  min="1" max={selectedArt?.quantite_stock}
                  value={saleData.quantite}
                  onChange={set('quantite')} required
                />
              </div>
              <div className="vt-field">
                <label className="vt-label">Prix unitaire (F)</label>
                <input
                  className="vt-input" type="number"
                  min="0" placeholder="0"
                  value={saleData.prix_unitaire}
                  onChange={set('prix_unitaire')} required
                />
              </div>
            </div>

            <div className="vt-total-box">
              <div className="vt-total-left">
                <span className="vt-total-label">Total à encaisser</span>
                <span className="vt-total-desc">
                  {saleData.quantite} × {Number(saleData.prix_unitaire).toLocaleString('fr-FR')} F
                </span>
              </div>
              <span className="vt-total-value">{total.toLocaleString('fr-FR')} F</span>
            </div>

            <div className="vt-divider" />

            <button type="submit" className="vt-submit no-print" disabled={!!stockInsuff}>
              {stockInsuff ? (
                <>{Icons.check} Stock insuffisant</>
              ) : (
                <>{Icons.check} Confirmer la vente</>
              )}
            </button>

          </div>
        </form>
      </div>
    </>
  );
};

export default VenteView;