import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchValidationCheck } from '../../api/checklist/fetchValidationCheck';

export const useCustomValidation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: fetchValidationCheck,
    onSuccess: () => {
      console.log('유효성 검증에 성공했습니다.');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
    onError: (error) => {
      console.log('유효성 검증과정에서 에러가 발생했습니다.', error.message);
      throw Error;
    },
  });

  const handleValidationCustomChecklist = () => {
    mutate();
  };

  return {
    handleValidationCustomChecklist,
  };
};
