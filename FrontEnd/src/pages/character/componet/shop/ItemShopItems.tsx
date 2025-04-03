import React, { useState } from 'react';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import { Lock, Check } from 'lucide-react';
import ShopCoin from './ShopCoinUI';
import FeedbackModal from './FeedBackModal';

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
  const isSelected = selectedItemId === productId;
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<{
    message: string;
    status: 'success' | 'error' | 'loading';
  }>({
    message: '',
    status: 'loading',
  });

  // 아이템 선택 처리 함수
  const handleItemSelection = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 이미 상품을 소유한 경우에만 선택 처리
    if (owned) {
      // UI 표시를 위해 먼저 아이템 선택 상태 업데이트
      selectOwnedItem(productId);

      setShowModal(true);
      setModalState({
        message: '선택 중...',
        status: 'loading',
      });

      // 아이템 타입에 따라 서버로 최종 선택 전송
      try {
        // 서버 요청 시뮬레이션 (실제로는 API 호출)
        setTimeout(() => {
          if (itemType === 'character' && selectCharacter && characterId) {
            selectCharacter(characterId);
            setModalState({
              message: '선택 완료',
              status: 'success',
            });
          } else if (
            itemType === 'background' &&
            selectBackground &&
            backgroundId
          ) {
            selectBackground(backgroundId);
            setModalState({
              message: '선택 완료',
              status: 'success',
            });
          }

          // 1.5초 후 자동으로 모달 닫기
          setTimeout(() => {
            setShowModal(false);
          }, 500);
        }, 200); // 0.8초 후 성공 처리 (실제로는 서버 응답 대기)
      } catch (error) {
        // 오류 발생 시
        setModalState({
          message: '선택에 실패했습니다.',
          status: 'error',
        });
      }
    }
  };

  // 구매 처리 함수
  const handleBuyItem = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!owned) {
      setShowModal(true);
      setModalState({
        message: '구매 중...',
        status: 'loading',
      });

      // 구매 로직 시뮬레이션
      setTimeout(() => {
        try {
          // 실제 구현에서는 응답에 따라 성공/실패 처리
          const success = true; // 테스트용 성공 플래그
          const hasEnoughCoins = true; // 테스트용 코인 충분 플래그

          if (success && hasEnoughCoins) {
            handlePurchaseClick({
              productId,
              price,
              owned,
              image,
              characterName,
            });
            setModalState({
              message: '구매 완료',
              status: 'success',
            });

            // 1.5초 후 자동으로 모달 닫기
            setTimeout(() => {
              setShowModal(false);
            }, 1500);
          } else if (!hasEnoughCoins) {
            // 코인 부족 오류 처리
            setModalState({
              message: '코인이 부족합니다',
              status: 'error',
            });
          } else {
            // 기타 오류 처리
            setModalState({
              message: '구매에 실패했습니다.',
              status: 'error',
            });
          }
        } catch (error) {
          setModalState({
            message: '구매에 실패했습니다.',
            status: 'error',
          });
        }
      }, 800);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`relative w-full max-w-[200px] transition-all duration-200 ${
          isSelected ? 'border-4 border-yellow-400' : ''
        }`}
        onMouseEnter={() => setHoveredItemId(productId)}
        onMouseLeave={() => setHoveredItemId(null)}
        onClick={owned ? handleItemSelection : undefined}
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
            ${
              hoveredItemId === productId
                ? 'shadow-lg ring ring-yellow-400'
                : ''
            }
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
              className='absolute inset-x-[20%] bottom-[10%] bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
            >
              {owned ? '선택' : '구매'}
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

      {/* 피드백 모달 */}
      {showModal && (
        <FeedbackModal
          message={modalState.message}
          status={modalState.status}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default ItemShopItems;
