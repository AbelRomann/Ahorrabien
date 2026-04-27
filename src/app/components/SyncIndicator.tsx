import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
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
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium"
      >
        <CloudOff size={12} />
        <span>Offline</span>
      </div>
    );
  }

  if (state.status === 'syncing') {
    return (
      <div
        title="Sincronizando con la nube..."
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium"
      >
        <RefreshCw size={12} className="animate-spin" />
        <span>Sync...</span>
      </div>
    );
  }

  if (state.status === 'error' || (state.status === 'idle' && state.pendingCount > 0)) {
    return (
      <div
        title={`${state.pendingCount} cambio${state.pendingCount !== 1 ? 's' : ''} pendiente${state.pendingCount !== 1 ? 's' : ''} por sincronizar`}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium"
      >
        <Cloud size={12} />
        <span>{state.pendingCount} pendiente{state.pendingCount !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  // synced o idle sin pendientes
  return (
    <div
      title="Datos sincronizados con la nube"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium"
    >
      <CheckCircle2 size={12} />
      <span>Sync</span>
    </div>
  );
}
