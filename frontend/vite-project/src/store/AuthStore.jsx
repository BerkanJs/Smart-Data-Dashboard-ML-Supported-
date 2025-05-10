import { create } from 'zustand';

const AuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  setAuth: (token) => set({ isAuthenticated: true, token }),
  logout: () => set({ isAuthenticated: false, token: null }),
}));

export default AuthStore;
