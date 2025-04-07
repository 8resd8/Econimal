// 법원
import { useState, useMemo } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import CourtModal from './CourtModal';
import courtImg from '@/assets/town/court.png';
import EventAlert from './EventAlert';

const Court = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);

  // const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;
  // [수정] useMemo 추가
  const isActive = useMemo(
    () => (infraEventId ? activeEvents.includes(infraEventId) : false),
    [infraEventId, activeEvents],
  );

  return (
    <div className={`${className || ''}`}>
      <img
        className='w-full h-auto cursor-pointer'
        src={courtImg}
        alt='법원'
        // onClick={() => infraEventId && setIsModalOpen(true)}
        // 클릭되게 할 것이라면 쓰로틀링이라던가...사용자가 연속적으로 불필요한 요청을 보냈을 때 막아놔야하지 않을까
        onClick={() => setIsModalOpen(true)} // 이벤트 발생하지 않아도 모달 오픈
      />

      {/* 이벤트 발생 시 빨간 느낌표 표시 */}
      <EventAlert
        isActive={isActive}
        className='top-10 right-5 w-[28%] h-[20%] '
      />

      <CourtModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        infraEventId={infraEventId}
      />
    </div>
  );
};

export default Court;
