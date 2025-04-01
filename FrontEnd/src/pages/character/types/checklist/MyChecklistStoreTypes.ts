import { ChecklistResTypes } from './ChecklistResTypes';

export interface MyChecklistStoreTypes {
  data: {
    daily: ChecklistResTypes<string>[];
    custom: ChecklistResTypes<string>[];
  };
  progress: {
    daily: number;
    custom: number;
  };
  activeTabs: string;
  actions: {
    setActiveTabs: (tab: string) => void;

    //체크리스트 관련 초기 세팅을 위한 set 작업
    setChecklistDailyData: (newData: ChecklistResTypes<string>[]) => void;
    setChecklistCustomData: (newData: ChecklistResTypes<string>[]) => void;
    setChecklistDailyProgress: (newProgress: number) => void;
    setChecklistCustomProgress: (newProgress: number) => void;
  };
}
