import Court from './components/Court';
import MyHouse from './components/MyHouse';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import TownName from './components/TownName';
import town from '@/assets/baisc-town.png'; // 배경
import { useGetTownEvents } from './features/useTownQuery';
import { useTownStore } from '@/store/useTownStore';
import { useEffect, useState } from 'react';
// import RecyclingCenter from './components/RecyclingCenter';
// import Vehicle from './components/Vehicle';

// 하위 컴포넌트로 전달할 인프라 아이디 타입
export interface TownProps {
  infraEventId?: number;
  className?: string; // className 속성 추가하여 스타일 전달 가능하게 함
}

const Town = () => {
  // 스토어에서 이벤트 설정 함수 가져오기
  const { setActiveEvents } = useTownStore();

  // 화면 비율을 관리하기 위한 상태 추가
  // const [aspectRatio, setAspectRatio] = useState({ width: 0, height: 0 });

  // 마을 상황 조회
  const { data: townEventsData } = useGetTownEvents();

  // // 화면 크기 변경 감지 및 aspectRatio 업데이트를 위한 useEffect 추가
  // useEffect(() => {
  //   // 초기 화면 크기 설정
  //   setAspectRatio({
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   });

  //   // 화면 크기 변경 감지 함수
  //   const handleResize = () => {
  //     setAspectRatio({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   };

  //   // 이벤트 리스너 등록
  //   window.addEventListener('resize', handleResize);

  //   // 컴포넌트 언마운트 시 이벤트 리스너 제거
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

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
    // 1. 전체 화면을 차지하는 고정 컨테이너
    <div className='fixed inset-0 overflow-hidden'>
      {/* 2. 배경 이미지 래퍼 - 배경 이미지를 화면 중앙에 배치 */}
      <div className='relative w-full h-full flex items-center justify-center'>
        {/* 3. 배경 이미지 - 비율 유지하면서 화면에 맞춤 */}
        <div className='relative'>
          <img
            src={town}
            alt='마을'
            className='max-w-full max-h-screen object-contain'
          />

          {/* 4. 컴포넌트 배치를 위한 절대 위치 오버레이 (이미지와 정확히 동일한 위치와 크기) */}
          <div className='absolute inset-0'>
            {/* 5. 마을 이름 - 항상 상단 중앙에 위치 */}
            <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg text-xl w-[15%] z-20'>
              <TownName />
            </div>

            {/* 6. 가정 컴포넌트 - 배경 이미지 기준 상대적 위치 */}
            <div className='absolute top-[14%] left-[44%] transform -translate-x-1/2 -translate-y-1/2 w-[15%] z-10'>
              <MyHouse infraEventId={getInfraEventId('ELECTRICITY')} />
            </div>

            {/* 7. 하수처리장 컴포넌트 - 배경 이미지 기준 상대적 위치 */}
            <div className='absolute top-[51%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-[13%] z-10'>
              <SewageTreatmentCenter infraEventId={getInfraEventId('WATER')} />
            </div>

            {/* 8. 법원 컴포넌트 - 배경 이미지 기준 상대적 위치 */}
            <div className='absolute top-[85%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 w-[13%] z-10'>
              <Court infraEventId={getInfraEventId('COURT')} />
            </div>

            {/* <div className="absolute top-[20%] right-[5%] transform -translate-y-1/2 w-[12%] z-10">
              <RecyclingCenter />
            </div> */}

            {/* <div className="absolute bottom-[25%] right-[30%] transform -translate-x-1/2 w-[12%] z-10">
              <Vehicle />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Town;
