import { motion } from 'framer-motion';
import CharNextChap from './CharNextChap';
import { CharacterDetailProps } from '../../types/CharacterDetailProps';

interface CharacterDetailCardType extends CharacterDetailProps<number> {
  handleHelpChar: () => void;
  handleHelpAnotherChar: () => void;
}

const CharacterDetailUI = ({
  id,
  name,
  subStory,
  detailStory,
  handleHelpChar,
  handleHelpAnotherChar,
}: CharacterDetailCardType) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* ✅ h-60 제거 → min-h-[300px]으로 자동 조정 */}
      <div className='rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col items-center bg-green-50 w-auto min-h-[300px]'>
        {/* 서브 스토리 */}
        <h3 className='text-xl font-bold text-primary mb-4 text-center'>
          "{subStory}"
        </h3>

        {/* 상세 스토리 */}
        <div className='text-sm text-primary/80 text-center whitespace-pre-wrap leading-normal'>
          {detailStory.split('.').map((text: string, index) => (
            <p key={index} className='mb-1'>
              {text}
            </p>
          ))}
        </div>

        {/* ✅ 버튼을 아래로 정렬 (mt-auto) */}
        <div className='mt-auto flex flex-row justify-center w-full gap-4 pb-6'>
          <CharNextChap
            text='다른 친구 돕기'
            handleChar={handleHelpAnotherChar}
            className='w-1/2 h-8'
          />
          <CharNextChap
            text={`${name} 돕기`}
            handleChar={handleHelpChar}
            className='w-1/2 h-8'
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterDetailUI;
