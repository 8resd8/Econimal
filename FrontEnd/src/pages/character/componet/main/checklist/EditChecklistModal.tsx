import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

      // 유효성 검증이 필요한 경우
      if (onValidateItem) {
        const validationResult = await onValidateItem(trimmedDescription);
        console.log('수정 내용 유효성 검증 결과:', validationResult);

        // 여기서 유효성 검증 결과에 따른 처리를 할 수 있습니다.
        // 예를 들어 검증 실패 시 사용자에게 알림을 줄 수 있습니다.
      }

      // 서버에 수정 사항 반영
      if (onEditItem) {
        onEditItem(item.checklistId, trimmedDescription);
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
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[300px] relative'>
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsModalOpen(false)}
          className='absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full'
          disabled={isLoading}
        >
          <X className='w-5 h-5' />
        </button>

        {/* 제목 */}
        <h3 className='font-bold mb-4'>체크리스트 수정</h3>

        {/* 입력 필드 */}
        <input
          type='text'
          placeholder='체크리스트 내용을 수정해주세요 (최소 5글자)'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError(''); // 입력 시 에러 메시지 초기화
          }}
          className={`w-full p-2 border rounded mb-2 ${
            error ? 'border-red-500' : ''
          }`}
          disabled={isLoading}
        />

        {/* 에러 메시지 */}
        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

        {/* 입력 길이 표시 */}
        <p className='text-xs text-gray-500 mb-4'>
          현재 {description.trim().length}글자 / 최소 5글자
        </p>

        {/* 버튼 영역 */}
        <div className='flex justify-end space-x-2'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors'
            disabled={isLoading}
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded ${
              description.trim().length >= 5 && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            } transition-colors`}
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
