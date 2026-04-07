import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Welcome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Redirection automatique si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white overflow-hidden relative font-sans">
      
      {/* EFFETS DE LUMIÈRE DYNAMIQUES (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-10 flex flex-col min-h-screen">
        
        {/* LOGO SECTION */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
            
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter mb-2 leading-none">
            SILVER <span className="text-emerald-500 tracking-normal">FIN</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-500">
            controle ta poche
          </p>
        </div>

        {/* FEATURES DYNAMIQUES */}
        <div className="space-y-4 mb-20">
          {[
            { 
              title: "Gestion de Flux", 
              desc: "Suivez vos entrées et sorties avec une interface intuitive.", 
              icon: "📊" 
            },
            { 
              title: "Contrôle des Dettes", 
              desc: "Ne perdez plus jamais le fil de ce qu'on vous doit.", 
              icon: "⚖️" 
            },
            { 
              title: "Rapports d'Expert", 
              desc: "Exportez vos bilans financiers en PDF haute définition.", 
              icon: "📄" 
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl hover:bg-slate-900/60 transition-all hover:border-emerald-500/20 duration-500"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className="text-2xl mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-auto space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <button 
            onClick={() => navigate('/auth')} 
            className="w-full bg-white text-black font-black py-6 rounded-[2.2rem] uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-emerald-500/10 hover:bg-emerald-500 hover:text-black transition-all active:scale-95 group relative overflow-hidden"
          >
            <span className="relative z-10">Ouvrir mon coffre-fort</span>
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              Technologie de Chiffrement Bancaire
            </p>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-[8px] text-emerald-500/60 font-black uppercase tracking-tighter">Système Opérationnel</p>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATION CSS */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.8s ease-out forwards; }
        .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>
    </div>
  );
};

export default Welcome;