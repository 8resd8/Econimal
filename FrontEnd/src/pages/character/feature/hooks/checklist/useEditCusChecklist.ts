import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEditCustomCheck } from '../../api/checklist/fetchEditCustomCheck';

export const useEditCusChecklist = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (checklistId: number) => {
      return fetchEditCustomCheck(checklistId);
    },
    onSuccess: () => {
      console.log('체크리스트 수정에 성공했습니다.');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
  });

  const handleEditCustomChecklist = (checklistId: number) => {
    mutate(checklistId);
  };

  return {
    handleEditCustomChecklist,
  };
};
