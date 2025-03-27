const ValidationResultModal = ({
  isOpen,
  validationData,
  onClose,
  onConfirm,
  onDelete,
}: {
  isOpen: boolean;
  validationData: {
    aiResponse: { point: number; reason: string };
    result: boolean;
    exp: number;
  } | null; // validationData가 null일 수 있음
  onClose: () => void;
  onConfirm: () => void;
  onDelete: () => void;
}) => {
  if (!isOpen || !validationData) return null; // 모달이 닫혀 있거나 데이터가 없으면 렌더링하지 않음

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[300px] relative'>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className='absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full'
        >
          닫기
        </button>

        {/* 메시지 */}
        <h3 className='font-bold mb-4'>검증 결과</h3>
        <p className='mb-4'>
          "{validationData.aiResponse.reason}";
          <br />
          그래도 추가할까요?
        </p>
        <p className='text-sm text-gray-500 mb-4'>
          환경 관련 체크리스트가 아니면 불합격 처리될 수 있어요.
        </p>

        {/* 결과 데이터 표시 */}
        <p className='text-sm text-gray-500 mb-4'>
          점수: {validationData.aiResponse.point}
        </p>
        <p className='text-sm text-gray-500 mb-4'>
          결과: {validationData.result ? '유효함' : '유효하지 않음'}
        </p>
        <p className='text-sm text-gray-500 mb-4'>
          경험치: {validationData.exp}
        </p>

        {/* 버튼 */}
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onDelete}
            className='px-4 py-2 bg-red-500 text-white rounded'
          >
            아니요. 지워주세요.
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-green-500 text-white rounded'
          >
            추가할래요!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationResultModal;
