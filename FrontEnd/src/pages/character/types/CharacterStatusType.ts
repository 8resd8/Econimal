import { MyCharInfoRes } from './MyCharInfoRes';

export interface CharacterStatusType extends MyCharInfoRes {
  //상태와 액션의 논리적 분리를 위함, 액션만 사용하는 컴포넌트 상태 변경시 릴렌더링 방지지
  actions: {
    setLevel: (nowLv: number) => void;
    setExp: (nowExp: number) => void;
    setCoin: (nowCoin: number) => void;
    setExpression: (nowExpres: string) => void;
  };
}
