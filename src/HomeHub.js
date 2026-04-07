import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeHub = ({ situation }) => {
  const navigate = useNavigate();

  const cards = [
    { title: "Vendre", path: "/vente", icon: "💰", color: "border-emerald-500/20 text-emerald-400", desc: "Facturer un client" },
    { title: "Achat Simple", path: "/achat", icon: "🛒", color: "border-blue-500/20 text-blue-400", desc: "Réapprovisionnement" },
    { title: "Coach Financier", path: "/gestion-financiere", icon: "🧠", color: "border-amber-500/40 text-amber-400 bg-amber-500/5", desc: "Suivi & Conseils" }, // NOUVEAU BOUTON
    { title: "Achat en Gros", path: "/achat-gros", icon: "📦", color: "border-indigo-500/20 text-indigo-400", desc: "Lots & Unités" },
    { title: "Production", path: "/production", icon: "🏭", color: "border-purple-500/20 text-purple-400", desc: "Transformation" },
    { title: "Statistiques", path: "/stats", icon: "📊", color: "border-slate-700 text-slate-300", desc: "Analyses & Tops" },
    { title: "Historique", path: "/historique", icon: "📜", color: "border-slate-700 text-slate-300", desc: "Journal des flux" },
  ];

  return (
    <div className="space-y-6">
      {/* RÉSUMÉ RAPIDE */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Solde de Caisse</p>
          <p className="text-2xl font-black text-white">{situation.difference.toLocaleString()} F</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Flux de vente</p>
          <p className="text-sm font-bold text-emerald-500">+{situation.montant_obtenu.toLocaleString()} F</p>
        </div>
      </div>

      {/* GRILLE DE BOUTONS */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => navigate(card.path)} 
            className={`bg-slate-900/50 p-5 rounded-3xl border ${card.color} hover:bg-slate-800 transition-all text-left group active:scale-95 shadow-lg shadow-black/20`}
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h3 className="font-bold text-xs uppercase tracking-tighter text-white">{card.title}</h3>
            <p className="text-[9px] opacity-40 mt-1 italic font-medium leading-tight">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeHub;