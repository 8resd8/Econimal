import React from 'react';
import { Check } from 'lucide-react';

interface CompleteChecklistModalProps {
  onClose: () => void;
  exp: number;
}

const CompleteChecklistModal: React.FC<CompleteChecklistModalProps> = ({
  onClose,
  exp,
}) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 border-blue-100'>
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
              <Check className='h-10 w-10 text-blue-500' />
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            체크리스트 완료!
          </h2>
          <p className='text-gray-600 mb-4'>
            환경 보호 활동을 실천해주셔서 감사합니다.
          </p>
          <div className='flex items-center justify-center space-x-2 mb-2'>
            <span className='text-xl font-bold text-blue-600'>+{exp}</span>
            <span className='text-gray-600'>경험치를 획득했습니다!</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200'
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CompleteChecklistModal;
