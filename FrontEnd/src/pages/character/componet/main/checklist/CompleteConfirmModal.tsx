import React from 'react';
import { HelpCircle } from 'lucide-react';

interface CompleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemDescription: string;
}

const CompleteConfirmModal: React.FC<CompleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4'>
      <div className='bg-white p-6 rounded-xl shadow-md w-[90%] max-w-[400px] max-h-[90vh] overflow-y-auto'>
        <div className='text-center'>
          {/* 아이콘 */}
          <div className='flex justify-center mb-3'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <HelpCircle className='h-8 w-8 text-blue-600' />
            </div>
          </div>

          {/* 제목 */}
          <h2 className='text-lg font-semibold text-gray-800 mb-3'>
            완료 확인
          </h2>

          {/* 설명 */}
          <p className='text-gray-700 text-sm mb-4'>
            정말로 이 체크리스트를 완료하시겠습니까?
          </p>

          {/* 체크리스트 내용 */}
          <div className='bg-gray-100 p-3 rounded-lg text-left max-h-[150px] overflow-y-auto text-sm'>
            <p className='text-gray-900 font-medium break-words'>
              {itemDescription}
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-3 mt-5'>
          <button
            onClick={onClose}
            className='flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition'
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition'
          >
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteConfirmModal;
