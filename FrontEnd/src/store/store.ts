import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 추가 설치 필요할 수 있음

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
    },
  ),
);
