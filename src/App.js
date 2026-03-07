import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar'; // Pour un look pro sur Android

// IMPORTATION DES MODULES JS
import DashboardView from './DashboardView';
import AchatView from './AchatView';
import VenteView from './VenteView';
import Transactions from './Transactions';
import './index.css';

const Navbar = () => (
  <nav className="bg-slate-900 border-b border-slate-800 p-4 pb-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between px-6 shadow-2xl sticky top-0 z-50 no-print">
    {/* LOGO SILVER-FIN */}
    <div className="flex items-center gap-1">
      <span className="text-white font-black tracking-tighter text-sm">SILVER</span>
      <span className="text-emerald-500 font-black text-sm">-</span>
      <span className="text-slate-400 font-black tracking-tighter text-sm">FIN</span>
    </div>

    {/* LIENS DE NAVIGATION */}
    <div className="flex gap-4 md:gap-8">
      <Link to="/" className="text-slate-400 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-colors">📊 Dash</Link>
      <Link to="/achat" className="text-slate-400 hover:text-indigo-400 font-bold text-[10px] uppercase tracking-widest transition-colors">📥 Achats</Link>
      <Link to="/vente" className="text-slate-400 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-colors">💸 Ventes</Link>
      <Link to="/historique" className="text-white bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-700 font-bold text-[10px] uppercase tracking-widest transition-all">📜 Journal</Link>
    </div>
  </nav>
);

function App() {
  const [articles, setArticles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [situation, setSituation] = useState({ montant_depense: 0, montant_obtenu: 0, difference: 0 });

  // 1. INITIALISATION SYSTEME (Status Bar & Chargement)
  useEffect(() => {
    // Configuration de la barre de notifications Android
    const setStatusBarStyle = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: '#0f172a' }); // Slate-900
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
        console.log("Not on mobile or StatusBar plugin missing");
      }
    };
    setStatusBarStyle();

    // Récupération des données SILVER-FIN
    const savedArticles = JSON.parse(localStorage.getItem('silver_articles') || '[]');
    const savedTrans = JSON.parse(localStorage.getItem('silver_transactions') || '[]');
    setArticles(savedArticles);
    setTransactions(savedTrans);
  }, []);

  // 2. CALCULS & SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    const depenses = transactions
      .filter(t => t.type === 'ACHAT')
      .reduce((sum, t) => sum + Number(t.montant), 0);
    
    const gains = transactions
      .filter(t => t.type === 'VENTE')
      .reduce((sum, t) => sum + Number(t.montant), 0);

    setSituation({
      montant_depense: depenses,
      montant_obtenu: gains,
      difference: gains - depenses
    });

    // Sauvegarde sous le nouveau nom de domaine local
    localStorage.setItem('silver_articles', JSON.stringify(articles));
    localStorage.setItem('silver_transactions', JSON.stringify(transactions));
  }, [articles, transactions]);

  // FONCTION : Approvisionnement
  const handleAddAchat = (data) => {
    const montantTotal = Number(data.prix_achat) * Number(data.quantite);
    
    const newTrans = {
      id: Date.now(),
      type: 'ACHAT',
      article: data.article_nom,
      montant: montantTotal,
      date: new Date().toISOString() // Format ISO plus fiable pour le tri
    };

    const existingIndex = articles.findIndex(a => a.nom.toLowerCase() === data.article_nom.toLowerCase());
    let updatedArticles = [...articles];

    if (existingIndex > -1) {
      updatedArticles[existingIndex].quantite_stock += Number(data.quantite);
    } else {
      updatedArticles.push({
        id: Date.now(),
        nom: data.article_nom,
        quantite_stock: Number(data.quantite)
      });
    }

    setArticles(updatedArticles);
    setTransactions([newTrans, ...transactions]);
  };

  // FONCTION : Vente
  const handleAddVente = (data) => {
    const selectedArt = articles.find(a => a.id === Number(data.article_id));
    if (!selectedArt) return;

    const newTrans = {
      id: Date.now(),
      type: 'VENTE',
      article: selectedArt.nom,
      montant: Number(data.prix_vente),
      date: new Date().toISOString()
    };

    const updatedArticles = articles.map(art => {
      if (art.id === Number(data.article_id)) {
        return { ...art, quantite_stock: art.quantite_stock - Number(data.quantite) };
      }
      return art;
    });

    setArticles(updatedArticles);
    setTransactions([newTrans, ...transactions]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
        <Navbar />
        
        {/* Conteneur Principal avec marge de sécurité basse pour mobile */}
        <main className="w-full max-w-2xl p-6 pb-24 animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<DashboardView situation={situation} />} />
            <Route path="/achat" element={<AchatView onAddAchat={handleAddAchat} />} />
            <Route path="/vente" element={<VenteView articles={articles} onAddVente={handleAddVente} />} />
            <Route path="/historique" element={<Transactions transactions={transactions} />} />
          </Routes>
        </main>

        {/* Pied de page discret */}
        <footer className="no-print mt-auto py-4 text-[8px] text-slate-700 uppercase tracking-[0.3em] font-bold">
          Powered by SILVER'S DESIGN &copy; 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;