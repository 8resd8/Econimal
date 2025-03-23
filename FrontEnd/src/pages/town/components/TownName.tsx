import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
// import { usePatchTownName } from '../features/useTownQuery';
// import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import { TownNameEditModal } from './TownNameEditModal';

const TownName = () => {
  const { townName } = useTownStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='w-full'>
      <div className='flex justify-center items-center p-2 gap-2 w-full'>
        {townName ? `${townName} 마을` : '기본 마을'}
        <div
          className='cursor-pointer hover:bg-gray-200'
          onClick={() => setIsModalOpen(true)}
        >
          <FilePenLine size={20} />
        </div>
      </div>
      <TownNameEditModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentTownName={townName}
      />
    </div>
  );
};
export default TownName;
