import GoMainBtn from '@/components/GoMainBtn';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import CharCoin from '../main/status/CharCoin';
import BuyModal from './BuyModal';
import ItemShopItems from './ItemShopItems';
import TabItemButton from './TabItemButton';
import { useState, useEffect } from 'react';
import { useCharacterCoin } from '@/store/useCharStatusStore';
import { useMyCharacterId, useMyBackgroundId } from '@/store/useMyCharStore';

interface ItemShopUIProps {
  userCoins: number;
  selectedTab: 'characters' | 'backgrounds';
  setSelectedTab: (tab: 'characters' | 'backgrounds') => void;
  currentItems: any[];
  setHoveredItemId: (id: number | null) => void;
  handlePurchaseClick: (item: ShopItemTypes) => void;
  hoveredItemId: number | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedItemForPurchase: ShopItemTypes | null;
  confirmPurchase: () => Promise<void>;
  selectCharacter: (characterId: number) => void;
  selectBackground: (backgroundId: number) => void;
  currentCharName: string | undefined;
  selectOwnedItem: (productId: number) => void;
  selectedItemId: number | null;
}

const ItemShopUI: React.FC<ItemShopUIProps> = ({
  userCoins,
  selectedTab,
  setSelectedTab,
  currentItems,
  setHoveredItemId,
  handlePurchaseClick,
  hoveredItemId,
  showModal,
  setShowModal,
  selectedItemForPurchase,
  confirmPurchase,
  selectCharacter,
  selectBackground,
  currentCharName,
  selectOwnedItem,
  selectedItemId,
}) => {
  const coin = useCharacterCoin();
  // 현재 사용 중인 캐릭터와 배경 ID 가져오기
  const currentCharacterId = useMyCharacterId();
  const currentBackgroundId = useMyBackgroundId();

  const [localSelectedItemId, setLocalSelectedItemId] = useState<number | null>(
    selectedItemId,
  );

  // 탭이 변경될 때, 현재 선택 중인 항목 설정
  useEffect(() => {
    // 현재 탭에 따라 적절한 선택 ID 설정
    if (selectedTab === 'characters') {
      // 캐릭터 탭에서는 현재 사용 중인 캐릭터를 선택 상태로 표시
      const currentCharacterItem = currentItems.find(
        (item) => item.userCharacterId === currentCharacterId,
      );
      if (currentCharacterItem) {
        setLocalSelectedItemId(currentCharacterItem.productId);
        selectOwnedItem(currentCharacterItem.productId);
      }
    } else if (selectedTab === 'backgrounds') {
      // 배경 탭에서는 현재 사용 중인 배경을 선택 상태로 표시
      const currentBackgroundItem = currentItems.find(
        (item) => item.userBackgroundId === currentBackgroundId,
      );
      if (currentBackgroundItem) {
        setLocalSelectedItemId(currentBackgroundItem.productId);
        selectOwnedItem(currentBackgroundItem.productId);
      }
    }
  }, [selectedTab, currentItems, currentCharacterId, currentBackgroundId]);

  // 아이템 선택 처리 함수 - 부모 컴포넌트로 전달
  const handleSelectOwnedItem = (productId: number) => {
    setLocalSelectedItemId(productId);
    selectOwnedItem(productId);
  };

  return (
    <div className='w-screen h-screen bg-black p-2 flex flex-col items-center relative pt-6 '>
      <div className='w-full max-w-[812px] flex flex-col items-center h-full px-4'>
        {/* 상점 제목 & 코인 표시 */}
        <div className='flex items-center justify-between w-full px-2 mb-2 relative pb-2 '>
          <GoMainBtn />
          <h1 className='absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white'>
            상점
          </h1>
          <CharCoin coin={coin} />
        </div>

        {/* 캐릭터 / 배경 선택 탭 */}
        <div className='flex justify-center gap-2 w-full mb-2'>
          <TabItemButton
            category='캐릭터'
            activeTab='characters'
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <TabItemButton
            category='배경'
            activeTab='backgrounds'
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>

        {/* 현재 선택된 캐릭터 표시 */}
        {currentCharName && (
          <div className='text-white mb-2 text-center bg-gray-800 py-1 px-4 rounded-md'>
            현재 선택된 캐릭터:{' '}
            <span className='font-bold'>{currentCharName}</span>
            {selectedTab === 'backgrounds' && (
              <p className='text-xs text-gray-300 mt-1'>
                * 선택 가능한 배경만 활성화됩니다.
              </p>
            )}
          </div>
        )}

        {/* 아이템 리스트 */}
        <div className='flex w-full overflow-y-auto justify-center'>
          <div className='grid grid-cols-4 gap-3 w-[93%] pt-6'>
            {currentItems &&
              currentItems.map((item: any, index: number) => (
                <ItemShopItems
                  key={index}
                  setHoveredItemId={setHoveredItemId}
                  handlePurchaseClick={handlePurchaseClick}
                  selectOwnedItem={handleSelectOwnedItem}
                  productId={item.productId}
                  price={item.price}
                  owned={item.owned}
                  image={item.image}
                  characterName={item.characterName}
                  // 탭에 따라 적절한 ID와 함수 전달
                  characterId={
                    selectedTab === 'characters'
                      ? item.userCharacterId
                      : undefined
                  }
                  backgroundId={
                    selectedTab === 'backgrounds'
                      ? item.userBackgroundId
                      : undefined
                  }
                  hoveredItemId={hoveredItemId}
                  selectedItemId={localSelectedItemId}
                  selectCharacter={
                    selectedTab === 'characters' ? selectCharacter : undefined
                  }
                  selectBackground={
                    selectedTab === 'backgrounds' ? selectBackground : undefined
                  }
                  itemType={
                    selectedTab === 'characters' ? 'character' : 'background'
                  }
                  // 선택 가능 여부 (배경인 경우 체크)
                  selectable={
                    item.selectable !== undefined ? item.selectable : true
                  }
                  currentCharName={currentCharName}
                />
              ))}
          </div>
        </div>

        {/* 구매 모달 */}
        {showModal && selectedItemForPurchase && (
          <BuyModal
            confirmPurchase={confirmPurchase}
            setShowModal={setShowModal}
            characterName={selectedItemForPurchase.characterName}
            price={selectedItemForPurchase.price}
          />
        )}
      </div>
    </div>
  );
};

export default ItemShopUI;
