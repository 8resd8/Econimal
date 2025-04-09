import { useState } from 'react';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import { Lock, Check, AlertTriangle } from 'lucide-react';
import SelectionModal from './SelectModal';
import LockedItemModal from './LockedItemModal';
import { useMyCharName } from '@/store/useMyCharStore';

// 캐릭터 메핑 - 이 정보는 useShopFetchMyChar.ts에서 import하는 것이 좋습니다
const characterToBackgroundMap = {
  부기부기: [
    '물속 모험의 세계',
    '자연의 숨결',
    '끝없는 바다 여행',
    '거대한 얼음 왕국',
  ],
  팽글링스: [
    '얼음나라 대탐험',
    '자연의 숨결',
    '끝없는 바다 여행',
    '거대한 얼음 왕국',
  ],
  호랭이: [
    '초원의 비밀 정원',
    '자연의 숨결',
    '끝없는 바다 여행',
    '거대한 얼음 왕국',
  ],
};

// 기본 배경과 캐릭터 매핑 (반대 방향)
const backgroundToCharacterMap = {
  '물속 모험의 세계': '부기부기',
  '얼음나라 대탐험': '팽글링스',
  '초원의 비밀 정원': '호랭이',
};

// 공통 배경 (모든 캐릭터가 선택 가능)
const commonBackgrounds = [
  '자연의 숨결',
  '끝없는 바다 여행',
  '거대한 얼음 왕국',
];

interface Props {
  setHoveredItemId: (productId: number) => void;
  handlePurchaseClick: (item: ShopItemTypes) => void;
  selectOwnedItem: (productId: number) => void;
  productId: number;
  price: number;
  owned: boolean;
  image: string;
  characterName: string;
  hoveredItemId: number | null;
  characterId?: number; // 캐릭터 ID (캐릭터 탭인 경우)
  backgroundId?: number; // 배경 ID (배경 탭인 경우) - 추가됨
  selectedItemId: number | null;
  selectCharacter?: (characterId: number) => void; // 캐릭터 선택 함수
  selectBackground?: (backgroundId: number) => void; // 배경 선택 함수 - 추가됨
  itemType?: 'character' | 'background'; // 아이템 타입 - 추가됨
  selectable?: boolean; // 선택 가능 여부 (배경인 경우)
  currentCharName?: string; // 현재 선택된 캐릭터 이름
  currentBackgroundId?: number; // 현재 선택된 배경 ID (추가)
}

