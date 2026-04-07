import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, Legend
} from 'recharts';

const GestionFinanciere = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('depense');
  const [category, setCategory] = useState('Nourriture');
  const [debtPerson, setDebtPerson] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtType, setDebtType] = useState('du_a_moi');

  // Utilisation de useCallback pour éviter les avertissements de dépendances
  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: transData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const { data: debtData } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (transData) setTransactions(transData);
    if (debtData) setDebts(debtData);
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount) return;
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('transactions').insert([{ 
        type, 
        amount: parseFloat(amount), 
        category, 
        user_id: user.id,
        description: `Gestion Perso: ${category}`
    }]);
    
    setAmount(''); 
    fetchData();
  };

  const handleAddDebt = async (e) => {
    e.preventDefault();
    if (!debtAmount || !debtPerson) return;
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('debts').insert([{ 
        person_name: debtPerson, 
        amount: parseFloat(debtAmount), 
        type: debtType, 
        user_id: user.id 
    }]);

    setDebtAmount(''); 
    setDebtPerson(''); 
    fetchData();
  };

  // --- LOGIQUE DE CALCUL ---
  const totalEntrees = transactions.filter(t => t.type === 'entree').reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalDepenses = transactions.filter(t => ['depense', 'ACHAT', 'PRODUCTION'].includes(t.type)).reduce((acc, t) => acc + (t.amount || 0), 0);
  const soldeReel = totalEntrees - totalDepenses;
  const ratioUtilisation = totalEntrees > 0 ? Math.round((totalDepenses / totalEntrees) * 100) : 0;
  
  const totalOnMeDoit = debts.filter(d => d.type === 'du_a_moi').reduce((acc, d) => acc + (d.amount || 0), 0);
  const totalJeDois = debts.filter(d => d.type === 'du_par_moi').reduce((acc, d) => acc + (d.amount || 0), 0);
  const valeurNette = soldeReel + totalOnMeDoit - totalJeDois;

  const dataBars = [
    { name: 'Revenus', montant: totalEntrees },
    { name: 'Dépenses', montant: totalDepenses }
  ];

  const dataPie = transactions
    .filter(t => ['depense', 'ACHAT', 'PRODUCTION'].includes(t.type))
    .reduce((acc, t) => {
        const cat = t.category || 'Autres';
        const existing = acc.find(i => i.name === cat);
        if (existing) existing.value += t.amount; else acc.push({ name: cat, value: t.amount });
        return acc;
    }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const getSanteStatus = () => {
    if (totalEntrees === 0) return { label: "ANALYSE", color: "text-slate-400" };
    if (ratioUtilisation >= 100) return { label: "DÉFICIT", color: "text-rose-400" };
    if (ratioUtilisation > 80) return { label: "TENSION", color: "text-amber-400" };
    return { label: "SAIN", color: "text-emerald-400" };
  };

  const status = getSanteStatus();

  return (
    <div className="min-h-screen bg-[#0a0f14] text-slate-200 font-sans pb-20">
      
      {/* SECTION PDF (Masquée à l'écran) */}
      <div className="print-only hidden p-10 bg-white text-black">
        <div className="text-center mb-10 border-b-4 border-black pb-6">
          <h1 className="text-5xl font-black uppercase italic">Silver Fin</h1>
          <p className="text-xs font-bold tracking-[0.3em] text-slate-500">RAPPORT FINANCIER PERSONNEL</p>
        </div>
        <div className="grid grid-cols-2 gap-10 mb-10 border p-6 rounded-2xl">
            <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Balance Actuelle</p>
                <p className="text-3xl font-black">{soldeReel.toLocaleString()} F CFA</p>
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Status Financier</p>
                <p className="text-3xl font-black">{status.label}</p>
            </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-200 text-[10px] uppercase font-black text-slate-400">
              <th className="py-4">Date</th>
              <th>Catégorie</th>
              <th>Type</th>
              <th className="text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {transactions.map(t => (
              <tr key={t.id} className="border-b border-slate-100">
                <td className="py-3">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="font-bold uppercase">{t.category || 'Commerce'}</td>
                <td className="uppercase text-[9px]">{t.type}</td>
                <td className={`text-right font-black ${t.type === 'entree' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.amount.toLocaleString()} F
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INTERFACE PRINCIPALE */}
      <div className="no-print p-4 max-w-2xl mx-auto">
        
        {/* HEADER AMÉLIORÉ */}
        <div className="flex justify-between items-center mt-4 mb-8 bg-slate-900/60 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div onClick={() => navigate('/')} className="cursor-pointer group flex items-center gap-4">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-emerald-500/20">
                <span className="text-emerald-500 text-lg">←</span>
             </div>
             <div>
                <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Finance</h1>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${status.color}`}>{status.label}</p>
             </div>
          </div>
          <button onClick={() => window.print()} className="bg-emerald-500 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
            Rapport PDF
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex bg-slate-900/40 p-1.5 rounded-[2rem] border border-white/5 mb-8 backdrop-blur-md">
          {['dashboard', 'flux', 'dettes'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-slate-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Widget Principal de Budget */}
            <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[3rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
               <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Utilisation du Budget</p>
               <h2 className={`text-7xl font-black mb-4 ${status.color}`}>{ratioUtilisation}%</h2>
               <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full transition-all duration-1000 ${ratioUtilisation > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(ratioUtilisation, 100)}%` }} />
               </div>
            </div>

            {/* Cartes Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Disponible</p>
                <p className="text-2xl font-black text-white">{soldeReel.toLocaleString()} F</p>
              </div>
              <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Valeur Nette</p>
                <p className="text-2xl font-black text-emerald-400">{valeurNette.toLocaleString()} F</p>
              </div>
            </div>

            {/* GRAPHIQUE BARS : Revenus vs Dépenses */}
            <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 h-64">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-4 text-center tracking-widest">Balance Mensuelle</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataBars}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '15px'}} />
                  <Bar dataKey="montant" radius={[10, 10, 10, 10]} barSize={40}>
                    {dataBars.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* GRAPHIQUE PIE : Répartition par Catégorie */}
            <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 h-80">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2 text-center tracking-widest">Dépenses par Catégorie</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '15px', fontSize: '10px'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* FLUX FORM */}
        {activeTab === 'flux' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <form onSubmit={handleAddTransaction} className="bg-slate-900/60 p-8 rounded-[3rem] border border-white/5 space-y-8 backdrop-blur-xl">
              <div className="flex p-1.5 bg-black/50 rounded-3xl border border-white/5">
                <button type="button" onClick={() => setType('entree')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all ${type === 'entree' ? 'bg-emerald-500 text-black shadow-lg' : 'text-slate-500'}`}>REVENU (+)</button>
                <button type="button" onClick={() => setType('depense')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all ${type === 'depense' ? 'bg-rose-500 text-black shadow-lg' : 'text-slate-500'}`}>DÉPENSE (-)</button>
              </div>
              <div className="text-center">
                <input type="number" placeholder="0 F" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent text-white text-center font-black text-6xl outline-none placeholder:text-slate-800" />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-3xl text-white outline-none text-center font-black uppercase text-[11px] tracking-widest appearance-none">
                {['Nourriture', 'Transport', 'Loisirs', 'Loyer', 'Salaire', 'Vente Stock', 'Autres'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-3xl uppercase text-[11px] tracking-widest active:scale-95 transition-all">Valider la Transaction</button>
            </form>

            <div className="space-y-3 pt-4">
               <p className="text-[10px] font-black text-slate-500 uppercase ml-4 mb-2 tracking-widest">Journal des activités</p>
               {transactions.slice(0, 8).map(t => (
                <div key={t.id} className="bg-slate-900/30 p-5 rounded-[2rem] flex justify-between items-center border border-white/5 backdrop-blur-sm">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase">{t.category || 'Commerce'}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className={`font-black text-sm ${t.type === 'entree' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'entree' ? '+' : '-'}{t.amount.toLocaleString()} F
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETTES FORM */}
        {activeTab === 'dettes' && (
           <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 p-6 rounded-[2.5rem] border border-emerald-500/20 text-center">
                  <p className="text-[9px] uppercase font-black text-emerald-500 mb-2">On me doit</p>
                  <p className="text-2xl font-black text-white">{totalOnMeDoit.toLocaleString()} F</p>
                </div>
                <div className="bg-rose-500/10 p-6 rounded-[2.5rem] border border-rose-500/20 text-center">
                  <p className="text-[9px] uppercase font-black text-rose-500 mb-2">Je dois</p>
                  <p className="text-2xl font-black text-white">{totalJeDois.toLocaleString()} F</p>
                </div>
              </div>

              <form onSubmit={handleAddDebt} className="bg-slate-900/60 p-8 rounded-[3rem] border border-white/5 space-y-4 backdrop-blur-xl">
                <input type="text" placeholder="Nom du contact" value={debtPerson} onChange={(e) => setDebtPerson(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white outline-none font-bold text-sm" />
                <input type="number" placeholder="Montant F" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white outline-none font-black text-2xl text-center" />
                <div className="flex gap-2 p-1 bg-black/50 rounded-2xl">
                  <button type="button" onClick={() => setDebtType('du_a_moi')} className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${debtType === 'du_a_moi' ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>JE PRÊTE</button>
                  <button type="button" onClick={() => setDebtType('du_par_moi')} className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${debtType === 'du_par_moi' ? 'bg-rose-500 text-black' : 'text-slate-500'}`}>J'EMPRUNTE</button>
                </div>
                <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-3xl text-[11px] uppercase tracking-widest active:scale-95 transition-all mt-4">Enregistrer la dette</button>
              </form>
           </div>
        )}
      </div>

      {/* STYLES ADDITIONNELS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; color: black !important; padding: 0 !important; }
        }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default GestionFinanciere;