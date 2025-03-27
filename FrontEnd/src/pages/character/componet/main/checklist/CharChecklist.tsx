import { useEffect, useMemo, useState } from 'react';
import ChecklistPanel from './ChecklistPanel';
import ProgressBar from './ProgressBar';
import { useChecklist } from '@/pages/character/feature/hooks/checklist/useChecklist';
import { usePostChecklist } from '@/pages/character/feature/hooks/checklist/usePostChecklist';
import ChecklistTab from './ChecklistTab';

//useChecklist의 data활용해서
const CharChecklist = () => {
  const { data, isLoading, isError, error } = useChecklist();

  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
  const { handleChecklistToServer } = usePostChecklist();

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
      //total 자체가 0으로 시작할 수 있기 때문에
      if (custom.total === 0) return Number(0);
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
            <h3 className='text-center text-lg font-semibold mb-2'>
              오늘 내가 실천할 일
            </h3>
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
