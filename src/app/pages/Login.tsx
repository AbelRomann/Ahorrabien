import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Wallet, AlertTriangle, ShieldOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { pinLockHelpers } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Preferences } from '@capacitor/preferences';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export function Login() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [tempPin, setTempPin] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const hasPin = useAuthStore((state) => state.hasPin);
  const checkPinConfig = useAuthStore((state) => state.checkPinConfig);
  const createPin = useAuthStore((state) => state.createPin);
  const verifyPin = useAuthStore((state) => state.verifyPin);
  const isLoading = useAuthStore((state) => state.isLoading);

  const isLocked = countdown > 0;

  // Load initial lockout state
  useEffect(() => {
    checkPinConfig();
    (async () => {
      const [attempts, locked] = await Promise.all([
        pinLockHelpers.getAttempts(),
        pinLockHelpers.getLockedUntil(),
      ]);
      setFailedAttempts(attempts);
      setLockedUntil(locked);
    })();
  }, [checkPinConfig]);

  // Countdown timer
  useEffect(() => {
    if (lockedUntil <= 0) { setCountdown(0); return; }
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCountdown(0);
        setLockedUntil(0);
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handlePin = (num: string) => {
    if (isLocked || isProcessing) return;
    setPin(prev => prev.length < 4 ? prev + num : prev);
  };

  const handleBackspace = () => {
    if (isLocked || isProcessing) return;
    setPin(prev => prev.slice(0, -1));
  };

  const processPin = useCallback(async (currentPin: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (hasPin) {
      // Check lockout before even trying
      const locked = await pinLockHelpers.getLockedUntil();
      if (locked > Date.now()) {
        setLockedUntil(locked);
        setPin('');
        setIsProcessing(false);
        return;
      }

      const isValid = await verifyPin(currentPin);
      if (isValid) {
        navigate('/home');
      } else {
        const { attempts, lockedUntil: newLocked } = await pinLockHelpers.recordFailure();
        setFailedAttempts(attempts);

        if (newLocked > 0) {
          setLockedUntil(newLocked);
          const mins = Math.ceil((newLocked - Date.now()) / 60_000);
          toast.error(`Demasiados intentos. Bloqueado por ${mins} min.`, { icon: '🔒' });
        } else {
          const remaining = 5 - attempts;
          if (remaining > 0) {
            toast.error(`PIN incorrecto. ${remaining} intento${remaining === 1 ? '' : 's'} restante${remaining === 1 ? '' : 's'}.`);
          } else {
            toast.error('PIN incorrecto.');
          }
        }
        setPin('');
      }
    } else {
      // Create PIN flow
      if (!confirmStep) {
        setTempPin(currentPin);
        setConfirmStep(true);
        setPin('');
        toast.info('Confirma tu PIN');
      } else {
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
    setIsProcessing(false);
  }, [hasPin, confirmStep, tempPin, verifyPin, createPin, navigate, isProcessing]);

  useEffect(() => {
    if (pin.length === 4) {
      processPin(pin);
    }
  }, [pin]);

  const handleConfirmReset = async () => {
    await Preferences.remove({ key: 'user_pin' });
    await pinLockHelpers.clearAll();
    toast.success('PIN borrado. Por favor crea uno nuevo.');
    setTimeout(() => window.location.reload(), 1200);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')} min` : `${s}s`;
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
          {hasPin
            ? confirmStep ? 'Confirma tu PIN' : 'Ingresa tu PIN'
            : confirmStep ? 'Confirma tu PIN' : 'Crea un PIN de 4 dígitos'}
        </p>
      </div>

      {/* Lockout Banner */}
      {isLocked && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
          <ShieldOff size={20} className="text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Acceso bloqueado</p>
            <p className="text-xs text-destructive/70">Intenta de nuevo en {formatCountdown(countdown)}</p>
          </div>
        </div>
      )}

      {/* PIN Dots */}
      <div className="flex justify-center gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
              isLocked
                ? 'border-destructive/40'
                : i < pin.length
                ? 'bg-primary border-primary scale-110'
                : 'border-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Attempts warning (3-4 failed attempts, not yet locked) */}
      {hasPin && failedAttempts >= 3 && !isLocked && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-500/90">
            {5 - failedAttempts} intento{5 - failedAttempts === 1 ? '' : 's'} restante{5 - failedAttempts === 1 ? '' : 's'} antes del bloqueo.
          </p>
        </div>
      )}

      {/* Numpad */}
      <div className="flex-1 flex flex-col justify-end pb-4">
        <div className="grid grid-cols-3 gap-y-6 gap-x-4 max-w-[280px] mx-auto w-full mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePin(num.toString())}
              disabled={isLocked || isProcessing}
              className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center text-2xl font-semibold active:bg-primary/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePin('0')}
            disabled={isLocked || isProcessing}
            className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center text-2xl font-semibold active:bg-primary/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={isLocked || isProcessing}
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-muted-foreground active:text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Borrar
          </button>
        </div>

        {hasPin && (
          <button
            onClick={() => setShowResetDialog(true)}
            className="text-muted-foreground text-sm hover:text-foreground mx-auto underline transition-colors"
          >
            Olvidé mi PIN
          </button>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="rounded-[24px] max-w-[340px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock size={18} className="text-destructive" />
              Restablecer acceso
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará tu PIN actual. Tendrás que crear uno nuevo para acceder a la app.
              <span className="block mt-2 font-semibold text-foreground/80">
                Tus datos financieros no se borrarán.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, restablecer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
