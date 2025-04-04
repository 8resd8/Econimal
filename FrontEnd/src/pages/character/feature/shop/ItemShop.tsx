import { useState, useEffect } from 'react';
import { useCharShopItem } from '../hooks/reuse/useCharShopItem';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import ItemShopUI from '../../componet/shop/ItemShopUI';
import { useShopList } from '../hooks/useShopCharList';
import { useShopBackList } from '../hooks/useShopBackList';
import { useBuyBackItem } from './../hooks/useBuyBackItem';
import { usebackShopItem } from '../hooks/reuse/useBackShopItem';
import {
  useCharacterCoin,
  useCharacterActions,
} from '@/store/useCharStatusStore';
import { useShopFetchMyChar } from '../hooks/useShopFetchMyChar';
import { useShopFetchMyBack } from './../hooks/useShopFetchMyBack';
import ErrorCoinModal from '../../componet/shop/ErrorCoinModal';
import SuccessPurchaseModal from '../../componet/shop/SuccessPurchaseModal';

const ItemShopLogic = () => {
  const { data } = useShopList();
  const { data: backData } = useShopBackList();
  const { charShopList } = useCharShopItem(data || null);
  const { backShopList } = usebackShopItem(backData || null);

  // Zustand 상태 및 액션 가져오기
  const coin = useCharacterCoin();
  const { setCoin } = useCharacterActions();

  // 캐릭터 선택 탭 전환 여부 => 상태 관리
  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );

  // 현재 아이템 목록 -> 캐릭터 선택 탭 전환 여부와 관련
  const [currentItems, setCurrentItems] = useState();
  // 아이템 호버시 발생되는 이벤트를 위한 상태관리
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  // 구매 모달 창 열고 / 닫기
  const [showModal, setShowModal] = useState<boolean>(false);
  // 구매 상품 선택 여부
  const [selectedItemForPurchase, setSelectedItemForPurchase] =
    useState<ShopItemTypes | null>(null);

  // 로컬에서도 코인 상태를 미러링 (UI 업데이트 강제를 위한 트릭)
  const [localCoin, setLocalCoin] = useState(coin);

  // Zustand 코인 상태가 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    setLocalCoin(coin);
  }, [coin]);

  //구매 핸들러 호출 - 코인 관리 로직을 포함하는 커스텀 훅
  const { handleBuyBackShopItem } = useBuyBackItem();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  //상점에서 캐릭터/배경 선택
  const { handleFetchShopChar } = useShopFetchMyChar();
  const { handleFetchShopBack } = useShopFetchMyBack();

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

  // 상품 구매 관련 모달 표시 - 구매 버튼 클릭 시 호출됨
  const handlePurchaseClick = (item: ShopItemTypes) => {
    if (item.productId === -1 || item.owned) {
      alert('구매할 수 없는 상품입니다!');
      return;
    }
    // 구매 모달 상태 설정
    setSelectedItemForPurchase(item);
    setShowModal(true);
  };

  // 상품 구매 완료 관련 내용 전달 - BuyModal에서 확인 버튼 클릭 시 호출됨
  const confirmPurchase = async () => {
    if (!selectedItemForPurchase) return;

    if (localCoin >= selectedItemForPurchase.price) {
      try {
        // 낙관적 업데이트: UI 먼저 업데이트
        const newCoinAmount = localCoin - selectedItemForPurchase.price;
        setLocalCoin(newCoinAmount); // 로컬 상태 먼저 업데이트
        setCoin(newCoinAmount); // Zustand 상태도 업데이트

        // 아이템 소유 상태 업데이트
        const updatedItems = currentItems.map((item) => {
          if (item.productId === selectedItemForPurchase.productId) {
            return { ...item, owned: true };
          }
          return item;
        });
        setCurrentItems(updatedItems);

        // 서버 요청 실행
        const success = await handleBuyBackShopItem(
          selectedItemForPurchase.productId,
        );

        // 구매 모달 닫기
        setShowModal(false);

        if (success) {
          // 구매 성공 모달 표시
          setSuccessModal(true);
          setSelectedItemForPurchase(null); // 구매 후 초기화
        } else {
          // 실패 시 복구 처리
          const originalCoin = localCoin + selectedItemForPurchase.price;
          setLocalCoin(originalCoin);
          setCoin(originalCoin);
          setErrorModal(true);
        }
      } catch (error) {
        console.error('구매 실패:', error);
        // 에러 발생 시 이전 상태로 복구
        setLocalCoin(coin);
        setErrorModal(true);
        // 구매 모달 닫기
        setShowModal(false);
      }
    } else {
      // 코인 부족 시 에러 모달 표시
      setErrorModal(true);
      // 구매 모달 닫기
      setShowModal(false);
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
        userCoins={localCoin} // 로컬 상태 사용으로 UI 업데이트 보장
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        currentItems={currentItems}
        setHoveredItemId={setHoveredItemId}
        handlePurchaseClick={handlePurchaseClick}
        hoveredItemId={hoveredItemId}
        selectCharacter={selectCharacter}
        selectBackground={selectBackground}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItemForPurchase={selectedItemForPurchase}
        confirmPurchase={confirmPurchase}
      />

      {/* 성공 모달 - 구매 성공 시에만 표시 */}
      {successModal && selectedItemForPurchase && (
        <SuccessPurchaseModal
          characterName={selectedItemForPurchase?.characterName}
          onClose={() => setSuccessModal(false)}
        />
      )}

      {/* 에러 모달 - 코인 부족 등 구매 실패 시 표시 */}
      {errorModal && selectedItemForPurchase && (
        <ErrorCoinModal
          requiredCoins={selectedItemForPurchase?.price}
          onClose={() => setErrorModal(false)}
        />
      )}
    </div>
  );
};

export default ItemShopLogic;
