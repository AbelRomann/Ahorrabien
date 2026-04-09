import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleGuest = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Logo */}
      <div className="flex flex-col items-center mt-12 mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-[#06B6D4] rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
          <Wallet size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold">AhorraRD</h1>
        <p className="text-muted-foreground mt-2">Bienvenido de vuelta</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex-1 flex flex-col">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 bg-card border-border rounded-2xl"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-14 bg-card border-border rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl"
          >
            Iniciar sesión
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-14 border-primary text-primary hover:bg-primary/10 rounded-2xl"
            onClick={() => navigate('/register')}
          >
            Registrarse
          </Button>

          <button
            type="button"
            onClick={handleGuest}
            className="w-full text-sm text-muted-foreground hover:text-foreground pt-4"
          >
            Continuar como invitado
          </button>
        </div>
      </form>
    </div>
  );
}
