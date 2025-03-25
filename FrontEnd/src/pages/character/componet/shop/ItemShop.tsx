import { useState, useEffect } from 'react';
import { useShopList } from '../../feature/hooks/useShopList';
import { useCharShopItem } from '../../feature/hooks/reuse/useCharShopItem';
import { backgroundShopConfig } from '@/config/backgroundShopConfig';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import ItemShopUI from './ItemShopUI';

const ItemShopLogic = () => {
  const { data } = useShopList();
  const { charShopList } = useCharShopItem(data || null);

  // 캐릭터 선택 탭 전환 여부 => 상태 관리
  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );
  // 현재 아이템 목록 -> 캐릭터 선택 탭 전환 여부와 관련
  const [currentItems, setCurrentItems] = useState();
  // 아이템 호버시 발생되는 이벤트를 위한 상태관리
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState<number>(1500); //추후 서버에서 fetching받은 coin값 활용
  // 모달 창 열고 / 닫기
  const [showModal, setShowModal] = useState<boolean>(false);
  // 구매 상품 선택 여부
  const [selectedItemForPurchase, setSelectedItemForPurchase] =
    useState<ShopItemTypes | null>(null);

  // 서버 패칭시에도 발생되는 상태관리에 대비
  useEffect(() => {
    if (!data || !charShopList || !selectedTab) return;
    const currentItem =
      selectedTab === 'characters'
        ? [
            //상품을 8개까지만 나타나게 하되, 부족한 부분은 fill로 채우기
            ...charShopList.slice(0, 8),
            ...Array(8 - charShopList.length).fill({
              productId: -1,
              characterName: '',
              image: '',
              owned: false,
              price: -1,
            }),
          ]
        : [
            ...backgroundShopConfig.slice(0, 8),
            ...Array(8 - backgroundShopConfig.length).fill({
              productId: -1,
              characterName: '',
              image: '',
              owned: false,
              price: -1,
            }),
          ];
    setCurrentItems(currentItem);
  }, [data, charShopList, selectedTab]);

  if (!data || charShopList.length === 0) {
    return <div>Loading...</div>;
  }

  // 상품 구매 관련 alert 발송
  const handlePurchaseClick = (item: ShopItemTypes) => {
    if (item.productId === -1 || item.owned) {
      alert('구매할 수 없는 상품입니다!');
      return;
    }
    setSelectedItemForPurchase(item);
    setShowModal(true);
  };

  // 상품 구해 완료 관련 내용 전달
  const confirmPurchase = () => {
    if (!selectedItemForPurchase) return;
    if (userCoins >= selectedItemForPurchase.price) {
      setUserCoins(userCoins - selectedItemForPurchase.price);
      const updatedItems = currentItems.map((item) => {
        if (item.productId === selectedItemForPurchase.productId) {
          return { ...item, owned: true };
        }
        return item;
      });
      setCurrentItems(updatedItems);
      alert(`"${selectedItemForPurchase.characterName}" 구매 완료!`);
      setShowModal(false);
      setSelectedItemForPurchase(null); // 구매 후 초기화
    } else {
      alert('코인이 부족합니다!'); //추후 모달창으로 변경
    }
  };

  return (
    <ItemShopUI
      userCoins={userCoins}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      currentItems={currentItems}
      setHoveredItemId={setHoveredItemId}
      handlePurchaseClick={handlePurchaseClick}
      hoveredItemId={hoveredItemId}
      showModal={showModal}
      setShowModal={setShowModal}
      selectedItemForPurchase={selectedItemForPurchase}
      confirmPurchase={confirmPurchase}
    />
  );
};

export default ItemShopLogic;
