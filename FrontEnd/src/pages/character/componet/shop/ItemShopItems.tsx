// 2. 수정된 ItemShopItems.tsx
import React from 'react';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import { Lock, Check } from 'lucide-react';
import ShopCoin from './ShopCoinUI';

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

const ItemShopItems: React.FC<Props> = ({
  setHoveredItemId,
  handlePurchaseClick,
  selectOwnedItem,
  productId,
  price,
  owned,
  image,
  characterName,
  hoveredItemId,
  characterId, // 전달받은 characterId
  backgroundId, // 전달받은 backgroundId
  selectedItemId,
  selectCharacter, // 선택된 캐릭터 ID 전달 함수
  selectBackground, // 선택된 배경 ID 전달 함수
  itemType = 'character', // 기본값은 character
}) => {
  const isSelected = selectedItemId === productId;

  return (
    <div
      className={`relative w-full max-w-[200px] transition-all duration-200 ${
        isSelected ? 'border-4 border-yellow-400' : ''
      }`}
      onMouseEnter={() => setHoveredItemId(productId)}
      onMouseLeave={() => setHoveredItemId(null)}
      onClick={() => {
        if (owned) {
          selectOwnedItem(productId); // 보유한 경우 선택 기능 실행
        }
      }}
    >
      {/* 가격 표시 (미보유 아이템만) */}
      {!owned && (
        <div className='absolute top-2 right-2 bg-yellow-200 px-2 py-1 rounded-full flex items-center shadow-md'>
          <ShopCoin />
          <span className='font-bold text-yellow-800'>{price}</span>
        </div>
      )}

      <div
        className={`relative rounded-lg p-4 flex flex-col items-center justify-center aspect-square border 
          ${
            owned
              ? 'bg-gray-100/10 border-gray-500'
              : 'bg-gray-800 border-gray-600'
          } 
          ${hoveredItemId === productId ? 'shadow-lg ring ring-yellow-400' : ''}
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
            onClick={(e) => {
              e.stopPropagation();
              if (owned) {
                selectOwnedItem(productId); // 보유한 경우 선택
              } else {
                handlePurchaseClick({
                  productId,
                  price,
                  owned,
                  image,
                  characterName,
                }); // 미보유한 경우 구매
              }
            }}
            className='absolute inset-x-[20%] bottom-[10%] bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
          >
            {owned ? '선택' : '구매'}
          </button>
        )}
        {owned && isSelected && (
          <button
            onClick={() => {
              // 아이템 타입에 따라 다른 선택 함수 호출
              if (itemType === 'character' && selectCharacter && characterId) {
                selectCharacter(characterId);
              } else if (
                itemType === 'background' &&
                selectBackground &&
                backgroundId
              ) {
                selectBackground(backgroundId);
              }
            }}
            className='absolute inset-x-[20%] bottom-[10%] bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
          >
            선택
          </button>
        )}
        <span
          className={`mt-3 text-base ${owned ? 'text-white' : 'text-gray-500'}`}
        >
          {characterName || 'Locked'}
        </span>
      </div>
    </div>
  );
};

export default ItemShopItems;
