import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share } from '@capacitor/share';
import * as XLSX from 'xlsx';
import { supabase } from './supabaseClient';

// --- CORRECTION DES IMPORTS PDF ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const Transactions = ({ transactions, onRefresh }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(""); 
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredData = transactions.filter(t => {
    const searchTerm = filter.toLowerCase();
    const nameMatch = (t.article || "").toLowerCase().includes(searchTerm);
    const contactMatch = (t.contact || "").toLowerCase().includes(searchTerm);
    const dateMatch = dateFilter ? t.date.startsWith(dateFilter) : true;
    return (nameMatch || contactMatch) && dateMatch;
  });

  // --- LOGIQUE GÉNÉRATION PDF (RÉPARÉE) ---
  const generatePDF = () => {
    if (filteredData.length === 0) return alert("Aucune donnée à exporter");

    const doc = new jsPDF();
    const dateStr = dateFilter || new Date().toLocaleDateString('fr-FR');

    // Header Style Silver
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text("SILVER-FIN", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("RAPPORT D'ACTIVITÉ GÉNÉRÉ", 14, 28);
    doc.text(`Date du rapport : ${new Date().toLocaleString('fr-FR')}`, 14, 33);
    doc.text(`Filtre appliqué : ${dateStr}`, 14, 38);

    // Corps du tableau - Données formatées
    const tableBody = filteredData.map(t => [
      new Date(t.date).toLocaleDateString('fr-FR'),
      new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      t.type,
      t.article,
      t.quantite || 0,
      `${Number(t.montant).toLocaleString()} F`,
      t.contact || 'Anonyme'
    ]);

    // Utilisation de la fonction autonome autoTable pour éviter l'erreur de fonction non définie
    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Heure', 'Type', 'Article', 'Qté', 'Montant', 'Contact']],
      body: tableBody,
      headStyles: { fillColor: [16, 185, 129] }, // Emerald-500
      styles: { fontSize: 8, font: 'helvetica', cellPadding: 3 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      margin: { top: 45 },
    });

    // Signature Silver's Design
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(99, 102, 241); // Indigo-500
    doc.text("Logiciel développé par SILVER'S DESIGN", 14, finalY);

    // Téléchargement pour PC ou Mobile
    doc.save(`SilverFin_Journal_${dateStr.replace(/\//g, '-')}.pdf`);
  };

  // --- LOGIQUE DE SUPPRESSION AVEC RÉTABLISSEMENT DU STOCK ---
  const handleDelete = async (t) => {
    if (!t.id) return alert("Erreur : Impossible d'identifier la transaction.");

    const confirmation = window.confirm(`Annuler l'opération "${t.article}" ? Le stock sera mis à jour.`);
    if (!confirmation) return;

    try {
      const { data: articleData } = await supabase
        .from('articles')
        .select('id, quantite_stock')
        .eq('nom', t.article)
        .single();

      if (articleData) {
        const qtyToAdjust = Number(t.quantite) || 0;
        const adjustment = t.type === 'VENTE' ? qtyToAdjust : -qtyToAdjust;
        const newStock = Number(articleData.quantite_stock) + adjustment;

        await supabase
          .from('articles')
          .update({ quantite_stock: Math.max(0, newStock) })
          .eq('id', articleData.id);
      }

      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', t.id);

      if (deleteError) throw deleteError;
      
      if (onRefresh) onRefresh();
      alert("✅ Transaction annulée et stock synchronisé.");

    } catch (error) {
      console.error(error);
      alert(`❌ Erreur : ${error.message}`);
    }
  };

  // --- EXPORT EXCEL ---
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(t => ({
      Date: new Date(t.date).toLocaleString('fr-FR'),
      Type: t.type,
      Article: t.article,
      Quantite: t.quantite,
      Montant: Number(t.montant),
      Contact: t.contact || 'Anonyme'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journal");
    XLSX.writeFile(wb, `SilverFin-Journal-${new Date().toLocaleDateString()}.xlsx`);
  };

  // --- PARTAGE RAPIDE CAPACITOR ---
  const partagerJournal = async () => {
    if (filteredData.length === 0) return alert("Rien à partager");
    let rapport = `📜 SILVER-FIN : JOURNAL DU ${dateFilter || new Date().toLocaleDateString()}\n━━━━━━━━━━━━━━━━━━━━\n`;
    filteredData.forEach(t => {
      rapport += `${t.type === 'VENTE' ? '🟢' : '🔴'} ${t.article} : ${Number(t.montant).toLocaleString()} F\n`;
    });
    try {
      await Share.share({ title: 'Rapport Silver-Fin', text: rapport });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 w-full max-w-2xl mx-auto p-2">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6 no-print">
        <button 
          onClick={() => navigate('/')} 
          className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"
        >
          <span className="text-xl font-bold">←</span>
        </button>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-slate-100">
            Journal <span className="text-emerald-500 italic">Flux</span>
          </h2>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20">
            {filteredData.length} Opérations
          </span>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* RECHERCHE */}
        <div className="p-6 border-b border-slate-800/50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-[11px] text-emerald-400 outline-none focus:border-emerald-500 shadow-inner"
              onChange={(e) => setFilter(e.target.value)}
            />
            <input 
              type="date" 
              className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-[11px] text-slate-400 outline-none focus:border-emerald-500 shadow-inner"
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        {/* LISTE */}
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <tbody className="text-xs">
              {filteredData.length > 0 ? filteredData.map((t, i) => (
                <tr key={t.id || i} className="border-b border-slate-800/30 hover:bg-slate-800/40 transition-colors">
                  <td className="p-5">
                    <span className="text-slate-600 block text-[9px] mb-1 font-black">
                      {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="font-bold text-slate-200 uppercase text-sm block">{t.article}</span>
                    <span className="text-[10px] text-indigo-400 italic">
                      {t.type === 'VENTE' ? '👤 Client: ' : '🏢 Source: '} {t.contact || 'Anonyme'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className={`font-black text-sm ${t.type === 'VENTE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'VENTE' ? '+' : '-'}{Number(t.montant).toLocaleString()} F
                    </div>
                    <button onClick={() => handleDelete(t)} className="mt-2 text-rose-500/50 hover:text-rose-500 no-print">🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="2" className="p-20 text-center text-slate-700 font-black uppercase text-[10px]">Journal Vide</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ACTIONS */}
        <div className="p-6 bg-slate-950/50 grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
          {isMobile && (
            <button onClick={partagerJournal} className="py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase">📤 Partager</button>
          )}
          <button onClick={exportToExcel} className="py-4 bg-slate-800 text-emerald-400 rounded-2xl text-[10px] font-black border border-slate-700">📊 Excel</button>
          <button onClick={generatePDF} className="py-4 bg-slate-800 text-indigo-400 rounded-2xl text-[10px] font-black border border-slate-700">📄 Générer PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;