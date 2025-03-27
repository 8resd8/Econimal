import { useState } from 'react';
import { X } from 'lucide-react';

const CustomChecklistModal = ({
  newItemDescription,
  setIsModalOpen,
  setNewDescription,
  onAddItem,
  onValidateItem,
}) => {
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedDescription = newItemDescription.trim();

    // 5글자 이상인지 체크
    if (trimmedDescription.length < 5) {
      setError('최소 5글자 이상 입력해주세요');
      return;
    }

    // 유효성 검증 실행
    onValidateItem(trimmedDescription);
    setNewDescription(''); // 입력창 비우기
    setIsModalOpen(false); // 모달창 닫기
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]'>
      {/* 부모 요소에 맞춰서 검정 화면으로 감싼다. */}
      <div className='bg-white p-6 rounded-lg shadow-lg w-[300px] relative'>
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsModalOpen(false)}
          className='absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full'
        >
          <X className='w-5 h-5' />
        </button>

        {/* 하위 체크리스트 추가 목록 창 및 사용자 입력 창*/}
        <h3 className='font-bold mb-4'>새 체크리스트 추가</h3>
        <input
          type='text'
          placeholder='나만의 체크리스트 내용을 작성해주세요 (최소 5글자)'
          value={newItemDescription}
          onChange={(e) => {
            setNewDescription(e.target.value);
            setError(''); // 입력 시 에러 메시지 초기화
          }}
          className={`w-full p-2 border rounded mb-2 ${
            error ? 'border-red-500' : ''
          }`}
        />

        {/* 에러 메시지 */}
        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

        {/* 입력 길이 표시 */}
        <p className='text-xs text-gray-500 mb-4'>
          현재 {newItemDescription.trim().length}글자 / 최소 5글자
        </p>

        {/* 취소 & 추가하기 버튼 */}
        <div className='flex justify-end space-x-2'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='px-4 py-2 bg-gray-200 rounded'
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded ${
              newItemDescription.trim().length >= 5
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={newItemDescription.trim().length < 5}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomChecklistModal;
