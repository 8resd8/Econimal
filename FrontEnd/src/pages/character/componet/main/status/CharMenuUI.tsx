import { Menu } from 'lucide-react';

const CharMenuUI = ({ onClick }: { onClick: () => void }) => {
  // 메뉴에 버튼이 눌리는 기능만 있을거니까
  return (
    <button
      className='w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-md hover:from-blue-200 hover:to-blue-100 transition-colors border-2 border-blue-300'
      onClick={onClick}
    >
      <Menu className='w-8 h-8 text-blue-700' />
    </button>
  );
};

export default CharMenuUI;
