// ItemShopItems.tsx
import React from 'react';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import { Lock } from 'lucide-react';
import ShopCoin from './ShopCoinUI';

interface Props {
  setHoveredItemId: (productId: number) => void;
  handlePurchaseClick: (item: ShopItemTypes) => void;
  productId: number;
  price: number;
  owned: boolean;
  image: string;
  characterName: string;
  hoveredItemId: number | null;
}

const ItemShopItems: React.FC<Props> = ({
  setHoveredItemId,
  handlePurchaseClick,
  productId,
  price,
  owned,
  image,
  characterName,
  hoveredItemId,
}) => {
  return (
    <div
      className='relative w-full max-w-[200px]'
      onMouseEnter={() => setHoveredItemId(productId)}
      onMouseLeave={() => setHoveredItemId(null)}
    >
      {/* 가격 표시 */}
      {productId !== -1 && (
        <div className='absolute top-2 right-2 bg-yellow-200 px-2 py-1 rounded-full flex items-center shadow-md'>
          <ShopCoin />
          <span className='font-bold text-yellow-800'>{price}</span>
        </div>
      )}

      <div
        className={`relative rounded-lg p-4 transition-all duration-200 flex flex-col items-center justify-center aspect-square border ${
          owned || productId === -1
            ? 'bg-gray-100/10 border-gray-500'
            : 'bg-gray-800 border-gray-600'
        } ${
          hoveredItemId === productId && !owned
            ? 'shadow-lg ring ring-yellow-400'
            : ''
        }`}
      >
        <div className='relative w-full h-full flex items-center justify-center rounded-md'>
          {owned && image ? (
            <img
              src={image}
              alt={characterName}
              className={`w-full h-full object-contain`}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-700 rounded-md'>
              <Lock className='w-[50%] h-[50%] text-gray-400' />
            </div>
          )}
        </div>
        {!owned && hoveredItemId === productId && productId !== -1 && (
          <button
            // onClick시 서버에 전송해줘야 함함
            onClick={() =>
              handlePurchaseClick({
                productId,
                price,
                owned,
                image,
                characterName,
              })
            }
            className='absolute inset-x-[20%] bottom-[10%] bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
          >
            구매
          </button>
        )}
        <span
          className={`mt-3 text-base ${
            owned ? 'text-white' : 'text-gray-500'
          } ${hoveredItemId === productId && !owned ? 'font-bold' : ''}`}
        >
          {characterName || 'Locked'}
        </span>
      </div>
    </div>
  );
};

export default ItemShopItems;
