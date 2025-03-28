// store.ts
import { create } from 'zustand';

// 메모리에만 토큰을 저장하는 인증 스토어
interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// persist 미들웨어 사용하지 않음 - 메모리에만 저장
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));