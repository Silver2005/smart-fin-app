import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductionView = ({ onAddAchat }) => {
  const navigate = useNavigate();
  const [articleProduit, setArticleProduit] = useState('');
  const [quantiteProduite, setQuantiteProduite] = useState('');
  
  // Liste dynamique des matières premières
  const [matieres, setMatieres] = useState([{ nom: '', prix: '' }]);

  const addMatiereRow = () => {
    setMatieres([...matieres, { nom: '', prix: '' }]);
  };

  const updateMatiere = (index, field, value) => {
    const newMatieres = [...matieres];
    newMatieres[index][field] = value;
    setMatieres(newMatieres);
  };

  const removeMatiere = (index) => {
    if (matieres.length > 1) {
      setMatieres(matieres.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!articleProduit || !quantiteProduite) return;

    const coutTotalProduction = matieres.reduce((sum, m) => sum + Number(m.prix || 0), 0);

    onAddAchat({
      article_nom: articleProduit.toUpperCase(),
      prix_achat: coutTotalProduction / Number(quantiteProduite), 
      quantite: Number(quantiteProduite),
      contact: "PRODUCTION INTERNE"
    });

    alert(`✅ Production de ${quantiteProduite} ${articleProduit} enregistrée !`);
    navigate('/');
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
          Volet <span className="text-purple-500">Production</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1 : PRODUIT FINI */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black">FINISH</div>
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Résultat de la transformation</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-2 block">Article produit</label>
              <input 
                type="text"
                placeholder="Ex: PAIN CHOCO"
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-purple-500 text-xs shadow-inner"
                onChange={(e) => setArticleProduit(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-2 block">Quantité faite</label>
              <input 
                type="number"
                placeholder="Nombre"
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-purple-500 text-xs shadow-inner"
                onChange={(e) => setQuantiteProduite(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2 : MATIÈRES PREMIÈRES */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Intrants & Ingrédients</p>
            <button 
              type="button" 
              onClick={addMatiereRow}
              className="text-[9px] bg-purple-600/10 text-purple-400 px-4 py-2 rounded-full font-black border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all active:scale-95"
            >
              + AJOUTER
            </button>
          </div>

          <div className="space-y-3">
            {matieres.map((matiere, index) => (
              <div key={index} className="flex gap-2 items-center animate-in fade-in slide-in-from-left duration-300">
                <input 
                  type="text"
                  placeholder="Nom (Farine, Sucre...)"
                  className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-2xl text-[11px] text-white outline-none focus:border-purple-500 shadow-inner"
                  value={matiere.nom}
                  onChange={(e) => updateMatiere(index, 'nom', e.target.value)}
                  required
                />
                <div className="relative">
                  <input 
                    type="number"
                    placeholder="Coût"
                    className="w-28 bg-slate-950 border border-slate-800 p-4 rounded-2xl text-[11px] text-emerald-400 outline-none focus:border-emerald-500 font-bold shadow-inner"
                    value={matiere.prix}
                    onChange={(e) => updateMatiere(index, 'prix', e.target.value)}
                    required
                  />
                  <span className="absolute right-3 top-4 text-[8px] text-slate-700 font-bold">F</span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeMatiere(index)}
                  className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL CALCULÉ */}
          <div className="pt-6 mt-4 border-t border-slate-800/50 flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coût de revient total</span>
                <span className="text-[8px] text-slate-600 italic">Basé sur les ingrédients</span>
            </div>
            <span className="text-xl font-black text-emerald-400 tracking-tighter">
              {matieres.reduce((sum, m) => sum + Number(m.prix || 0), 0).toLocaleString()} F
            </span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-purple-900/40 transition-all active:scale-95 mt-4"
        >
          Enregistrer la Production
        </button>
      </form>
    </div>
  );
};

export default ProductionView;