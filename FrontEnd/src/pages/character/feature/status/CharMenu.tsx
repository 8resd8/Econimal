import ReactDOM from 'react-dom';
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
  const checklistContent = openChceklist && (
    <div className='fixed inset-y-0 right-0 w-[375px] max-w-full h-full bg-white shadow-xl transition-transform duration-300 transform translate-x-0 z-[9999]'>
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
  );

  return (
    <div>
      {/* 햄버거 메뉴 버튼 */}
      <button
        className='w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full flex items-center justify-center shadow-md
        hover:from-blue-200 hover:to-blue-100 transition-colors border-2 border-slate-200'
        onClick={handleOpenChecklist}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-6 h-6 text-blue-700'
        >
          <path d='M3.5 5.5l1.5 1.5l2.5 -2.5' />
          <path d='M3.5 11.5l1.5 1.5l2.5 -2.5' />
          <path d='M3.5 17.5l1.5 1.5l2.5 -2.5' />
          <path d='M11 6h9' />
          <path d='M11 12h9' />
          <path d='M11 18h9' />
        </svg>
      </button>

      {/* Portal을 통해 최상위로 렌더링 */}
      {ReactDOM.createPortal(checklistContent, document.body)}
      {/* 오른쪽 슬라이드 패널 */}
      {openChecklist && (
        <div
          className='fixed z-50 inset-y-0 right-0 w-[375px] max-w-full h-full bg-slate-50 shadow-xl
        transition-transform duration-300 transform translate-x-0 pb-4'
        >
          <div className='p-5 h-full max-h-screen overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold text-slate-700'>
                ✅ 나의 체크리스트
              </h2>
              <button
                onClick={handleCloseChecklist}
                className='p-2 hover:bg-gray-200 rounded-full transition-colors'
              >
                <X className='w-6 h-6 text-red-500' />
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
