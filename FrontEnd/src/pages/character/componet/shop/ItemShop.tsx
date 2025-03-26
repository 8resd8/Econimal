import { useState, useEffect, useMemo } from 'react';
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
  const [currentItems, setCurrentItems] = useState([]);

  const currentItem = useMemo(() => {
    if (!data || !charShopList || !selectedTab || !backShopList) return [];

    return selectedTab === 'characters'
      ? [
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
  }, [data, charShopList, selectedTab, backShopList]);

  useEffect(() => {
    setCurrentItems(currentItem); //current값 변경될떄마다 상태갱신
  }, [currentItem]);

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
    handleBuyBackShopItem(item.productId);
    setShowModal(true);
    // modal을 보여주 구매를 하게 되면 => 실제 서버에 fetching
  };

  // 상품 구해 완료 관련 내용 전달 => 실제 coin값을 반영하고 변경해야 함 => zustand에 저장하고
  // 서버에 저장된 코인 값이 아니라 자체적으로 저장되고 => 서버에 패칭된 coin이 반영이 안되는 현상 확인됨
  const confirmPurchase = () => {
    if (!selectedItemForPurchase) return;

    if (userCoins >= selectedItemForPurchase.price) {
      setUserCoins(userCoins - selectedItemForPurchase.price);
      // 불변성 유지를 위한 새로운 배열 생성
      const updatedItems = [...currentItems].map((item) =>
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
