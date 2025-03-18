// 하수처리장
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import sewageImg from '@/assets/sewage-treatment-center.png';

const SewageTreatmentCenter = ({ infraEventId }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;

  return (
    <div className={`${isActive ? 'animate-puslse' : ''}`}>
      <img
        className='size-4/12 cursor-pointer'
        src={sewageImg}
        alt='하수처리장'
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
export default SewageTreatmentCenter;
