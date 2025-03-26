import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CharacterStatusType } from '@/pages/character/types/CharacterStatusType';
//따로 관리 ? 함께 관리?
export const useCharStatusStore = create<CharacterStatusType>()(
  persist(
    (set) => ({
      level: 0,
      exp: 0,
      coin: 0,
      expression: 'NEUTRAL',
      actions: {
        setLevel: (nowLv: number) => set({ level: nowLv }),
        setExp: (nowExp: number) => set({ exp: nowExp }),
        setCoin: (nowCoin: number) => set({ coin: nowCoin }),
        setExpression: (nowExpres: string) => set({ expression: nowExpres }),
      },
    }),
    {
      name: 'char-status',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        level: state.level,
        exp: state.exp,
        coin: state.coin,
        expression: state.expression,
      }),
    },
  ),
);
