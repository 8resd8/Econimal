export interface ItemShopTypesUI {
  userCoins: number;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  currentItems: any[];
  setHoveredItemId: (id: number) => void;
  handlePurchaseClick: (item: any) => void;
  hoveredItemId: number | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedItemForPurchase: any;
  confirmPurchase: () => void;
}
