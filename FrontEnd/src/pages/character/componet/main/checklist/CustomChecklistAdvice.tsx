const CustomChecklistAdvice = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (bool: boolean) => void;
}) => {
  return (
    <div className='text-center p-6 border border-gray-200 rounded-xl bg-white shadow-md'>
      <h3 className='text-lg font-semibold text-slate-700 mb-2'>
        체크리스트가 비어있어요
      </h3>

      <button
        onClick={() => setIsModalOpen(true)}
        className='px-6 py-3 bg-blue-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold
        transition-colors duration-200'
      >
        + 체크리스트 추가하기
      </button>
    </div>
  );
};

export default CustomChecklistAdvice;
