import { useMemo } from 'react';
//일일 목록 dailyChecklist 내용 매개변수로 전달

export const useprogressData = (data) => {
  //데일리 진척률 (하기와 동일한 진행 상황 계산)
  const dailyProgress = useMemo(() => {
    if (data) {
      const daily = data.checklists.daily; //daily 요소
      if (daily.total === 0) return Number(0); //전체 해야할 일이 0이면 -> 0반환
      const dailyProgress = Math.ceil((daily.done / daily.total) * 100); //진척률 계산
      return Number(dailyProgress);
    }
    return 0;
  }, [data]);

  // 커스텀 체크리스트 진행 상황 계산
  const customProgress = useMemo(() => {
    if (data) {
      const custom = data.checklists.custom;
      //total 자체가 0으로 시작할 수 있기 때문에
      if (custom.total === 0) return Number(0); //전체 해야할 일이 0이면 -> 0반환
      const customProgress = Math.ceil((custom.done / custom.total) * 100); //진척률 계산
      return Number(customProgress);
    }
    return 0;
  }, [data]);

  // console.log(dailyProgress, customProgress, '진척률 내부 use');

  return {
    dailyProgress,
    customProgress,
  };
};
