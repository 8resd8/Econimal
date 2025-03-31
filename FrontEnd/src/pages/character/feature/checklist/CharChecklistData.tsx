import { useState } from 'react';
import { useChecklist } from '../hooks/checklist/useChecklist';
import { useCheckProgressData } from '../hooks/reuse/useCheckProgressData';

//model => data를 받아서 활용할 내용들
const CharChecklistData = () => {
  //활성화 버튼 -> 오늘의 체크리스트 / 데일리 체크리스트
  const [activeTab, setActiveTab] = useState<'daily' | 'custom'>('daily'); // 'daily' 또는 'custom'
  //서버에서 받아오는 fetching checklist
  const { data, isLoading, isError, error } = useChecklist();
  const { dailyProgress, customProgress } = useCheckProgressData(data);

  return {
    activeTab,
    setActiveTab,
    data: {
      daily: data.checklists.daily.checklist || [],
      custom: data.checklists.custom.checklist || [],
    },
    progress: {
      daily: dailyProgress,
      custom: customProgress,
    },
    isLoading,
    isError,
    error,
  };
};

export default CharChecklistData;
