import { ShoppingCart } from 'lucide-react';

const BuyModal = ({
  confirmPurchase,
  setShowModal,
  characterName,
  price,
}: {
  confirmPurchase: () => void;
  setShowModal: (bool: boolean) => void;
  characterName: string;
  price: number;
}) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
      <div className='bg-white p-6 rounded-xl shadow-lg max-w-[600px] w-full border-4 border-blue-100'>
        <div className='text-center'>
          {/* 아이콘 추가 */}
          <div className='flex justify-center mb-4'>
            <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center'>
              <ShoppingCart className='h-8 w-8 text-blue-600' />
            </div>
          </div>

          {/* 제목 */}
          <h2 className='text-xl font-bold text-gray-800 mb-3'>
            구매하시겠습니까?
          </h2>

          {/* 설명 */}
          <p className='text-gray-600 text-sm mb-1'>
            아이템: <span className='font-semibold'>{characterName}</span>
          </p>
          <p className='text-gray-600 text-sm'>
            가격: <span className='font-semibold'>{price} 코인</span>
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-3 mt-6'>
          <button
            // 이떄 서버 fetching 성공해야 함
            onClick={confirmPurchase}
            className='flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition'
          >
            구매 확인
          </button>
          <button
            onClick={() => setShowModal(false)}
            className='flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition'
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
