import { useState } from 'react';
import { Lock } from 'lucide-react';
import { CharShoptTypes } from '../../types/shop/CharShopType';

// 배경 타입 정의
interface BackgroundType {
  id: number;
  name: string;
  image: string;
  owned: boolean;
}

// 샘플 데이터
const characters: CharShoptTypes[] = [
  // 기존 캐릭터 데이터 유지
  { id: 1, name: '꼬부기', image: '/placeholder.svg', owned: true },
  { id: 2, name: '호랭이', image: '/placeholder.svg', owned: true },
  { id: 3, name: '펭귄킹', image: '/placeholder.svg', owned: true },
  { id: 4, name: '이하힝', image: '/placeholder.svg', owned: false },
  { id: 5, name: '으르렁', image: '/placeholder.svg', owned: true },
  { id: 6, name: '늑대', image: '/placeholder.svg', owned: true },
  { id: 7, name: '박쥐', image: '/placeholder.svg', owned: false },
  { id: 8, name: '야옹', image: '/placeholder.svg', owned: true },
];

const backgrounds: BackgroundType[] = [
  { id: 1, name: '마을', image: '/bg1.svg', owned: true },
  { id: 2, name: '숲', image: '/bg2.svg', owned: false },
  { id: 3, name: '성채', image: '/bg3.svg', owned: false },
  // 5개 추가 placeholder
  ...Array(5).fill({ id: 0, name: '', image: '', owned: false }),
];

const CharacterShop = () => {
  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds'>(
    'characters',
  );
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(3);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<number>(1);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  // 현재 표시할 아이템 목록
  const currentItems =
    selectedTab === 'characters' ? characters : backgrounds.slice(0, 8); // 8개로 고정

  const handleSelectItem = (id: number) => {
    const item = currentItems.find((item) => item.id === id);
    if (!item || !item.owned) return;

    if (selectedTab === 'characters') {
      setSelectedCharacterId(id);
    } else {
      setSelectedBackgroundId(id);
    }
  };

  return (
    <div className='w-screen h-screen bg-black p-6 flex flex-col justify-center items-center'>
      <div className='w-full max-w-6xl'>
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
                id: index,
                name: '',
                image: '',
                owned: false,
              };

              const isSelected =
                selectedTab === 'characters'
                  ? item.id === selectedCharacterId
                  : item.id === selectedBackgroundId;

              return (
                <div
                  key={index}
                  className='relative w-full max-w-[200px]'
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
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
                            alt={item.name}
                            className={`w-3/4 h-3/4 object-contain transition-all duration-200 ${
                              isSelected ? 'opacity-100' : 'opacity-70'
                            }`}
                          />
                          {hoveredItemId === item.id && (
                            <button
                              onClick={() => handleSelectItem(item.id)}
                              className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-md'
                            >
                              <span className='px-4 py-2 bg-white text-black text-sm font-medium rounded-md'>
                                선택
                              </span>
                            </button>
                          )}
                        </>
                      ) : (
                        <div className='w-3/4 h-3/4 flex items-center justify-center bg-gray-700 rounded-md'>
                          <Lock className='w-1/2 h-1/2 text-gray-400' />
                        </div>
                      )}
                    </div>
                    <span
                      className={`mt-3 text-base ${
                        item.owned ? 'text-white' : 'text-gray-500'
                      } ${isSelected && item.owned ? 'font-bold' : ''}`}
                    >
                      {item.name || 'Locked'}
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

export default CharacterShop;
