// 하수처리장
import { useState } from 'react';
import NormalModal from './NormalModal';
import sewageImg from '@/assets/sewage-treatment-center.png';

const SewageTreatmentCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <img
        className='size-4/12 cursor-pointer'
        src={sewageImg}
        alt='하수처리장'
        onClick={() => setIsModalOpen(true)}
      />
      <NormalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
export default SewageTreatmentCenter;
