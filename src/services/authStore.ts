import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (token: string, user?: any) => void;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  login: (token, user = null) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;