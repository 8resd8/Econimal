import { useQuery } from '@tanstack/react-query';
import { MyCharInfoResponse } from '../../types/MyCharInfoRes';
import { fetchMyCharInfo } from '../api/fetchMyCharInfo';
import { useCharacterActions } from '@/store/useCharStatusStore';
import { useEffect } from 'react';

export const useMyCharInfo = () => {
  const { setLevel, setExp, setCoin, setExpression } = useCharacterActions();

  const queryResult = useQuery<MyCharInfoResponse>({
    queryKey: ['myCharInfo'],
    queryFn: fetchMyCharInfo,
    staleTime: 1000 * 60 * 5,
    // retry: 3,
  });

  useEffect(() => {
    if (queryResult.data?.userCharacterMain) {
      //queryResult에 구조분해할당으로 사용되는 data 여부
      const { level, exp, coin, expression } =
        queryResult.data.userCharacterMain; //필요한 내용에 대해서 할당
      //각 필요한 데이터 전달달
      setLevel(level);
      setExp(exp);
      setCoin(coin);
      setExpression(expression || 'NEUTRAL');
      // console.log(level, exp, coin, expression);
    }
  }, [queryResult.data, setLevel, setExp, setCoin, setExpression]);

  return {
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
  };
};
