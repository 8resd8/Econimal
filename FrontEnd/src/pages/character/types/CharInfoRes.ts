export interface CharInfoRes<T> {
  userCharacterId: T;
  summary: string;
  description: string;
}

export interface CharInfoResponse<T> {
  characters: CharInfoRes<T>;
}
