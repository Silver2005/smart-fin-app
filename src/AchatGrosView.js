import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AchatGrosView = ({ onAddAchat }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    article_nom: '',
    prix_lot: '',
    quantite_totale: '',
    contact: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation stricte
    if (!formData.article_nom || !formData.prix_lot || !formData.quantite_totale) {
      return alert("Veuillez remplir tous les champs obligatoires");
    }

    // 2. Conversion forcée en nombres pour éviter les bugs JS
    const totalLot = Number(formData.prix_lot);
    const qteGros = Number(formData.quantite_totale);
    
    // Calcul du prix unitaire pour que App.js puisse refaire la multiplication
    const prixUnitaire = totalLot / qteGros;

    try {
      // 3. Appel de la fonction parente (App.js)
      await onAddAchat({
        article_nom: formData.article_nom.trim().toUpperCase(),
        prix_achat: prixUnitaire, 
        quantite: qteGros,
        contact: formData.contact.trim() || 'Fournisseur Gros'
      });

      alert("✅ Lot enregistré avec succès !");
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("❌ Erreur de connexion à la base de données.");
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 shadow-lg"
        >
          ←
        </button>
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Achat en <span className="text-indigo-500 font-italic">Gros</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2 mb-1 block italic">Désignation du lot</label>
            <input 
              type="text"
              value={formData.article_nom}
              placeholder="Ex: CARTON CANETTES COCA"
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all shadow-inner"
              onChange={(e) => setFormData({...formData, article_nom: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 mb-1 block italic">Prix Total Lot (F)</label>
              <input 
                type="number"
                value={formData.prix_lot}
                placeholder="F CFA"
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all shadow-inner font-bold text-emerald-400"
                onChange={(e) => setFormData({...formData, prix_lot: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 mb-1 block italic">Unités dans le lot</label>
              <input 
                type="number"
                value={formData.quantite_totale}
                placeholder="Ex: 24"
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all shadow-inner"
                onChange={(e) => setFormData({...formData, quantite_totale: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2 mb-1 block italic">Source / Fournisseur</label>
            <input 
              type="text"
              value={formData.contact}
              placeholder="Nom du fournisseur"
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all shadow-inner"
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40 transition-all active:scale-95 mt-4"
        >
          Enregistrer le stock
        </button>
      </form>
    </div>
  );
};

export default AchatGrosView;