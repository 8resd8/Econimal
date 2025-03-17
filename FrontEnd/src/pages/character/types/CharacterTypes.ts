//서버에서 사용되는 부분은 undefined가 발생할 수 있기 떄문에 유의할 것 => ?로 일단 처리

export interface CharacterTypes<T> {
  id?: T; //암호화 로직에 따라서 바뀔수도 있는 내용
  name?: string;
  description?: string;
  img?: string;
  backImg?: string;
  profileImg?: string;
  footImg?: string;
  subStory?: string;
  detailStory?: string;
}
