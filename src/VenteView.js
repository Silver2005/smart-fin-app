import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share } from '@capacitor/share';

const VenteView = ({ articles, onAddVente }) => {
  const navigate = useNavigate();
  const [saleData, setSaleData] = useState({ contact: '', article_id: '', quantite: 1, prix_unitaire: '' });
  const [receipt, setReceipt] = useState(null);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const selectedArt = articles.find(a => a.id === Number(saleData.article_id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!saleData.article_id) return alert("Sélectionnez un article");
    
    const currentArticle = articles.find(a => a.id === Number(saleData.article_id));
    
    if (currentArticle && currentArticle.quantite_stock < Number(saleData.quantite)) {
      return alert(`Stock insuffisant ! Il ne reste que ${currentArticle.quantite_stock} unités.`);
    }

    const montantTotal = Number(saleData.quantite) * Number(saleData.prix_unitaire);

    onAddVente({
      ...saleData,
      prix_vente: montantTotal 
    });

    setReceipt({ 
      ...saleData, 
      article_nom: currentArticle?.nom || "Article", 
      prix_total: montantTotal, 
      date: new Date().toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }) 
    });
    
    setSaleData({ contact: '', article_id: '', quantite: 1, prix_unitaire: '' });
  };

  const handleShare = async () => {
    const message = `
📄 REÇU DE CAISSE SILVER-FIN
---------------------------
Date: ${receipt.date}
Client: ${receipt.contact}
Produit: ${receipt.article_nom}
Quantité: x${receipt.quantite}
Prix Unitaire: ${Number(receipt.prix_unitaire).toLocaleString()} F
---------------------------
TOTAL: ${Number(receipt.prix_total).toLocaleString()} F
---------------------------
Développé par SILVER'S DESIGN
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
      <div className="flex flex-col items-center w-full animate-in zoom-in-95 pb-10">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .receipt-to-print, .receipt-to-print * { visibility: visible; }
            .receipt-to-print { 
              position: absolute; left: 0; top: 0; width: 100%; 
              border: none !important; box-shadow: none !important;
            }
            .no-print { display: none !important; }
          }
        `}</style>

        <div className="bg-white text-black p-8 rounded-lg shadow-2xl border-4 border-double border-slate-300 w-full max-w-md font-mono receipt-to-print">
          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h2 className="text-xl font-black italic underline uppercase text-slate-900">REÇU DE CAISSE</h2>
            <p className="text-[10px] no-italic font-sans text-slate-500 font-bold tracking-widest">SILVER-FIN</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="flex justify-between"><span>Date:</span> <span>{receipt.date}</span></p>
            <p className="flex justify-between border-b border-slate-200 pb-2"><span>Client:</span> <span className="font-bold uppercase">{receipt.contact}</span></p>
            
            <div className="border-b-2 border-dashed border-black my-4 py-2">
              <p className="flex justify-between italic"><span>Produit:</span> <span className="font-bold">{receipt.article_nom}</span></p>
              <p className="flex justify-between italic"><span>Prix Unit:</span> <span>{Number(receipt.prix_unitaire).toLocaleString()} F</span></p>
              <p className="flex justify-between italic"><span>Quantité:</span> <span>x {receipt.quantite}</span></p>
            </div>
            
            <div className="pt-2">
               <p className="text-[10px] uppercase font-bold text-slate-400">Total Net</p>
               <p className="text-2xl font-black flex justify-between">
                <span>CFA</span> <span>{Number(receipt.prix_total).toLocaleString()} F</span>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-[9px] text-slate-400 uppercase tracking-tighter italic">
            Merci de votre confiance !
          </div>
        </div>

        <div className="mt-8 space-y-3 w-full max-w-md no-print">
          {isMobile ? (
            <button onClick={handleShare} className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs rounded-2xl active:scale-95 transition-transform shadow-lg shadow-emerald-900/40">
              📤 Partager le Reçu
            </button>
          ) : (
            <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white font-black uppercase text-xs rounded-2xl hover:bg-black transition-all shadow-lg shadow-slate-900/40">
              🖨️ Générer la Facture PDF
            </button>
          )}
          
          <button onClick={() => setReceipt(null)} className="w-full py-3 border-2 border-slate-800 text-slate-400 font-black uppercase text-[10px] rounded-2xl hover:bg-slate-900 transition-colors">
            Nouvelle Vente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom duration-500 pb-10">
      
      {/* --- EN-TÊTE AVEC BOUTON RETOUR --- */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 shadow-lg"
        >
          ←
        </button>
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Facturation <span className="text-emerald-400">Client</span>
        </h2>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-900/20 shadow-2xl w-full">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest italic underline underline-offset-8">Terminal de Vente</h2>
            <span className="text-[8px] text-slate-600 font-black tracking-widest border border-slate-800 px-2 py-1 rounded">SILVER-FIN</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="text-[10px] text-slate-500 ml-2 uppercase font-bold">Sélection de l'article</label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none text-slate-300 focus:border-emerald-500 appearance-none mt-1 shadow-inner"
              onChange={(e) => setSaleData({...saleData, article_id: e.target.value})} 
              required 
              value={saleData.article_id}
            >
              <option value="">-- Choisir un produit --</option>
              {articles.map(art => (
                <option key={art.id} value={art.id} disabled={art.quantite_stock <= 0}>
                  {art.nom} ({art.quantite_stock} en stock)
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-11 pointer-events-none text-slate-500 text-xs">▼</div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 ml-2 uppercase font-bold">Information Client</label>
            <input type="text" placeholder="Nom complet du client" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white mt-1 placeholder:text-slate-700 shadow-inner" 
              value={saleData.contact}
              onChange={(e) => setSaleData({...saleData, contact: e.target.value})} required />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="text-[10px] text-slate-500 ml-2 uppercase font-bold">Quantité</label>
              <input 
                type="number" 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white mt-1 shadow-inner" 
                min="1" 
                max={selectedArt?.quantite_stock} 
                value={saleData.quantite}
                onChange={(e) => setSaleData({...saleData, quantite: e.target.value})} 
                required 
              />
            </div>
            <div className="w-2/3">
              <label className="text-[10px] text-slate-500 ml-2 uppercase font-bold">Prix Unitaire (F)</label>
              <input type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white mt-1 placeholder:text-slate-700 shadow-inner font-bold text-emerald-400" 
                value={saleData.prix_unitaire}
                onChange={(e) => setSaleData({...saleData, prix_unitaire: e.target.value})} required />
            </div>
          </div>

          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 text-right">
            <span className="text-slate-500 text-[10px] uppercase mr-2 font-bold italic">Total à encaisser :</span>
            <span className="text-emerald-400 font-black text-2xl tracking-tighter">
              {(Number(saleData.quantite) * Number(saleData.prix_unitaire)).toLocaleString()} <span className="text-xs">F</span>
            </span>
          </div>

          <button 
            type="submit"
            disabled={selectedArt && selectedArt.quantite_stock < Number(saleData.quantite)}
            className={`w-full py-5 rounded-3xl font-black text-sm uppercase shadow-lg transition-all text-white mt-4 ${
              selectedArt && selectedArt.quantite_stock < Number(saleData.quantite) 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
              : 'bg-emerald-600 active:scale-95 hover:bg-emerald-500 shadow-emerald-900/40'
            }`}
          >
            {selectedArt && selectedArt.quantite_stock < Number(saleData.quantite) ? 'Stock Insuffisant' : 'Confirmer la Vente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VenteView;