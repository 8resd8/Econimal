// interface CharButtonProps {
//   handleEvent: () => void;
//   isSelect: boolean;
// }

const CharButton = ({
  handleEvent,
  isSelect,
}: {
  handleEvent: () => void;
  isSelect: boolean;
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        handleEvent();
      }}
      className='mt-4 rounded-full text-white px-4 py-2 bg-black/85 hover:bg-primary/70'
    >
      {isSelect ? '선택취소' : '선택하기'}
      {/* 선택 취소 */}
    </button>
  );
};

export default CharButton;
