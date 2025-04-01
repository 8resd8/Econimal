import { create } from 'zustand';
import { MyChecklistStoreTypes } from '@/pages/character/types/checklist/MyChecklistStoreTypes';
import { ChecklistResTypes } from '@/pages/character/types/checklist/ChecklistResTypes';

//get을 통해 현재 상태에 접근할 수 있도록 만듬
export const useChecklistStore = create<MyChecklistStoreTypes>((set, get) => ({
  data: {
    daily: [],
    custom: [],
  },
  progress: {
    daily: 0,
    custom: 0,
  },
  activeTabs: 'daily',
  actions: {
    setActiveTabs: () => ({ activeTabs: '' }),

    //초기 데이터 세팅을 위한 store
    //초기값을 그대로 사용하기 위해 전개구문 사용, 변경 내용만 바꿀 수 있도록
    setChecklistDailyData: (newData: ChecklistResTypes<string>[]) =>
      set((state) => ({ data: { ...state.data, daily: newData } })),
    setChecklistCustomData: (newData: ChecklistResTypes<string>[]) =>
      set((state) => ({ data: { ...state.data, custom: newData } })),
    setChecklistDailyProgress: (newProgress: number) =>
      set((state) => ({ progress: { ...state.progress, daily: newProgress } })),
    setChecklistCustomProgress: (newProgress: number) =>
      set((state) => ({
        progress: { ...state.progress, custom: newProgress },
      })),
  },
}));

export const useChecklistData = () => useChecklistStore((state) => state.data);
export const useChecklistProgress = () =>
  useChecklistStore((state) => state.progress);
export const useChecklistActiveTabs = () =>
  useChecklistStore((state) => state.activeTabs);

//액션 선택자
export const useChecklistActions = () =>
  useChecklistStore((state) => state.actions);
