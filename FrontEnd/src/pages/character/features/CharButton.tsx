const CharButton = ({ handleEvent }: { handleEvent: () => void }) => {
  return (
    <button
      onClick={handleEvent}
      className='mt-4 rounded-full text-white px-4 py-2 bg-black/85 hover:bg-primary/70'
    >
      선택하기
    </button>
  );
};

export default CharButton;
