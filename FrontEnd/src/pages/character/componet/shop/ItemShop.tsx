import { useState, useEffect } from 'react';
import { useShopList } from '../../feature/hooks/useShopCharList';
import { useCharShopItem } from '../../feature/hooks/reuse/useCharShopItem';
import { backShopList } from '@/config/backShopList';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import ItemShopUI from './ItemShopUI';
import SuccessPurchaseModal from './SuccessPurchaseModal';
import ErrorCoinModal from './ErrorCoinModal';
import { useCharacterCoin } from '@/store/useCharStatusStore';
import { usebackShopItem } from '../../feature/hooks/reuse/useBackShopItem';
import { useShopBackList } from '../../feature/hooks/useShopBackList';
import { useBuyBackItem } from '../../feature/hooks/useBuyBackItem';

const ItemShopLogic = () => {
  const { data } = useShopList();
  const { data: backData } = useShopBackList();
  const { charShopList } = useCharShopItem(data || null);
  const { backShopList } = usebackShopItem(backData);
  const { handleBuyBackShopItem } = useBuyBackItem();
  const coin = useCharacterCoin();

  // 캐릭터 선택 탭 전환 여부 => 상태 관리
  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );
  // 현재 아이템 목록 -> 캐릭터 선택 탭 전환 여부와 관련
  const [currentItems, setCurrentItems] = useState();
  // 아이템 호버시 발생되는 이벤트를 위한 상태관리
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState<number>(coin); //추후 서버에서 fetching받은 coin값 활용
  // 모달 창 열고 / 닫기
  const [showModal, setShowModal] = useState<boolean>(false);
  // 구매 상품 선택 여부
  const [selectedItemForPurchase, setSelectedItemForPurchase] =
    useState<ShopItemTypes | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  // 서버 패칭시에도 발생되는 상태관리에 대비
  useEffect(() => {
    if (!data || !charShopList || !selectedTab || !backShopList) return;
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
            ...backShopList.slice(0, 8),
            ...Array(8 - backShopList.length).fill({
              productId: -1,
              characterName: '',
              image: '',
              owned: false,
              price: -1,
            }),
          ];
    setCurrentItems(currentItem);
  }, [data, charShopList, selectedTab]);

  if (
    !data ||
    !backData ||
    charShopList.length === 0 ||
    backShopList.length === 0
  ) {
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
    handleBuyBackShopItem(item.productId);
    // modal을 보여주 구매를 하게 되면 => 실제 서버에 fetching
  };

  // 상품 구해 완료 관련 내용 전달 => 실제 coin값을 반영하고 변경해야 함 => zustand에 저장하고
  // 서버에 저장된 코인 값이 아니라 자체적으로 저장되고 => 서버에 패칭된 coin이 반영이 안되는 현상 확인됨 
  const confirmPurchase = () => {
    if (!selectedItemForPurchase) return;

    if (userCoins >= selectedItemForPurchase.price) {
      setUserCoins(userCoins - selectedItemForPurchase.price);
      const updatedItems = currentItems.map((item) =>
        item.productId === selectedItemForPurchase.productId
          ? { ...item, owned: true }
          : item,
      );
      setCurrentItems(updatedItems);

      setShowModal(false);
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  // 성공 모달 닫기
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSelectedItemForPurchase(null); // 2. 모달 닫을 때 데이터 초기화
  };

  return (
    <>
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
      // 수정된 모달 렌더링 부분
      {showSuccessModal && (
        <SuccessPurchaseModal
          characterName={selectedItemForPurchase?.characterName || ''}
          onClose={handleSuccessModalClose} // 변경된 핸들러 사용
        />
      )}
      {showErrorModal && selectedItemForPurchase && (
        <ErrorCoinModal
          requiredCoins={selectedItemForPurchase.price}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default ItemShopLogic;
