// 인프라 탠스택쿼리
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getInfraEvent,
  submitInfraResult,
  InfraSubmitResponse,
} from './infraApi';
import { useTownStore } from '@/store/useTownStore';
import { EcoType } from './infraApi';

// useQuery? useSuspenseQuery?
// 인프라 이벤트 상세 조회
export const useGetInfraEvent = (infraEventId: number) =>
  useQuery({
    queryKey: ['infra-event', infraEventId],
    queryFn: () => getInfraEvent(infraEventId), //queryFn에는 "함수 실행 결과"가 아니라 "함수 자체"가 전달되어야 함함
    enabled: !!infraEventId, // infraEventId가 있을 때만 쿼리 실행
  });

// 인프라 이벤트 선택지 제출
export const useSubmitInfraResult = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (params: { ecoAnswerId: number; ecoType: string }) =>
      submitInfraResult(params.ecoAnswerId),
    onSuccess: (data, variables) => {
      // 해당 인프라 타입의 상태를 isOptimal 값에 따라 설정
      useTownStore
        .getState()
        .setInfraStatus(variables.ecoType as EcoType, data.isOptimal);

      // 마을 전체 이벤트 상태를 다시 불러오도록 무효화
      queryClient.invalidateQueries({ queryKey: ['town-events'] }); // 선택지 제출 후 데이터 새로고침

      // 마을 정보도 함께 갱신
      queryClient.invalidateQueries({ queryKey: ['town-info'] });

      // 캐릭터 정보도 갱신
      queryClient.invalidateQueries({ queryKey: ['myCharInfo'] });

      // 데이터는 콜백으로 직접 전달됨 ???
      return data;
    },
    onError: (error) => {
      console.log(error.message || '선택지 제출 중 오류가 발생했습니다.');
    },
  });

  // [수정] ecoAnswerId와 ecoType을 함께 전달하는 함수 수정
  return (
    ecoAnswerId: number,
    ecoType: string,
    options?: { onSuccess?: (data: InfraSubmitResponse) => void },
  ) =>
    mutate(
      { ecoAnswerId, ecoType },
      {
        onSuccess: (data) => {
          // 외부에서 전달된 onSuccess 콜백 실행
          if (options?.onSuccess) {
            options.onSuccess(data);
          }
        },
      },
    );
};
