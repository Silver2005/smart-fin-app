import React from 'react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView = ({ situation }) => {
  const dataGraph = [
    { name: 'Sorties', s: situation.montant_depense },
    { name: 'Entrées', s: situation.montant_obtenu },
    { name: 'Solde', s: situation.difference },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-2 right-4 opacity-10 text-4xl font-black italic select-none">SMART-FIN</div>
        <h1 className="text-lg font-bold mb-4 text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">État de Caisse</h1>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 italic">Total Achats</span>
            <span className="text-red-400 font-bold">-{situation.montant_depense} F</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 italic">Total Ventes</span>
            <span className="text-emerald-400 font-bold">+{situation.montant_obtenu} F</span>
          </div>
          <div className="pt-3 border-t border-dashed border-slate-700 flex justify-between items-end">
            <span className="text-xs uppercase font-black text-slate-300">Net en Caisse</span>
            <span className={`text-2xl font-black ${situation.difference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {situation.difference} F
            </span>
          </div>
        </div>

        <button onClick={() => window.print()} className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all no-print border border-slate-700">
          🖨️ Imprimer Rapport Rapide
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 h-48 shadow-xl no-print">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataGraph}>
            <defs>
              <linearGradient id="colorSolde" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '10px', fontSize: '10px'}} />
            <Area type="monotone" dataKey="s" stroke="#10b981" strokeWidth={2} fill="url(#colorSolde)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardView;