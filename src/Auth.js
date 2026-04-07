import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;

    if (isSignUp) {
      // INSCRIPTION avec métadonnées (Prénom et Nom)
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
    } else {
      // CONNEXION classique
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    const { error } = result;

    if (error) {
      alert(error.message);
    } else if (isSignUp) {
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setIsSignUp(false); // On bascule sur l'écran de connexion
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Effet visuel d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            SILVER<span className="text-emerald-500">-</span>FIN
          </h1>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] mt-2">
            {isSignUp ? "Création de profil premium" : "Accès sécurisé au coffre-fort"}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {/* CHAMPS NOM & PRENOM (Affichés uniquement en mode Inscription) */}
          {isSignUp && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <input 
                type="text" 
                placeholder="Prénom" 
                className="w-full bg-black/50 border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50 text-sm font-bold transition-all" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required={isSignUp} 
              />
              <input 
                type="text" 
                placeholder="Nom" 
                className="w-full bg-black/50 border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50 text-sm font-bold transition-all" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required={isSignUp} 
              />
            </div>
          )}

          <input 
            type="email" 
            placeholder="Email professionnel" 
            className="w-full bg-black/50 border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50 text-sm font-bold transition-all" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="w-full bg-black/50 border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50 text-sm font-bold transition-all" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <button 
            disabled={loading} 
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-emerald-900/20 active:scale-95 transition-all text-white mt-4"
          >
            {loading ? "Traitement..." : isSignUp ? "Devenir Membre" : "Déverrouiller"}
          </button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          className="w-full mt-8 text-slate-500 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors"
        >
          {isSignUp 
            ? "Déjà enregistré ? Se connecter" 
            : "Nouveau ici ? Créer un compte SILVER-FIN"
          }
        </button>
      </div>

      {/* Footer minimaliste */}
      <div className="absolute bottom-6 w-full text-center opacity-20 pointer-events-none">
        
      </div>
    </div>
  );
};

export default Auth;