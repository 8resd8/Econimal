export interface CharacterTypes<T> {
  id?: T; //암호화 로직에 따라서 바뀔수도 있는 내용
  name: string;
  description: string;
  img?: string;
  backImg?: string;
  profileImg?: string;
  footImg?: string;
  subStory?: string;
  detailStory?: string;
}
