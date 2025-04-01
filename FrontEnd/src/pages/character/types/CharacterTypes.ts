//서버에서 사용되는 부분은 undefined가 발생할 수 있기 떄문에 유의할 것 => ?로 일단 처리

export interface CharacterTypes<T> {
  userCharacterId?: T; // 서버에서 제공하는 실제 ID
  userBackgroundId?: T; // 추후 배경과 관련된 ID값을 제공할 수 있기 떄문에 확장성 측면을 고려해서 추가함

  // 기본적으로 캐릭터와 관련된 정보를 보유하고 있는 내용
  id?: T; // 로컬에서 사용하는 임의 id값
  name: string; // 서버의 characterName
  description: string;
  subStory: string; // 서버의 summary
  detailStory: string; // 서버의 description
  img: string;
  // backgroundImg와 backgroundId는 연관성이 있어야 함
  backImg: string;
  profileImg: string;
  footImg: string;
}
