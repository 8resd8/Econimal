import { ItemShopTypesUI } from '../../types/shop/ItemShopTypesUI';
import CharCoin from '../main/status/CharCoin';
import BuyModal from './BuyModal';
import ItemShopItems from './ItemShopItems';
import TabItemButton from './TabItemButton';

const ItemShopUI: React.FC<ItemShopTypesUI> = ({
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
}) => {
  return (
    <div className='w-screen h-screen bg-black p-6 flex flex-col justify-center items-center'>
      <div className='w-full max-w-6xl'>
        {/* 상단 코인 표시 */}
        <div className='flex justify-end mb-4'>
          <CharCoin coin={userCoins} />
        </div>

        <h1 className='text-3xl font-bold text-white mb-6 text-center'>상점</h1>

        {/* 캐릭터 / 아이템 전환 탭 버튼 */}
        <div className='flex justify-center gap-2 mb-8'>
          <TabItemButton
            category={'캐릭터'}
            activeTab={'characters'}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <TabItemButton
            category={'배경'}
            activeTab={'backgrounds'}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>

        {/* 아이템 그리드 */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center'>
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
            />
          ))}
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
