// itemShop.tsx
import { useState, useEffect } from 'react';
import { useShopList } from '../../feature/hooks/useShopList';
import { useCharShopItem } from '../../feature/hooks/reuse/useCharShopItem';
import { backgroundShopConfig } from '@/config/backgroundShopConfig';
import { ShopItemTypes } from '../../types/shop/ShopItemTypes';
import TabItemButton from './TabItemButton';
import CharCoin from '../main/status/CharCoin';
import { useBuyItem } from '../../feature/hooks/useBuyItem';
import BuyModal from './BuyModal';
import ShopCoin from './ShopCoinUI';
import ItemShopItems from './ItemShopItems';
import { ItemShopCardTypes } from './../../types/shop/ItemShopCardTypes';

// 아이템 타입 정의
const backgrounds: ShopItemTypes[] = backgroundShopConfig;

const itemShop = () => {
  const { data } = useShopList();
  const { charShopList } = useCharShopItem(data || null); // 데이터가 없을 경우 null 전달
  // const {handleBuyShopItem} = useBuyItem()

  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState<number>(1500); // 유저 보유 코인 상태 =>
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태
  const [selectedItemForPurchase, setSelectedItemForPurchase] =
    useState<ShopItemTypes | null>(null); // 구매 대상 아이템
  const [currentItems, setCurrentItems] = useState();

  useEffect(() => {
    if (!data || !charShopList || !selectedTab) return;
    //state
    const currentItem =
      selectedTab === 'characters'
        ? [
            ...charShopList.slice(0, 8),
            ...Array(8 - charShopList.length).fill({
              productId: -1,
              characterName: '',
              image: '',
              owned: false,
              price: -1,
            }),
          ]
        : [
            ...backgrounds.slice(0, 8),
            ...Array(8 - backgrounds.length).fill({
              productId: -1,
              characterName: '',
              image: '',
              owned: false,
              price: -1,
            }),
          ];
    setCurrentItems(currentItem);
  }, [data, charShopList, selectedTab]);

  if (!data || charShopList.length === 0) {
    return <div>Loading...</div>;
  }

  const handlePurchaseClick = (item: ShopItemTypes) => {
    if (item.productId === -1 || item.owned) {
      alert('구매할 수 없는 상품입니다!');
      return;
    }
    setSelectedItemForPurchase(item); // 구매 대상 설정
    setShowModal(true); // 모달 표시
  };

  const confirmPurchase = () => {
    if (!selectedItemForPurchase) return;

    if (userCoins >= selectedItemForPurchase.price) {
      setUserCoins(userCoins - selectedItemForPurchase.price); // 코인 차감
      selectedItemForPurchase.owned = true; // 소유 상태 업데이트
      alert(`"${selectedItemForPurchase.characterName}" 구매 완료!`);
      setShowModal(false); // 모달 닫기
    } else {
      alert('코인이 부족합니다!');
    }
  };

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
          {currentItems.map((item: ItemShopCardTypes, index: number) => (
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

export default itemShop;
