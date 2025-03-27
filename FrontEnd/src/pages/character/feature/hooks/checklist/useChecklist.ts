import { useQuery } from '@tanstack/react-query';
import { fetchChecklist } from '../../api/checklist/fetchChecklist';

export const useChecklist = () => {
  //total / done / todo /
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['checklist'],
    queryFn: fetchChecklist,
  });

  if (data) {
    console.log(data);
    console.log(data, 'data 왜 안됨');
  }

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
