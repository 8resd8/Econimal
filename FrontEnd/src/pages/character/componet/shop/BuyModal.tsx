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
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        {/* 현재 아이템 가격과 아이템 이름  */}
        <h2 className='text-xl font-bold mb-4'>구매하시겠습니까?</h2>
        <p>아이템: {characterName}</p>
        <p>가격: {price} 코인</p>

        {/* 구매와 관련된 버튼 */}
        <div className='flex gap-4 mt-4'>
          <button
            onClick={confirmPurchase}
            className='px-4 py-2 bg-green-500 text-white rounded-md'
          >
            구매 확인
          </button>
          <button
            onClick={() => setShowModal(false)}
            className='px-4 py-2 bg-red-500 text-white rounded-md'
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
