import Court from './components/Court';
import MyHouse from './components/MyHouse';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import TownName from './components/TownName';
import Factory from './components/Factory';
import town from '@/assets/town/baisc-town.png'; // 배경
import GoMainBtn from '@/components/GoMainBtn';
import { useGetTownEvents } from './features/useTownQuery';
import { useTownStore } from '@/store/useTownStore';
import { TownEvent } from './features/townApi';

import pollutedImg from '@/assets/town/polluted-river.png';

// import RecyclingCenter from './components/RecyclingCenter';
// import Vehicle from './components/Vehicle';

// 하위 컴포넌트로 전달할 인프라 아이디 타입
export interface TownProps {
  infraEventId?: number;
  className?: string; // className 속성 추가하여 스타일 전달 가능하게 함
  onClick?: () => void;
}

const Town = () => {
  // 마을 상황 조회
  const { data: townEventsData } = useGetTownEvents();

  // Zustand 스토어에서 인프라 상태 가져오기
  const infraStatus = useTownStore((state) => state.infraStatus);

  // 각 인프라에 해당 이벤트ID 전달하는 함수
  const getInfraEventId = (ecoType: string) => {
    if (!townEventsData?.townStatus) return undefined; // undefined 처리가 맞을까?

    const infraEvent = townEventsData.townStatus.find(
      (e: TownEvent) => e.ecoType === ecoType && e.isActive,
    );
    return infraEvent ? infraEvent.infraEventId : undefined;
  };

  return (
    // 전체 화면을 차지하는 고정 컨테이너
    <div className='fixed inset-0 overflow-hidden '>
      <div className='absolute inset-0'>
        <img
          src={town}
          alt='뒷 배경'
          className='w-full h-full object-cover blur-3xl'
        />
      </div>
      {/* 배경 이미지 래퍼 - 배경 이미지를 화면 중앙에 배치 */}
      <div className='relative w-full h-full flex items-center justify-center'>
        {/* 배경 이미지 - 비율 유지하면서 화면에 맞춤 */}
        <div className='relative max-w-full max-h-screen'>
          <img
            src={town}
            alt='마을'
            className='max-w-full max-h-screen object-contain'
          />

          {/* 컴포넌트 배치를 위한 절대 위치 오버레이 (이미지와 정확히 동일한 위치와 크기) */}
          <div className='absolute inset-0'>
            <div className=''>
              {/* 홈으로 가는 버튼 */}
              <div className='absolute top-[%] left-[4%] z-30'>
                <GoMainBtn />
              </div>

              {/* 마을 이름 - 항상 상단 중앙에 위치 */}
              <div className='absolute top-[5%] left-[50%] transform -translate-x-1/2 w-[20%] h-[5%] z-30'>
                <TownName />
              </div>
            </div>

            {/* 가정 컴포넌트 - 배경 이미지 기준 상대적 위치 */}
            <div className='absolute top-[60%] right-[0.1%] transform -translate-x-1/2 -translate-y-1/2 w-[15%] z-20'>
              <MyHouse infraEventId={getInfraEventId('ELECTRICITY')} />
            </div>
            {/* 하수처리장 컴포넌트 - 배경 이미지 기준 상대적 위치 */}
            <div className='absolute top-[51%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-[13%] z-20'>
              <SewageTreatmentCenter infraEventId={getInfraEventId('WATER')} />
            </div>
            {/* 오염된 강물 오버레이 - 하수처리장이 오염 상태일 때만 표시 */}
            {!infraStatus.WATER && (
              <img
                src={pollutedImg}
                alt='오염된 강물'
                className='absolute top-0 left-0 max-w-full max-h-screen object-contain z-10 pointer-events-none'
              />
            )}
            {/* 공장 */}
            <div className='absolute top-[30%] left-[78%] transform -translate-x-1/2 -translate-y-1/2 w-[20%] z-20'>
              <Factory infraEventId={getInfraEventId('GAS')} />
            </div>
            {/* 법원 컴포넌트 - 배경 이미지 기준 상대적 위치 */}
            <div className='absolute top-[84%] left-[19%] transform -translate-x-1/2 -translate-y-1/2 w-[14%] z-20'>
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
