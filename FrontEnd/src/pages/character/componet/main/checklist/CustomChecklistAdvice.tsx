const CustomChecklistAdvice = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (bool: boolean) => void;
}) => {
  return (
    <div className='text-center p-6 border rounded-lg bg-gray-50'>
      <p>아직 체크리스트가 없습니다.</p>
      <p>새로운 체크리스트를 추가해보세요!</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className='mt-4 px-6 py-2 bg-green-500 text-white rounded-lg'
      >
        체크리스트 추가하기
      </button>
    </div>
  );
};
export default CustomChecklistAdvice;
