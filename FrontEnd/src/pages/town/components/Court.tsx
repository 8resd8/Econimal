// 법원
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import CourtModal from './CourtModal';
import courtImg from '@/assets/town/court.png';

const Court = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);

  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;

  return (
    <div className={`${className || ''} ${isActive ? 'animate-pulse' : ''}`}>
      <img
        className='w-full h-auto cursor-pointer'
        src={courtImg}
        alt='법원'
        // onClick={() => infraEventId && setIsModalOpen(true)}
        onClick={() => setIsModalOpen(true)} // 이벤트 발생하지 않아도 모달 오픈
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
