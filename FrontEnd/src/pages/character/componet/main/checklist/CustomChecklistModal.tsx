import { useState } from 'react';
import { X, Check } from 'lucide-react';
import aiLoadingGif from '@/assets/ailoading.gif';

interface CustomChecklistModalProps {
  newItemDescription: string;
  setIsModalOpen: (isOpen: boolean) => void;
  setNewDescription: (description: string) => void;
  onAddItem?: (item: any) => void;
  onValidateItem: (description: string) => Promise<any>;
}

const CustomChecklistModal: React.FC<CustomChecklistModalProps> = ({
  newItemDescription,
  setIsModalOpen,
  setNewDescription,
  onValidateItem,
}) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedDescription = newItemDescription.trim();

    // 5글자 이상인지 체크
    if (trimmedDescription.length < 5) {
      setError('최소 5글자 이상 입력해주세요');
      return;
    }

    // 로딩 상태 시작
    setIsLoading(true);

    try {
      // 유효성 검증 실행 (비동기 작업)
      await onValidateItem(trimmedDescription);
      setNewDescription(''); // 입력창 비우기
    } catch (error) {
      console.error('체크리스트 검증 중 오류 발생:', error);
      setError('체크리스트를 추가하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 상태 종료
      setIsModalOpen(false); // 모달창 닫기
    }
  };

  return (
    <>
      {/* 메인 모달 */}
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4'>
        <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-5 border-4 border-blue-100 relative'>
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsModalOpen(false)}
            className='absolute top-4 right-4 p-1 hover:bg-slate-200 rounded-full z-10'
          >
            <X className='w-6 h-6 text-slate-700' />
          </button>

          {/* 로딩 상태일 때의 컨텐츠 */}
          {isLoading ? (
            <div className='flex flex-col items-center'>
              {/* 로딩 이미지와 메시지 */}
              <div className='w-full max-w-[200px] aspect-square mb-2'>
                <img 
                  src={aiLoadingGif} 
                  alt="로딩 중..." 
                  className="w-full h-full object-contain" 
                />
              </div>
              <p className="text-base font-medium text-gray-700 text-center">
                AI가 내용을 검사중이에요
              </p>
            </div>
          ) : (
            <>
              {/* 제목 및 아이콘 */}
              <div className='text-center mb-6'>
                <div className='flex justify-center mb-4'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
                    <Check className='h-10 w-10 text-blue-500' />
                  </div>
                </div>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                  새 체크리스트 추가
                </h2>
              </div>

              {/* 입력 필드 */}
              <div className='mb-6'>
                <input
                  type='text'
                  placeholder='오늘은 어떠한 행동으로 지구를 지킬까요?'
                  value={newItemDescription}
                  onChange={(e) => {
                    setNewDescription(e.target.value);
                    setError(''); // 입력 시 에러 메시지 초기화
                  }}
                  className={`w-full p-3 border-2 rounded-xl mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    error ? 'border-red-300' : 'border-slate-300'
                  }`}
                />

                {/* 에러 메시지 */}
                {error && <p className='text-red-500 text-sm mb-1'>{error}</p>}

                {/* 입력 길이 표시 */}
                <p className='text-sm text-gray-500'>
                  현재 {newItemDescription.trim().length}글자 / 최소 5글자
                </p>
              </div>

              {/* 버튼 영역 */}
              <div className='flex gap-4'>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl
                  font-bold transition-colors duration-200'
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                    newItemDescription.trim().length >= 5 &&
                    newItemDescription.trim().length <= 50
                      ? 'bg-blue-300 hover:bg-blue-400 text-slate-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={
                    isLoading ||
                    newItemDescription.trim().length < 5 ||
                    newItemDescription.length > 50
                  }
                >
                  추가하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomChecklistModal;