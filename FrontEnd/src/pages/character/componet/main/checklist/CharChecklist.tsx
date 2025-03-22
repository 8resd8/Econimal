import { useState } from 'react';
import ChecklistPanel from './ChecklistPanel';
import ProgressBar from './ProgressBar';

const CharChecklist = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
  const [dailyProgress, setDailyProgress] = useState(40); // 오늘의 체크리스트 진행률
  const [customProgress, setCustomProgress] = useState(20); // 나만의 체크리스트 진행률

  const [dailyItems] = useState([
    {
      id: '1',
      title: '물 절약하기',
      description: '...',
      points: 10,
      completed: false,
    },
    {
      id: '2',
      title: '쓰레기 분리수거',
      description: '...',
      points: 15,
      completed: false,
    },
    {
      id: '3',
      title: '전기 절약하기',
      description: '...',
      points: 10,
      completed: false,
    },
    {
      id: '4',
      title: '식물 돌보기',
      description: '...',
      points: 20,
      completed: false,
    },
  ]);

  const [customItems] = useState([
    {
      id: '5',
      title: '독서하기',
      description: '...',
      points: 10,
      completed: false,
    },
  ]);

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
        <>
          {/* 진척률 막대바 */}
          <div className='mt-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>진척률</h3>
            <ProgressBar progress={dailyProgress} />
            <p className='text-center text-sm mt-2'>{dailyProgress}% 완료</p>
          </div>
          <ChecklistPanel items={dailyItems} isEditable={false} />
        </>
      ) : (
        <>
          {/* 진척률 막대바 */}
          <div className='mt-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>진척률</h3>
            <ProgressBar progress={customProgress} />
            <p className='text-center text-sm mt-2'>{customProgress}% 완료</p>
          </div>
          <ChecklistPanel items={customItems} isEditable={true} />
        </>
      )}
    </div>
  );
};

export default CharChecklist;
