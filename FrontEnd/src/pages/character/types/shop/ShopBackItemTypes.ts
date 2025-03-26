export interface ShopBackItemTypes {
  productId: number;
  owned: boolean;
  price: number;
}

export interface ShopBackItemTypesRes {
  products: ShopBackItemTypes[];
}
