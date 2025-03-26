import { useTownStore } from '@/store/useTownStore';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// 이벤트 감지기
const EventDetector = () => {
  // 스토어에서 isActive한 이벤트 상태 가져오기
  const { activeEvents } = useTownStore();

  useEffect(() => {
    //
  });
  return (
    <>
      <ToastContainer />
    </>
  );
};
export default EventDetector;

// 1. useTownQurey.ts의 useGetTownEvents에서 데이터 가져옴
// 1-1. useGetTownEvents는 Town.tsx에서 사용하는 쿼리임
// 2. 이때의 response에서 isActive가 하나라도 true이면 이벤트 감지
// 3. 주스탄드에 저장해야한다면 저장(꼭 저장해야함? 다른 페이지여서?)
// 4. Town.tsx이 아닌 MyCharacter.tsx에서 이벤트 발생 여부를 토스트창으로 알 수 있어야함.

// useSubmitInfraResult 쿼리의 response에서 exp, coin은 Town.tsx에서 토스트창 띄울거야

// 최적화된 코드와 컴포넌트 분리 어떻게 하지
