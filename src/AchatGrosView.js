import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import indispensable pour la synchro

const AchatGrosView = ({ onAddAchat }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    article_nom: '',
    prix_lot: '',
    quantite_totale: '',
    contact: ''
  });

  // Calcul dynamique du prix unitaire pour l'affichage
  const prixRevientUnitaire = (formData.prix_lot && formData.quantite_totale) 
    ? (Number(formData.prix_lot) / Number(formData.quantite_totale)).toFixed(2) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    if (!formData.article_nom || !formData.prix_lot || !formData.quantite_totale) {
      return alert("Veuillez remplir tous les champs obligatoires");
    }

    setLoading(true);

    try {
      // 2. Récupérer l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();

      const totalLot = Number(formData.prix_lot);
      const qteGros = Number(formData.quantite_totale);
      const prixUnitaire = totalLot / qteGros;

      // 3. Synchronisation Financière (Transaction de sortie)
      const { error: transError } = await supabase.from('transactions').insert([
        {
          type: 'depense',
          amount: totalLot,
          category: `Achat Gros: ${formData.article_nom.toUpperCase()}`,
          user_id: user.id,
          created_at: new Date()
        }
      ]);

      if (transError) throw transError;

      // 4. Mise à jour du Stock via la fonction parente
      await onAddAchat({
        article_nom: formData.article_nom.trim().toUpperCase(),
        prix_achat: prixUnitaire, 
        quantite: qteGros,
        contact: formData.contact.trim() || 'Fournisseur Gros'
      });

      alert("✅ Lot et Trésorerie mis à jour !");
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("❌ Erreur de connexion ou de synchronisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 shadow-lg"
        >
          ←
        </button>
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Achat en <span className="text-indigo-500 italic">Gros</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          {/* NOM DU PRODUIT */}
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
            {/* PRIX DU LOT */}
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
            {/* QUANTITÉ DANS LE LOT */}
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

          {/* INDICATEUR DE PRIX UNITAIRE (DYNAMIQUE) */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-xl flex justify-between items-center">
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Prix de revient unitaire :</span>
            <span className="text-sm font-black text-indigo-400">{Number(prixRevientUnitaire).toLocaleString()} F</span>
          </div>

          {/* SOURCE */}
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

        {/* BOUTON VALIDATION */}
        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 mt-4 ${
            loading 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
          }`}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer le stock'}
        </button>
      </form>
    </div>
  );
};

export default AchatGrosView;