import { useState } from 'react';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import { Lock, Check } from 'lucide-react';
import ShopCoin from './ShopCoinUI';
import SelectionModal from './SelectModal';
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
}: Props) => {
  const myCharName = useMyCharName(); // 현재 선택된 캐릭터 이름 (store에서 가져옴)
  // 전달받은 currentCharName이 있으면 우선 사용, 없으면 store에서 가져온 값 사용
  const activeCharName = currentCharName || myCharName;

  const isSelected = selectedItemId === productId;
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionStatus, setSelectionStatus] = useState<'loading' | 'success'>(
    'loading',
  );

  // 배경 선택 가능 여부 확인
  const isBackgroundSelectable = (): boolean => {
    // 배경 아이템이 아니면 항상 선택 가능
    if (itemType !== 'background') return true;

    // 현재 선택된 캐릭터가 없으면 모든 배경 선택 가능
    if (!activeCharName) return true;

    // 이 배경이 기본 배경인지 확인 (물속 모험의 세계, 얼음나라 대탐험, 초원의 비밀 정원)
    const isBasicBackground =
      backgroundToCharacterMap[characterName] !== undefined;

    // 기본 배경인 경우: 현재 캐릭터에 매핑된 기본 배경인지 확인
    if (isBasicBackground) {
      return backgroundToCharacterMap[characterName] === activeCharName;
    }

    // 추가 배경은 항상 선택 가능 (자연의 숨결, 끝없는 바다 여행, 거대한 얼음 왕국)
    return commonBackgrounds.includes(characterName);
  };

  // 아이템 선택 처리 함수 - 소유한 아이템만 선택 가능
  const handleItemSelection = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 소유한 아이템이고 선택 가능한 경우에만 선택 처리
    if (owned && (itemType !== 'background' || isBackgroundSelectable())) {
      // UI 표시를 위해 먼저 아이템 선택 상태 업데이트
      selectOwnedItem(productId);

      // 선택 모달 표시
      setShowSelectionModal(true);
      setSelectionStatus('loading');

      // 아이템 타입에 따라 서버로 최종 선택 전송
      try {
        // 서버 요청 시뮬레이션 (실제로는 API 호출)
        setTimeout(() => {
          if (itemType === 'character' && selectCharacter && characterId) {
            selectCharacter(characterId);
            setSelectionStatus('success');
          } else if (
            itemType === 'background' &&
            selectBackground &&
            backgroundId
          ) {
            selectBackground(backgroundId);
            setSelectionStatus('success');
          }

          // 성공 상태를 잠시 표시한 후 자동으로 모달 닫기
          setTimeout(() => {
            if (selectionStatus === 'success') {
              setShowSelectionModal(false);
            }
          }, 2000);
        }, 800);
      } catch (error) {
        console.error('선택 실패:', error);
        setShowSelectionModal(false);
      }
    }
  };

  // 구매 처리 함수 - 구매 모달은 부모 컴포넌트로 처리 위임
  const handleBuyItem = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!owned) {
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

  // 선택 모달 닫기
  const closeSelectionModal = () => {
    setShowSelectionModal(false);
  };

  // selectable prop이 false거나 isBackgroundSelectable()이 false인 경우 비활성화
  const isDisabled =
    itemType === 'background' && (!selectable || !isBackgroundSelectable());

  // 버튼 텍스트 설정
  const getButtonText = () => {
    if (owned) {
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

  return (
    <>
      <div
        className={`relative w-full max-w-[200px] transition-all duration-200 ${
          isSelected ? 'border-4 border-green-400' : ''
        }`}
        onMouseEnter={() => setHoveredItemId(productId)}
        onMouseLeave={() => setHoveredItemId(null)}
        onClick={owned && !isDisabled ? handleItemSelection : undefined}
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
              <div className='w-full h-full flex items-center justify-center bg-gray-700 rounded-md'>
                <Lock className='w-[50%] h-[50%] text-gray-400' />
              </div>
            )}
          </div>

          {/* 선택된 경우 체크 아이콘 표시 */}
          {isSelected && (
            <div className='absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full shadow-md'>
              <Check size={16} />
            </div>
          )}

          {/* 배경인 경우, 호환되지 않음을 표시 (선택 불가능한 경우) */}
          {itemType === 'background' && isDisabled && owned && (
            <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs shadow-md'>
              호환 불가
            </div>
          )}

          {/* 버튼 - 보유한 경우 선택, 미보유한 경우 구매 */}
          {hoveredItemId === productId && productId !== -1 && (
            <button
              onClick={owned ? handleItemSelection : handleBuyItem}
              className={`absolute inset-x-[20%] bottom-[10%] ${
                isDisabled
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded-md shadow-md`}
              disabled={isDisabled}
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
          status={selectionStatus}
          characterName={characterName}
          onClose={closeSelectionModal}
        />
      )}
    </>
  );
};

export default ItemShopItems;
