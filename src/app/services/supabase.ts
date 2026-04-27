import { createClient } from '@supabase/supabase-js';
import { Preferences } from '@capacitor/preferences';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Device ID ────────────────────────────────────────────────────────────────
// Un UUID estable generado la primera vez que corre la app en este dispositivo.
const DEVICE_ID_KEY = 'ahorrrard_device_id';

let _cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (_cachedDeviceId) return _cachedDeviceId;

  const { value } = await Preferences.get({ key: DEVICE_ID_KEY });
  if (value) {
    _cachedDeviceId = value;
    return value;
  }

  const newId = crypto.randomUUID();
  await Preferences.set({ key: DEVICE_ID_KEY, value: newId });
  _cachedDeviceId = newId;
  return newId;
}

// ─── Connectivity check ───────────────────────────────────────────────────────
export function isOnline(): boolean {
  return navigator.onLine;
}
