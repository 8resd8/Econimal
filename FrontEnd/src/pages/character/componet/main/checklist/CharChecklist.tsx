import { useEffect, useMemo, useState } from 'react';
import ChecklistPanel from './ChecklistPanel';
import ProgressBar from './ProgressBar';
import { useChecklist } from '@/pages/character/feature/hooks/useChecklist';
import { usePostChecklist } from '@/pages/character/feature/hooks/usePostChecklist';
import ChecklistTab from './ChecklistTab';
import { a } from 'node_modules/framer-motion/dist/types.d-B50aGbjN';

//useChecklist의 data활용해서
const CharChecklist = () => {
  // const [dailyProgress, setDailyProgress] = useState(40); // 오늘의 체크리스트 진행률
  // const [customProgress, setCustomProgress] = useState(20); // 나만의 체크리스트 진행률
  const { data, isLoading, isError, error } = useChecklist();

  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
  const { handleChecklistToServer } = usePostChecklist();

  //계산 로직이다보니 memo를 써야할 것 같음
  const dailyProgress = useMemo(() => {
    if (data) {
      const daily = data.checklists.daily;
      const dailyProgress = Math.ceil((daily.done / daily.total) * 100);
      return Number(dailyProgress);
    }
  }, [data]);

  const customProgress = useMemo(() => {
    if (data) {
      const custom = data.checklists.custom;
      const customProgress = Math.ceil((custom.done / custom.total) * 100);
      return Number(customProgress);
    }
  }, [data]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>오류 발생: {error.message}</div>;
  }

  const dailyItems = data.checklists.daily.checklist; //이거 자체

  const customItems = data.checklists.custom.checklist;

  const onCompleteItem = async (checklistId: string, type: string) => {
    try {
      handleChecklistToServer(checklistId, type);
      console.log('[2] 상위 컴포넌트 핸들러 실행', checklistId);
    } catch (error) {
      console.log('체크리스트 완료 실패', error);
    }
  };

  return (
    <div>
      {/* 탭 전환 버튼 */}
      <div className='flex mb-4 space-x-4'>
        <ChecklistTab
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          tabName='daily'
          text={'오늘의 체크리스트'}
        />
        <ChecklistTab
          setActiveTab={setActiveTab}
          tabName='custom'
          activeTab={activeTab}
          text={'나만의 체크리스트'}
        />
      </div>

      {/* 체크리스트 패널 */}
      {activeTab === 'daily' ? (
        <>
          {/* 진척률 막대바 */}
          <div className='mt-4 mb-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>
              오늘 내가 실천할 일
            </h3>
            <ProgressBar progress={dailyProgress} />
            <p className='text-center text-sm mt-2'>{dailyProgress}% 완료</p>
          </div>
          <ChecklistPanel
            items={dailyItems}
            activateTab={activeTab}
            isEditable={false}
            onCompleteItem={onCompleteItem}
          />
        </>
      ) : (
        <>
          {/* 진척률 막대바 */}
          <div className='mt-4 mb-4'>
            <h3 className='text-center text-lg font-semibold mb-2'>진척률</h3>
            <ProgressBar progress={customProgress} />
            <p className='text-center text-sm mt-2'>{customProgress}% 완료</p>
          </div>
          <ChecklistPanel
            items={customItems}
            isEditable={true}
            activateTab={activeTab}
            onCompleteItem={onCompleteItem}
          />
        </>
      )}
    </div>
  );
};

export default CharChecklist;
