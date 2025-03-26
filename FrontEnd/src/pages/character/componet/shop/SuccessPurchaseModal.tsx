const SuccessPurchaseModal = ({
  characterName,
  onClose,
}: {
  characterName: string;
  onClose: () => void;
}) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 border-green-100'>
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 text-green-500'
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
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>구매 성공!</h2>
          <p className='text-gray-600'>
            <span className='font-semibold text-green-600'>
              {characterName}
            </span>
            이(가) 정상적으로 구매되었습니다
          </p>
        </div>
        <button
          onClick={onClose}
          className='w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors duration-200'
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SuccessPurchaseModal;
