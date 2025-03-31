export interface ShopItemTypes {
  productId: number;
  characterName: string;
  image?: string;
  price?: number;
  owned: boolean;
  userCharacterId?: number;
}

export interface ShopItemRes {
  products: ShopItemTypes[];
}
