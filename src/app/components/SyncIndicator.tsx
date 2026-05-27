import React, { useState, useEffect } from 'react';
import { CloudUpload, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { syncService, SyncState } from '../services/syncService';

/**
 * Badge pequeño que muestra el estado de sincronización con Supabase.
 * Se coloca típicamente en el header de Home.
 */
export function SyncIndicator() {
  const [state, setState] = useState<SyncState>(syncService.state);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsub = syncService.subscribe(setState);

    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsub();
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div
        title="Sin conexión — los datos se guardan localmente"
        className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-3.5 text-[13px] font-medium text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
      >
        <CloudOff size={14} />
        <span>Offline</span>
      </div>
    );
  }

  if (state.status === 'syncing') {
    return (
      <div
        title="Sincronizando con la nube..."
        className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-3.5 text-[13px] font-medium text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
      >
        <RefreshCw size={14} className="animate-spin" />
        <span>Sync...</span>
      </div>
    );
  }

  if (state.pendingCount > 0) {
    return (
      <div
        title={`${state.pendingCount} cambio${state.pendingCount !== 1 ? 's' : ''} pendiente${state.pendingCount !== 1 ? 's' : ''} por sincronizar`}
        className="flex h-11 items-center gap-2 rounded-2xl border border-amber-300/16 bg-amber-500/14 px-3.5 text-[13px] font-medium text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
      >
        <CloudUpload size={14} />
        <span>{state.pendingCount} pendiente{state.pendingCount !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  // synchronized sin pendientes
  return (
    <div
      title="Datos sincronizados con la nube"
      className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-3.5 text-[13px] font-medium text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
    >
      <CheckCircle2 size={14} />
      <span>Sync</span>
    </div>
  );
}
