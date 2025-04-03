import { useState } from 'react';
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
  onValidateItem: (description: string) => Promise<any>;
}

const EditChecklistModal: React.FC<EditChecklistModalProps> = ({
  item,
  setIsModalOpen,
  onEditItem,
  onValidateItem,
}) => {
  const [description, setDescription] = useState(item.description);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setErrorMessage('체크리스트 항목을 입력해주세요.');
      return;
    }

    if (description.trim() === item.description) {
      setIsModalOpen(false);
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    try {
      // 유효성 검증 로직 추가
      // 유효성 검증은 상위 컴포넌트의 handleValidationResult에서 처리하도록 함
      await onValidateItem(description);
      setIsValidating(false);
      setIsModalOpen(false);
    } catch (error) {
      setIsValidating(false);
      setErrorMessage('유효성 검증 중 오류가 발생했습니다.');
      console.error('유효성 검증 오류:', error);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4'>
      <div className='bg-white rounded-xl shadow-lg max-w-md w-full p-5'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>체크리스트 수정</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className='p-1 rounded-full hover:bg-gray-100'
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              체크리스트 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              rows={3}
              placeholder='환경 보호 관련 체크리스트를 입력해주세요'
            />
            {errorMessage && (
              <p className='mt-1 text-sm text-red-500'>{errorMessage}</p>
            )}
          </div>

          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={() => setIsModalOpen(false)}
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={isValidating}
              className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition'
            >
              {isValidating ? '검증 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChecklistModal;
