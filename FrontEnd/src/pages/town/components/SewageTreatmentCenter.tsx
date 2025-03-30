// 하수처리장
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import sewageImg from '@/assets/town/sewage-treatment-center.png';
import EventAlert from './EventAlert';

const SewageTreatmentCenter = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;
  // 해당 인프라(WATER)의 상태 가져오기
  const isOptimal = useTownStore((state) => state.infraStatus.WATER);

  return (
    <div className={`relative ${className || ''}`}>
      <img
        className={`w-full h-auto cursor-pointer ${!isOptimal ? 'brightness-50 grayscale-[100%]' : ''}`}
        src={sewageImg}
        alt='하수처리장'
        onClick={() => setIsModalOpen(true)}
      />

      <EventAlert isActive={isActive} className='top-10 left-4 w-[29%] h-[20%]' />

      <NormalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        infraEventId={infraEventId}
        ecoType='WATER'
      />
    </div>
  );
};
export default SewageTreatmentCenter;
