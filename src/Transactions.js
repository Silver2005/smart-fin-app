import React, { useState } from 'react';
import { Share } from '@capacitor/share';

const Transactions = ({ transactions }) => {
  const [filter, setFilter] = useState("");

  const filteredData = transactions.filter(t => {
    const name = t.article || t.article_nom || "";
    return name.toLowerCase().includes(filter.toLowerCase());
  });

  // --- FONCTION DE PARTAGE DU RAPPORT (Remplace Excel/PDF) ---
  const partagerJournal = async () => {
    if (filteredData.length === 0) {
      alert("Aucune donnée à partager");
      return;
    }

    let rapport = `📜 JOURNAL DE CAISSE - ${new Date().toLocaleDateString()}\n`;
    rapport += `---------------------------\n`;

    filteredData.forEach(t => {
      const type = t.type === 'VENTE' ? '🟢 VENTE' : '🔴 ACHAT';
      rapport += `[${new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}] ${type}\n`;
      rapport += `${t.article} : ${t.montant} F\n`;
      rapport += `---------------------------\n`;
    });

    const totalVentes = filteredData.filter(t => t.type === 'VENTE').reduce((sum, t) => sum + Number(t.montant), 0);
    rapport += `\n💰 TOTAL VENTES : ${totalVentes} F`;

    try {
      await Share.share({
        title: 'Journal de Caisse',
        text: rapport,
        dialogTitle: 'Partager le journal via...',
      });
    } catch (error) {
      console.error("Erreur de partage", error);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      {/* En-tête */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black uppercase tracking-tighter text-slate-300">Journal</h2>
          <span className="bg-slate-800 text-[10px] px-3 py-1 rounded-full text-slate-500 font-bold">
            {filteredData.length} Opérations
          </span>
        </div>
        
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-emerald-400 outline-none focus:border-emerald-500"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Tableau simplifié pour Mobile */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-left">
          <tbody className="text-xs">
            {filteredData.length > 0 ? filteredData.map((t, i) => (
              <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td className="p-4">
                  <span className="text-slate-500 block text-[10px]">
                    {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="font-bold text-slate-200 uppercase">{t.article}</span>
                </td>
                <td className="p-4 text-right">
                  <div className={`font-black ${t.type === 'VENTE' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'VENTE' ? '+' : '-'}{Number(t.montant).toLocaleString()} F
                  </div>
                  <span className="text-[9px] text-slate-600 uppercase">{t.type}</span>
                </td>
              </tr>
            )) : (
              <tr><td className="p-12 text-center text-slate-700">Journal vide</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Unique de Partage */}
      <div className="p-4 bg-slate-950/50">
        <button 
          onClick={partagerJournal} 
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20"
        >
          📤 Partager le Rapport Complet
        </button>
      </div>
    </div>
  );
};

export default Transactions;