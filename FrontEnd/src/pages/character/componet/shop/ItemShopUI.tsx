import GoMainBtn from '@/components/GoMainBtn';
import { ItemShopTypes } from '../../types/shop/ItemShopTypesUI';
import CharCoin from '../main/status/CharCoin';
import BuyModal from './BuyModal';
import ItemShopItems from './ItemShopItems';
import TabItemButton from './TabItemButton';
import { useState } from 'react';
import { useCharacterCoin } from '@/store/useCharStatusStore';
import bgImage from '@/assets/auth_background.png';

const ItemShopUI = ({
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
  selectCharacter, // 선택된 캐릭터 ID 전달 함수
  selectBackground, // 선택된 배경 ID 전달 함수
  currentCharName, // 현재 선택된 캐릭터 이름
  currentBackgroundId, // 현재 선택된 배경 ID (추가)
  selectOwnedItem, // 선택된 아이템 처리 함수
  selectedItemId, // 선택된 아이템 ID
}: ItemShopTypes) => {
  const coin = useCharacterCoin();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null,
  );
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<
    number | null
  >(null);

  return (
    <div
      className='flex items-center justify-center min-h-screen bg-cover bg-center w-full h-full p-5'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
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

        {/* 아이템 리스트 */}
        <div className='flex w-full overflow-y-auto justify-center'>
          <div className='grid grid-cols-4 gap-3 w-[93%] pt-6'>
            {currentItems &&
              currentItems.map((item: any, index: number) => (
                <ItemShopItems
                  key={index}
                  setHoveredItemId={setHoveredItemId}
                  handlePurchaseClick={handlePurchaseClick}
                  selectOwnedItem={selectOwnedItem}
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
                  selectedItemId={selectedItemId}
                  selectCharacter={
                    selectedTab === 'characters' ? selectCharacter : undefined
                  }
                  selectBackground={
                    selectedTab === 'backgrounds' ? selectBackground : undefined
                  }
                  itemType={
                    selectedTab === 'characters' ? 'character' : 'background'
                  }
                  currentCharName={currentCharName}
                  currentBackgroundId={currentBackgroundId}
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
