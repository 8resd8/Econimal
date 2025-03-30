import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PersistOptions } from 'zustand/middleware'; //단일 제네릭만 필요함
interface useMyCharStoreTypes {
  userCharacterId: number;
  userBackgroundId: number;
  name: string;
  actions: {
    setResetData: () => void;
    setUserCharacterId: (userId: number) => void;
    setUserBackgroundId: (backId: number) => void;
    setName: (name: string) => void;
  };
}

//미들웨어 타입 명시
type PersistConfig = PersistOptions<useMyCharStoreTypes>;

//초기 characterZustand 값 => Character와 관련된 모든 정보들을 보관함
//display로 나타내기 위함
//실제적으로 이름과 아이디값만 활용하기 때문에 다른 내용은 필요없다고 판단됨
export const useMyCharStore = create<useMyCharStoreTypes>()(
  persist(
    (set, get) => ({
      //상점과 캐릭터 설명 및 마을에서 사용되면 좋을 키워드
      userCharacterId: 0,
      userBackgroundId: 0,
      name: '',
      //단순 fetching을 위해선만 사용될 데이터들
      //   subStory: '',
      //   detailStory: '',
      //   description: '',
      //감정과 캐릭터에 따라 바뀌는 하기 데이터들 (img 관련)
      //   img: '',
      //   backImg: '',
      //   profileImg: '',
      //   footImg: '',
      actions: {
        //실제 반영되어야 할 값 => characterId에 따른 반영
        //따라서 추후 필요한 값을 위한 데이터들
        setResetData: () =>
          set({ userCharacterId: 0, userBackgroundId: 0, name: '' }),
        setUserCharacterId: (userId: number) =>
          set({ userCharacterId: userId }),
        setUserBackgroundId: (backId: number) =>
          set({ userBackgroundId: backId }),
        setName: (name: string) => set({ name: name }),
        // setDescription : (description : string) => ({description : description}),
      },
    }),
    {
      name: 'myCharInformation',
      storage: createJSONStorage(() => localStorage),
      // paratialize -> 부분적으로 필요한 부분에 대해서 저장
      partialize: (state) => ({
        name: state.name,
        userCharacterId: state.userCharacterId,
        userBackgroundId: state.userBackgroundId,
      }),
    } as PersistConfig,
  ),
);

// 상태 값
export const useMyCharName = () => useMyCharStore((state) => state.name);
export const useMyCharacterId = () =>
  useMyCharStore((state) => state.userCharacterId);
export const useMyBackgroundId = () =>
  useMyCharStore((state) => state.userBackgroundId);

//액션 값
export const userMyCharActions = () => useMyCharStore((state) => state.actions);
