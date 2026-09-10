import { create } from 'zustand';

type User = {
  id?: string;
  email?: string;
  name?: string;
  role?: 'BUYER' | 'SUPPLIER' | 'ADMIN';
};

type AuthState = {
  token: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string, user?: User) => void;
  logout: () => void;
};

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: readStoredUser(),
  setUser: (user) => {
    set({ user });
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
    } catch {}
  },
  login: (token: string, user?: User) => {
    set({ token, user: user ?? null });
    try {
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    } catch {}
  },
  logout: () => {
    set({ token: null, user: null });
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
  },
}));

export default useAuthStore;