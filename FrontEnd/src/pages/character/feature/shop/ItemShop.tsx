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
import bgThem from '../../../../assets/auth_background.png';
import { userMyCharActions, useMyCharName } from '@/store/useMyCharStore';

// 기본 배경과 캐릭터 이름 매핑
const backgroundToCharacterMap: Record<string, string> = {
  '물속 모험의 세계': '부기부기',
  '얼음나라 대탐험': '팽글링스',
  '초원의 비밀 정원': '호랭이',
};

// 모든 캐릭터가 선택 가능한 공통 배경
const commonBackgrounds: string[] = [
  '자연의 숨결',
  '끝없는 바다 여행',
  '거대한 얼음 왕국',
];

const ItemShopLogic = () => {
  const { data } = useShopList();
  const { data: backData } = useShopBackList();
  const { charShopList } = useCharShopItem(data || null);
  const { backShopList } = usebackShopItem(backData || null);

  // Zustand 상태 및 액션 가져오기
  const coin = useCharacterCoin();
  const { setCoin } = useCharacterActions();
  const currentCharName = useMyCharName(); // 현재 선택된 캐릭터 이름

  // 캐릭터 선택 탭 전환 여부 => 상태 관리
  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );

  // 현재 아이템 목록 -> 캐릭터 선택 탭 전환 여부와 관련
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  // 아이템 호버시 발생되는 이벤트를 위한 상태관리
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  // 구매 모달 창 열고 / 닫기
  const [showModal, setShowModal] = useState<boolean>(false);
  // 구매 상품 선택 여부
  const [selectedItemForPurchase, setSelectedItemForPurchase] =
    useState<ShopItemTypes | null>(null);

  // 로컬에서도 코인 상태를 미러링 (UI 업데이트 강제를 위한 트릭)
  const [localCoin, setLocalCoin] = useState(coin);

  //구매 핸들러 호출 및 훅 가져오기
  const { handleBuyBackShopItem } = useBuyBackItem();
  const { handleFetchShopChar } = useShopFetchMyChar();
  const { handleFetchShopBack } = useShopFetchMyBack();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // Zustand 코인 상태가 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    setLocalCoin(coin);
  }, [coin]);

  // 배경 아이템 선택 가능 여부 확인 함수
  const isBackgroundSelectable = (backgroundName: string): boolean => {
    if (!currentCharName) return true; // 캐릭터 선택 안 된 경우 모두 선택 가능

    // 이 배경이 기본 배경인지 확인
    const isBasicBackground =
      backgroundToCharacterMap[backgroundName] !== undefined;

    // 기본 배경인 경우: 현재 캐릭터에 매핑된 기본 배경인지 확인
    if (isBasicBackground) {
      return backgroundToCharacterMap[backgroundName] === currentCharName;
    }

    // 공통 배경인 경우 항상 선택 가능
    return commonBackgrounds.includes(backgroundName);
  };

  // 현재 선택 탭에 따라 아이템 목록 준비
  useEffect(() => {
    if (!data || !charShopList || !selectedTab) return;

    let currentItem: any[];

    if (selectedTab === 'characters') {
      // 캐릭터 탭인 경우 모든 캐릭터 표시
      currentItem = [
        ...charShopList.slice(0, 8),
        ...Array(8 - charShopList.length).fill({
          productId: -1,
          characterName: '',
          image: '',
          owned: false,
          price: -1,
          userCharacterId: -1,
          selectable: true, // 캐릭터는 항상 선택 가능
        }),
      ];
    } else {
      // 배경 탭인 경우 배경 선택 가능 여부 설정
      currentItem = [
        ...backShopList.slice(0, 8).map((item) => ({
          ...item,
          selectable: isBackgroundSelectable(item.characterName),
        })),
        ...Array(8 - backShopList.length).fill({
          productId: -1,
          characterName: '',
          image: '',
          owned: false,
          price: -1,
          userBackgroundId: -1,
          selectable: true,
        }),
      ];
    }

    setCurrentItems(currentItem);
  }, [
    data,
    backData,
    charShopList,
    backShopList,
    selectedTab,
    currentCharName,
  ]);

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

  //상점에서 캐릭터 선택 (이 부분만 수정하면 됩니다)
  const selectCharacter = (characterId: number) => {
    if (characterId && characterId > 0) {
      console.log(`캐릭터 선택 호출: ${characterId}`);

      // 캐릭터 선택 처리 (이름이 자동으로 설정됨)
      handleFetchShopChar(characterId);
    } else {
      console.error('characterId가 존재하지 않습니다.');
    }
  };

  //상점에서 배경 선택 (이 부분만 수정하면 됩니다)
  const selectBackground = (backgroundId: number) => {
    if (backgroundId && backgroundId > 0) {
      console.log(`배경 선택 호출: ${backgroundId}`);

      // 1. 배경 ID로 배경 정보 찾기
      const selectedBackground = backShopList.find(
        (bg) => bg.userBackgroundId === backgroundId,
      );

      if (selectedBackground) {
        const bgName = selectedBackground.characterName;

        // 2. 이 배경이 특정 캐릭터에 매핑된 기본 배경인지 확인
        const matchedCharName = backgroundToCharacterMap[bgName];

        if (matchedCharName) {
          // 3. 매핑된 캐릭터 ID 찾기
          const matchingCharacter = charShopList.find(
            (char) => char.characterName === matchedCharName,
          );

          if (matchingCharacter) {
            // 4. 매핑된 캐릭터 자동 선택 (배경 변경 후 약간의 지연을 두고 캐릭터 변경)
            console.log(
              `배경 '${bgName}'에 매핑된 캐릭터 '${matchedCharName}' 자동 선택`,
            );
            setTimeout(() => {
              selectCharacter(matchingCharacter.userCharacterId);
            }, 300);
          }
        }
      }

      // 배경 선택 처리
      handleFetchShopBack(backgroundId);
    } else {
      console.error('backgroundId가 존재하지 않습니다.');
    }
  };

  return (
    <div>
      <div
        className='w-screen h-screen flex items-center justify-center bg-white relative'
        style={{
          backgroundImage: `url(${bgThem})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <ItemShopUI
          userCoins={localCoin}
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
          currentCharName={currentCharName}
        />

        {/* 성공/에러 모달 */}
        {successModal && selectedItemForPurchase && (
          <SuccessPurchaseModal
            characterName={selectedItemForPurchase?.characterName}
            onClose={() => setSuccessModal(false)}
          />
        )}
        {errorModal && selectedItemForPurchase && (
          <ErrorCoinModal
            requiredCoins={selectedItemForPurchase?.price}
            onClose={() => setErrorModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ItemShopLogic;
