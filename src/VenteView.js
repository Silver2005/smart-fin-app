import React, { useState } from 'react';
import { Share } from '@capacitor/share';

const VenteView = ({ articles, onAddVente }) => {
  const [saleData, setSaleData] = useState({ contact_nom: '', article_id: '', quantite: 1, prix_unitaire: '' });
  const [receipt, setReceipt] = useState(null);

  // Détection du support mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Trouver l'article sélectionné pour accéder à son stock
  const selectedArt = articles.find(a => a.id === Number(saleData.article_id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!saleData.article_id) return alert("Sélectionnez un article");
    
    if (selectedArt && selectedArt.quantite_stock < saleData.quantite) {
      return alert(`Stock insuffisant ! Il ne reste que ${selectedArt.quantite_stock} unités.`);
    }

    const montantTotal = Number(saleData.quantite) * Number(saleData.prix_unitaire);

    onAddVente({
      ...saleData,
      prix_vente: montantTotal 
    });

    setReceipt({ 
      ...saleData, 
      article_nom: selectedArt?.nom || "Article", 
      prix_total: montantTotal, 
      date: new Date().toLocaleString('fr-FR') 
    });
    
    setSaleData({ contact_nom: '', article_id: '', quantite: 1, prix_unitaire: '' });
  };

  const handleShare = async () => {
    const message = `
📄 REÇU DE CAISSE SILVER-FIN
---------------------------
Date: ${receipt.date}
Client: ${receipt.contact_nom}
Produit: ${receipt.article_nom}
Quantité: x${receipt.quantite}
Prix Unitaire: ${Number(receipt.prix_unitaire).toLocaleString()} F
---------------------------
TOTAL: ${Number(receipt.prix_total).toLocaleString()} F
---------------------------
Merci de votre confiance !
    `;

    try {
      await Share.share({
        title: 'Reçu de vente',
        text: message,
        dialogTitle: 'Envoyer le reçu via...',
      });
    } catch (error) {
      console.error("Erreur de partage", error);
    }
  };

  if (receipt) {
    return (
      <div className="bg-white text-black p-8 rounded-lg shadow-2xl border-4 border-double border-slate-300 mx-auto w-full animate-in zoom-in-95 font-mono">
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h2 className="text-xl font-black italic underline uppercase text-slate-900">REÇU DE CAISSE</h2>
          <p className="text-[10px] no-italic font-sans text-slate-500 font-bold tracking-widest">SILVER-FIN</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between"><span>Date:</span> <span>{receipt.date}</span></p>
          <p className="flex justify-between border-b border-slate-200 pb-2"><span>Client:</span> <span className="font-bold uppercase">{receipt.contact_nom}</span></p>
          <div className="border-b-2 border-dashed border-black my-4 py-2">
            <p className="flex justify-between italic"><span>Produit:</span> <span>{receipt.article_nom}</span></p>
            <p className="flex justify-between italic"><span>Prix Unit:</span> <span>{Number(receipt.prix_unitaire).toLocaleString()} F</span></p>
            <p className="flex justify-between italic"><span>Quantité:</span> <span>x {receipt.quantite}</span></p>
          </div>
          <p className="text-2xl font-black flex justify-between pt-2">
            <span>TOTAL:</span> <span>{Number(receipt.prix_total).toLocaleString()} F</span>
          </p>
        </div>

        <div className="mt-8 space-y-2 no-print">
          {isMobile ? (
            <button 
              onClick={handleShare} 
              className="w-full py-3 bg-emerald-600 text-white font-bold uppercase text-xs rounded-lg active:scale-95 transition-transform shadow-lg shadow-emerald-200"
            >
              📤 Partager (WhatsApp)
            </button>
          ) : (
            <button 
              onClick={() => window.print()} 
              className="w-full py-3 bg-slate-900 text-white font-bold uppercase text-xs rounded-lg hover:bg-black transition-all"
            >
              🖨️ Générer PDF / Imprimer
            </button>
          )}
          
          <button 
            onClick={() => setReceipt(null)} 
            className="w-full py-2 border border-black font-bold uppercase text-xs rounded-lg hover:bg-slate-50 transition-colors"
          >
            Nouvelle Vente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-900/20 shadow-2xl animate-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-emerald-400 font-bold text-sm uppercase tracking-widest italic underline underline-offset-8">Facturation Client</h2>
         <span className="text-[8px] text-slate-600 font-black tracking-widest border border-slate-800 px-2 py-1 rounded">SILVER-FIN</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <select 
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none text-slate-300 focus:border-emerald-500 appearance-none"
            onChange={(e) => setSaleData({...saleData, article_id: e.target.value})} 
            required 
            value={saleData.article_id}
          >
            <option value="">-- Sélectionner l'article --</option>
            {articles.map(art => (
              <option key={art.id} value={art.id} disabled={art.quantite_stock <= 0}>
                {art.nom} ({art.quantite_stock} dispo)
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-5 pointer-events-none text-slate-500 text-xs">▼</div>
        </div>

        <input type="text" placeholder="Nom du Client" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white" 
          value={saleData.contact_nom}
          onChange={(e) => setSaleData({...saleData, contact_nom: e.target.value})} required />
        
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="text-[10px] text-slate-500 ml-2">Qté {selectedArt && <span className="text-emerald-500">(Max {selectedArt.quantite_stock})</span>}</label>
            <input 
              type="number" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white" 
              min="1" 
              max={selectedArt?.quantite_stock} // Sécurité HTML5
              value={saleData.quantite}
              onChange={(e) => setSaleData({...saleData, quantite: e.target.value})} 
              required 
            />
          </div>
          <div className="w-2/3">
            <label className="text-[10px] text-slate-500 ml-2">Prix Unitaire (F)</label>
            <input type="number" placeholder="Ex: 2500" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white" 
              value={saleData.prix_unitaire}
              onChange={(e) => setSaleData({...saleData, prix_unitaire: e.target.value})} required />
          </div>
        </div>

        {/* Alerte Stock Bas */}
        {selectedArt && selectedArt.quantite_stock < 5 && (
           <p className="text-[10px] text-amber-500 font-bold animate-pulse">⚠️ Attention : Stock critique ({selectedArt.quantite_stock} restants)</p>
        )}

        <div className="text-right p-2">
          <span className="text-slate-500 text-xs uppercase mr-2">Sous-total :</span>
          <span className="text-emerald-400 font-bold">{(Number(saleData.quantite) * Number(saleData.prix_unitaire)).toLocaleString()} F</span>
        </div>

        <button 
          type="submit"
          disabled={selectedArt && selectedArt.quantite_stock < saleData.quantite}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase shadow-lg transition-all text-white ${
            selectedArt && selectedArt.quantite_stock < saleData.quantite 
            ? 'bg-slate-700 cursor-not-allowed' 
            : 'bg-emerald-600 active:scale-95 hover:bg-emerald-500'
          }`}
        >
          {selectedArt && selectedArt.quantite_stock < saleData.quantite ? 'Stock Insuffisant' : 'Encaisser Transaction'}
        </button>
      </form>
    </div>
  );
};

export default VenteView;