// 인프라 탠스택쿼리
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getInfraEvent, submitInfraResult } from './infraApi';

// useQuery? useSuspenseQuery?
// 인프라 이벤트 상세 조회
export const useGetInfraEvent = () =>
  useQuery({ queryKey: ['infra-event'], queryFn: getInfraEvent });

// 인프라 이벤트 선택지 제출
export const useSubmitInfraResult = () => {
  // const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: submitInfraResult,
    // 무효화 언제 사용하는지
    onSuccess: () => {
      // queryClient.invalidateQueries({})
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return mutate;
};
