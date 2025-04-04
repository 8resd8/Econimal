import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PersistOptions } from 'zustand/middleware';
import { MyCharStoreTypes } from '@/pages/character/types/select/MyCharStoreTypes';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';

type PersistConfig = PersistOptions<MyCharStoreTypes>;

export const useMyCharStore = create<MyCharStoreTypes>()(
  persist(
    (set, get) => ({
      userCharacterId: 0,
      userBackgroundId: 0,
      name: '',
      subStory: '',
      detailStory: '',
      description: '',
      img: '',
      backImg: '',
      profileImg: '',
      footImg: '',
      actions: {
        setResetData: () =>
          set({ userCharacterId: 0, userBackgroundId: 0, name: '' }),
        setUserCharacterId: (userId: number) =>
          set({ userCharacterId: userId }),
        setUserBackgroundId: (backId: number) =>
          set({ userBackgroundId: backId }),
        setName: (name: string) => set({ name: name }),
        // 배경 이미지 직접 설정 액션 추가
        setBackImg: (backImg: string) => set({ backImg }),
        setAllData: (characterInfo: CharacterTypes<number>) =>
          set({
            userCharacterId: characterInfo.userCharacterId,
            userBackgroundId: characterInfo.userBackgroundId,
            name: characterInfo.name,
            subStory: characterInfo.subStory,
            detailStory: characterInfo.detailStory,
            img: characterInfo.img,
            backImg: characterInfo.backImg,
            profileImg: characterInfo.profileImg,
            footImg: characterInfo.footImg,
          }),
      },
    }),
    {
      name: 'myCharInformation',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        userCharacterId: state.userCharacterId,
        userBackgroundId: state.userBackgroundId,
        description: state.description,
        backImg: state.backImg, // backImg도 저장
      }),
    } as PersistConfig,
  ),
);

export const useMyCharName = () => useMyCharStore((state) => state.name);
export const useMyCharacterId = () =>
  useMyCharStore((state) => state.userCharacterId);
export const useMyBackgroundId = () =>
  useMyCharStore((state) => state.userBackgroundId);
export const useMyCharDescription = () =>
  useMyCharStore((state) => state.description);
export const useMyCharSubStory = () =>
  useMyCharStore((state) => state.subStory);
export const useMyCharDetailStory = () =>
  useMyCharStore((state) => state.detailStory);
export const useCharImg = () => useMyCharStore((state) => state.img);
export const useCharFootImg = () => useMyCharStore((state) => state.footImg);
export const useCharProfileImg = () =>
  useMyCharStore((state) => state.profileImg);
export const useBackImg = () => useMyCharStore((state) => state.backImg);

export const userMyCharActions = () => useMyCharStore((state) => state.actions);
