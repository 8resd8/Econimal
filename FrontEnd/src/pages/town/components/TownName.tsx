import { useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
// import { usePatchTownName } from '../features/useTownQuery';
// import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import { TownNameEditModal } from './TownNameEditModal';

const TownName = () => {
  const { townName } = useTownStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 마을 이름 5글자까지 보이기
  const MAX_LENGTH = 5;
  const formattedTownName =
    [...townName].length <= MAX_LENGTH
      ? townName
      : [...townName].slice(0, MAX_LENGTH).join('') + '...';

  // substring() : string 객체의 시작 인덱스로 부터 종료 인덱스 전 까지 문자열의 부분 문자열을 반환

  return (
    <div className='w-full'>
      <div className='relative flex items-center justify-center px-2 py-2 w-full text-slate-900 border-4 border-slate-700 rounded-lg bg-white/90'>
        {/* 마을 이름 + 마을 */}
        <div className='flex items-center gap-1 overflow-hidden max-w-[200px]'>
          <span className='font-bold overflow-hidden text-ellipsis whitespace-nowrap block'>
            {formattedTownName}
          </span>
          <span className='font-bold flex-shrink-0'>마을</span>
        </div>

        <div
          className='absolute right-3 cursor-pointer hover:bg-gray-300'
          onClick={() => setIsModalOpen(true)}
        >
          <FilePenLine size={16} />
        </div>
      </div>

      <TownNameEditModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentTownName={townName}
      />
    </div>
  );
};
export default TownName;
