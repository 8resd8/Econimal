import { Check } from 'lucide-react';

interface SelectionModalProps {
  status: 'loading' | 'success';
  characterName: string;
  onClose: () => void;
}

const SelectionModal = ({
  status,
  characterName,
  onClose,
}: SelectionModalProps) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]'>
      <div className='bg-white p-6 rounded-xl shadow-lg max-w-[600px] w-full border-4 border-blue-100'>
        <div className='text-center'>
          {/* 아이콘 추가 */}
          <div className='flex justify-center mb-4'>
            <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center'>
              {status === 'loading' ? (
                <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <Check className='h-8 w-8 text-blue-600' />
              )}
            </div>
          </div>

          {/* 제목 */}
          <h2 className='text-xl font-bold text-gray-800 mb-3'>
            {status === 'loading' ? '선택 중...' : '선택 완료!'}
          </h2>

          {/* 설명 */}
          <p className='text-gray-600 text-sm mb-1'>
            <span className='font-semibold'>{characterName}</span>
          </p>
        </div>

        {/* 버튼 영역 */}
        {status === 'success' && (
          <div className='flex mt-6'>
            <button
              onClick={onClose}
              className='flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition'
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionModal;
