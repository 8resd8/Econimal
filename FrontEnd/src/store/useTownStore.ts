import { create } from 'zustand';
import { InfraSubmitResponse } from '@/pages/town/features/infraApi';
import { TownNameData } from '@/pages/town/features/townApi';
import { EcoType } from '@/pages/town/features/infraApi';

// 인프라 상태 맵: 각 인프라 타입별 상태(최적/오염)
interface InfraStatusMap {
  [key: string]: boolean; // true = 최적(clean), false = 오염(polluted)
}

// 마을 상태 타입 - 두 타입 모두 확장
interface TownState
  extends TownNameData,
    Pick<InfraSubmitResponse, 'carbon' | 'exp' | 'coin' | 'expression'> {
  activeEvents: number[]; // 활성화된 이벤트 ID 목록
  infraStatus: InfraStatusMap; // 각 인프라별 상태 맵
}

// 액션 타입
interface TownActions {
  setInfraStatus: (ecoType: EcoType, status: boolean) => void;
  setTownId: (id: number) => void;
  setTownName: (name: string) => void;
  setCarbon: (carbon: number) => void;
  setExp: (exp: number) => void;
  setCoin: (coin: number) => void;
  setExpression: (expression: TownState['expression']) => void;
  setActiveEvents: (eventIds: number[]) => void; //특정 이벤트를 제거
  // addCarbon: (carbon: number) => void;
  // addExp: (exp: number) => void;
  // addCoin: (coin: number) => void;
  // addActiveEvent: (eventId: number) => void; // 특정 이벤트를 추가
  // removeActiveEvent: (eventId: number) => void; // 전체 이벤트 목록을 변경

  // 다중 상태 업데이트를 위한 유틸리티 액션
  updateValues: (values: Partial<TownState>) => void; // 이게 필요할까

  // 상태 리셋 함수
  resetState: () => void; // 이게 필요할까
}

// 전체 스토어 타입 = 상태 + 액션
type TownStore = TownState & TownActions;

// 초기 상태를 별도의 객체로 분리
const initialState: TownState = {
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

  // InfraSubmitResponse
  carbon: 0,
  exp: 0,
  coin: 0,
  expression: 'NEUTRAL',

  // 추가 필드
  activeEvents: [],
};

// 마을 스토어 생성
export const useTownStore = create<TownStore>((set) => ({
  // 초기 상태 전개
  ...initialState,

  // 다중 상태 업데이트 유틸리티
  updateValues: (values) => set((state) => ({ ...state, ...values })),

  // 상태 리셋
  resetState: () => set(initialState),

  // 특정 인프라 상태 설정
  setInfraStatus: (ecoType, status) =>
    set((state) => ({
      infraStatus: {
        ...state.infraStatus,
        [ecoType]: status,
      },
    })),

  // 단일 상태 업데이트 액션들
  setTownId: (id) => set({ townId: id }),
  setTownName: (name) => set({ townName: name }),
  setCarbon: (carbon) => set({ carbon }),
  setCoin: (coin) => set({ coin }),
  setExp: (exp) => set({ exp }),
  setExpression: (expression) => set({ expression }),
  setActiveEvents: (eventIds) => set({ activeEvents: eventIds }),

  // 계산된 상태 업데이트 액션들
  // addCarbon: (amount) => set((state) => ({ carbon: state.carbon + amount })),
  // addExp: (amount) => set((state) => ({ exp: state.exp + amount })),
  // addCoin: (amount) => set((state) => ({ coin: state.coin + amount })),
  // addActiveEvent: (eventId) =>
  //   set((state) => ({
  //     activeEvents: state.activeEvents.includes(eventId)
  //       ? state.activeEvents
  //       : [...state.activeEvents, eventId],
  //   })),
  // removeActiveEvent: (eventId) =>
  //   set((state) => ({
  //     activeEvents: state.activeEvents.filter((id) => id !== eventId),
  //   })),
}));

// 외부에서 사용할 액션 함수 내보내기
export const {
  setInfraStatus,
  setTownId,
  setTownName,
  setCarbon,
  setExp,
  setCoin,
  setExpression,
  setActiveEvents,
  // addExp,
  // addCoin,
  // addCarbon,
  // addActiveEvent,
  // removeActiveEvent,
  updateValues,
  resetState,
} = useTownStore.getState();
