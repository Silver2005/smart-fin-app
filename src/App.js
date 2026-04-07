import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar'; 
import { supabase } from './supabaseClient'; 
import { 
  User, 
  LogOut, 
  History, 
  LayoutDashboard, 
  Mail, 
  Calendar,
  ShieldCheck
} from 'lucide-react';

// IMPORTATION DES MODULES
import Welcome from './Welcome'; 
import Auth from './Auth'; 
import HomeHub from './HomeHub'; 
import DashboardView from './DashboardView';
import AchatView from './AchatView';
import VenteView from './VenteView';
import Transactions from './Transactions';
import AchatGrosView from './AchatGrosView'; 
import ProductionView from './ProductionView'; 
import GestionFinanciere from './GestionFinanciere';

import './index.css';

// --- COMPOSANT PROFILE VIEW ---
const ProfileView = ({ session }) => {
  const user = session?.user;
  const { first_name, last_name } = user?.user_metadata || {};

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center py-10 bg-slate-900/50 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-slate-900 text-4xl font-black mb-4 shadow-xl shadow-emerald-500/20 uppercase">
            {first_name ? first_name.charAt(0) : user.email.charAt(0)}
          </div>
          <div className="absolute bottom-4 right-0 bg-slate-950 p-1.5 rounded-full border border-emerald-500/50">
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
        </div>
        
        <h2 className="text-xl font-black text-white tracking-tight uppercase">
          {first_name ? `${first_name} ${last_name}` : user.email.split('@')[0]}
        </h2>
        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mt-1">Admin Silver-Fin</p>
      </div>

      <div className="grid gap-3">
        <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Identité</p>
                <p className="text-sm font-bold text-slate-200 uppercase">{first_name || 'Utilisateur'} {last_name || ''}</p>
              </div>
           </div>
        </div>
        
        <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Email</p>
            <p className="text-sm font-bold text-slate-200">{user.email}</p>
          </div>
        </div>
        
        <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Dernière Connexion</p>
            <p className="text-sm font-bold text-slate-200">
              {new Date(user.last_sign_in_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
        className="w-full flex items-center justify-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black py-6 rounded-[2.2rem] uppercase text-[11px] tracking-[0.2em] active:scale-95 transition-all"
      >
        <LogOut size={18} /> Déconnexion Sécurisée
      </button>
    </div>
  );
};

// --- NAVBAR ---
const Navbar = ({ session }) => {
  const { first_name } = session?.user?.user_metadata || {};
  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 no-print">
      <div className="max-w-2xl mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/dashboard" className="flex items-center gap-1 group active:scale-95 transition-transform">
          <span className="text-white font-black tracking-tighter text-xl italic">SILVER</span>
          <span className="text-emerald-500 font-black text-xl">-</span>
          <span className="text-slate-400 font-black tracking-tighter text-xl">FIN</span>
        </Link>

        <div className="flex gap-3 items-center">
          <Link to="/historique" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white/5 rounded-2xl transition-all">
            <History size={20} />
          </Link>
          <Link to="/stats" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white/5 rounded-2xl transition-all">
            <LayoutDashboard size={20} />
          </Link>
          <Link 
            to="/profile" 
            className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-slate-900 font-black text-sm hover:scale-105 transition-all active:scale-90 uppercase shadow-lg shadow-emerald-500/20"
          >
            {first_name ? first_name.charAt(0) : session?.user?.email?.charAt(0).toUpperCase()}
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [situation, setSituation] = useState({ montant_depense: 0, montant_obtenu: 0, difference: 0 });

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: artData } = await supabase.from('articles').select('*').eq('user_id', user.id).order('nom');
    const { data: transData } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

    if (artData) setArticles(artData);
    if (transData) setTransactions(transData);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const initStatusBar = async () => {
      try {
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
          await StatusBar.setBackgroundColor({ color: '#020617' });
          await StatusBar.setStyle({ style: Style.Dark });
        }
      } catch (e) { console.log("Web mode"); }
    };
    initStatusBar();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  useEffect(() => {
    if (!transactions.length) {
      setSituation({ montant_depense: 0, montant_obtenu: 0, difference: 0 });
      return;
    }
    const depenses = transactions
      .filter(t => ['ACHAT', 'PRODUCTION', 'depense'].includes(t.type))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const gains = transactions
      .filter(t => ['VENTE', 'entree'].includes(t.type))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    setSituation({ montant_depense: depenses, montant_obtenu: gains, difference: gains - depenses });
  }, [transactions]);

  const handleActionWrapper = async (func, data) => {
    await func(data);
    fetchData();
  };

  const handleAddAchat = async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    const montantTotal = Number(data.prix_achat) * Number(data.quantite);
    const type = data.contact === "PRODUCTION INTERNE" ? "PRODUCTION" : "ACHAT";
    
    await supabase.from('transactions').insert([{
      user_id: user.id, type, category: 'Commerce', amount: montantTotal, description: data.article_nom, contact: data.contact || 'Fournisseur'
    }]);

    const existing = articles.find(a => a.nom.toLowerCase() === data.article_nom.toLowerCase());
    if (existing) {
      await supabase.from('articles').update({ quantite_stock: Number(existing.quantite_stock) + Number(data.quantite) }).eq('id', existing.id);
    } else {
      await supabase.from('articles').insert([{ user_id: user.id, nom: data.article_nom, quantite_stock: Number(data.quantite) }]);
    }
  };

  const handleAddVente = async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    const selectedArt = articles.find(a => a.id === Number(data.article_id));
    if (!selectedArt) return;

    await supabase.from('transactions').insert([{
      user_id: user.id, type: 'VENTE', category: 'Commerce', amount: Number(data.prix_vente), description: selectedArt.nom, contact: data.contact || 'Client'
    }]);

    await supabase.from('articles').update({ quantite_stock: Math.max(0, Number(selectedArt.quantite_stock) - Number(data.quantite)) }).eq('id', selectedArt.id);
  };

  if (loading) return <div className="min-h-screen bg-slate-950" />;

  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-white flex flex-col selection:bg-emerald-500/30">
        {session && <Navbar session={session} />}
        
        <main className={`w-full max-w-2xl mx-auto p-6 ${session ? 'pb-24' : 'p-0 max-w-none'}`}>
          <Routes>
            <Route path="/" element={!session ? <Welcome /> : <Navigate to="/dashboard" />} />
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={session ? <HomeHub situation={situation} /> : <Navigate to="/" />} />
            <Route path="/achat" element={session ? <AchatView onAddAchat={(d) => handleActionWrapper(handleAddAchat, d)} /> : <Navigate to="/auth" />} />
            <Route path="/vente" element={session ? <VenteView articles={articles} onAddVente={(d) => handleActionWrapper(handleAddVente, d)} /> : <Navigate to="/auth" />} />
            <Route path="/historique" element={session ? <Transactions transactions={transactions} onRefresh={fetchData} /> : <Navigate to="/auth" />} />
            <Route path="/stats" element={session ? <DashboardView situation={situation} transactions={transactions} articles={articles} /> : <Navigate to="/auth" />} />
            <Route path="/achat-gros" element={session ? <AchatGrosView onAddAchat={(d) => handleActionWrapper(handleAddAchat, d)} /> : <Navigate to="/auth" />} />
            <Route path="/production" element={session ? <ProductionView onAddAchat={(d) => handleActionWrapper(handleAddAchat, d)} /> : <Navigate to="/auth" />} />
            <Route path="/gestion-financiere" element={session ? <GestionFinanciere onRefresh={fetchData} /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={session ? <ProfileView session={session} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>

        <footer className="mt-auto py-8 text-center w-full opacity-20 pointer-events-none">
          <p className="text-[8px] font-black uppercase tracking-[0.5em]">DÉVELOPPÉ PAR SILVERS DESIGN</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;