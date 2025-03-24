// import { create } from 'zustand'; // zustand 설정 파일

// interface AuthState {
//   token: string | null;
//   setToken: (token: string) => void;
//   clearToken: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   token: null,
//   setToken: (token) => set({ token }),
//   clearToken: () => set({ token: null }),
// }));

// 테스팅을 위한 로컬스토리지에 토큰 저장하는 로직
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
