import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Wallet } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0a5f4a] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-[#06B6D4] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/50">
          <Wallet size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          AhorraRD
        </h1>
        <p className="text-muted-foreground">
          Tu gestor financiero personal
        </p>
      </div>
      
      <div className="absolute bottom-8 text-white/50 text-sm font-medium">
         Cargando...
      </div>
    </div>
  );
}
