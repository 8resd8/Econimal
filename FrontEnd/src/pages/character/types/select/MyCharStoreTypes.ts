import { CharacterTypes } from '../CharacterTypes';

export interface MyCharStoreTypes {
  //많이 활용되는 데이터
  userCharacterId: number;
  userBackgroundId: number;
  name: string;

  //캐릭터 선택에 활용되는 데이터(필요는 하다! 궁극적으로)
  img: string;
  description: string;
  backImg: string;
  profileImg: string;
  footImg: string;
  subStory: string;
  detailStory: string;
  actions: {
    setResetData: () => void;
    setAllData: (characterInfo: CharacterTypes<number>) => void;
    setUserCharacterId: (userId: number) => void;
    setUserBackgroundId: (backId: number) => void;
    setName: (name: string) => void;
  };
}
