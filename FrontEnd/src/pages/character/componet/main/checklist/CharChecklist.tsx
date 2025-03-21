import { useState } from 'react';
import ChecklistPanel from './ChecklistPanel';

const CharChecklist = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
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
  ]);
  const [customItems, setCustomItems] = useState([]);

  // 커스텀 미션 추가
  const handleAddCustomItem = (newItem) => {
    setCustomItems([...customItems, newItem]);
  };

  // 커스텀 미션 수정
  const handleEditCustomItem = (id, newTitle) => {
    setCustomItems(
      customItems.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item,
      ),
    );
  };

  // 커스텀 미션 삭제
  const handleDeleteCustomItem = (id) => {
    setCustomItems(customItems.filter((item) => item.id !== id));
  };

  return (
    <div>
      {/* 탭 전환 버튼 */}
      <div className='flex mb-4'>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('daily')}
        >
          일일 미션
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('custom')}
        >
          커스텀 미션
        </button>
      </div>

      {/* 체크리스트 패널 */}
      {activeTab === 'daily' ? (
        <ChecklistPanel items={dailyItems} isEditable={false} />
      ) : (
        <ChecklistPanel
          items={customItems}
          isEditable={true}
          onAddItem={handleAddCustomItem}
          onEditItem={handleEditCustomItem}
          onDeleteItem={handleDeleteCustomItem}
        />
      )}
    </div>
  );
};

export default CharChecklist;
