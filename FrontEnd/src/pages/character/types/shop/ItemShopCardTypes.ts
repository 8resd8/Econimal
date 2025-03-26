import { ShopItemTypes } from './ShopItemTypes';

export interface ItemShopCardTypes {
  setHoveredItemId: (productId: number) => void;
  handlePurchaseClick: (item: ShopItemTypes) => void;
  productId: number;
  price: number;
  owned: boolean;
  image: string;
  characterName: string;
  hoveredItemId: number | null;
}
