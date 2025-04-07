import { useEffect, useState, Suspense, useMemo } from 'react';
import Court from './components/Court';
import MyHouse from './components/MyHouse';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import TownName from './components/TownName';
import Factory from './components/Factory';
import town from '@/assets/town/baisc-town.png'; // 배경
import GoMainBtn from '@/components/GoMainBtn';
import { useGetTownEvents } from './features/useTownQuery';
import { useTownStore } from '@/store/useTownStore';
import { TownEvent, TownEventsResponse } from './features/townApi';
import pollutedImg from '@/assets/town/polluted-river.png';

import LoadingScreen from '@/components/LoadingScreen';

// 하위 컴포넌트로 전달할 인프라 아이디 타입
export interface TownProps {
  infraEventId?: number;
  className?: string; // className 속성 추가하여 스타일 전달 가능하게 함
  onClick?: () => void;
}

// TownContent에 전달할 props 타입 정의
interface TownContentProps {
  data: TownEventsResponse; // 타입 명시적 지정
}

// 실제 마을 컨텐츠 분리 - 이 컴포넌트는 데이터가 준비된 경우에만 렌더링됨
const TownContent = ({ data }: TownContentProps) => {
  const infraStatus = useTownStore((state) => state.infraStatus);

  const townEventsData = data;
  // [수정] useMemo로 이벤트 ID 매핑 최적화
  const infraEventMap = useMemo(() => {
    if (!townEventsData?.townStatus) return {};

    return townEventsData.townStatus.reduce((acc, event) => {
      if (event.isActive) {
        acc[event.ecoType] = event.infraEventId;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [townEventsData]);

  // 각 인프라에 해당 이벤트ID 전달하는 함수
  // const getInfraEventId = (ecoType: string) => {
  //   if (!townEventsData?.townStatus) return undefined;

  //   const infraEvent = townEventsData.townStatus.find(
  //     (e: TownEvent) => e.ecoType === ecoType && e.isActive,
  //   );
  //   return infraEvent ? infraEvent.infraEventId : undefined;
  // };
  const getInfraEventId = (ecoType: string): number | undefined => {
    return infraEventMap[ecoType];
  };

  return (
    // 전체 화면을 차지하는 컨테이너
    <div className='fixed inset-0 overflow-hidden'>
      {/* 배경 이미지 - 전체 화면 채우기 */}
      <div className='absolute inset-0 w-full h-full'>
        <img
          src={town}
          alt='마을'
          className='w-full h-full object-cover'
          loading='eager'
        />

        {/* 오염된 강물 오버레이 - 하수처리장이 오염 상태일 때만 표시 */}
        {!infraStatus.WATER && (
          <img
            src={pollutedImg}
            alt='오염된 강물'
            className='absolute inset-0 w-full h-full object-cover z-10 pointer-events-none'
          />
        )}

        {/* 홈으로 가는 버튼 */}
        <div className='absolute top-[5%] left-[3%] w-[10%] z-30'>
          <GoMainBtn />
        </div>

        {/* 마을 이름 - 항상 상단 중앙에 위치 */}
        <div className='absolute top-[6%] left-[50%] transform -translate-x-1/2 w-[20%] z-30'>
          <TownName />
        </div>

        {/* 가정 컴포넌트 - 화면 비율에 맞게 상대적 위치 */}
        <div className='absolute top-[58%] left-[86%] transform -translate-x-1/2 -translate-y-1/2 w-[15%] z-20'>
          <MyHouse infraEventId={getInfraEventId('ELECTRICITY')} />
        </div>

        {/* 하수처리장 컴포넌트 */}
        <div className='absolute top-[51%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-[13%] z-20'>
          <SewageTreatmentCenter infraEventId={getInfraEventId('WATER')} />
        </div>

        {/* 공장 */}
        <div className='absolute top-[30%] left-[78%] transform -translate-x-1/2 -translate-y-1/2 w-[20%] z-20'>
          <Factory infraEventId={getInfraEventId('GAS')} />
        </div>

        {/* 법원 컴포넌트 */}
        <div className='absolute top-[84%] left-[19%] transform -translate-x-1/2 -translate-y-1/2 w-[14%] z-20'>
          <Court infraEventId={getInfraEventId('COURT')} />
        </div>
      </div>
    </div>
  );
};

// 메인 Town 컴포넌트 - 로딩 상태 관리 및 데이터 페칭
const Town = () => {
  // 로딩 완료 여부를 추적하는 상태
  const [isAppReady, setIsAppReady] = useState(false);

  // 마을 상황 조회
  const { data, isLoading, error } = useGetTownEvents();

  // 이미지 사전 로딩
  useEffect(() => {
    // 주요 이미지들 사전 로딩
    const preloadImages = async () => {
      const imagesToPreload = [town, pollutedImg];

      const preloadPromises = imagesToPreload.map((imgSrc) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = imgSrc;
          img.onload = resolve;
          img.onerror = resolve; // 에러가 나도 계속 진행
        });
      });

      // 모든 이미지 로딩 대기
      await Promise.all(preloadPromises);
    };

    // 데이터가 있고 로딩이 완료됐을 때만 준비 상태로 설정
    if (!isLoading && data) {
      // 이미지 프리로딩 및 렌더링 지연
      preloadImages().then(() => {
        // 약간의 지연을 추가하여 로딩 화면이 깔끔하게 전환되도록 함
        setTimeout(() => {
          setIsAppReady(true);
        }, 300);
      });
    }
  }, [isLoading, data]);

  // 로딩 중이거나 준비되지 않은 경우 로딩 화면 표시
  if (isLoading || !data || !isAppReady) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10000,
          backgroundColor: '#ffffff',
        }}
      >
        <LoadingScreen />
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return <div>오류가 발생했습니다: {(error as Error).message}</div>;
  }

  // 준비되었을 때만 마을 콘텐츠 렌더링
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TownContent data={data} />
    </Suspense>
  );
};

export default Town;
