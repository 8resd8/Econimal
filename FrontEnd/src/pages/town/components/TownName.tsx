import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
// import { usePatchTownName } from '../features/useTownQuery';
// import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import { TownNameEditModal } from './TownNameEditModal';

const TownName = () => {
  const { townName, townId } = useTownStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className='flex items-center p-2 gap-2'>
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
        townId={townId}
      />
    </div>
  );
};
export default TownName;
