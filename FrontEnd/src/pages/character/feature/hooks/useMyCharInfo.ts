import { useQuery } from '@tanstack/react-query';
import { MyCharInfoResponse } from '../../types/MyCharInfoRes';
import { fetchMyCharInfo } from '../api/fetchMyCharInfo';
import { useCharStatusStore } from '@/store/useCharStatusStore';
import { useEffect } from 'react';

// data자체가
export const useMyCharInfo = () => {
  //status store 관리리
  // const {setLevel, setExp, setCoin, setExpression} = useCharStatusStore()
  const { data, isError, isLoading, error } = useQuery<MyCharInfoResponse>({
    queryKey: ['myCharInfo'],
    queryFn: fetchMyCharInfo, //경험치/코인/레벨 정보 가져오기
    staleTime: 1000 * 60 * 5,
    retry: 3, // 재시도 요청 3번
  });

  // 현 데이터를 가공해서 => zustand에 저장
  // useEffect(() => {
  //   if (data && data.userCharacterMain) {
  //     setLevel(data.userCharacterMain.level)
  //     setExp(data.userCharacterMain.exp)
  //     setCoin(data.userCharacterMain.coin)
  //     setExpression(data.userCharacterMain.expression)
  //   }
  // }, [data])

  return {
    data: data?.userCharacterMain, //infoData를 적극적으로 활용하기 위해서 1차 속성값까지 접근해서 반환
    isError,
    isLoading,
    error,
  };
};
