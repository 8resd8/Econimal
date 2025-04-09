import { Clock } from 'lucide-react';

const LockedItemModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
      <div className='bg-white p-6 rounded-xl shadow-lg max-w-[600px] w-full border-4 border-blue-100'>
        <div className='text-center'>
          {/* 아이콘 추가 */}
          <div className='flex justify-center mb-4'>
            <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center'>
              <Clock className='h-8 w-8 text-blue-600' />
            </div>
          </div>

          {/* 제목 */}
          <h2 className='text-xl font-bold text-gray-800 mb-3'>
            추가 아이템 출시 예정입니다
          </h2>

          {/* 설명 */}
          <p className='text-gray-600 mb-4'>
            곧 새로운 아이템이 추가될 예정이니 기대해 주세요!
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className='flex justify-center mt-6'>
          <button
            onClick={onClose}
            className='px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition'
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedItemModal;
