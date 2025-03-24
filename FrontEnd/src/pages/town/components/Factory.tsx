// 공장
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import factoryImg from '@/assets/town/factory.png';

const Factory = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;
  // const sewageStatus = useTownStore((state) => state.sewageStatus);

  // const showImage = sewageStatus === 'polluted' ? pollutedImg : sewageImg;

  return (
    <div
      className={`relative ${className || ''} ${
        isActive ? 'animate-pulse' : ''
      }`}
    >
      <img
        className='w-full h-auto cursor-pointer'
        src={factoryImg}
        alt='공장'
        // onClick={() => infraEventId && setIsModalOpen(true)}
        onClick={() => setIsModalOpen(true)} // 이벤트 발생하지 않아도 모달 오픈
      />
      <NormalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        infraEventId={infraEventId}
      />
    </div>
  );
};
export default Factory;
