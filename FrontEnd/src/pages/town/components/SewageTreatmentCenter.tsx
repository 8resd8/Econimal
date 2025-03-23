// 하수처리장
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import sewageImg from '@/assets/sewage-treatment-center.png';

const SewageTreatmentCenter = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;

  return (
    <div className={`${className || ''} ${isActive ? 'animate-puslse' : ''}`}>
      <img
        className='w-full h-auto cursor-pointer'
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
