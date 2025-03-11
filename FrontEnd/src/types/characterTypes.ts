export interface characterTypes<T> {
  name: string;
  description: string;
  subStory?: T; //나중에 추가할 속성
  detailStroy?: T; //나중에 추가할 속성
}
