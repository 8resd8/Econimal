// 하수처리장
import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { TownProps } from '../Town';
import NormalModal from './NormalModal';
import sewageImg from '@/assets/town/sewage-treatment-center.png';

const SewageTreatmentCenter = ({ infraEventId, className }: TownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeEvents = useTownStore((state) => state.activeEvents);
  const isActive = infraEventId ? activeEvents.includes(infraEventId) : false;
  // 해당 인프라(WATER)의 상태 가져오기
  const isOptimal = useTownStore((state) => state.infraStatus.WATER);

  return (
    <div
      className={`relative ${className || ''} ${
        isActive ? 'animate-pulse' : ''
      }`}
    >
      <img
        className={`w-full h-auto cursor-pointer ${
          !isOptimal ? 'opacity-70' : '' // 오염 상태(false)일 때 이미지를 약간 흐리게 표시
        }`}
        src={sewageImg}
        alt='하수처리장'
        onClick={() => setIsModalOpen(true)}
      />
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
