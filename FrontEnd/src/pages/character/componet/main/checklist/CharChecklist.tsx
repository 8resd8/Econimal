import { useEffect, useMemo, useState } from 'react';
import ChecklistPanel from './ChecklistPanel';
import ProgressBar from './ProgressBar';
import { useChecklist } from '@/pages/character/feature/hooks/useChecklist';
import { usePostChecklist } from '@/pages/character/feature/hooks/usePostChecklist';

//useChecklist의 data활용해서
const CharChecklist = () => {
  // const {data, isLoading, isError, error} = useChecklist()
  const [dailyProgress, setDailyProgress] = useState(40); // 오늘의 체크리스트 진행률
  const [customProgress, setCustomProgress] = useState(20); // 나만의 체크리스트 진행률
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' 또는 'custom'
  // const {handleChecklistToServer} = usePostChecklist()

  //daily 진척률 값 계산
  // useEffect(()=> {
  /*  
    const daily = data.checklist.daily
    const dailyProgress = daily.done / daily.total
    setDailyProgress(dailyProgress)
  */
  // }, [data])

  //custom 진척률 값 계산
  /*
  useEffect(()=>{
    const custom = data.checklist.custom
    const customProgress = custom.done / custom.total
    setCustomProgress(customProgress)
  },[data])
  */

  //-------------

  //계산 로직이다보니 memo를 써야할 것 같음
  /*
  const dailyCheckProgress = useMemo(()=>{
    const daily = data.checklists.daily
    const dailyProgress = daily.done / daily.total
  },[data])  
  */

  /*
  const customCheckProgress = useMemo(()=>{
    const custom = data.checklists.custom
    const customProgress = custom.done / custom.total
  },[data])
  */

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
      id: '5',
      title: '독서하기',
      description: '...',
      points: 10,
      completed: false,
    },
  ]);

  const onCompletedItem = (checklistId: number) => {
    // 서버에 fetching 보내줄 것
    //여기서 나중에 경고 메세지
    // handleChecklistToServer(checklistId)
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
