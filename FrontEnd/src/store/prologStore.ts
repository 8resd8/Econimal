import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PrologState {
    hasSeenProlog: boolean;
    setHasSeenProlog: (value: boolean) => void;
  }
  
  export const usePrologStore = create<PrologState>()(
    persist(
      (set) => ({
        hasSeenProlog: false,
        setHasSeenProlog: (value) => set({ hasSeenProlog: value }),
      }),
      {
        name: 'prolog-storage', // localStorage에 저장될 키 이름
      },
    ),
  );