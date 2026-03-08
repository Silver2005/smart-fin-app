import React, { useState } from 'react';

const achatStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --navy-950:  #050d1a;
    --navy-900:  #0a1628;
    --surface:   #0c1a2e;
    --surface-2: #0f2040;
    --blue-500:  #2563eb;
    --blue-400:  #3b82f6;
    --blue-300:  #93c5fd;
    --success:   #10b981;
    --danger:    #ef4444;
    --warning:   #f59e0b;
    --border:         rgba(255,255,255,0.07);
    --border-focus:   rgba(59,130,246,0.4);
    --text-primary:   #f1f5f9;
    --text-secondary: #64748b;
    --text-muted:     #334155;
  }

  /* ── CARD ── */
  .ac-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    animation: acIn 0.3s ease both;
  }
  @keyframes acIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── CARD HEADER ── */
  .ac-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
  }
  .ac-card-header-left { display: flex; align-items: center; gap: 10px; }
  .ac-card-icon {
    width: 32px; height: 32px;
    background: rgba(59,130,246,0.1);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: var(--blue-400);
  }
  .ac-card-icon svg { width: 15px; height: 15px; }
  .ac-card-title {
    font-size: 14px; font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .ac-card-subtitle {
    font-size: 11px; color: var(--text-secondary);
    margin-top: 1px;
  }
  .ac-card-badge {
    font-size: 10px; font-weight: 500;
    color: var(--blue-400);
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.15);
    padding: 3px 9px; border-radius: 20px;
    letter-spacing: 0.02em;
  }

  /* ── FORM BODY ── */
  .ac-form-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  /* ── FIELD ── */
  .ac-field { display: flex; flex-direction: column; gap: 6px; }
  .ac-label {
    font-size: 11px; font-weight: 500;
    color: var(--text-secondary);
    letter-spacing: 0.01em;
  }
  .ac-input {
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
  .ac-input::placeholder { color: var(--text-muted); font-size: 12px; }
  .ac-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
    background: rgba(5,13,26,0.9);
  }

  /* ── ROW ── */
  .ac-row { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; }

  /* ── TOTAL BOX ── */
  .ac-total-box {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px;
    background: rgba(59,130,246,0.05);
    border: 1px solid rgba(59,130,246,0.12);
    border-radius: 10px;
  }
  .ac-total-left { display: flex; flex-direction: column; gap: 2px; }
  .ac-total-label {
    font-size: 10px; font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .ac-total-desc { font-size: 11px; color: var(--text-secondary); }
  .ac-total-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px; font-weight: 500;
    color: var(--blue-400);
    letter-spacing: -0.02em;
  }

  /* ── DIVIDER ── */
  .ac-divider { height: 1px; background: var(--border); margin: 0 -20px; }

  /* ── SUBMIT ── */
  .ac-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px;
    background: var(--blue-500);
    border: none; border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    color: white; cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 2px 12px rgba(37,99,235,0.25);
    letter-spacing: -0.01em;
  }
  .ac-submit svg { width: 15px; height: 15px; }
  .ac-submit:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 20px rgba(37,99,235,0.35);
  }
  .ac-submit:active { transform: scale(0.99); }

  /* ── TOAST ── */
  .ac-toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 10px;
    padding: 11px 18px;
    background: #0c1a2e;
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--success);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    white-space: nowrap; z-index: 9999;
    animation: toastIn 0.3s ease both, toastOut 0.3s 2.3s ease forwards;
  }
  .ac-toast svg { width: 14px; height: 14px; flex-shrink: 0; }
  @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes toastOut { to{opacity:0;transform:translateX(-50%) translateY(6px)} }
`;

const AchatView = ({ onAddAchat }) => {
  const [formData, setFormData] = useState({
    contact_nom: '',
    article_nom: '',
    quantite: 1,
    prix_achat: 0
  });
  const [toast, setToast] = useState(false);

  const total = Number(formData.quantite) * Number(formData.prix_achat);
  const set = (key) => (e) => setFormData(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.quantite) <= 0 || Number(formData.prix_achat) <= 0) return;
    onAddAchat(formData);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
    setFormData({ contact_nom: '', article_nom: '', quantite: 1, prix_achat: 0 });
  };

  return (
    <>
      <style>{achatStyle}</style>

      <div className="ac-card">
        {/* Header */}
        <div className="ac-card-header">
          <div className="ac-card-header-left">
            <div className="ac-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div>
              <div className="ac-card-title">Nouvel approvisionnement</div>
              <div className="ac-card-subtitle">Enregistrer une entrée de stock</div>
            </div>
          </div>
          <span className="ac-card-badge">Stock · In</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="ac-form-body">

            <div className="ac-field">
              <label className="ac-label">Désignation de l'article</label>
              <input
                className="ac-input" type="text"
                placeholder="Ex : T-shirt XL Noir"
                value={formData.article_nom}
                onChange={set('article_nom')} required
              />
            </div>

            <div className="ac-field">
              <label className="ac-label">Fournisseur / Source</label>
              <input
                className="ac-input" type="text"
                placeholder="Nom du fournisseur"
                value={formData.contact_nom}
                onChange={set('contact_nom')} required
              />
            </div>

            <div className="ac-row">
              <div className="ac-field">
                <label className="ac-label">Quantité</label>
                <input
                  className="ac-input" type="number" min="1"
                  value={formData.quantite}
                  onChange={set('quantite')} required
                />
              </div>
              <div className="ac-field">
                <label className="ac-label">Prix unitaire (F)</label>
                <input
                  className="ac-input" type="number" min="0"
                  placeholder="0"
                  value={formData.prix_achat}
                  onChange={set('prix_achat')} required
                />
              </div>
            </div>

            {/* Total */}
            <div className="ac-total-box">
              <div className="ac-total-left">
                <span className="ac-total-label">Investissement total</span>
                <span className="ac-total-desc">{formData.quantite} × {Number(formData.prix_achat).toLocaleString('fr-FR')} F</span>
              </div>
              <span className="ac-total-value">{total.toLocaleString('fr-FR')} F</span>
            </div>

            <div className="ac-divider" />

            {/* Submit */}
            <button type="submit" className="ac-submit no-print">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Valider l'entrée stock
            </button>

          </div>
        </form>
      </div>

      {toast && (
        <div className="ac-toast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Stock mis à jour avec succès
        </div>
      )}
    </>
  );
};

export default AchatView;