import React, { useState } from 'react';

const AchatView = ({ onAddAchat }) => {
  const [formData, setFormData] = useState({ 
    contact_nom: '', 
    article_nom: '', 
    quantite: 1, 
    prix_achat: 0 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (Number(formData.quantite) <= 0 || Number(formData.prix_achat) <= 0) {
      alert("Veuillez entrer des montants valides.");
      return;
    }

    // On utilise la fonction de mise à jour locale
    onAddAchat(formData);
    
    alert("🚀 Stock SILVER-FIN mis à jour !");
    
    // Réinitialisation
    setFormData({ 
      contact_nom: '', 
      article_nom: '', 
      quantite: 1, 
      prix_achat: 0 
    });
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-indigo-900/20 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-indigo-400 font-bold text-sm uppercase tracking-widest italic underline underline-offset-8">
          Approvisionnement
        </h2>
        <span className="text-[8px] text-slate-600 font-black tracking-widest border border-slate-800 px-2 py-1 rounded">SILVER-FIN</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 uppercase ml-2">Désignation de l'article</label>
          <input 
            type="text" 
            placeholder="Ex: T-shirt XL Noir" 
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all" 
            value={formData.article_nom} 
            onChange={(e) => setFormData({...formData, article_nom: e.target.value})} 
            required 
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 uppercase ml-2">Fournisseur / Source</label>
          <input 
            type="text" 
            placeholder="Nom du fournisseur" 
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all" 
            value={formData.contact_nom} 
            onChange={(e) => setFormData({...formData, contact_nom: e.target.value})} 
            required 
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Qté</label>
            <input 
              type="number" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white" 
              value={formData.quantite} 
              onChange={(e) => setFormData({...formData, quantite: e.target.value})} 
              required 
            />
          </div>
          <div className="w-2/3">
            <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Prix d'achat unitaire (F)</label>
            <input 
              type="number" 
              placeholder="0" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white" 
              value={formData.prix_achat} 
              onChange={(e) => setFormData({...formData, prix_achat: e.target.value})} 
              required 
            />
          </div>
        </div>

        {/* Calcul du coût total d'achat pour info */}
        <div className="text-right p-2">
          <span className="text-slate-500 text-xs uppercase mr-2">Investissement total :</span>
          <span className="text-indigo-400 font-bold">
            {(Number(formData.quantite) * Number(formData.prix_achat)).toLocaleString()} F
          </span>
        </div>
        
        <button 
          type="submit"
          className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 no-print"
        >
          Valider Entrée Stock
        </button>
      </form>
    </div>
  );
};

export default AchatView;