import { create } from 'zustand';
import type { User } from '../models/User';

const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

interface UserState {
  user: User | null;
  isVisible: boolean;
  setUser: (name: string) => void;
  setName: (name: string) => void;
  setVisible: (visible: boolean) => void;
  clearUser: () => void;
}

/** SRP: only manages local user identity and visibility preference. */
export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isVisible: false,

  setUser: (name: string) => {
    const existing = get().user;
    set({ user: { id: existing?.id ?? uid(), name } });
  },

  setName: (name: string) => {
    const existing = get().user;
    if (!existing) return;
    set({ user: { ...existing, name } });
  },

  setVisible: (visible: boolean) => set({ isVisible: visible }),

  clearUser: () => set({ user: null, isVisible: false }),
}));
