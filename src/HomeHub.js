import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importation des icônes Phosphor (Style moderne et arrondi)
import { 
  ShoppingBag, 
  ShoppingCart, 
  Lightbulb, 
  Package, 
  Factory, 
  ChartBar, 
  ClockCounterClockwise,
  TrendUp,
  Wallet,
  CirclesThreePlus
} from 'phosphor-react';

const HomeHub = ({ situation }) => {
  const navigate = useNavigate();

  // Configuration des cartes avec les icônes Phosphor en mode "duotone"
  const cards = [
    { 
      title: "Vendre", 
      path: "/vente", 
      icon: <ShoppingBag size={28} weight="duotone" />, 
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5", 
      desc: "Facturer un client" 
    },
    { 
      title: "Achat Simple", 
      path: "/achat", 
      icon: <ShoppingCart size={28} weight="duotone" />, 
      color: "border-blue-500/20 text-blue-400 bg-blue-500/5", 
      desc: "Réapprovisionnement" 
    },
    { 
      title: "Coach Financier", 
      path: "/gestion-financiere", 
      icon: <Lightbulb size={28} weight="duotone" />, 
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10", 
      desc: "Suivi & Conseils" 
    },
    { 
      title: "Achat en Gros", 
      path: "/achat-gros", 
      icon: <Package size={28} weight="duotone" />, 
      color: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5", 
      desc: "Lots & Unités" 
    },
    { 
      title: "Production", 
      path: "/production", 
      icon: <Factory size={28} weight="duotone" />, 
      color: "border-purple-500/20 text-purple-400 bg-purple-500/5", 
      desc: "Transformation" 
    },
    { 
      title: "Statistiques", 
      path: "/stats", 
      icon: <ChartBar size={28} weight="duotone" />, 
      color: "border-slate-700 text-slate-300 bg-slate-800/20", 
      desc: "Analyses & Tops" 
    },
    { 
      title: "Historique", 
      path: "/historique", 
      icon: <ClockCounterClockwise size={28} weight="duotone" />, 
      color: "border-slate-700 text-slate-300 bg-slate-800/20", 
      desc: "Journal des flux" 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* RÉSUMÉ RAPIDE FINTECH */}
      <div className="relative overflow-hidden bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={14} weight="fill" className="text-slate-500" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Solde de Caisse</p>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter">
              {situation.difference.toLocaleString()} <span className="text-emerald-500 text-sm italic">F</span>
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Flux Live</p>
            </div>
            <div className="flex items-center gap-1 justify-end text-emerald-400 font-black">
              <TrendUp size={16} />
              <p className="text-sm">+{situation.montant_obtenu.toLocaleString()} F</p>
            </div>
          </div>
        </div>
      </div>

      {/* TITRE DE SECTION AVEC ICONE */}
      <div className="px-2 flex items-center gap-2">
        <CirclesThreePlus size={18} className="text-slate-600" />
        <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Menu Principal</h2>
      </div>

      {/* GRILLE DE BOUTONS */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => navigate(card.path)} 
            className={`relative overflow-hidden p-5 rounded-[2.2rem] border ${card.color} hover:bg-slate-800/80 transition-all text-left group active:scale-95 shadow-lg shadow-black/20 flex flex-col justify-between h-40`}
          >
            {/* Icône de fond décorative */}
            <div className="absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              {React.cloneElement(card.icon, { size: 80 })}
            </div>

            <div className="w-12 h-12 rounded-2xl bg-slate-950/40 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
              {card.icon}
            </div>
            
            <div>
              <h3 className="font-black text-[12px] uppercase tracking-tight text-white">{card.title}</h3>
              <p className="text-[9px] opacity-40 mt-1 italic font-medium leading-tight">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="pt-6 pb-4 text-center">
        <div className="h-px w-12 bg-slate-800 mx-auto mb-4"></div>
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em]">Développé par Silver's Design</p>
      </div>
    </div>
  );
};

export default HomeHub;