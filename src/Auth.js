import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else if (isSignUp) alert("Inscription réussie ! Vérifiez vos emails.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl animate-in zoom-in-95">
        <h1 className="text-2xl font-black text-center text-white mb-2">SILVER<span className="text-emerald-500">-</span>FIN</h1>
        <p className="text-slate-500 text-center text-[10px] mb-8 uppercase tracking-[0.3em]">Gestion de Stock Cloud</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full py-4 bg-emerald-600 rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-900/20 active:scale-95 transition-all text-white">
            {loading ? "Chargement..." : isSignUp ? "Créer mon compte" : "Se Connecter"}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">
          {isSignUp ? "Déjà un compte ? Connexion" : "Nouveau ? Créer un compte SILVER-FIN"}
        </button>
      </div>
    </div>
  );
};

export default Auth;