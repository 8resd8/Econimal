import { X } from 'lucide-react';
import { useState } from 'react';
import CharChecklist from '../../componet/main/checklist/CharChecklist';
import CharMenuUI from '../../componet/main/status/CharMenuUI';

const CharMenu = () => {
  const [openChecklist, setOpenChecklist] = useState(false);
  const handleOpenChecklist = () => {
    setOpenChecklist(true);
  };

  return (
    <div>
      <CharMenuUI onClick={handleOpenChecklist} />
      <div className='fixed right-0 top-0 h-full z-50'>
        {openChecklist && (
          <div>
            <div className='fixed inset-y-0 right-0 bg-white/95 w-[400px] shadow-2xl p-6 space-y-4 overflow-y-auto'>
              {/* 체크리스트 헤더 */}
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold'>오늘의 체크리스트</h2>
                <button
                  // onClick={onClose}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>
            <CharChecklist />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharMenu;
