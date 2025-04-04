import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEditCustomCheck } from '../../api/checklist/fetchEditCustomCheck';

export const useEditCusChecklist = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (params: {
      id: string;
      description: string;
      expId?: string;
    }) => {
      return fetchEditCustomCheck(params.id, params.description, params.expId);
    },
    onSuccess: () => {
      console.log('체크리스트 수정 성공');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
    onError: (error) => {
      console.error(
        '체크리스트 수정 과정에서 에러가 발생했습니다.',
        error.message,
      );
      throw Error;
    },
  });

  const handleEditCustomChecklist = (
    id: string,
    description: string,
    expId?: string,
  ) => {
    return new Promise((resolve, reject) => {
      mutate(
        { id, description, expId },
        {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        },
      );
    });
  };

  return { handleEditCustomChecklist };
};
