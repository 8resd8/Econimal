// 가정
import { useState } from 'react';
import NormalModal from './NormalModal';
import houseImg from '@/assets/my-house.png';

const MyHouse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <img
        className='size-4/12 cursor-pointer'
        src={houseImg}
        alt='가정'
        onClick={() => setIsModalOpen(true)}
      />
      <NormalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default MyHouse;
