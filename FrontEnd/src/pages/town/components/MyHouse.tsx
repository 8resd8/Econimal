// 가정
import { useState, useMemo } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import houseImg from '@/assets/town/my-house.png';
import EventAlert from './EventAlert';

const MyHouse = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  // activeEvents : 현재 마을에서 활성화된 이벤트의 ID 목록을 저장하는 배열
  // API에서 받아온 이벤트 중 isActive: true인 이벤트들의 ID만 모아놓은 것

  // 해당 인프라(ELECTRICITY)의 최적/오염 상태 가져오기
  const isOptimal = useTownStore((state) => state.infraStatus.ELECTRICITY);

  // 이벤트가 활성화 되었는지 확인 -> 활성화 됐을 경우 CSS 효과(ex. 반짝반짝)
  // const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;
  // includes() : 배열에서 특정 요소가 존재하는지 확인하는 메서드
  // useMemo를 사용하여 계산 최적화
  const isActive = useMemo(
    () => (infraEventId ? activeEvents.includes(infraEventId) : false),
    [infraEventId, activeEvents],
  );

  return (
    // 외부에서 전달받은 className이 있으면 적용, 없으면 기본값 사용
    <div className={`relative ${className || ''}`}>
      <img
        className={`w-full h-auto cursor-pointer ${
          !isOptimal ? 'brightness-50 grayscale-[100%]' : ''
        }`}
        src={houseImg}
        alt='가정'
        onClick={() => setIsModalOpen(true)}
      />

      {/* 이벤트 발생 시 빨간 느낌표 표시 */}
      <EventAlert
        isActive={isActive}
        className='top-4 right-8 w-[25%] h-[25%] '
      />

      <NormalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        infraEventId={infraEventId}
        ecoType='ELECTRICITY'
      />
    </div>
  );
};

export default MyHouse;
