import GoMainBtn from '@/components/GoMainBtn';
import { ItemShopTypes } from '../../types/shop/ItemShopTypesUI';
import CharCoin from '../main/status/CharCoin';
import BuyModal from './BuyModal';
import ItemShopItems from './ItemShopItems';
import TabItemButton from './TabItemButton';

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
}: ItemShopTypes) => {
  return (
    <div className='w-screen h-screen bg-black p-2 flex flex-col items-center relative'>
      <div className='w-full max-w-[812px] flex flex-col items-center h-full'>
        {/* 상단 바 (발자국 + 코인 + 상점) */}
        <div className='flex items-center justify-between w-full px-2 mb-2 relative'>
          {/* 발자국 아이콘 (뒤로가기 버튼) */}
          <GoMainBtn />

          {/* 상점 제목 (정확한 중앙 정렬) */}
          <h1 className='absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white'>
            상점
          </h1>

          {/* 코인 표시 */}
          <CharCoin coin={userCoins} />
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

        {/* 아이템 리스트 (스크롤 가능) */}
        <div className='flex-grow w-full overflow-y-auto'>
          <div className='grid grid-cols-4 gap-1 w-full'>
            {currentItems.map((item: any, index: number) => (
              <ItemShopItems
                key={index}
                setHoveredItemId={setHoveredItemId}
                handlePurchaseClick={handlePurchaseClick}
                productId={item.productId}
                price={item.price}
                owned={item.owned}
                image={item.image}
                characterName={item.characterName}
                hoveredItemId={hoveredItemId}
                className='max-w-[140px]'
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
