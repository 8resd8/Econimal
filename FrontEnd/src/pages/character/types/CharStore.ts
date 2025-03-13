import { CharacterTypes } from "./CharacterTypes";

export interface CharStore {
  myChar: CharacterTypes<string>;
  setMyChar: (char: CharacterTypes<string>) => void; //return값 없음
}
