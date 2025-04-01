import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEditCustomCheck } from '../../api/checklist/fetchEditCustomCheck';

export const useEditCusChecklist = () => {
  const queryClient = useQueryClient();
  //mutation함수가 단일 객체로 전달받기 떄문에 => 래핑
  //구조분해할당
  const { mutate } = useMutation({
    mutationFn: ({
      checklistId,
      description,
    }: {
      checklistId: string;
      description: string;
    }) => {
      return fetchEditCustomCheck(checklistId, description);
    },
    onSuccess: () => {
      console.log('체크리스트 수정에 성공했습니다.');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
  });

  const handleEditCustomChecklist = (
    checklistId: string,
    description: string,
  ) => {
    mutate({ checklistId, description });
  };

  return {
    handleEditCustomChecklist,
  };
};
