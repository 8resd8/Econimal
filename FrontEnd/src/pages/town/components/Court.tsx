// 법원
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import CourtModal from './CourtModal';
import courtImg from '@/assets/court.png';

const Court = ({ infraEventId }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);

  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;

  return (
    <div className={`${isActive ? 'animate-pulse' : ''}`}>
      <img
        className='size-4/12 cursor-pointer'
        src={courtImg}
        alt='법원'
        onClick={() => infraEventId && setIsModalOpen(true)}
      />
      <CourtModal open={isModalOpen} onOpenChange={setIsModalOpen} infraEventId={infraEventId} />
    </div>
  );
};
export default Court;
