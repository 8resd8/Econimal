import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';

interface CharState {
  myChar: CharacterTypes<number>;
  setMyChar: (char: CharacterTypes<number>) => void;
  resetMyChar: () => void;
}

interface PersistedCharState extends CharState {
  $$storeMutators?: [['zustand/persist', unknown]];
}

const defaultChar: CharacterTypes<number> = {
  // 기본 캐릭터 상태
};

const useCharStore = create<PersistedCharState>(
  persist(
    (set) => ({
      myChar: defaultChar,

      setMyChar: (char) => {
        const validatedChar = {
          ...char,
          id: char.id || char.userCharacterId || 1,
          userCharacterId: char.userCharacterId || char.id || 1,
          backgroundId: char.backgroundId || 1,
        };

        set({ myChar: validatedChar });
      },

      resetMyChar: () => set({ myChar: defaultChar }),
    }),
    {
      name: 'char-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
) as typeof useCharStore;

export default useCharStore;
