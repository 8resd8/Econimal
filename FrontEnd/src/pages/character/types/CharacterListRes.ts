//response.data에 들어갈 interface 값
export interface CharacterListRes<T> {
  userCharacterId: T;
  characterName?: string;
  summary?: string;
}

//유연성을 더하기 위해 같은 interface내에서 선언한다.
export interface CharacterListResponse<T> {
  characters: CharacterListRes<T>[]; //characters라는 배열안에
  //데이터들의 정의가 userCharacterId, characterName, summary로 되어있다는 의미
}
