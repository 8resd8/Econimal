import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAddCustomCheck } from '../../api/checklist/fetchAddCustomCheck';
export const useAddCusChecklist = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (params: { description: string; uuid?: string }) => {
      // uuid를 expId로 변환하여 전달
      const payload = params.uuid
        ? { description: params.description, expId: params.uuid }
        : { description: params.description };

      return fetchAddCustomCheck(payload);
    },
    onSuccess: () => {
      console.log('custom 체크리스트 등록 성공');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
    onError: (error) => {
      console.log(
        'checklist 서버 등록과정에서 에러가 발생했습니다.',
        error.message,
      );
      throw Error;
    },
  });

  const handleSubmitCustomChecklist = (description: string, uuid?: string) => {
    mutate({ description, uuid }); // uuid 전달
  };

  return {
    handleSubmitCustomChecklist,
  };
};
