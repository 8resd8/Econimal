import { create } from 'zustand';
import { InfraSubmitResponse } from '@/pages/town/features/infraApi';
import { TownNameData } from '@/pages/town/features/townApi';
import { EcoType } from '@/pages/town/features/infraApi';

// 각 인프라 타입
// type EcoType = 'ELECTRICITY' | 'WATER' | 'GAS' | 'COURT';

// 인프라 상태 맵: 각 인프라 타입별 상태(최적/오염)
interface InfraStatusMap {
  [key: string]: boolean; // true = 최적(clean), false = 오염(polluted)
}

// 마을 스토어 타입 정의 - 두 타입 모두 확장
interface TownState
  extends TownNameData,
    Pick<InfraSubmitResponse, 'carbon' | 'exp' | 'coin' | 'expression'> {
  activeEvents: number[]; // 활성화된 이벤트 ID 목록

  // 각 인프라별 상태 맵
  infraStatus: InfraStatusMap;
  setInfraStatus: (ecoType: EcoType, status: boolean) => void;

  // 액션
  // 이게 전부 필요할까?
  setTownId: (id: number) => void;
  setTownName: (name: string) => void;
  // setCarbon: (carbon: number) => void;
  // addCarbon: (carbon: number) => void;
  // setExp: (exp: number) => void;
  // addExp: (exp: number) => void;
  // setCoin: (coin: number) => void;
  // addCoin: (coin: number) => void;
  setExpression: (expression: TownState['expression']) => void;
  setActiveEvents: (eventIds: number[]) => void; //특정 이벤트를 제거
  addActiveEvent: (eventId: number) => void; // 특정 이벤트를 추가
  removeActiveEvent: (eventId: number) => void; // 전체 이벤트 목록을 변경
}

// 마을 스토어 생성
export const useTownStore = create<TownState>((set) => ({
  // TownNameData
  townId: 0,
  townName: '기본',

  // 인프라 상태 초기화 - 모두 오염 상태(false)로 시작
  infraStatus: {
    ELECTRICITY: false,
    WATER: false,
    GAS: false,
    COURT: false,
  },

  // 특정 인프라 상태 설정
  setInfraStatus: (ecoType, status) =>
    set((state) => ({
      infraStatus: {
        ...state.infraStatus,
        [ecoType]: status,
      },
    })),

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
  // setCarbon: (carbon) => set({ carbon }),
  // addCarbon: (amount) => set((state) => ({ carbon: state.carbon + amount })),
  // setExp: (exp) => set({ exp }),
  // addExp: (amount) => set((state) => ({ exp: state.exp + amount })),
  // setCoin: (coin) => set({ coin }),
  // addCoin: (amount) => set((state) => ({ coin: state.coin + amount })),
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
