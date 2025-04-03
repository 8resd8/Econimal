import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ValidationResultModalProps {
  isOpen: boolean;
  validationData: {
    aiResponse: { reason: string };
    result: boolean;
    exp: number;
  } | null;
  onClose: () => void;
  onConfirm: () => void;
  onDelete: () => void;
}

const ValidationResultModal: React.FC<ValidationResultModalProps> = ({
  isOpen,
  validationData,
  onClose,
  onConfirm,
  onDelete,
}) => {
  if (!isOpen || !validationData) return null;

  // 검증 결과 스타일 결정
  const isValid = validationData.result;
  const iconBgColor = isValid ? 'bg-green-100' : 'bg-yellow-100';
  const iconColor = isValid ? 'text-green-500' : 'text-yellow-500';
  const borderColor = isValid ? 'border-green-200' : 'border-yellow-200';

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4'>
      <div
        className={`bg-white p-5 rounded-xl shadow-lg border-4 ${borderColor} 
        max-w-[600px] w-full max-h-[90vh] flex flex-col justify-between`}
      >
        {/* 헤더 */}
        <div className='flex flex-col justify-center items-center mb-1'>
          <div className='flex justify-center  mb-3'>
            <div
              className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}
            >
              <AlertTriangle className={`h-8 w-8 ${iconColor}`} />
            </div>
          </div>
          <h2 className='text-lg font-semibold text-gray-800 mb-3'>
            검증 결과
          </h2>

          {/* 검증 내용 */}
          <div className='bg-gray-100 p-3 rounded-lg mb-3 text-left text-xs max-w-full'>
            <p className='text-gray-700'>{validationData.aiResponse.reason}</p>
            {/* {!isValid && (
              <p className='text-xs text-red-500 mt-2'>
                환경 관련 체크리스트가 아니면 불합격 처리될 수 있어요.
              </p>
            )} */}
          </div>
        </div>

        {/* 결과 및 버튼 */}
        <div className='flex flex-col gap-2 mt-auto'>
          <div className='flex justify-between items-center p-3 bg-gray-100 rounded-lg'>
            {/* 경험치 표시 */}
            <div className='text-left'>
              <span className='text-sm text-gray-600'>경험치:</span>
              <span className='ml-2 font-bold text-lg text-gray-900'>
                {validationData.exp} XP
              </span>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                validationData.result
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {validationData.result ? '유효함' : '유효하지 않음'}
            </span>
          </div>

          {/* 버튼 영역 */}
          <div className='flex gap-2 justify-between'>
            <button
              onClick={onDelete}
              className='w-full sm:w-[35%] py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition mt-1'
            >
              삭제하기
            </button>
            <button
              onClick={onConfirm}
              className='w-full sm:w-[35%] py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition mt-1'
            >
              추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationResultModal;
