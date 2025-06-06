import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchValidationCheck } from '../../api/checklist/fetchValidationCheck';

export const useCustomValidation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (description: string) => fetchValidationCheck(description),
    onSuccess: (data) => {
      console.log('유효성 검증에 성공했습니다.');
      console.log(data, '성공 후 받은 data --------@@@');
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
    onError: (error) => {
      console.error('유효성 검증 과정에서 에러가 발생했습니다.', error.message);
    },
  });

  const handleValidationCustomChecklist = async (description: string) => {
    return new Promise((resolve, reject) => {
      mutate(description, {
        onSuccess: (data) => {
          // 서버에서 받은 데이터에 uuid가 있다면 expId로 매핑
          const processedData = {
            ...data,
            // uuid가 있으면 expId로 매핑, 없으면 기존 expId 사용
            expId: data.uuid || data.expId,
          };
          resolve(processedData); // 처리된 데이터 반환
        },
        onError: (error) => reject(error), // 에러 발생 시 처리
      });
    });
  };

  return { handleValidationCustomChecklist };
};
