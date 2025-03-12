// 법원
import { useState } from 'react';
import CourtModal from './CourtModal';
import courtImg from '@/assets/court.png';

const Court = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <img
        className='size-4/12 cursor-pointer'
        src={courtImg}
        alt='법원'
        onClick={() => setIsModalOpen(true)}
      />
      <CourtModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
export default Court;
