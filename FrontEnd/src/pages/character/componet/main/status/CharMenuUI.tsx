import { Menu } from 'lucide-react';

const CharMenuUI = ({ onClick }: { onClick: () => void }) => {
  // 메뉴에 버튼이 눌리는 기능만 있을거니까
  return (
    <button
      onClick={onClick}
    >
      <Menu className='w-8 h-8 text-blue-700' />
    </button>
  );
};

export default CharMenuUI;
