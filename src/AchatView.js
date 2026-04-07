import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import indispensable

const AchatView = ({ onAddAchat }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    contact: '', 
    article_nom: '', 
    quantite: 1, 
    prix_achat: 0 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const montantTotal = Number(formData.quantite) * Number(formData.prix_achat);

    if (Number(formData.quantite) <= 0 || Number(formData.prix_achat) <= 0) {
      alert("Veuillez entrer des montants valides.");
      return;
    }

    setLoading(true);

    try {
      // 1. RÉCUPÉRER L'UTILISATEUR CONNECTÉ
      const { data: { user } } = await supabase.auth.getUser();

      // 2. SYNCHRONISATION FINANCIÈRE (Enregistre la dépense)
      const { error: transError } = await supabase.from('transactions').insert([
        {
          type: 'depense',
          amount: montantTotal,
          category: `Achat: ${formData.article_nom}`,
          user_id: user.id,
          created_at: new Date()
        }
      ]);

      if (transError) throw transError;

      // 3. MISE À JOUR DU STOCK (Appel de la fonction parente)
      await onAddAchat(formData);

      alert("🚀 Stock et Trésorerie SILVER-FIN mis à jour !");
      
      // Retour à l'accueil
      navigate('/');

    } catch (error) {
      console.error("Erreur lors de l'achat:", error);
      alert("Erreur lors de la synchronisation des données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 pb-10">
      {/* --- EN-TÊTE AVEC BOUTON RETOUR --- */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-90 shadow-lg"
        >
          ←
        </button>
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Gestion des <span className="text-indigo-400">Achats</span>
        </h2>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl border border-indigo-900/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest italic underline underline-offset-8">
            Approvisionnement
          </h2>
          <span className="text-[8px] text-slate-600 font-black tracking-widest border border-slate-800 px-2 py-1 rounded">SILVER-FIN</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DESIGNATION */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase ml-2">Désignation de l'article</label>
            <input 
              type="text" 
              placeholder="Ex: T-shirt XL Noir" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all placeholder:text-slate-700 shadow-inner" 
              value={formData.article_nom} 
              onChange={(e) => setFormData({...formData, article_nom: e.target.value})} 
              required 
            />
          </div>
          
          {/* FOURNISSEUR */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase ml-2">Fournisseur / Source</label>
            <input 
              type="text" 
              placeholder="Nom du fournisseur" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all placeholder:text-slate-700 shadow-inner" 
              value={formData.contact} 
              onChange={(e) => setFormData({...formData, contact: e.target.value})} 
              required 
            />
          </div>
          
          {/* QUANTITÉ ET PRIX */}
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="text-[10px] text-slate-500 uppercase ml-2 mb-1 block">Qté</label>
              <input 
                type="number" 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white shadow-inner" 
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
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-indigo-500 text-white shadow-inner font-bold text-rose-400" 
                value={formData.prix_achat} 
                onChange={(e) => setFormData({...formData, prix_achat: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* INFO INVESTISSEMENT */}
          <div className="text-right p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <span className="text-slate-500 text-[10px] uppercase mr-2 tracking-tighter">Investissement total :</span>
            <span className="text-indigo-400 font-black text-lg">
              {(Number(formData.quantite) * Number(formData.prix_achat)).toLocaleString()} F
            </span>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/40 text-white mt-4 ${
              loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
            }`}
          >
            {loading ? 'Traitement...' : 'Valider Entrée Stock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AchatView;