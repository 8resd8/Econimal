import { useState } from 'react';
import ChecklistPanel from './CheckListPanel';
import { ChecklistItem } from '@/pages/character/types/ChecklistItem';

const CharChecklist = () => {
  //예시시
  const [dailyChecklist, setDailyChecklist] = useState<ChecklistItem[]>([
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

  return (
    <div className='fixed right-0 top-0 h-full z-50'>
      <ChecklistPanel
        // title='펭귄이의 체크리스트'
        items={dailyChecklist}
        // onClose={() => setActivePanel(null)}
        // onComplete={(id) => completeItem(id, true)}
      />
    </div>
  );
};
export default CharChecklist;
