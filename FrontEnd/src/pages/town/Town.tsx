import Court from './components/Court';
import MyHouse from './components/MyHouse';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import TownName from './components/TownName';
import town from '@/assets/baisc-town.png'; // 배경
import { useGetTownEvents } from './features/useTownQuery';
import { useTownStore } from '@/store/useTownStore';
import { useEffect } from 'react';
// import RecyclingCenter from './components/RecyclingCenter';
// import Vehicle from './components/Vehicle';

// 하위 컴포넌트로 전달할 인프라 아이디 타입
export interface TownProps {
  infraEventId?: number;
}

const Town = () => {
  // 스토어에서 마을ID, 이벤트 설정 함수 가져오기
  const { townId, setActiveEvents } = useTownStore();

  // 마을 상황 조회
  const { data: townEventsData } = useGetTownEvents(townId);

  // 마을 접속 시(페이지 로드 시) 이벤트 목록 조회 및 상태 업데이트
  useEffect(() => {
    if (townEventsData?.townStatus) {
      // 활성화된 이벤트id 필터링
      const activeEventIds = townEventsData.townStatus
        .filter((event) => event.isActive)
        .map((event) => event.infraEventId);

      // 스토어에 활성화된 이벤트 설정
      setActiveEvents(activeEventIds);
    }
  }, [townEventsData, setActiveEvents]);

  // 각 인프라에 해당 이벤트ID 전달하는 함수
  const getInfraEventId = (ecoType: string) => {
    if (!townEventsData?.townStatus) return undefined; // undefined 처리가 맞을까?

    const infraEvent = townEventsData.townStatus.find(
      (e) => e.ecoType === ecoType && e.isActive,
    );
    return infraEvent ? infraEvent.infraEventId : undefined;
  };

  return (
    // <div className='w-full h-full relative'>
    <div className='fixed inset-0 overflow-hidden'>
      {/* 배경 이미지 */}
      <div>
        <img src={town} alt='마을' className='w-screen h-screen object-cover' />
      </div>

      {/* 컴포넌트들을 위한 컨테이너 */}
      <div className='absolute inset-0'>
        {/* -translate-x-1/2: 요소를 X축 기준으로 왼쪽으로 50% 이동 */}
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg text-3xl z-20'>
          <TownName />
        </div>

        {/* 각 건물/시설 컴포넌트들 - 이미지의 특정 위치에 고정 */}
        <div className='absolute top-[-2%] left-[28%] z-10'>
          <MyHouse infraEventId={getInfraEventId('ELECTRICITY')} />
        </div>

        <div className='absolute bottom-[30%] left-[30%] z-10'>
          <SewageTreatmentCenter infraEventId={getInfraEventId('WATER')} />
        </div>

        <div className='absolute top-[75%] left-[30%] transform z-10'>
          <Court infraEventId={getInfraEventId('COURT')} />
        </div>

        {/* <div className='absolute top-[20%] right-[5%] z-10'>
          <RecyclingCenter />
        </div> */}

        {/* <div className='absolute bottom-[25%] right-[30%] z-10'>
          <Vehicle />
        </div> */}
      </div>
    </div>
  );
};

export default Town;
