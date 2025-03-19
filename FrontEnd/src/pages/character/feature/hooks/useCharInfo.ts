import { useQuery } from '@tanstack/react-query';
import { fetchCharInfo } from '../api/fetchCharInfo';
import useCharStore from '@/store/useCharStore';
import { CharInfoResponse } from '../../types/CharInfoRes';
import { useEffectiveId } from './reuse/useEffectiveId';

//hook -> hook불러와도 문제없음
export const useCharInfo = () => {
  const { myChar } = useCharStore(); //캐릭터 정보 zustand
  const { effectiveId } = useEffectiveId(myChar); //유효성 여부가 판단된 id값
  const { data, isLoading, isError, error } = useQuery<
    CharInfoResponse<number>
  >({
    queryKey: ['charInfo', effectiveId], //캐싱을 id별로 적용, 더 세분화
    queryFn: ({ queryKey }) => {
      const id = queryKey[1] as number; //effective Id의 타입 지정
      return fetchCharInfo(id); //캐릭터 상세 조회 정보(구해달라는 특정 캐릭터 메세지 창)
    },
    staleTime: 1000 * 60 * 5, //캐싱 유지 시간 5분
    enabled: effectiveId !== null && effectiveId > 0, // ID가 유효한 경우에만 쿼리 실행
    retry: 3, // 재시도 요청 3번
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
