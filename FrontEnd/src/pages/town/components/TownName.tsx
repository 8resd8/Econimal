import { useState } from 'react';
import { create } from 'zustand';
// import { usePatchTownName } from '../features/useTownQuery';
// import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import { TownNameEditModal } from './TownNameEditModal';

// 주스탄드가 필요한가
export const useUserStore = create((set) => ({
  user: {
    townName: '',
  },
}));

const TownName = () => {
  // 임시 데이터
  const [userData, setUserData] = useState({
    townName: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { data } = usePatchTownName();
  // const { townname } = data || { townname: '기본값' };

  const handleSaveTownName = (newName: string) => {
    setUserData({ townName: newName });
    // patchTownName(newName) // 탠스택쿼리 쓰면 탠스택쿼리로 해야될 것 같은데...
  };

  return (
    <div>
      <div className='flex items-center p-2 gap-2'>
        {userData.townName ? `${userData.townName} 마을` : '기본 마을'}
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
        currentTownName={userData.townName}
      />
    </div>
  );
};
export default TownName;
