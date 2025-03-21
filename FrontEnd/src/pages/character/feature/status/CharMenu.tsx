// CharMenu.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import CharMenuUI from '../../componet/main/status/CharMenuUI';
import CharChecklist from '../../componet/main/checklist/CharChecklist';


export function CharMenu() {
  const [openChecklist, setOpenChecklist] = useState(false);

  const handleOpenChecklist = () => {
    setOpenChecklist(true);
  };

  const handleCloseChecklist = () => {
    setOpenChecklist(false);
  };

  return (
    <div>
      <CharMenuUI onClick={handleOpenChecklist} />
      {openChecklist && (
        <div className='fixed inset-y-0 right-0 w-[400px] bg-white shadow-xl transition-transform duration-300 transform translate-x-0'>
          <div className='p-6 h-full overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold'>오늘의 체크리스트</h2>
              <button
                onClick={handleCloseChecklist}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <CharChecklist />
          </div>
        </div>
      )}
    </div>
  );
}

export default CharMenu;
