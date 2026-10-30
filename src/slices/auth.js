import { createStore } from 'zustand/vanilla';

export const createAuthStore = () => createStore((set) => ({
  token: null,
  username: null,
  setAuth: ({ token, username }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    set({ token, username });
  },
  removeAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('auth');
    set({ token: null, username: null });
  },
}));
