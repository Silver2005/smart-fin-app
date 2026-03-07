import React, { useState } from 'react';
import { Share } from '@capacitor/share';
import * as XLSX from 'xlsx'; // Importation pour l'export Excel

const Transactions = ({ transactions }) => {
  const [filter, setFilter] = useState("");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const filteredData = transactions.filter(t => {
    const name = t.article || t.article_nom || "";
    return name.toLowerCase().includes(filter.toLowerCase());
  });

  // --- FONCTION EXCEL (WEB UNIQUEMENT) ---
  const exportToExcel = () => {
    const dataToExport = filteredData.map(t => ({
      Date: new Date(t.date).toLocaleString('fr-FR'),
      Type: t.type,
      Article: t.article,
      Montant: Number(t.montant),
      Contact: t.contact_nom || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journal");
    XLSX.writeFile(wb, `Silver-Fin-Journal-${new Date().toLocaleDateString()}.xlsx`);
  };

  // --- FONCTION DE PARTAGE (MOBILE) ---
  const partagerJournal = async () => {
    if (filteredData.length === 0) return alert("Aucune donnée à partager");

    let rapport = `📜 SILVER-FIN : JOURNAL DU ${new Date().toLocaleDateString()}\n`;
    rapport += `---------------------------\n`;

    filteredData.forEach(t => {
      const type = t.type === 'VENTE' ? '🟢' : '🔴';
      rapport += `${type} ${t.article} : ${Number(t.montant).toLocaleString()} F\n`;
    });

    const totalVentes = filteredData.filter(t => t.type === 'VENTE').reduce((sum, t) => sum + Number(t.montant), 0);
    rapport += `\n💰 TOTAL VENTES : ${totalVentes.toLocaleString()} F`;

    try {
      await Share.share({
        title: 'Journal Silver-Fin',
        text: rapport,
        dialogTitle: 'Partager via...',
      });
    } catch (error) {
      console.error("Erreur de partage", error);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      {/* En-tête avec Branding */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black uppercase tracking-tighter text-slate-100">
            SILVER<span className="text-emerald-500">-</span>FIN
          </h2>
          <span className="bg-slate-800 text-[10px] px-3 py-1 rounded-full text-slate-400 font-bold border border-slate-700">
            {filteredData.length} Opérations
          </span>
        </div>
        
        <input 
          type="text" 
          placeholder="Rechercher un article..." 
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs text-emerald-400 outline-none focus:border-emerald-500 transition-all shadow-inner"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Tableau du Journal */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <tbody className="text-xs">
            {filteredData.length > 0 ? filteredData.map((t, i) => (
              <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                <td className="p-4">
                  <span className="text-slate-500 block text-[9px] mb-1">
                    {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="font-bold text-slate-200 uppercase tracking-tight">{t.article}</span>
                </td>
                <td className="p-4 text-right">
                  <div className={`font-black text-sm ${t.type === 'VENTE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'VENTE' ? '+' : '-'}{Number(t.montant).toLocaleString()} F
                  </div>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{t.type}</span>
                </td>
              </tr>
            )) : (
              <tr><td className="p-20 text-center text-slate-700 font-bold uppercase italic tracking-widest">Journal vide</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Section Actions Dynamiques (no-print pour le PDF) */}
      <div className="p-6 bg-slate-950/50 flex flex-col gap-3 no-print">
        {isMobile ? (
          <button 
            onClick={partagerJournal} 
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            📤 Partager Rapport (WhatsApp)
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={exportToExcel} 
              className="py-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-900/30 transition-all"
            >
              📊 Export Excel
            </button>
            <button 
              onClick={() => window.print()} 
              className="py-4 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-900/30 transition-all"
            >
              🖨️ Imprimer PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;