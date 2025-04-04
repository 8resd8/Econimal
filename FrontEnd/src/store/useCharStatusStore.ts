import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CharacterStatusType } from '@/pages/character/types/CharacterStatusType';

//상태 객체 전체 구독 + action 함수 생명주기 변경X
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

// 상태 선택자
export const useCharacterLevel = () =>
  useCharStatusStore((state) => state.level);
export const useCharacterExp = () => useCharStatusStore((state) => state.exp);
export const useCharacterCoin = () => useCharStatusStore((state) => state.coin);
export const useCharacterExpression = () =>
  useCharStatusStore((state) => state.expression);

// 액션 선택자
export const useCharacterActions = () =>
  useCharStatusStore((state) => state.actions);
