import { create } from 'zustand';
import { InfraSubmitResponse } from '@/pages/town/features/infraApi';
import { TownNameData } from '@/pages/town/features/townApi';

// 마을 스토어 타입 정의 - 두 타입 모두 확장
interface TownState
  extends TownNameData,
    Pick<InfraSubmitResponse, 'carbon' | 'exp' | 'coin' | 'expression'> {
  activeEvents: number[]; // 활성화된 이벤트 ID 목록

  // 액션
  // 이게 전부 필요할까?
  setTownId: (id: number) => void;
  setTownName: (name: string) => void;
  setCarbon: (carbon: number) => void;
  addCarbon: (carbon: number) => void;
  setExp: (exp: number) => void;
  addExp: (exp: number) => void;
  setCoin: (coin: number) => void;
  addCoin: (coin: number) => void;
  setExpression: (expression: TownState['expression']) => void;
  setActiveEvents: (eventIds: number[]) => void; //특정 이벤트를 제거
  addActiveEvent: (eventId: number) => void; // 특정 이벤트를 추가
  removeActiveEvent: (eventId: number) => void; // 전체 이벤트 목록을 변경
}

// 마을 스토어 생성
export const useTownStore = create<TownState>((set) => ({
  // TownNameData
  townId: 0,
  townName: '기본 마을',

  // InfraSubmitResponse
  carbon: 0,
  exp: 0,
  coin: 0,
  expression: 'NEUTRAL',

  // 추가 필드
  activeEvents: [],

  // 액션 구현
  setTownId: (id) => set({ townId: id }),
  setTownName: (name) => set({ townName: name }),
  setCarbon: (carbon) => set({ carbon }),
  addCarbon: (amount) => set((state) => ({ carbon: state.carbon + amount })),
  setExp: (exp) => set({ exp }),
  addExp: (amount) => set((state) => ({ exp: state.exp + amount })),
  setCoin: (coin) => set({ coin }),
  addCoin: (amount) => set((state) => ({ coin: state.coin + amount })),
  setExpression: (expression) => set({ expression }),
  setActiveEvents: (eventIds) => set({ activeEvents: eventIds }),
  addActiveEvent: (eventId) =>
    set((state) => ({
      activeEvents: state.activeEvents.includes(eventId)
        ? state.activeEvents
        : [...state.activeEvents, eventId],
    })),
  removeActiveEvent: (eventId) =>
    set((state) => ({
      activeEvents: state.activeEvents.filter((id) => id !== eventId),
    })),
}));
