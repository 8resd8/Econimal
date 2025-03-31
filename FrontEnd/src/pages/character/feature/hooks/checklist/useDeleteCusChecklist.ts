import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDeleteCustomCheck } from '../../api/checklist/fetchDeleteCustomCheck';
import { error } from 'console';

export const useDeleteCusChecklist = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (checklistId: string) => {
      return fetchDeleteCustomCheck(checklistId);
    },
    onSuccess: () => {
      console.log('커스텀 체크리스트 삭제에 성공했습니다!');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
    onError: (error) => {
      console.log(
        '커스텀 체크리스트를 삭제하는 과정에서 에러가 발생했습니다.',
        error.message,
      );
    },
  });

  const handleDeleteCustomChecklist = (checklistId: string) => {
    mutate(checklistId);
  };

  return {
    handleDeleteCustomChecklist,
  };
};
