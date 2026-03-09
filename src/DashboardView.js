import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView = ({ situation, transactions = [], articles = [] }) => {
  const navigate = useNavigate();

  // --- LOGIQUE : TOP ARTICLES ---
  const topArticles = transactions
    .filter(t => t.type === 'VENTE')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.nom === t.article);
      if (existing) {
        existing.total += Number(t.montant);
        existing.qty += 1;
      } else {
        acc.push({ nom: t.article, total: Number(t.montant), qty: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // --- LOGIQUE : TOP CLIENTS ---
  const topClients = transactions
    .filter(t => t.type === 'VENTE' && t.contact)
    .reduce((acc, t) => {
      const existing = acc.find(c => c.nom === t.contact);
      if (existing) {
        existing.total += Number(t.montant);
      } else {
        acc.push({ nom: t.contact, total: Number(t.montant) });
      }
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // --- LOGIQUE : ALERTES DE STOCK ---
  const lowStockArticles = articles.filter(a => a.quantite_stock <= 5);

  const dataGraph = [
    { name: 'Sorties', s: situation.montant_depense },
    { name: 'Entrées', s: situation.montant_obtenu },
    { name: 'Solde', s: situation.difference },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* --- EN-TÊTE AVEC BOUTON RETOUR --- */}
      <div className="flex items-center gap-4 mb-4 no-print">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 shadow-lg"
        >
          ←
        </button>
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Analyses <span className="text-indigo-500">&</span> Performance
        </h2>
      </div>

      {/* ÉTAT DE CAISSE */}
      <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-2 right-4 opacity-10 text-4xl font-black italic select-none text-slate-500">SILVER-FIN</div>
        <h1 className="text-[10px] font-black mb-4 text-slate-500 uppercase tracking-[0.3em] border-b border-slate-800/50 pb-2">État de Caisse</h1>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 italic font-medium text-xs">Total Sorties (Achats/Prod)</span>
            <span className="text-rose-400 font-bold">-{situation.montant_depense.toLocaleString()} F</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 italic font-medium text-xs">Total Entrées (Ventes)</span>
            <span className="text-emerald-400 font-bold">+{situation.montant_obtenu.toLocaleString()} F</span>
          </div>
          <div className="pt-4 border-t border-dashed border-slate-700 flex justify-between items-end">
            <span className="text-xs uppercase font-black text-slate-300 tracking-tighter">Net Disponible</span>
            <span className={`text-3xl font-black tracking-tighter ${situation.difference >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {situation.difference.toLocaleString()} <span className="text-xs">F</span>
            </span>
          </div>
        </div>

        <button onClick={() => window.print()} className="w-full py-4 bg-slate-950 hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all no-print border border-slate-800 text-slate-400 flex items-center justify-center gap-2">
          🖨️ Générer un Rapport PDF
        </button>
      </div>

      {/* GRAPHIQUE DE PERFORMANCE */}
      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 h-56 shadow-xl no-print relative">
        <p className="text-[9px] font-black text-slate-600 uppercase mb-4 tracking-widest text-center">Tendance de flux</p>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={dataGraph}>
            <defs>
              <linearGradient id="colorSolde" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold'}} />
            <Area type="monotone" dataKey="s" stroke="#6366f1" strokeWidth={3} fill="url(#colorSolde)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ALERTES STOCK FAIBLE */}
      {lowStockArticles.length > 0 && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-rose-900/30 shadow-xl border-l-4 border-l-rose-500 animate-pulse">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4 flex items-center gap-2">
            ⚠️ Vigilance Stock
          </h3>
          <div className="space-y-2">
            {lowStockArticles.map((art, index) => (
              <div key={index} className="flex justify-between items-center bg-rose-500/5 p-3 rounded-2xl border border-rose-500/10">
                <span className="text-xs font-bold text-slate-200 uppercase">{art.nom}</span>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full ${art.quantite_stock === 0 ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-500'}`}>
                  {art.quantite_stock === 0 ? 'RUPTURE' : `${art.quantite_stock} RESTANTS`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION TOP (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TOP ARTICLES */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 italic">⭐ Top Produits</h3>
          <div className="space-y-4">
            {topArticles.length > 0 ? topArticles.map((art, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-700">0{index + 1}</span>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tight">{art.nom}</span>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    {art.total.toLocaleString()} F
                </span>
              </div>
            )) : (
              <p className="text-[10px] text-slate-700 italic text-center py-4">Aucune vente enregistrée</p>
            )}
          </div>
        </div>

        {/* TOP CLIENTS */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 italic">👤 Fidélité Clients</h3>
          <div className="space-y-4">
            {topClients.length > 0 ? topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tight">{client.nom}</span>
                </div>
                <span className="text-xs font-black text-indigo-400">
                    {client.total.toLocaleString()} F
                </span>
              </div>
            )) : (
              <p className="text-[10px] text-slate-700 italic text-center py-4">Pas de données clients</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardView;