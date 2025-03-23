import { useQuery } from '@tanstack/react-query';
import { fetchChecklist } from '../api/fetchChecklist';

export const useChecklist = () => {
  //total / done / todo / 
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['checklist'],
    queryFn: fetchChecklist,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
