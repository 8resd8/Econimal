export interface CharacterTypes<T> {
  name: string;
  description: string;
  img?: string;
  backImg?: string;
  profileImg?: string;
  footImg?: string;
  subStory?: T; //나중에 추가할 속성
  detailStory?: T; //나중에 추가할 속성
}
