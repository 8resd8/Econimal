import { useQuery } from '@tanstack/react-query';
import { fetchChecklist } from '../../api/checklist/fetchChecklist';
import { useEffect, useMemo } from 'react';
import { useChecklistActions } from '@/store/useChecklistStore';

//query-hook
export const useChecklist = () => {
  //action을 통해서 실제값만 담기 -> zustand
  // const {
  //   setChecklistCustomData,
  //   setChecklistDailyData,
  //   setChecklistCustomProgress,
  //   setChecklistDailyProgress,
  // } = useChecklistActions();
  //현재 가공 로직을 넣은 usehook

  //total / done / todo /
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['checklist'],
    queryFn: fetchChecklist,
  });

  //zustand에 넣을 데이터
  // useEffect(() => {
  //   if (data && data.checklists) {
  //     setChecklistDailyData(data.checklist.daily.checklist);
  //     setChecklistCustomData(data.checklist.custom.checklist);
  //   }
  // }, [data]);

  //계산에 따라 zustand에 넣을 데이터

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