const ItemShopItems = ({
  setHoveredItemId,
  handlePurchaseClick,
  selectOwnedItem,
  productId,
  price,
  owned,
  image,
  characterName,
  hoveredItemId,
  characterId,
  backgroundId,
  selectedItemId,
  selectCharacter,
  selectBackground,
  itemType = 'character',
  selectable = true, // 기본값 true
  currentCharName,
  currentBackgroundId, // 현재 선택된 배경 ID prop 추가
}: Props) => {
  const myCharName = useMyCharName(); // 현재 선택된 캐릭터 이름 (store에서 가져옴)
  // 전달받은 currentCharName이 있으면 우선 사용, 없으면 store에서 가져온 값 사용
  const activeCharName = currentCharName || myCharName;

  const isSelected = selectedItemId === productId;
  const [showSelectionModal, setShowSelectionModal] = useState<
    'loading' | 'success' | false
  >(false);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  // 배경 선택 가능 여부 확인
  const isBackgroundSelectable = (): boolean => {
    // If not a background item, always selectable
    if (itemType !== 'background') return true;

    // If no active character is selected, all backgrounds are selectable
    if (!activeCharName) return true;

    // Check if this is a default background (물속 모험의 세계, 얼음나라 대탐험, 초원의 비밀 정원)
    const isBasicBackground =
      backgroundToCharacterMap[characterName] !== undefined;

    // For basic backgrounds: check if it matches the current character
    if (isBasicBackground) {
      // Allow selection even if it's for a different character
      // The selectBackground function will handle the character switching
      return true;
    }

    // Common backgrounds (자연의 숨결, 끝없는 바다 여행, 거대한 얼음 왕국) are always selectable
    return commonBackgrounds.includes(characterName);
  };

  // 현재 사용 중인 아이템인지 체크
  const isCurrentlyInUse = (): boolean => {
    // 이미 선택된 아이템인 경우 (selectedItemId와 일치)
    if (isSelected) return true;

    // 캐릭터 타입이고, 현재 캐릭터 이름과 일치하는 경우
    if (itemType === 'character' && characterName === activeCharName) {
      return true;
    }

    // 배경 타입이고, 현재 배경 ID와 일치하는 경우 (추가)
    if (itemType === 'background' && backgroundId && currentBackgroundId) {
      return backgroundId === currentBackgroundId;
    }

    return false;
  };

  // 아이템 선택 처리 함수 - 소유한 아이템만 선택 가능
  const handleItemSelection = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If already in use, do nothing
    if (isCurrentlyInUse()) {
      return;
    }

    // For owned items that are either not backgrounds or are selectable backgrounds
    if (owned && (itemType !== 'background' || isBackgroundSelectable())) {
      // Update item selection state for UI first
      selectOwnedItem(productId);

      // Show selection modal
      setShowSelectionModal('loading');

      try {
        // Simulate server request (would be an API call in reality)
        setTimeout(() => {
          if (itemType === 'character' && selectCharacter && characterId) {
            selectCharacter(characterId);
            setShowSelectionModal('success');
          } else if (
            itemType === 'background' &&
            selectBackground &&
            backgroundId
          ) {
            // For character-specific backgrounds, we need special handling
            if (
              backgroundToCharacterMap[characterName] !== undefined &&
              backgroundToCharacterMap[characterName] !== activeCharName
            ) {
              // This is a background for a different character
              console.log(
                `Selected ${characterName} which is specific to ${backgroundToCharacterMap[characterName]}`,
              );
            }

            // Call the background selection function which will handle character switching if needed
            selectBackground(backgroundId);
            setShowSelectionModal('success');
          }

          // Auto-close success modal after delay
          setTimeout(() => {
            if (showSelectionModal === 'success') {
              setShowSelectionModal(false);
            }
          }, 2000);
        }, 800);
      } catch (error) {
        console.error('Selection failed:', error);
        setShowSelectionModal(false);
      }
    }
  };

  // 구매 처리 함수 - 구매 모달은 부모 컴포넌트로 처리 위임
  const handleBuyItem = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!owned) {
      // productId가 -1인 경우 (Locked) 추가 아이템 출시 예정 모달 표시
      if (productId === -1) {
        setShowLockedModal(true);
        return;
      }

      // 구매 처리를 위해 부모 컴포넌트에 데이터 전달만 하고, 모달은 부모에서 처리
      handlePurchaseClick({
        productId,
        price,
        owned,
        image,
        characterName,
      });
    }
  };

  // 아이템 클릭 처리
  const handleItemClick = () => {
    // Locked 아이템 클릭 시 모달 표시
    if (productId === -1) {
      setShowLockedModal(true);
    } else if (owned && !isDisabled && !isInUse) {
      handleItemSelection({
        stopPropagation: () => {},
      } as React.MouseEvent);
    }
  };

  // 선택 모달 닫기
  const closeSelectionModal = () => {
    setShowSelectionModal(false);
  };

  // selectable prop이 false거나 isBackgroundSelectable()이 false인 경우 비활성화
  const isDisabled =
    itemType === 'background' && (!selectable || !isBackgroundSelectable());

  // 이미 사용 중인 아이템인 경우 추가 비활성화
  const isInUse = isCurrentlyInUse();

  // 버튼 텍스트 설정
  const getButtonText = () => {
    if (productId === -1) {
      return 'Locked';
    }

    if (owned) {
      if (isInUse) {
        return '사용 중';
      }
      if (isDisabled) {
        return '불가능';
      }
      return '선택';
    }
    return (
      <>
        구매<span className='ml-1'>({price})</span>
      </>
    );
  };

  // 버튼 클래스 설정
  const getButtonClass = () => {
    if (productId === -1) {
      return 'bg-gray-500 cursor-pointer';
    }

    if (!owned) {
      return 'bg-green-600 hover:bg-green-700';
    }

    if (isInUse) {
      return 'bg-blue-500 cursor-not-allowed';
    }

    if (isDisabled) {
      return 'bg-gray-500 cursor-not-allowed';
    }

    return 'bg-green-600 hover:bg-green-700';
  };

  return (
    <>
      <div
        className={`relative w-full max-w-[200px] transition-all duration-200 ${
          isSelected ? 'border-4 border-green-400' : ''
        }`}
        onMouseEnter={() => setHoveredItemId(productId)}
        onMouseLeave={() => setHoveredItemId(null)}
        onClick={handleItemClick}
      >
        <div
          className={`relative rounded-lg p-4 flex flex-col items-center justify-center aspect-square border 
            ${
              owned
                ? 'bg-gray-100/10 border-gray-500'
                : 'bg-gray-800 border-gray-600'
            } 
            ${hoveredItemId === productId ? 'shadow-lg ring ring-red-400' : ''}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isInUse ? 'ring-2 ring-blue-500' : ''}
            ${productId === -1 ? 'cursor-pointer' : ''}
          `}
        >
          <div className='relative w-full h-full flex items-center justify-center rounded-md'>
            {owned ? (
              <img
                src={image}
                alt={characterName}
                className='w-full h-full object-contain'
              />
            ) : (
              <div className='relative w-full h-full flex items-center justify-center rounded-md'>
                {productId === -1 ? (
                  <Lock className='w-[50%] h-[50%] text-gray-400' />
                ) : null}
                <img
                  src={image}
                  alt={characterName || 'Locked Item'}
                  className='w-full h-full object-contain opacity-25'
                />
              </div>
            )}
          </div>

          {/* 현재 사용 중인 아이템 표시 */}
          {isInUse && (
            <div className='absolute top-2 left-2 bg-blue-500 text-white p-1 px-2 rounded-md shadow-md text-xs'>
              사용 중
            </div>
          )}

          {/* 배경인 경우, 호환되지 않음을 표시 (선택 불가능한 경우) */}
          {itemType === 'background' && isDisabled && owned && (
            <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs shadow-md'>
              호환 불가
            </div>
          )}

          {/* 버튼 - 보유한 경우 선택, 미보유한 경우 구매 */}
          {hoveredItemId === productId && (
            <button
              onClick={
                productId === -1
                  ? handleBuyItem
                  : owned && !isInUse
                  ? handleItemSelection
                  : handleBuyItem
              }
              className={`absolute inset-x-[20%] bottom-[10%] ${getButtonClass()} text-white px-4 py-2 rounded-md shadow-md`}
              disabled={productId !== -1 && (isDisabled || isInUse)}
            >
              {getButtonText()}
            </button>
          )}

          <span
            className={`mt-3 text-base ${
              owned ? 'text-white' : 'text-gray-500'
            }`}
          >
            {characterName || 'Locked'}
          </span>
        </div>
      </div>

      {/* 선택 모달 */}
      {showSelectionModal && (
        <SelectionModal
          status={showSelectionModal}
          characterName={characterName}
          onClose={closeSelectionModal}
        />
      )}

      {/* Locked 아이템 모달 */}
      {showLockedModal && (
        <LockedItemModal onClose={() => setShowLockedModal(false)} />
      )}
    </>
  );
};

export default ItemShopItems;
