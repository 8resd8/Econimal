export interface ShopBackItemTypes {
  productId: number;
  owned: boolean;
  price: number;
  userBackgroundId?: number;
}

export interface ShopBackItemTypesRes {
  products: ShopBackItemTypes[];
}
