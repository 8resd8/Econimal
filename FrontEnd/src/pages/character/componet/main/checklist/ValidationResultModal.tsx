import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ValidationResultModalProps {
  isOpen: boolean;
  validationData: {
    aiResponse: { point: number; reason: string };
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
  if (!isOpen || !validationData) return null; // 모달이 닫혀 있거나 데이터가 없으면 렌더링하지 않음

  // 검증 결과에 따라 아이콘 색상 결정
  const isValid = validationData.result;
  const iconBgColor = isValid ? 'bg-green-100' : 'bg-yellow-100';
  const iconColor = isValid ? 'text-green-500' : 'text-yellow-500';
  const borderColor = isValid ? 'border-green-100' : 'border-yellow-100';

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]'>
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 ${borderColor}`}
      >
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div
              className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center`}
            >
              <AlertTriangle className={`h-10 w-10 ${iconColor}`} />
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>검증 결과</h2>

          <div className='bg-gray-50 p-4 rounded-lg mb-4 text-left'>
            <p className='text-gray-600 mb-2'>
              {validationData.aiResponse.reason}
            </p>
            {!isValid && (
              <p className='text-sm text-red-500'>
                환경 관련 체크리스트가 아니면 불합격 처리될 수 있어요.
              </p>
            )}
          </div>

          {/* 결과 데이터 표시 */}
          <div className='flex justify-between items-center p-3 bg-gray-100 rounded-lg mb-4'>
            <div className='text-left'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500'>점수:</span>
                <span className='font-bold'>
                  {validationData.aiResponse.point}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500'>경험치:</span>
                <span className='font-bold'>{validationData.exp}</span>
              </div>
            </div>
            <div className='text-right'>
              <span
                className='px-3 py-1 rounded-full text-sm font-semibold ${
                validationData.result 
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }'
              >
                {validationData.result ? '유효함' : '유효하지 않음'}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-4'>
          <button
            onClick={onDelete}
            className='flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors duration-200'
          >
            삭제하기
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200'
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationResultModal;
