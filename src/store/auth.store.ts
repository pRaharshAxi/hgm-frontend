import { create } from 'zustand';

type User = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set: any) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  login: (token: string, user?: User) => {
    set({ token, user: user || null });
    try {
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      // ignore storage errors
    }
  },
  logout: () => {
    set({ token: null, user: null });
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
    window.location.href = '/login';
  },
}));

export default useAuthStore;
