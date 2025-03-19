//서버에서 사용되는 부분은 undefined가 발생할 수 있기 떄문에 유의할 것 => ?로 일단 처리

export interface CharacterTypes<T> {
  userCharacterId?: T; // 서버에서 제공하는 실제 ID
  id?: T; // 로컬에서 사용하는 임의 ID
  name: string; // 서버의 characterName과 일치시킬 필드 (필수)
  description: string;
  subStory: string; // 서버의 summary
  detailStory: string; // 서버의 description
  img: string;
  backImg: string;
  profileImg: string;
  footImg: string;
}
