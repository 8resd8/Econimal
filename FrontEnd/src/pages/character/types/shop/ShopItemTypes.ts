export interface ShopItemTypes {
  productId: number;
  characterName: string;
  image?: string;
  owned: boolean;
}

export interface ShopItemRes {
  products: ShopItemTypes[];
}
