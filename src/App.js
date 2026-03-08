import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar';
import { supabase } from './supabaseClient'; // Import du client Cloud
import Auth from './Auth'; // Import de l'écran de Login

// IMPORTATION DES MODULES JS
import DashboardView from './DashboardView';
import AchatView from './AchatView';
import VenteView from './VenteView';
import Transactions from './Transactions';
import './index.css';

const Navbar = ({ onLogout }) => (
  <nav className="bg-slate-900 border-b border-slate-800 p-4 pb-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between px-6 shadow-2xl sticky top-0 z-50 no-print">
    <div className="flex items-center gap-1">
      <span className="text-white font-black tracking-tighter text-sm">SILVER</span>
      <span className="text-emerald-500 font-black text-sm">-</span>
      <span className="text-slate-400 font-black tracking-tighter text-sm">FIN</span>
    </div>

    <div className="flex gap-3 md:gap-6 items-center">
      <Link to="/" className="text-slate-400 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-colors">📊 Dash</Link>
      <Link to="/achat" className="text-slate-400 hover:text-indigo-400 font-bold text-[10px] uppercase tracking-widest transition-colors">📥 Achats</Link>
      <Link to="/vente" className="text-slate-400 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-colors">💸 Ventes</Link>
      <button onClick={onLogout} className="text-rose-500 font-bold text-[10px] uppercase tracking-widest ml-2">Déconnexion</button>
    </div>
  </nav>
);

function App() {
  const [session, setSession] = useState(null);
  const [articles, setArticles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [situation, setSituation] = useState({ montant_depense: 0, montant_obtenu: 0, difference: 0 });

  // 1. GESTION DE LA SESSION (CLOUD)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    const setStatusBarStyle = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: '#0f172a' });
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {}
    };
    setStatusBarStyle();
  }, []);

  // 2. CHARGEMENT DES DONNÉES DEPUIS LE CLOUD
  const fetchData = async () => {
    if (!session?.user) return;

    const { data: artData } = await supabase.from('articles').select('*');
    const { data: transData } = await supabase.from('transactions').select('*').order('date', { ascending: false });

    if (artData) setArticles(artData);
    if (transData) setTransactions(transData);
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  // 3. CALCULS DE LA SITUATION
  useEffect(() => {
    const depenses = transactions.filter(t => t.type === 'ACHAT').reduce((sum, t) => sum + Number(t.montant), 0);
    const gains = transactions.filter(t => t.type === 'VENTE').reduce((sum, t) => sum + Number(t.montant), 0);

    setSituation({
      montant_depense: depenses,
      montant_obtenu: gains,
      difference: gains - depenses
    });
  }, [transactions]);

  // FONCTION : Approvisionnement (Push to Supabase)
  const handleAddAchat = async (data) => {
    const montantTotal = Number(data.prix_achat) * Number(data.quantite);
    const userId = session.user.id;

    // Enregistrer la transaction
    await supabase.from('transactions').insert([{
      user_id: userId,
      type: 'ACHAT',
      article: data.article_nom,
      montant: montantTotal
    }]);

    // Mettre à jour ou Créer l'article
    const existing = articles.find(a => a.nom.toLowerCase() === data.article_nom.toLowerCase());
    if (existing) {
      await supabase.from('articles').update({ 
        quantite_stock: Number(existing.quantite_stock) + Number(data.quantite) 
      }).eq('id', existing.id);
    } else {
      await supabase.from('articles').insert([{
        user_id: userId,
        nom: data.article_nom,
        quantite_stock: Number(data.quantite)
      }]);
    }

    fetchData(); // Rafraîchir tout
  };

  // FONCTION : Vente (Push to Supabase)
  const handleAddVente = async (data) => {
    const selectedArt = articles.find(a => a.id === data.article_id || a.id === Number(data.article_id));
    if (!selectedArt) return;

    const userId = session.user.id;

    // Enregistrer la transaction
    await supabase.from('transactions').insert([{
      user_id: userId,
      type: 'VENTE',
      article: selectedArt.nom,
      montant: Number(data.prix_vente)
    }]);

    // Déduire du stock
    await supabase.from('articles').update({ 
      quantite_stock: Number(selectedArt.quantite_stock) - Number(data.quantite) 
    }).eq('id', selectedArt.id);

    fetchData(); // Rafraîchir tout
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // SI PAS DE SESSION -> ÉCRAN DE LOGIN
  if (!session) return <Auth />;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
        <Navbar onLogout={handleLogout} />
        
        <main className="w-full max-w-2xl p-6 pb-24 animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<DashboardView situation={situation} />} />
            <Route path="/achat" element={<AchatView onAddAchat={handleAddAchat} />} />
            <Route path="/vente" element={<VenteView articles={articles} onAddVente={handleAddVente} />} />
            <Route path="/historique" element={<Transactions transactions={transactions} />} />
          </Routes>
        </main>

        <footer className="no-print mt-auto py-4 text-[8px] text-slate-700 uppercase tracking-[0.3em] font-bold">
          SILVER-FIN Cloud &copy; 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;