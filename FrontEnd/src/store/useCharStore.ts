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
        profileImg: '',
        footImg: '',
        id: 0, //음.. 숫자로 들어가져야하는 부분이긴 한데
        subStory: '', // 초기값 설정
        detailStory: '', // 초기값 설정
      },
      setMyChar: (char: CharacterTypes<number>) => set({ myChar: char }), //캐릭터 자체가 반환하는 내용?
    }),
    {
      name: 'char-storage',
    },
  ),
);

export default useCharStore;
