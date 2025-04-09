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
import {
  userMyCharActions,
  useMyCharName,
  useMyCharacterId,
  useMyBackgroundId,
} from '@/store/useMyCharStore';
import bgnew from '../../../../assets/char/background/noBack.png';
import charnew from '../../../../assets/char/background/noProfile.png';

const ItemShopLogic = () => {
  const { data } = useShopList();
  const { data: backData } = useShopBackList();
  const { charShopList } = useCharShopItem(data || null);
  const { backShopList } = usebackShopItem(backData || null);

  // Zustand 상태 및 액션 가져오기
  const coin = useCharacterCoin();
  const { setCoin } = useCharacterActions();
  const currentCharName = useMyCharName(); // 현재 선택된 캐릭터 이름
  const currentCharacterId = useMyCharacterId(); // 현재 선택된 캐릭터 ID
  const currentBackgroundId = useMyBackgroundId(); // 현재 선택된 배경 ID

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

  // 선택된 아이템 ID 상태 추가
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // 중복 선택 방지를 위한 처리 중 상태
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  //구매 핸들러 호출 및 훅 가져오기
  const { handleBuyBackShopItem } = useBuyBackItem();
  const { handleFetchShopChar, isPending: isCharPending } =
    useShopFetchMyChar();
  const {
    handleFetchShopBack,
    isBackgroundSelectable,
    isPending: isBackPending,
  } = useShopFetchMyBack();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // Zustand 코인 상태가 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    setLocalCoin(coin);
  }, [coin]);

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
          image: charnew,
          owned: false,
          price: -1,
          userCharacterId: -1,
          selectable: true, // 캐릭터는 항상 선택 가능
        }),
      ];

      // 캐릭터 탭에서 현재 사용 중인 캐릭터 선택 상태로 설정
      const currentCharItem = charShopList.find(
        (char) => char.userCharacterId === currentCharacterId,
      );
      if (currentCharItem) {
        setSelectedItemId(currentCharItem.productId);
      }
    } else {
      // 배경 탭인 경우 배경 선택 가능 여부 설정
      currentItem = [
        ...backShopList.slice(0, 8).map((item) => ({
          ...item,
          selectable: isBackgroundSelectable(
            item.characterName,
            currentCharName,
          ),
        })),
        ...Array(8 - backShopList.length).fill({
          productId: -1,
          characterName: '',
          image: bgnew,
          owned: false,
          price: -1,
          userBackgroundId: -1,
          selectable: true,
        }),
      ];

      // 배경 탭에서 현재 사용 중인 배경 선택 상태로 설정
      const currentBackItem = backShopList.find(
        (back) => back.userBackgroundId === currentBackgroundId,
      );
      if (currentBackItem) {
        setSelectedItemId(currentBackItem.productId);
      }
    }

    setCurrentItems(currentItem);
  }, [
    data,
    backData,
    charShopList,
    backShopList,
    selectedTab,
    currentCharName,
    currentCharacterId,
    currentBackgroundId,
  ]);

  // API 요청 중인 동안 중복 선택 방지
  useEffect(() => {
    if (isCharPending || isBackPending) {
      setIsProcessing(true);
    } else {
      // API 요청이 완료되면 일정 시간 후 처리 상태 해제
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isCharPending, isBackPending]);

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

  // 소유한 아이템 선택 시 호출되는 함수
  const selectOwnedItem = (productId: number) => {
    // 이미 선택된 아이템이거나 처리 중인 경우 무시
    if (selectedItemId === productId || isProcessing) {
      return;
    }

    // 새 아이템 선택
    setSelectedItemId(productId);
  };

  //상점에서 캐릭터 선택
  const selectCharacter = (characterId: number) => {
    // 이미 처리 중이거나 현재 캐릭터와 동일한 경우 무시
    if (isProcessing || characterId === currentCharacterId) {
      console.log('이미 처리 중이거나 현재 캐릭터와 동일합니다.');
      return;
    }

    if (characterId && characterId > 0) {
      console.log(`캐릭터 선택 호출: ${characterId}`);
      setIsProcessing(true); // 처리 중 상태 설정

      // 1. 캐릭터 ID로 캐릭터 정보 찾기
      const selectedCharacter = charShopList.find(
        (char) => char.userCharacterId === characterId,
      );

      if (selectedCharacter) {
        const charName = selectedCharacter.characterName;
        console.log(`캐릭터 '${charName}' 선택됨`);

        // 2. 캐릭터 이름으로 기본 배경 이름 찾기
        let defaultBgName = null;
        if (charName === '부기부기') defaultBgName = '물속 모험의 세계';
        else if (charName === '팽글링스') defaultBgName = '얼음나라 대탐험';
        else if (charName === '호랭이') defaultBgName = '초원의 비밀 정원';

        // 3. 캐릭터 선택 API 호출
        handleFetchShopChar(characterId);

        // 4. 이름에 맞는 기본 배경 찾기
        if (defaultBgName) {
          console.log(`기본 배경 '${defaultBgName}' 검색 중...`);
          const defaultBg = backShopList.find(
            (bg) => bg.characterName === defaultBgName,
          );

          if (defaultBg && defaultBg.userBackgroundId) {
            console.log(
              `기본 배경 ID ${defaultBg.userBackgroundId} 찾음, 배경 변경 중...`,
            );
            // 5. 기본 배경으로 설정 (약간의 지연 후)
            setTimeout(() => {
              handleFetchShopBack(defaultBg.userBackgroundId);
            }, 100);
          } else {
            console.error(`'${defaultBgName}' 배경을 찾을 수 없음`);
            setIsProcessing(false); // 처리 완료
          }
        }
      } else {
        console.error('캐릭터 정보를 찾을 수 없습니다.');
        setIsProcessing(false); // 처리 완료
      }
    } else {
      console.error('characterId가 존재하지 않습니다.');
      setIsProcessing(false); // 처리 완료
    }
  };

  //상점에서 배경 선택
  const selectBackground = (backgroundId: number) => {
    // 이미 처리 중이거나 현재 배경과 동일한 경우 무시
    if (isProcessing || backgroundId === currentBackgroundId) {
      console.log('이미 처리 중이거나 현재 배경과 동일합니다.');
      return;
    }

    if (backgroundId && backgroundId > 0) {
      console.log(`배경 선택 호출: ${backgroundId}`);
      setIsProcessing(true); // 처리 중 상태 설정

      // 1. 배경 ID로 배경 정보 찾기
      const selectedBackground = backShopList.find(
        (bg) => bg.userBackgroundId === backgroundId,
      );

      if (selectedBackground) {
        const bgName = selectedBackground.characterName;
        console.log(`배경 '${bgName}' 선택됨`);

        // 2. 배경 선택 API 호출
        handleFetchShopBack(backgroundId);

        // 3. 이 배경이 특정 캐릭터의 기본 배경인지 확인
        let matchedCharName = null;
        if (bgName === '물속 모험의 세계') matchedCharName = '부기부기';
        else if (bgName === '얼음나라 대탐험') matchedCharName = '팽글링스';
        else if (bgName === '초원의 비밀 정원') matchedCharName = '호랭이';

        // 4. 배경에 맞는 캐릭터가 있으면 자동 선택
        if (matchedCharName) {
          console.log(
            `배경 '${bgName}'에 맞는 캐릭터 '${matchedCharName}' 검색 중...`,
          );
          const matchingCharacter = charShopList.find(
            (char) => char.characterName === matchedCharName,
          );

          if (matchingCharacter && matchingCharacter.userCharacterId) {
            console.log(
              `캐릭터 ID ${matchingCharacter.userCharacterId} 찾음, 캐릭터 변경 중...`,
            );
            // 5. 지연 후 캐릭터 변경 (API 호출 충돌 방지)
            setTimeout(() => {
              handleFetchShopChar(matchingCharacter.userCharacterId);
            }, 100);
          } else {
            console.error(`'${matchedCharName}' 캐릭터를 찾을 수 없음`);
            setIsProcessing(false); // 처리 완료
          }
        } else {
          // 기본 배경이 아닌 경우 바로 처리 완료
          setTimeout(() => {
            setIsProcessing(false);
          }, 300);
        }
      } else {
        console.error('배경 정보를 찾을 수 없습니다.');
        setIsProcessing(false); // 처리 완료
      }
    } else {
      console.error('backgroundId가 존재하지 않습니다.');
      setIsProcessing(false); // 처리 완료
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
          selectOwnedItem={selectOwnedItem}
          selectedItemId={selectedItemId}
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
