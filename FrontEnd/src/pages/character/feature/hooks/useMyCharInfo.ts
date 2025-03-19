import { useQuery } from '@tanstack/react-query';
import { MyCharInfoResponse } from '../../types/MyCharInfoRes';
import { fetchMyCharInfo } from '../api/fetchMyCharInfo';
// data자체가
export const useMyCharInfo = () => {
  const { data, isError, isLoading, error } = useQuery<MyCharInfoResponse>({
    queryKey: ['myCharInfo'],
    queryFn: fetchMyCharInfo, //경험치/코인/레벨 정보 가져오기
    staleTime: 1000 * 60 * 5,
    retry: 3, // 재시도 요청 3번
  });

  return {
    data: data?.userCharacterMain, //infoData를 적극적으로 활용하기 위해서 1차 속성값까지 접근해서 반환
    isError,
    isLoading,
    error,
  };
};
