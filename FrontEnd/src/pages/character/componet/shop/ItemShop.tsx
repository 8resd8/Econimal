import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useShopList } from '../../feature/hooks/useShopList';
import { useCharShopItem } from '../../feature/hooks/reuse/useCharShopItem';
import CharCoin from '../main/status/CharCoin';

// 배경 타입 정의
interface BackgroundType {
  productId: number;
  characterName: string;
  image: string;
  owned: boolean;
}

const backgrounds: BackgroundType[] = [
  { productId: 1, characterName: '마을', image: '/bg1.svg', owned: true },
  // 5개 추가 placeholder
  ...Array(5).fill({
    productId: 0,
    characterName: '',
    image: '',
    owned: false,
  }),
];

const itemShop = () => {
  const { data } = useShopList();
  const { charShopList } = useCharShopItem(data || null); // 데이터가 없을 경우 null 전달

  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(3);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<number>(1);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState<number>(1500); // 유저 보유 코인 상태

  if (!data || charShopList.length === 0) {
    // 데이터 로딩 상태 처리
    return <div>Loading...</div>;
  }

  if (charShopList.length > 0) {
    console.log(charShopList, 'csL');
  }

  // 현재 표시할 아이템 목록
  const currentItems =
    selectedTab === 'characters' ? charShopList : backgrounds.slice(0, 8); // 8개로 고정

  const handlePurchaseItem = (productId: number, price: number) => {
    const item = currentItems.find((item) => item.productId === productId);
    if (!item || item.owned) return;

    if (userCoins >= price) {
      setUserCoins(userCoins - price); // 코인 차감
      item.owned = true; // 아이템 소유 상태 업데이트
      alert(`"${item.characterName}" 구매 완료!`);
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

        {/* 탭 버튼 */}
        <div className='flex justify-center gap-2 mb-8'>
          <button
            onClick={() => setSelectedTab('characters')}
            className={`px-6 py-2 rounded-full ${
              selectedTab === 'characters'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            캐릭터
          </button>
          <button
            onClick={() => setSelectedTab('backgrounds')}
            className={`px-6 py-2 rounded-full ${
              selectedTab === 'backgrounds'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            배경
          </button>
        </div>

        {/* 아이템 그리드 */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center'>
          {Array(8)
            .fill(0)
            .map((_, index) => {
              const item = currentItems[index] || {
                productId: index,
                characterName: '',
                image: '',
                owned: false,
                price: (index + 1) * 100, // 가격 정보 추가
              };

              const isSelected =
                selectedTab === 'characters'
                  ? item.productId === selectedCharacterId
                  : item.productId === selectedBackgroundId;

              return (
                <div
                  key={index}
                  className='relative w-full max-w-[200px]'
                  onMouseEnter={() => setHoveredItemId(item.productId)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  {/* 가격 표시 */}
                  {!item.owned && (
                    <div className='absolute top-2 right-2 bg-yellow-200 px-2 py-1 rounded-full flex items-center shadow-md'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='mr-1'
                      >
                        <circle
                          cx='12'
                          cy='12'
                          r='10'
                          fill='#fcd34d'
                          stroke='#f59e0b'
                          strokeWidth='2'
                        />
                        <text
                          x='12'
                          y='16'
                          textAnchor='middle'
                          fontSize='10'
                          fontWeight='bold'
                          fill='#f59e0b'
                        >
                          $
                        </text>
                      </svg>
                      <span className='font-bold text-yellow-800'>
                        {item.price}
                      </span>
                    </div>
                  )}

                  {/* 기존 로직 유지 */}
                  <div
                    className={`relative rounded-lg p-4 transition-all duration-200 flex flex-col items-center justify-center aspect-square border ${
                      item.owned
                        ? 'bg-gray-100/10 border-gray-500'
                        : 'bg-gray-800 border-gray-600'
                    } ${isSelected && item.owned ? 'bg-gray-100/30' : ''}`}
                  >
                    <div className='relative w-full h-full flex items-center justify-center rounded-md'>
                      {item.owned && item.image ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.characterName}
                            className={`w-full h-full object-contain transition-all duration-200 ${
                              isSelected ? 'opacity-100' : 'opacity-70'
                            }`}
                          />
                          {hoveredItemId === item.productId && (
                            <button
                              onClick={() =>
                                handlePurchaseItem(item.productId, item.price)
                              }
                              className='absolute inset-x-[20%] bottom-[10%] bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
                            >
                              구매
                            </button>
                          )}
                        </>
                      ) : (
                        <div className='w-full h-full flex items-center justify-center bg-gray-700 rounded-md'>
                          <Lock className='w-[50%] h-[50%] text-gray-400' />
                        </div>
                      )}
                    </div>
                    <span
                      className={`mt-3 text-base ${
                        item.owned ? 'text-white' : 'text-gray-500'
                      } ${isSelected && item.owned ? 'font-bold' : ''}`}
                    >
                      {item.characterName || 'Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default itemShop;
