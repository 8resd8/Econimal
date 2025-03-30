// 공장
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import factoryImg from '@/assets/town/factory.png';
import EventAlert from './EventAlert';

const Factory = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);

  // 해당 인프라(GAS)의 최적/오염 상태 가져오기
  const isOptimal = useTownStore((state) => state.infraStatus.GAS);

  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;

  return (
    <div className={`relative ${className || ''}`}>
      <img
        className={`w-full h-auto cursor-pointer
      ${!isOptimal ? 'brightness-50 grayscale-[100%]' : ''}`}
        src={factoryImg}
        alt='공장'
        onClick={() => setIsModalOpen(true)}
      />

      <EventAlert
        isActive={isActive}
        className='top-32 left-8 w-[18%] h-[15%]'
      />

      <NormalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        infraEventId={infraEventId}
        ecoType='GAS'
      />
    </div>
  );
};
export default Factory;
