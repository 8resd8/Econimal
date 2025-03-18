import { CharacterTypes } from './CharacterTypes';

export interface CharStore {
  myChar: CharacterTypes<number>;
  setMyChar: (char: CharacterTypes<number>) => void; //return값 없음
  resetMyChar: () => void;
  isCharSelected: () => boolean;
}
