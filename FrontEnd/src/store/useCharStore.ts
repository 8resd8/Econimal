import { create } from 'zustand';
import { CharStore } from '@/pages/character/types/CharStore';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { persist } from 'zustand/middleware'; //localstorage 저장장

// 캐릭터 초기 상태
// 기본 캐릭터 상태 - 모든 필드를 명시적으로 초기화
interface CharState {
  myChar: CharacterTypes<number>;
  setMyChar: (char: CharacterTypes<number>) => void;
  resetMyChar: () => void;
}

const defaultChar: CharacterTypes<number> = {
  id: 0,
  userCharacterId: 0,
  name: '',
  description: '',
  img: '',
  backImg: '',
  profileImg: '',
  footImg: '',
  subStory: '',
  detailStory: '',
};

const useCharStore = create<CharState>((set) => ({
  myChar: defaultChar,

  setMyChar: (char) => {
    // ID 값이 유효한지 확인하고 수정
    const validatedChar = {
      ...char,
      // ID가 undefined이거나 0인 경우 적절한 값으로 설정
      id: char.id || char.userCharacterId || 1, // 최소한 1 이상의 값으로 설정
      userCharacterId: char.userCharacterId || char.id || 1,
    };

    console.log('캐릭터 저장 전 데이터 검증:', {
      원본: char,
      검증후: validatedChar,
    });

    set({ myChar: validatedChar });
  },

  resetMyChar: () => set({ myChar: defaultChar }),
}));

export default useCharStore;
