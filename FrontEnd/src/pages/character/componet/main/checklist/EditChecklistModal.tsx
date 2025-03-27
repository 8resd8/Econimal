import { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';

interface ChecklistItemType {
  checklistId: string;
  description: string;
  exp: number;
  isComplete: boolean;
}

interface EditChecklistModalProps {
  item: ChecklistItemType;
  setIsModalOpen: (isOpen: boolean) => void;
  onEditItem?: (id: string, description: string) => void;
  onValidateItem?: (description: string) => Promise<any>;
}

const EditChecklistModal: React.FC<EditChecklistModalProps> = ({
  item,
  setIsModalOpen,
  onEditItem,
  onValidateItem,
}) => {
  const [description, setDescription] = useState(item.description);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트가 마운트될 때 현재 항목 설명을 상태에 설정
  useEffect(() => {
    setDescription(item.description);
    console.log('수정 모달 오픈됨:', item);
  }, [item]);

  const handleSubmit = async () => {
    const trimmedDescription = description.trim();

    // 5글자 이상인지 체크
    if (trimmedDescription.length < 5) {
      setError('최소 5글자 이상 입력해주세요');
      return;
    }

    // 내용이 변경되지 않았으면 그냥 닫기
    if (trimmedDescription === item.description) {
      setIsModalOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('수정 시작:', item.checklistId, trimmedDescription);

      // 유효성 검증이 필요한 경우
      if (onValidateItem) {
        const validationResult = await onValidateItem(trimmedDescription);
        console.log('수정 내용 유효성 검증 결과:', validationResult);
      }

      // 서버에 수정 사항 반영
      if (onEditItem) {
        console.log('onEditItem 호출:', item.checklistId, trimmedDescription);
        onEditItem(item.checklistId, trimmedDescription);
      } else {
        console.error('onEditItem 함수가 없습니다');
      }

      // 모달 닫기
      setIsModalOpen(false);
    } catch (error) {
      console.error('체크리스트 수정 중 오류 발생:', error);
      setError('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 border-blue-100'>
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsModalOpen(false)}
          className='absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full'
          disabled={isLoading}
        >
          <X className='w-6 h-6 text-gray-500' />
        </button>

        {/* 제목 및 아이콘 */}
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
              <Edit className='h-10 w-10 text-blue-500' />
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>
            체크리스트 수정
          </h2>
        </div>

        {/* 입력 필드 */}
        <div className='mb-6'>
          <input
            type='text'
            placeholder='체크리스트 내용을 수정해주세요 (최소 5글자)'
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(''); // 입력 시 에러 메시지 초기화
            }}
            className={`w-full p-3 border-2 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />

          {/* 에러 메시지 */}
          {error && <p className='text-red-500 text-sm mb-1'>{error}</p>}

          {/* 입력 길이 표시 */}
          <p className='text-sm text-gray-500'>
            현재 {description.trim().length}글자 / 최소 5글자
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-4'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors duration-200'
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors duration-200 ${
              description.trim().length >= 5 && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={description.trim().length < 5 || isLoading}
          >
            {isLoading ? '처리 중...' : '수정하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditChecklistModal;
