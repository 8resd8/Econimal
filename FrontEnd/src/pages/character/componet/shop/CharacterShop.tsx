import { useState } from 'react';
import { Lock } from 'lucide-react';
import { CharShoptTypes } from '../../types/shop/CharShopType';

const characters: CharShoptTypes[] = [
  {
    id: 1,
    name: '꼬부기',
    image: '/placeholder.svg?height=80&width=80',
    owned: true,
  },
  {
    id: 2,
    name: '호랭이',
    image: '/placeholder.svg?height=80&width=80',
    owned: true,
  },
  {
    id: 3,
    name: '펭귄킹',
    image: '/placeholder.svg?height=80&width=80',
    owned: true,
  },
  {
    id: 4,
    name: '이하힝',
    image: '/placeholder.svg?height=80&width=80',
    owned: false,
  },
  {
    id: 5,
    name: '으르렁',
    image: '/placeholder.svg?height=80&width=80',
    owned: true,
  },
  {
    id: 6,
    name: '늑대',
    image: '/placeholder.svg?height=80&width=80',
    owned: true,
  },
  {
    id: 7,
    name: '박쥐',
    image: '/placeholder.svg?height=80&width=80',
    owned: false,
  },
  {
    id: 8,
    name: '야옹',
    image: '/placeholder.svg?height=80&width=80',
    owned: true,
  },
];

const CharacterShop = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(3);
  // 호버 상태인 캐릭터 ID
  const [hoveredCharacterId, setHoveredCharacterId] = useState<number | null>(
    null,
  );

  // 캐릭터 선택 핸들러
  const handleSelectCharacter = (id: number) => {
    if (characters.find((char) => char.id === id)?.owned) {
      setSelectedCharacterId(id);
    }
  };
  return (
    <div className='w-screen h-screen bg-black p-6 flex flex-col justify-center items-center'>
      <div className='w-full max-w-6xl'>
        <h1 className='text-3xl font-bold text-white mb-6 text-center'>상점</h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center'>
          {characters.map((character) => (
            <div
              key={character.id}
              className='relative w-full max-w-[200px]'
              onMouseEnter={() => setHoveredCharacterId(character.id)}
              onMouseLeave={() => setHoveredCharacterId(null)}
            >
              <div
                className={`relative rounded-lg p-4 transition-all duration-200 flex flex-col items-center justify-center aspect-square border ${
                  character.owned
                    ? 'bg-gray-100/10 border-gray-500'
                    : 'bg-gray-800 border-gray-600'
                } ${
                  selectedCharacterId === character.id && character.owned
                    ? 'bg-gray-100/30'
                    : ''
                }`}
              >
                <div className='relative w-full h-full flex items-center justify-center rounded-md'>
                  {character.owned ? (
                    <img
                      src={character.image || '/placeholder.svg'}
                      alt={character.name}
                      className={`w-3/4 h-3/4 object-contain transition-all duration-200 ${
                        selectedCharacterId === character.id
                          ? 'opacity-100'
                          : 'opacity-70'
                      }`}
                    />
                  ) : (
                    <div className='w-3/4 h-3/4 flex items-center justify-center bg-gray-700 rounded-md'>
                      <Lock className='w-1/2 h-1/2 text-gray-400' />
                    </div>
                  )}

                  {/* 호버 시 선택 버튼 표시 */}
                  {hoveredCharacterId === character.id && character.owned && (
                    <button
                      onClick={() => handleSelectCharacter(character.id)}
                      className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-md transition-all duration-200'
                    >
                      <span className='px-4 py-2 bg-white text-black text-sm font-medium rounded-md'>
                        선택
                      </span>
                    </button>
                  )}
                </div>
                <span
                  className={`mt-3 text-base ${
                    character.owned ? 'text-white' : 'text-gray-500'
                  } ${
                    selectedCharacterId === character.id && character.owned
                      ? 'font-bold'
                      : ''
                  }`}
                >
                  {character.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterShop;
