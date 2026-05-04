import { useState, useEffect } from 'react';
import { HardHat, Users, FileText, GraduationCap } from 'lucide-react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(onComplete, 600);
          return 100;
        }
        return p + 3;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#0f0f1a] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Grille de fond */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Particules */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-amber-300/20 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-amber-400/20 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-amber-300/30 rounded-full animate-ping" style={{ animationDelay: '0.7s', animationDuration: '4s' }} />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="relative">
          {/* Anneau externe */}
          <div className="absolute -inset-3 rounded-full border-2 border-amber-500/20 animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="absolute -inset-6 rounded-full border border-amber-500/10 animate-pulse" />
          
          {/* Icône principale */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <HardHat size={48} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Icônes secondaires */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1.5 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Users size={20} className="text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <HardHat size={24} className="text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <FileText size={20} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            BTP<span className="text-amber-500"> RH</span> Manager
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
            Gestion du personnel de chantier
          </p>
        </div>

        {/* Barre de progression */}
        <div className="w-56 space-y-2">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-600 font-medium">{progress}%</p>
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-700 tracking-widest uppercase">
          Ressources Humaines
        </p>
      </div>

      {/* Version */}
      <p className="absolute bottom-6 text-xs text-gray-800">v2.0.0</p>
    </div>
  );
}