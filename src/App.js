import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar';
import { supabase } from './supabaseClient';
import Auth from './Auth';

import DashboardView from './DashboardView';
import AchatView from './AchatView';
import VenteView from './VenteView';
import Transactions from './Transactions';
import './index.css';

const appStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --navy-950:  #050d1a;
    --navy-900:  #0a1628;
    --navy-800:  #0f2044;
    --blue-500:  #2563eb;
    --blue-400:  #3b82f6;
    --blue-300:  #93c5fd;
    --success:   #10b981;
    --danger:    #ef4444;
    --border:    rgba(255,255,255,0.07);
    --border-active: rgba(59,130,246,0.35);
    --text-primary:   #f1f5f9;
    --text-secondary: #64748b;
    --text-muted:     #334155;
    --surface:        #0c1a2e;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--navy-950);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
  }

  /* ══════════════════════════
     NAVBAR
  ══════════════════════════ */
  .app-nav {
    position: sticky; top: 0; z-index: 100;
    height: 52px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    background: rgba(5,13,26,0.92);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
  }

  /* Logo */
  .app-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none;
  }
  .app-logo-icon {
    width: 28px; height: 28px;
    background: var(--blue-500);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .app-logo-icon svg { width: 14px; height: 14px; color: white; }
  .app-logo-name {
    font-size: 13px; font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  .app-logo-name span { color: var(--blue-400); }

  /* Nav links */
  .app-nav-links {
    display: flex; align-items: center; gap: 2px;
  }
  .app-nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 10px;
    border-radius: 7px;
    font-size: 12px; font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
    white-space: nowrap;
  }
  .app-nav-link svg { width: 13px; height: 13px; flex-shrink: 0; }
  .app-nav-link:hover {
    color: var(--text-primary);
    background: rgba(255,255,255,0.05);
  }
  .app-nav-link.active {
    color: var(--blue-400);
    background: rgba(59,130,246,0.1);
  }
  .app-nav-link.active svg { color: var(--blue-400); }

  /* Separator */
  .app-nav-sep {
    width: 1px; height: 16px;
    background: var(--border);
    margin: 0 4px;
    flex-shrink: 0;
  }

  /* Logout */
  .app-logout {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 10px;
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--text-muted);
    background: transparent;
    border: none; cursor: pointer;
    transition: color 0.15s, background 0.15s;
  }
  .app-logout svg { width: 13px; height: 13px; }
  .app-logout:hover {
    color: var(--danger);
    background: rgba(239,68,68,0.08);
  }

  /* ══════════════════════════
     MAIN
  ══════════════════════════ */
  .app-main {
    width: 100%; max-width: 600px;
    margin: 0 auto;
    padding: 24px 16px 80px;
    animation: pageIn 0.3s ease both;
  }
  @keyframes pageIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ══════════════════════════
     FOOTER
  ══════════════════════════ */
  .app-footer {
    text-align: center;
    padding: 20px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .app-footer-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--text-muted);
  }
  .app-footer-text {
    font-size: 10px; font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* ══════════════════════════
     PRINT
  ══════════════════════════ */
  @media print {
    .no-print, .app-nav, .app-footer { display: none !important; }
    body { background: white !important; color: black !important; }
    .app-main { max-width: 100% !important; padding: 0 !important; }
  }
`;

/* SVG Icons */
const Icons = {
  logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  achat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>,
  vente: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`app-nav-link ${isActive ? 'active' : ''}`}>
      {icon}
      {label}
    </Link>
  );
};

const Navbar = ({ onLogout }) => (
  <nav className="app-nav no-print">
    <Link to="/" className="app-logo">
      <div className="app-logo-icon">{Icons.logo}</div>
      <span className="app-logo-name">Silver<span>Fin</span></span>
    </Link>

    <div className="app-nav-links">
      <NavLink to="/"           icon={Icons.dashboard} label="Tableau de bord" />
      <NavLink to="/achat"      icon={Icons.achat}     label="Achats" />
      <NavLink to="/vente"      icon={Icons.vente}     label="Ventes" />
      <NavLink to="/historique" icon={Icons.history}   label="Historique" />
      <div className="app-nav-sep" />
      <button className="app-logout" onClick={onLogout}>
        {Icons.logout}
        Déconnexion
      </button>
    </div>
  </nav>
);

function App() {
  const [session, setSession]           = useState(null);
  const [articles, setArticles]         = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [situation, setSituation]       = useState({ montant_depense: 0, montant_obtenu: 0, difference: 0 });

  const fetchData = useCallback(async () => {
    if (!session?.user) return;
    const { data: artData }   = await supabase.from('articles').select('*');
    const { data: transData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (artData)   setArticles(artData);
    if (transData) setTransactions(transData);
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    const applyStatusBar = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: '#050d1a' });
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (_) {}
    };
    applyStatusBar();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const depenses = transactions.filter(t => t.type === 'ACHAT').reduce((s, t) => s + Number(t.montant), 0);
    const gains    = transactions.filter(t => t.type === 'VENTE').reduce((s, t) => s + Number(t.montant), 0);
    setSituation({ montant_depense: depenses, montant_obtenu: gains, difference: gains - depenses });
  }, [transactions]);

  const handleAddAchat = async (data) => {
    const montantTotal = Number(data.prix_achat) * Number(data.quantite);
    const userId = session.user.id;
    await supabase.from('transactions').insert([{ user_id: userId, type: 'ACHAT', article: data.article_nom, montant: montantTotal }]);
    const existing = articles.find(a => a.nom.toLowerCase() === data.article_nom.toLowerCase());
    if (existing) {
      await supabase.from('articles').update({ quantite_stock: Number(existing.quantite_stock) + Number(data.quantite) }).eq('id', existing.id);
    } else {
      await supabase.from('articles').insert([{ user_id: userId, nom: data.article_nom, quantite_stock: Number(data.quantite) }]);
    }
    fetchData();
  };

  const handleAddVente = async (data) => {
    const selectedArt = articles.find(a => a.id === Number(data.article_id));
    if (!selectedArt) return;
    await supabase.from('transactions').insert([{ user_id: session.user.id, type: 'VENTE', article: selectedArt.nom, montant: Number(data.prix_vente) }]);
    await supabase.from('articles').update({ quantite_stock: Number(selectedArt.quantite_stock) - Number(data.quantite) }).eq('id', selectedArt.id);
    fetchData();
  };

  if (!session) return <Auth />;

  return (
    <Router>
      <style>{appStyle}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy-950)' }}>

        <Navbar onLogout={() => supabase.auth.signOut()} />

        <main className="app-main">
          <Routes>
            <Route path="/"           element={<DashboardView situation={situation} />} />
            <Route path="/achat"      element={<AchatView onAddAchat={handleAddAchat} />} />
            <Route path="/vente"      element={<VenteView articles={articles} onAddVente={handleAddVente} />} />
            <Route path="/historique" element={<Transactions transactions={transactions} />} />
          </Routes>
        </main>

        <footer className="app-footer no-print" style={{ marginTop: 'auto' }}>
          <div className="app-footer-dot" />
          <span className="app-footer-text">SilverFin</span>
          <div className="app-footer-dot" />
          <span className="app-footer-text">Silver's Design © 2026</span>
          <div className="app-footer-dot" />
        </footer>

      </div>
    </Router>
  );
}

export default App;