import { create } from 'zustand';
import { CharStore } from '@/pages/character/types/CharStore';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { persist } from 'zustand/middleware'; //localstorage 저장장

// zustand Type 설정 => charStore로
const useCharStore = create(
  persist<CharStore>(
    (set) => ({
      myChar: {
        name: '',
        description: '',
        img: '',
        backImg: '',
        subStory: undefined, // 초기값 설정
        detailStory: undefined, // 초기값 설정
      },
      setMyChar: (char: CharacterTypes<string>) => set({ myChar: char }), //캐릭터 자체가 반환하는 내용?
    }),
    {
      name: 'char-storage',
    },
  ),
);

export default useCharStore;
