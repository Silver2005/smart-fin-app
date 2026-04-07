import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share } from '@capacitor/share';
import * as XLSX from 'xlsx';
import { supabase } from './supabaseClient';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const Transactions = ({ transactions, onRefresh }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(""); 
  const [userName, setUserName] = useState("Utilisateur");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Récupérer le nom de l'utilisateur pour le rapport
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) setUserName(user.user_metadata.full_name);
    };
    getUser();
  }, []);

  // --- LOGIQUE DE FILTRAGE MISE À JOUR ---
  const filteredData = transactions.filter(t => {
    const searchTerm = filter.toLowerCase();
    // On cherche dans la catégorie (qui contient le nom du produit) ou le contact
    const nameMatch = (t.category || "").toLowerCase().includes(searchTerm);
    const contactMatch = (t.contact || "").toLowerCase().includes(searchTerm);
    const dateMatch = dateFilter ? t.created_at.startsWith(dateFilter) : true;
    return (nameMatch || contactMatch) && dateMatch;
  });

  // --- GÉNÉRATION PDF ---
  const generatePDF = () => {
    if (filteredData.length === 0) return alert("Aucune donnée à exporter");

    const doc = new jsPDF();
    const dateStr = dateFilter || new Date().toLocaleDateString('fr-FR');

    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); 
    doc.text("SILVER-FIN", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`RAPPORT D'ACTIVITÉ - Responsable: ${userName}`, 14, 28);
    doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`, 14, 33);

    const tableBody = filteredData.map(t => [
      new Date(t.created_at).toLocaleDateString('fr-FR'),
      new Date(t.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      t.type === 'entree' ? 'VENTE' : 'ACHAT',
      t.category,
      `${Number(t.amount).toLocaleString()} F`,
      t.contact || 'Système'
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Heure', 'Type', 'Description', 'Montant', 'Auteur/Contact']],
      body: tableBody,
      headStyles: { fillColor: [16, 185, 129] }, 
      styles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    doc.setFontSize(9);
    doc.text("Logiciel SILVER-FIN - SILVER'S DESIGN", 14, doc.lastAutoTable.finalY + 10);
    doc.save(`SilverFin_Journal_${dateStr}.pdf`);
  };

  // --- SUPPRESSION & RÉTABLISSEMENT ---
  const handleDelete = async (t) => {
    const confirmation = window.confirm(`Supprimer cette transaction ? Cela impactera votre solde global.`);
    if (!confirmation) return;

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', t.id);
      if (error) throw error;
      if (onRefresh) onRefresh();
      alert("✅ Transaction supprimée.");
    } catch (error) {
      alert(`❌ Erreur : ${error.message}`);
    }
  };

  // --- EXPORT EXCEL ---
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(t => ({
      Date: new Date(t.created_at).toLocaleString('fr-FR'),
      Type: t.type === 'entree' ? 'VENTE' : 'ACHAT',
      Description: t.category,
      Montant: Number(t.amount),
      Contact: t.contact || 'Inconnu'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journal");
    XLSX.writeFile(wb, `SilverFin-Journal.xlsx`);
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
              placeholder="Rechercher un produit ou contact..." 
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

        {/* LISTE DES TRANSACTIONS */}
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <tbody className="text-xs">
              {filteredData.length > 0 ? filteredData.map((t, i) => (
                <tr key={t.id || i} className="border-b border-slate-800/30 hover:bg-slate-800/40 transition-colors">
                  <td className="p-5">
                    <span className="text-slate-600 block text-[9px] mb-1 font-black">
                      {new Date(t.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="font-bold text-slate-200 uppercase text-sm block">
                        {t.category || "Transaction"}
                    </span>
                    <span className="text-[10px] text-indigo-400 italic">
                      {t.type === 'entree' ? '👤 Client: ' : '🏢 Source: '} {t.contact || userName}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className={`font-black text-sm ${t.type === 'entree' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'entree' ? '+' : '-'}{Number(t.amount).toLocaleString()} F
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

        {/* ACTIONS EXPORT */}
        <div className="p-6 bg-slate-950/50 grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
          <button onClick={exportToExcel} className="py-4 bg-slate-800 text-emerald-400 rounded-2xl text-[10px] font-black border border-slate-700 hover:bg-slate-700">📊 Excel</button>
          <button onClick={generatePDF} className="py-4 bg-slate-800 text-indigo-400 rounded-2xl text-[10px] font-black border border-slate-700 hover:bg-slate-700">📄 Générer PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;