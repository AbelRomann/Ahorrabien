import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Wallet } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Preferences } from '@capacitor/preferences';

export function Login() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [tempPin, setTempPin] = useState('');
  
  const hasPin = useAuthStore((state) => state.hasPin);
  const checkPinConfig = useAuthStore((state) => state.checkPinConfig);
  const createPin = useAuthStore((state) => state.createPin);
  const verifyPin = useAuthStore((state) => state.verifyPin);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkPinConfig();
  }, [checkPinConfig]);

  const handlePin = (num: string) => {
    setPin(prev => {
      if (prev.length < 4) return prev + num;
      return prev;
    });
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      processPin(pin);
    }
  }, [pin]);

  const processPin = async (currentPin: string) => {
    if (hasPin) {
      // Validate
      const isValid = await verifyPin(currentPin);
      if (isValid) {
        navigate('/home');
      } else {
        // [DEV HELPER]: Fetching the real saved PIN to show in the error for debugging
        const stored = await Preferences.get({ key: 'user_pin' });
        toast.error(`PIN incorrecto (El correcto era: ${stored.value})`);
        setPin('');
      }
    } else {
      // Create Step
      if (!confirmStep) {
        setTempPin(currentPin);
        setConfirmStep(true);
        setPin('');
        toast.info('Confirma tu PIN');
      } else {
        // Confirmation Step
        if (currentPin === tempPin) {
          const success = await createPin(currentPin);
          if (success) {
            toast.success('PIN configurado exitosamente');
            navigate('/home');
          } else {
            toast.error('Error al guardar el PIN');
            setPin('');
            setConfirmStep(false);
          }
        } else {
          toast.error('Los PINs no coinciden. Intenta de nuevo.');
          setPin('');
          setConfirmStep(false);
          setTempPin('');
        }
      }
    }
  };

  const resetEverything = async () => {
    await Preferences.remove({ key: 'user_pin' });
    toast.success('El PIN de seguridad ha sido borrado. Reiniciando...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Logo */}
      <div className="flex flex-col items-center mt-12 mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-[#06B6D4] rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
          <Wallet size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold">AhorraRD</h1>
        <p className="text-muted-foreground mt-2">
          {hasPin ? 'Ingresa tu PIN' : confirmStep ? 'Confirma tu PIN' : 'Crea un PIN de 4 dígitos'}
        </p>
      </div>

      {/* PIN Dots */}
      <div className="flex justify-center gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              i < pin.length 
                ? 'bg-primary border-primary' 
                : 'border-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Numpad */}
      <div className="flex-1 flex flex-col justify-end pb-4">
        <div className="grid grid-cols-3 gap-y-6 gap-x-4 max-w-[280px] mx-auto w-full mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePin(num.toString())}
              className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center text-2xl font-semibold active:bg-primary/20 transition-colors cursor-pointer"
            >
              {num}
            </button>
          ))}
          <div /> {/* Empty cell */}
          <button
            onClick={() => handlePin('0')}
            className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center text-2xl font-semibold active:bg-primary/20 transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-muted-foreground active:text-foreground transition-colors cursor-pointer"
          >
            Borrar
          </button>
        </div>
        
        {/* DEV RESET OPTION */}
        {hasPin && (
           <button 
             onClick={resetEverything}
             className="text-muted-foreground text-sm hover:text-foreground mx-auto underline transition-colors"
           >
             Olvidé mi PIN (Restablecer Seguridad)
           </button>
        )}
      </div>
    </div>
  );
}
