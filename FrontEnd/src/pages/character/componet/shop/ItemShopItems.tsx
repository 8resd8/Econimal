import { useState } from 'react';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import { Lock, Check } from 'lucide-react';
import ShopCoin from './ShopCoinUI';
import SelectionModal from './SelectModal';
import { useMyCharName } from '@/store/useMyCharStore';

// 캐릭터 메핑
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
}: Props) => {
  const currentCharName = useMyCharName(); // 현재 선택된 캐릭터 이름
  const isSelected = selectedItemId === productId;
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionStatus, setSelectionStatus] = useState<'loading' | 'success'>(
    'loading',
  );

  // 배경 선택 가능 여부 확인
  const isBackgroundSelectable = () => {
    if (!currentCharName) return true;

    const isDefaultBg = Object.keys(backgroundToCharacterMap).includes(
      characterName,
    );
    if (isDefaultBg) {
      return backgroundToCharacterMap[characterName] === currentCharName;
    }
    return true;
  };

  const isDisabled = itemType === 'background' && !isBackgroundSelectable(); // 선택 불가 여부

  // 아이템 선택 처리 함수 - 소유한 아이템만 선택 가능
  const handleItemSelection = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (owned && !isDisabled) {
      selectOwnedItem(productId);
      setShowSelectionModal(true);
      setSelectionStatus('loading');

      try {
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

  // 구매 처리 함수
  const handleBuyItem = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!owned) {
      handlePurchaseClick({
        productId,
        price,
        owned,
        image,
        characterName,
      });
    }
  };

  const closeSelectionModal = () => {
    setShowSelectionModal(false);
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
              {owned ? (
                isDisabled ? (
                  '호환 불가'
                ) : (
                  '선택'
                )
              ) : (
                <>
                  구매<span className='ml-1'>({price})</span>
                </>
              )}
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
