// 가정
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import houseImg from '@/assets/my-house.png';

const MyHouse = ({infraEventId}: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  // activeEvents : 현재 마을에서 활성화된 이벤트의 ID 목록을 저장하는 배열
  // API에서 받아온 이벤트 중 isActive: true인 이벤트들의 ID만 모아놓은 것

  // 이벤트가 활성화 되었는지 확인 -> 활성화 됐을 경우 CSS 효과(ex. 반짝반짝)
  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;
  // includes() : 배열에서 특정 요소가 존재하는지 확인하는 메서드

  return (
    <div className='relative'>
      <img
        className={`size-4/12 cursor-pointer ${
          isActive ? 'animate-pulse' : ''
        }`} // 이벤트 발생한 건물 깜빡이기
        src={houseImg}
        alt='가정'
        onClick={() => infraEventId && setIsModalOpen(true)}
      />
      <NormalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        infraEventId={infraEventId}
      />
    </div>
  );
};

export default MyHouse;
