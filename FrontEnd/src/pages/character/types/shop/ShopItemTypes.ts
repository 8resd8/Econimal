export interface ShopItemTypes {
  productId: number;
  characterName: string;
  image?: string;
  price?: number;
  owned: boolean;
}

export interface ShopItemRes {
  products: ShopItemTypes[];
}
