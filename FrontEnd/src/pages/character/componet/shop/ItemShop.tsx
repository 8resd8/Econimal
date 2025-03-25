import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useShopList } from '../../feature/hooks/useShopList';
import { useCharShopItem } from '../../feature/hooks/reuse/useCharShopItem';
import CharCoin from '../main/status/CharCoin';

// 아이템 타입 정의
interface ItemType {
  productId: number;
  characterName: string;
  image: string;
  owned: boolean;
  price: number; // 가격 정보 추가
}

const backgrounds: ItemType[] = [
  {
    productId: 1,
    characterName: '마을',
    image: '/images/village.png',
    owned: true,
    price: 300,
  },
  {
    productId: 2,
    characterName: '바다',
    image: '/images/sea.png',
    owned: false,
    price: 500,
  },
  {
    productId: 3,
    characterName: '산',
    image: '/images/mountain.png',
    owned: false,
    price: 700,
  },
  ...Array(5).fill({
    productId: -1,
    characterName: '',
    image: '',
    owned: false,
    price: 1000,
  }),
];

const itemShop = () => {
  const { data } = useShopList();
  const { charShopList } = useCharShopItem(data || null); // 데이터가 없을 경우 null 전달

  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState<number>(1500); // 유저 보유 코인 상태
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태
  const [selectedItemForPurchase, setSelectedItemForPurchase] =
    useState<ItemType | null>(null); // 구매 대상 아이템

  // 스크롤 방지
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시 초기화
    };
  }, [showModal]);

  if (!data || charShopList.length === 0) {
    return <div>Loading...</div>;
  }

  // 항상 아이템을 최대 8개로 고정
  const currentItems =
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

  const handlePurchaseClick = (item: ItemType) => {
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
          {currentItems.map((item, index) => (
            <div
              key={index}
              className='relative w-full max-w-[200px]'
              onMouseEnter={() => setHoveredItemId(item.productId)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              {/* 가격 표시 */}
              {item.productId !== -1 && (
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
                  item.owned || item.productId === -1
                    ? 'bg-gray-100/10 border-gray-500'
                    : 'bg-gray-800 border-gray-600'
                } ${
                  hoveredItemId === item.productId && !item.owned
                    ? 'shadow-lg ring ring-yellow-400'
                    : ''
                }`}
              >
                <div className='relative w-full h-full flex items-center justify-center rounded-md'>
                  {item.owned && item.image ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.characterName}
                        className={`w-full h-full object-contain`}
                      />
                    </>
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gray-700 rounded-md'>
                      <Lock className='w-[50%] h-[50%] text-gray-400' />
                    </div>
                  )}
                </div>
                {!item.owned &&
                  hoveredItemId === item.productId &&
                  item.productId !== -1 && (
                    <button
                      onClick={() => handlePurchaseClick(item)}
                      className='absolute inset-x-[20%] bottom-[10%] bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
                    >
                      구매
                    </button>
                  )}
                <span
                  className={`mt-3 text-base ${
                    item.owned ? 'text-white' : 'text-gray-500'
                  } ${
                    hoveredItemId === item.productId && !item.owned
                      ? 'font-bold'
                      : ''
                  }`}
                >
                  {item.characterName || 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 구매 모달 */}
        {showModal && selectedItemForPurchase && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h2 className='text-xl font-bold mb-4'>구매하시겠습니까?</h2>
              <p>아이템: {selectedItemForPurchase.characterName}</p>
              <p>가격: {selectedItemForPurchase.price} 코인</p>
              <div className='flex gap-4 mt-4'>
                <button
                  onClick={confirmPurchase}
                  className='px-4 py-2 bg-green-500 text-white rounded-md'
                >
                  구매 확인
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 bg-red-500 text-white rounded-md'
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default itemShop;
