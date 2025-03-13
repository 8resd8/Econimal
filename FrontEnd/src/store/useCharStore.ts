import { create } from 'zustand';
import { CharStore } from '@/types/CharStore';
import { CharacterTypes } from '@/types/CharacterTypes';

// zustand Type 설정 => charStore로
const useCharStore = create<CharStore>((set) => ({
  myChar: {
    name: '',
    description: '',
    subStory: undefined, // 초기값 설정
    detailStory: undefined, // 초기값 설정
  },
  setMyChar: (char: CharacterTypes<string>) => set({ myChar: char }), //캐릭터 자체가 반환하는 내용?
}));

export default useCharStore;
