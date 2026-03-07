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
    
    // On vérifie que les nombres sont valides
    if (formData.quantite <= 0 || formData.prix_achat <= 0) {
      alert("Veuillez entrer des montants valides.");
      return;
    }

    // On utilise la fonction passée par App.js
    onAddAchat(formData);
    
    alert("🚀 Stock mis à jour localement !");
    
    // Réinitialisation du formulaire
    setFormData({ 
      contact_nom: '', 
      article_nom: '', 
      quantite: 1, 
      prix_achat: 0 
    });
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300">
      <h2 className="text-indigo-400 font-bold text-sm uppercase mb-6 tracking-widest text-center italic underline underline-offset-8">
        Approvisionnement (Local)
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 text-black font-medium">
        <input 
          type="text" 
          placeholder="Désignation Article" 
          className="w-full bg-white p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-500 transition-all" 
          value={formData.article_nom} 
          onChange={(e) => setFormData({...formData, article_nom: e.target.value})} 
          required 
        />
        
        <input 
          type="text" 
          placeholder="Nom Fournisseur" 
          className="w-full bg-white p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-500 transition-all" 
          value={formData.contact_nom} 
          onChange={(e) => setFormData({...formData, contact_nom: e.target.value})} 
          required 
        />
        
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Quantité</label>
            <input 
              type="number" 
              placeholder="Qté" 
              className="w-full bg-white p-4 rounded-2xl outline-none" 
              value={formData.quantite} 
              onChange={(e) => setFormData({...formData, quantite: e.target.value})} 
              required 
            />
          </div>
          <div className="w-2/3">
            <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Prix d'achat unitaire</label>
            <input 
              type="number" 
              placeholder="Prix Achat" 
              className="w-full bg-white p-4 rounded-2xl outline-none" 
              value={formData.prix_achat} 
              onChange={(e) => setFormData({...formData, prix_achat: e.target.value})} 
              required 
            />
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95"
        >
          Valider Entrée Stock
        </button>
      </form>
    </div>
  );
};

export default AchatView;