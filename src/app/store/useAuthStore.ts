import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';

const FAILED_ATTEMPTS_KEY = 'pin_failed_attempts';
const LOCKED_UNTIL_KEY = 'pin_locked_until';

// Returns lockout duration in ms based on total failed attempts
const getLockDurationMs = (attempts: number): number => {
  if (attempts < 5) return 0;
  // 1 min for 5th attempt, doubles every 5 more
  const level = Math.floor((attempts - 5) / 5);
  return 60_000 * Math.pow(2, level);
};

export const pinLockHelpers = {
  getAttempts: async (): Promise<number> => {
    const res = await Preferences.get({ key: FAILED_ATTEMPTS_KEY });
    return res.value ? parseInt(res.value, 10) : 0;
  },
  getLockedUntil: async (): Promise<number> => {
    const res = await Preferences.get({ key: LOCKED_UNTIL_KEY });
    return res.value ? parseInt(res.value, 10) : 0;
  },
  recordFailure: async (): Promise<{ attempts: number; lockedUntil: number }> => {
    const current = await pinLockHelpers.getAttempts();
    const newAttempts = current + 1;
    await Preferences.set({ key: FAILED_ATTEMPTS_KEY, value: newAttempts.toString() });
    const lockMs = getLockDurationMs(newAttempts);
    const lockedUntil = lockMs > 0 ? Date.now() + lockMs : 0;
    if (lockedUntil > 0) {
      await Preferences.set({ key: LOCKED_UNTIL_KEY, value: lockedUntil.toString() });
    }
    return { attempts: newAttempts, lockedUntil };
  },
  clearAll: async (): Promise<void> => {
    await Preferences.remove({ key: FAILED_ATTEMPTS_KEY });
    await Preferences.remove({ key: LOCKED_UNTIL_KEY });
  },
};

interface AuthState {
  hasPin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  displayName: string;
  email: string;
  checkPinConfig: () => Promise<void>;
  createPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  hasPin: false,
  isAuthenticated: false,
  isLoading: true,
  displayName: 'Usuario',
  email: '',

  checkPinConfig: async () => {
    try {
      const pinRes = await Preferences.get({ key: 'user_pin' });
      const nameRes = await Preferences.get({ key: 'user_name' });
      const emailRes = await Preferences.get({ key: 'user_email' });

      set({ 
        hasPin: !!pinRes.value, 
        displayName: nameRes.value || 'Usuario',
        email: emailRes.value || '',
        isLoading: false 
      });
    } catch (error) {
      console.error('Error checking pin', error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (name: string, email: string) => {
    await Preferences.set({ key: 'user_name', value: name });
    await Preferences.set({ key: 'user_email', value: email });
    set({ displayName: name, email });
  },

  createPin: async (pin: string) => {
    try {
      await Preferences.set({ key: 'user_pin', value: pin });
      await pinLockHelpers.clearAll();
      set({ hasPin: true, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Error creating pin', error);
      return false;
    }
  },

  verifyPin: async (pin: string) => {
    try {
      const { value } = await Preferences.get({ key: 'user_pin' });
      if (value === pin) {
        await pinLockHelpers.clearAll();
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying pin', error);
      return false;
    }
  },

  logout: () => {
    set({ isAuthenticated: false });
  }
}));
