export interface MyCharInfoRes {
  level: number;
  exp: number;
  coin: number;
  expression?: string;
}

export interface MyCharInfoResponse {
  userCharacterMain: MyCharInfoRes;
}
