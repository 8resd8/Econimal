import { useEffect, useMemo, useState } from 'react';
import ChecklistPanel from './ChecklistPanel';
import ProgressBar from './ProgressBar';
import { useChecklist } from '@/pages/character/feature/hooks/useChecklist';
import { usePostChecklist } from '@/0pages/character/feature/hooks/usePostChecklist';
import ChecklistTab from './ChecklistTab';

//useChecklist의 data활용해서
const CharChecklist = () => {
  // const {data, isLoading, isError, error} = useChecklist()
  const [dailyProgress, setDailyProgress] = useState(40); // 오늘의 체크리스트 진행률
  const [customProgress, setCustomProgress] = useState(20); // 나만의 체크리스트 진행률
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
  // const {handleChecklistToServer} = usePostChecklist()

  //계산 로직이다보니 memo를 써야할 것 같음
  /*
  const dailyCheckProgress = useMemo(()=>{
    const daily = data.checklists.daily
    const dailyProgress = daily.done / daily.total
    return dailyProgress
  },[data])  
  */

  /*
  const customCheckProgress = useMemo(()=>{
    const custom = data.checklists.custom
    const customProgress = custom.done / custom.total
    return customProgress
  },[data])
  */

  const [dailyItems] = useState([
    {
      id: '1',
      description: '물 절약하기',
      // description: '...',
      exp: 10,
      completed: false,
    },
    {
      id: '2',
      description: '쓰레기 분리수거',
      // description: '...',
      exp: 15,
      completed: false,
    },
    {
      id: '3',
      description: '전기 절약하기',
      // description: '...',
      exp: 10,
      completed: false,
    },
    {
      id: '4',
      description: '식물 돌보기',
      // description: '...',
      exp: 20,
      completed: false,
    },
  ]);
  //state로 관리할 필요가 있을까? -> 짜피 캐싱해주고 상태관리를,,? 그냥 있는거 그대로 받아서 사용
  //dailyItems 관련
  /*
  const dailyItems = data.checklists.daily.checklist //이거 자체
  */

  //customItems 관련
  /*
  const customItems = data.checklists.custom.checklist
  */

  const [customItems] = useState([
    {
      checklistId: '5',
      description: '독서하기',
      exp: 10,
      completed: false,
    },
  ]);

  const onCompletedItem = (checklistId: number) => {
    // 서버에 fetching 보내줄 것
    //여기서 나중에 경고 메세지
    // handleChecklistToServer(checklistId)
    // 로컬 상태 업데이트  => Q. 놓친 포인트
    // const updatedItems = dailyItems.map((item) =>
    //   item.checklistId === checklistId ? { ...item, completed: true } : item,
    // );
    // setDailyItems(updatedItems);
  };

  // if (isLoading) {
  //   return <div>로딩 중...</div>;
  // }

  // if (isError) {
  //   return <div>오류 발생: {error.message}</div>;
  // }

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
            <h3 className='text-center text-lg font-semibold mb-2'>진척률</h3>
            <ProgressBar progress={dailyProgress} />
            <p className='text-center text-sm mt-2'>{dailyProgress}% 완료</p>
          </div>
          <ChecklistPanel items={dailyItems} isEditable={false} />
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
            onCompleteItem={onCompletedItem}
          />
        </>
      )}
    </div>
  );
};

export default CharChecklist;
