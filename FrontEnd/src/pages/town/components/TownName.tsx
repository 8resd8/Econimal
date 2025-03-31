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
      <div className='relative flex items-center justify-center px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-2.5 md:py-2 lg:px-3 lg:py-2.5 xl:px-3.5 xl:py-3 text-slate-900 border-2 border-slate-800 sm:border-1 rounded-lg bg-white/90'>
        {/* 마을 이름 + 마을 */}
        {/* <div className='flex items-center gap-2 sm:gap-4 overflow-hidden max-w-[80%]'> */}
        <div className='flex items-center gap-2 sm:text-sm md:text-base overflow-hidden max-w-[80%]'>
          {/* <span className='text-xs sm:text-sm md:text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap block'> */}
          <span className='text-[10px] xs:text-xs sm:text-sm md:text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap block'>
            {formattedTownName}
          </span>
          {/* <span className='text-xs sm:text-sm md:text-base font-bold flex-shrink-0'> */}
          <span className='text-[10px] xs:text-xs sm:text-sm md:text-base font-bold flex-shrink-0'>
            마을
          </span>
        </div>

        <div
          // className='absolute right-3 cursor-pointer hover:bg-gray-300'
          className='right-1 sm:right-4 md:right-1 cursor-pointer hover:bg-gray-300 rounded p-0.5'
          onClick={() => setIsModalOpen(true)}
        >
          {/* <FilePenLine size={16} className='sm:w-4 sm:h-4 md:w-5 md:h-5' /> */}
          <FilePenLine
            size={10}
            className='absolute top-[30%] right-[6%] w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 '
          />
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
