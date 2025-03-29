import { useState } from 'react';
import { X } from 'lucide-react';
import CharChecklist from '../../componet/main/checklist/CharChecklist';
// import CharChecklist from '../../componet/main/checklist/CharChecklistI';
//컴포넌트 분리구조 내용

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
      {/* 햄버거 메뉴 버튼 */}
      <button
        className='w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-md hover:from-blue-200 hover:to-blue-100 transition-colors border-2 border-blue-300'
        onClick={handleOpenChecklist}
      >
        <svg
          width='24'
          height='24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M4 6h16M4 12h16M4 18h16' />
        </svg>
      </button>

      {/* 오른쪽 슬라이드 패널 */}
      {openChecklist && (
        <div className='fixed inset-y-0 right-0 w-[375px] max-w-full h-full bg-white shadow-xl transition-transform duration-300 transform translate-x-0'>
          <div className='p-6 h-full max-h-screen overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-blue-700'>
                📖 나의 체크리스트
              </h2>
              <button
                onClick={handleCloseChecklist}
                className='p-2 hover:bg-gray-200 rounded-full transition-colors'
              >
                <X className='w-5 h-5 text-red-500' />
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
