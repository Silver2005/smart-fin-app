import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar'; 
import { supabase } from './supabaseClient'; 
import Auth from './Auth'; 

// IMPORTATION DES MODULES JS
import HomeHub from './HomeHub'; 
import DashboardView from './DashboardView';
import AchatView from './AchatView';
import VenteView from './VenteView';
import Transactions from './Transactions';
import AchatGrosView from './AchatGrosView'; 
import ProductionView from './ProductionView'; 

import './index.css';

// --- NAVBAR MISE À JOUR (DYNAMIQUE ET AGRANDIE) ---
const Navbar = ({ onLogout }) => (
  <nav className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-2xl no-print">
    <div className="max-w-2xl mx-auto flex items-center justify-between h-20 px-6">
      
      {/* LOGO - Zone de clic plus large et interactive */}
      <Link to="/" className="flex items-center gap-1 group active:scale-95 transition-transform py-2">
        <span className="text-white font-black tracking-tighter text-lg italic">SILVER</span>
        <span className="text-emerald-500 font-black text-lg">-</span>
        <span className="text-slate-400 font-black tracking-tighter text-lg">FIN</span>
      </Link>

      {/* ACTIONS - Boutons plus gros pour le pouce */}
      <div className="flex gap-5 items-center">
        <Link 
          to="/historique" 
          title="Historique" 
          className="text-2xl p-3 hover:bg-slate-800 rounded-full transition-all active:scale-90"
        >
          📜
        </Link>
        
        <button 
          onClick={onLogout} 
          className="bg-rose-500 text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-900/20 active:scale-90 transition-all border border-rose-400/20"
        >
          Quitter
        </button>
      </div>
    </div>
  </nav>
);

function App() {
  const [session, setSession] = useState(null);
  const [articles, setArticles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [situation, setSituation] = useState({ montant_depense: 0, montant_obtenu: 0, difference: 0 });

  // --- RÉCUPÉRATION DES DONNÉES ---
  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;

    const { data: artData } = await supabase
      .from('articles')
      .select('*')
      .eq('user_id', session.user.id)
      .order('nom');

    const { data: transData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    if (artData) setArticles(artData);
    if (transData) setTransactions(transData);
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    
    const initStatusBar = async () => {
      try {
        if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
          await StatusBar.setBackgroundColor({ color: '#0f172a' });
          await StatusBar.setStyle({ style: Style.Dark });
        }
      } catch (e) {
        console.log("Mode Web : StatusBar ignorée");
      }
    };

    initStatusBar();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  // --- CALCUL DU SOLDE ---
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
        setSituation({ montant_depense: 0, montant_obtenu: 0, difference: 0 });
        return;
    }
    const depenses = transactions
      .filter(t => t.type === 'ACHAT' || t.type === 'PRODUCTION')
      .reduce((sum, t) => sum + (parseFloat(t.montant) || 0), 0);
    const gains = transactions
      .filter(t => t.type === 'VENTE')
      .reduce((sum, t) => sum + (parseFloat(t.montant) || 0), 0);
    setSituation({ montant_depense: depenses, montant_obtenu: gains, difference: gains - depenses });
  }, [transactions]);

  // --- LOGIQUE MÉTIER ---
  const handleAddAchat = async (data) => {
    if (!session?.user?.id) return;
    const montantTotal = Number(data.prix_achat) * Number(data.quantite);
    const type = data.contact === "PRODUCTION INTERNE" ? "PRODUCTION" : "ACHAT";
    
    await supabase.from('transactions').insert([{
      user_id: session.user.id, type, article: data.article_nom,
      montant: montantTotal, quantite: Number(data.quantite), contact: data.contact || 'Anonyme'
    }]);

    const existing = articles.find(a => a.nom.toLowerCase() === data.article_nom.toLowerCase());
    if (existing) {
      await supabase.from('articles')
        .update({ quantite_stock: Number(existing.quantite_stock) + Number(data.quantite) })
        .eq('id', existing.id);
    } else {
      await supabase.from('articles').insert([{ 
        user_id: session.user.id, nom: data.article_nom, quantite_stock: Number(data.quantite) 
      }]);
    }
    fetchData(); 
  };

  const handleAddVente = async (data) => {
    if (!session?.user?.id) return;
    const selectedArt = articles.find(a => a.id === Number(data.article_id));
    if (!selectedArt) return;

    await supabase.from('transactions').insert([{
      user_id: session.user.id, type: 'VENTE', article: selectedArt.nom,
      montant: Number(data.prix_vente), quantite: Number(data.quantite), contact: data.contact || 'Client'
    }]);

    await supabase.from('articles')
      .update({ quantite_stock: Math.max(0, Number(selectedArt.quantite_stock) - Number(data.quantite)) })
      .eq('id', selectedArt.id);

    fetchData();
  };

  if (!session) return <Auth />;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
        <Navbar onLogout={() => supabase.auth.signOut()} />
        
        {/* Contenu principal avec une marge pour ne pas être collé sous la navbar sticky */}
        <main className="w-full max-w-2xl p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Routes>
            <Route path="/" element={<HomeHub situation={situation} transactions={transactions} />} />
            <Route path="/achat" element={<AchatView onAddAchat={handleAddAchat} />} />
            <Route path="/vente" element={<VenteView articles={articles} onAddVente={handleAddVente} />} />
            <Route path="/historique" element={<Transactions transactions={transactions} onRefresh={fetchData} />} />
            <Route path="/stats" element={<DashboardView situation={situation} transactions={transactions} articles={articles} />} />
            <Route path="/achat-gros" element={<AchatGrosView onAddAchat={handleAddAchat} />} />
            <Route path="/production" element={<ProductionView onAddAchat={handleAddAchat} />} />
          </Routes>
        </main>

        <footer className="mt-auto py-12 text-center w-full opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.4em]">Développé par <span className="text-indigo-500">Silver's Design</span></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;