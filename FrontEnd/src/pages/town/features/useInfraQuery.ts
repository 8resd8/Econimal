// 인프라 탠스택쿼리
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getInfraEvent,
  submitInfraResult,
  InfraSubmitResponse,
} from './infraApi';
import { useTownStore } from '@/store/useTownStore';
import { EcoType } from './infraApi';
// import { showInfraResultNotice } from '@/components/toast/toastUtil';

// 인프라 이벤트 상세 조회
export const useGetInfraEvent = (infraEventId: number) =>
  useQuery({
    queryKey: ['infra-event', infraEventId],
    queryFn: () => getInfraEvent(infraEventId), //queryFn에는 "함수 실행 결과"가 아니라 "함수 자체"가 전달되어야 함
    enabled: !!infraEventId, // infraEventId가 있을 때만 쿼리 실행
  });

// 인프라 이벤트 선택지 제출
export const useSubmitInfraResult = () => {
  const queryClient = useQueryClient();
  // const updateValues = useTownStore((state) => state.updateValues);

  const { mutate } = useMutation({
    mutationFn: (params: { ecoAnswerId: number; ecoType: string }) =>
      submitInfraResult(params.ecoAnswerId),
    onSuccess: (data, variables) => {
      // 해당 인프라 타입의 상태를 isOptimal 값에 따라 설정
      useTownStore
        .getState()
        .setInfraStatus(variables.ecoType as EcoType, data.isOptimal);

      // Zustand 스토어 상태 업데이트 (carbon, exp, coin, expression)
      // 덧셈 할 필요있나. 백에서 캐릭터 경험치, 코인 정보 가져오면 어차피 정보 있을 텐데
      // updateValues({
      //   carbon: useTownStore.getState().carbon + data.carbon,
      //   exp: useTownStore.getState().exp + data.exp,
      //   coin: useTownStore.getState().coin + data.coin,
      //   expression: data.expression,
      // });

      // 마을 페이지에 있고, 모달이 열려있지 않을 때만 토스트 알림 표시
      // 여기서는 토스트 알림을 표시하지 않고 ResultModal에서 처리
      // showInfraResultNotice(data.isOptimal, data.exp, data.coin);

      // [수정] 여러 쿼리 무효화를 일괄 처리
      queryClient.invalidateQueries({
        predicate: (query) =>
          ['town-events', 'town-info', 'myCharInfo'].includes(
            query.queryKey[0] as string,
          ),
      });

      // queryClient.invalidateQueries({ queryKey: ['town-events'] }); // 마을 전체 이벤트 상태를 다시 불러오도록 무효화
      // queryClient.invalidateQueries({ queryKey: ['town-info'] }); // 마을 정보도 함께 갱신
      // queryClient.invalidateQueries({ queryKey: ['myCharInfo'] }); // 캐릭터 정보도 갱신

      return data;
    },
    onError: (error) => {
      console.log(error.message || '선택지 제출 중 오류가 발생했습니다.');
    },
  });

  // ecoAnswerId와 ecoType을 함께 전달하는 함수 수정
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
