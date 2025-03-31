const SuccessPurchaseModal = ({
  characterName,
  onClose,
}: {
  characterName: string;
  onClose: () => void;
}) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
      <div className='bg-white p-5 rounded-xl shadow-lg max-w-[600px] w-full border-4 border-green-100'>
        <div className='text-center'>
          {/* 아이콘 */}
          <div className='flex justify-center mb-4'>
            <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-green-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          </div>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>구매 성공!</h2>
          <p className='text-gray-600 text-sm'>
            <span className='font-semibold text-green-600'>
              {characterName}
            </span>
            이(가) 정상적으로 구매되었습니다.
          </p>
        </div>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className='w-full mt-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition'
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SuccessPurchaseModal;
