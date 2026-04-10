import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';

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
