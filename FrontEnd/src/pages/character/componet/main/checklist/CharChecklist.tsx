import { useState } from 'react';
import ChecklistPanel from './ChecklistPanel';

const CharChecklist = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
  const [expLevel, setExpLevel] = useState(75); // 경험치 상태
  const [dailyItems] = useState([
    {
      id: '1',
      title: '물 절약하기',
      description: '오늘 양치할 때 물을 받아서 사용해보세요!',
      points: 10,
      completed: false,
    },
    {
      id: '2',
      title: '쓰레기 분리수거',
      description: '오늘 집에서 나온 쓰레기를 분리해서 버려보세요!',
      points: 15,
      completed: false,
    },
    {
      id: '3',
      title: '전기 절약하기',
      description: '사용하지 않는 전등을 끄고 에너지를 절약해보세요!',
      points: 10,
      completed: false,
    },
    {
      id: '4',
      title: '식물 돌보기',
      description: '집에 있는 식물에게 물을 주고 돌봐주세요!',
      points: 20,
      completed: false,
    },
  ]);
  const [customItems, setCustomItems] = useState([]);

  // 커스텀 미션 추가
  const handleAddCustomItem = (newItem) => {
    setCustomItems([...customItems, newItem]);
  };

  // 완료 시 경험치 증가
  const handleCompleteItem = (id, isDaily) => {
    if (isDaily) {
      dailyItems.map((item) =>
        item.id === id ? { ...item, completed: true } : item,
      );
    } else {
      setCustomItems(
        customItems.map((item) =>
          item.id === id ? { ...item, completed: true } : item,
        ),
      );
    }
    setExpLevel((prev) => Math.min(prev + 10, 100));
  };

  return (
    <div>
      {/* 탭 전환 버튼 */}
      <div className='flex mb-4 space-x-4'>
        <button
          className={`px-4 py-2 rounded-full font-bold ${
            activeTab === 'daily'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => setActiveTab('daily')}
        >
          오늘의 체크리스트
        </button>
        <button
          className={`px-4 py-2 rounded-full font-bold ${
            activeTab === 'custom'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => setActiveTab('custom')}
        >
          나만의 체크리스트
        </button>
      </div>

      {/* 체크리스트 패널 */}
      {activeTab === 'daily' ? (
        <ChecklistPanel
          items={dailyItems}
          isEditable={false}
          onCompleteItem={(id) => handleCompleteItem(id, true)}
        />
      ) : (
        <ChecklistPanel
          items={customItems}
          isEditable={true}
          onAddItem={handleAddCustomItem}
          onCompleteItem={(id) => handleCompleteItem(id, false)}
        />
      )}
    </div>
  );
};

export default CharChecklist;
