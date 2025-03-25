// 분리수거장
import { useState } from 'react';
import NormalModal from './NormalModal';
import recyclingImg from '@/assets/town/recycling-center.png';

const RecyclingCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <img
        className='size-4/12 cursor-pointer'
        src={recyclingImg}
        alt='분리수거장'
        onClick={() => setIsModalOpen(true)}
      />
      <NormalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default RecyclingCenter;
