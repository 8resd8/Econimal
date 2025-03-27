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
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 border-blue-100'>
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
              <HelpCircle className='h-10 w-10 text-blue-500' />
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>완료 확인</h2>

          <p className='text-gray-600 mb-6'>
            정말로 이 체크리스트를 완료하시겠습니까?
          </p>

          <div className='bg-gray-50 p-4 rounded-lg mb-4 text-left'>
            <p className='text-gray-800 font-medium'>{itemDescription}</p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors duration-200'
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors duration-200'
          >
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteConfirmModal;
