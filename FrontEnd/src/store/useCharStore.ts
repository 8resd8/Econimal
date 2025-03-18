import { create } from 'zustand';
import { CharStore } from '@/pages/character/types/CharStore';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { persist } from 'zustand/middleware'; //localstorage 저장장

// 캐릭터 초기 상태
const initialCharState: CharacterTypes<number> = {
  id: 0,
  userCharacterId: 0, // 서버 ID도 명시적으로 저장
  name: '',
  description: '',
  img: '',
  backImg: '',
  profileImg: '',
  footImg: '',
  subStory: '',
  detailStory: '',
};

// zustand Type 설정 => charStore로
const useCharStore = create(
  persist<CharStore>(
    (set) => ({
      myChar: initialCharState,
      // 캐릭터 설정 함수
      setMyChar: (char) => {
        console.log('Zustand - 캐릭터 설정:', char);
        set({ myChar: char });
      },
      //캐릭터 초기화
      resetMyChar: () => {
        console.log('Zustand - 캐릭터 초기화');
        set({ myChar: initialCharState });
      },
      // 캐릭터가 선택되었는지 확인하는 함수
      isCharSelected: () => {
        const { myChar } = get();
        return !!(myChar.id || myChar.userCharacterId);
      },
    }),
    {
      name: 'char-storage',
    },
  ),
);

export default useCharStore;
