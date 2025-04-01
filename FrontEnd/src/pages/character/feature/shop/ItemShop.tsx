// 1. 수정된 ItemShopLogic.tsx
import { useState, useEffect } from 'react';
import { useCharShopItem } from '../hooks/reuse/useCharShopItem';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import ItemShopUI from '../../componet/shop/ItemShopUI';
import { useShopList } from '../hooks/useShopCharList';
import { useShopBackList } from '../hooks/useShopBackList';
import { useBuyBackItem } from './../hooks/useBuyBackItem';
import ErrorCoinModal from '../../componet/shop/ErrorCoinModal';
import SuccessPurchaseModal from '../../componet/shop/SuccessPurchaseModal';
import { usebackShopItem } from '../hooks/reuse/useBackShopItem';
import { useCharacterCoin } from '@/store/useCharStatusStore';
import useCharStore from '@/store/useCharStore';
import { useShopFetchMyChar } from '../hooks/useShopFetchMyChar';
import { useShopFetchMyBack } from './../hooks/useShopFetchMyBack';

const ItemShopLogic = () => {
  const { data } = useShopList();
  const { data: backData } = useShopBackList();
  const { charShopList } = useCharShopItem(data || null);
  const { backShopList } = usebackShopItem(backData || null);
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

  //구매 핸들러 호출
  const { handleBuyBackShopItem } = useBuyBackItem();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { myChar } = useCharStore();

  //상점에서 캐릭터/배경 선택
  const { handleFetchShopChar } = useShopFetchMyChar();
  const { handleFetchShopBack } = useShopFetchMyBack();

  const [selectedForChar, setSelectedForChar] = useState(myChar);

  if (myChar) {
    console.log(myChar, 'myCHar itemshop');
  }

  if (charShopList) {
    console.log(charShopList, 'charshoplist');
  }

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
              userCharacterId: -1,
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
              userBackgroundId: -1,
            }),
          ];
    setCurrentItems(currentItem);
  }, [data, backData, charShopList, backShopList, selectedTab]);

  if (!data || charShopList.length === 0) {
    return <div>Loading...</div>;
  }

  // 상품 구매 관련 alert 발송
  const handlePurchaseClick = (item: ShopItemTypes) => {
    if (item.productId === -1 || item.owned) {
      alert('구매할 수 없는 상품입니다!');
      return;
    }
    console.log(item.productId); //productId가 들어감 => 구매하기 클릭 시
    setSelectedItemForPurchase(item);
    setShowModal(true);
  };

  // 상품 구해 완료 관련 내용 전달
  const confirmPurchase = async () => {
    if (!selectedItemForPurchase) return;

    if (userCoins >= selectedItemForPurchase.price) {
      try {
        const success = await handleBuyBackShopItem(
          selectedItemForPurchase.productId,
        );
        if (success) {
          setUserCoins(userCoins - selectedItemForPurchase.price);
          const updatedItems = currentItems.map((item) => {
            if (item.productId === selectedItemForPurchase.productId) {
              return { ...item, owned: true };
            }
            return item;
          });
          setCurrentItems(updatedItems);
          setSuccessModal(true); // 성공 모달 표시
          setShowModal(false);
          setSelectedItemForPurchase(null); // 구매 후 초기화
        } else {
          setErrorModal(true); // 에러 모달 표시
        }
      } catch (error) {
        console.error('구매 실패:', error);
        setErrorModal(true); // 에러 모달 표시
      }
    } else {
      setErrorModal(true); // 에러 모달 표시
    }
  };

  //상점에서 캐릭터 선택
  const selectCharacter = (characterId: number) => {
    if (characterId && characterId > 0) {
      handleFetchShopChar(characterId);
      console.log(characterId, 'characterId');
    } else {
      console.error('characterId가 존재하지 않습니다.');
    }
  };

  //상점에서 배경 선택
  const selectBackground = (backgroundId: number) => {
    if (backgroundId && backgroundId > 0) {
      handleFetchShopBack(backgroundId);
      console.log(backgroundId, 'backgroundId');
    } else {
      console.error('backgroundId가 존재하지 않습니다.');
    }
  };

  return (
    <div>
      <ItemShopUI
        userCoins={userCoins}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        currentItems={currentItems}
        setHoveredItemId={setHoveredItemId}
        handlePurchaseClick={handlePurchaseClick}
        hoveredItemId={hoveredItemId}
        selectCharacter={selectCharacter} // 선택된 캐릭터 ID 전달 함수 전달
        selectBackground={selectBackground} // 선택된 배경 ID 전달 함수 전달
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItemForPurchase={selectedItemForPurchase}
        confirmPurchase={confirmPurchase}
      />
      {successModal && (
        <SuccessPurchaseModal
          characterName={selectedItemForPurchase?.characterName}
          onClose={() => setSuccessModal(false)}
        />
      )}
      {errorModal && (
        <ErrorCoinModal
          requiredCoins={selectedItemForPurchase?.price}
          onClose={() => setErrorModal(false)}
        />
      )}
    </div>
  );
};

export default ItemShopLogic;
