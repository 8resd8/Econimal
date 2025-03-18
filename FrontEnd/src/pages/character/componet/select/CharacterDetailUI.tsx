import { motion } from 'framer-motion';
import CharNextChap from './CharNextChap';
import { CharacterDetailProps } from '../../types/CharacterDetailProps';

interface CharacterDetailCardType extends CharacterDetailProps<number> {
  //기존 값 상속받기
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
      <div
        className={`rounded-2xl p-14 transition-all duration-300 hover:shadow-lg flex flex-col items-center bg-green-50`}
      >
        <h3 className='text-2xl font-bold text-primary mb-8'>"{subStory}"</h3>
        {detailStory.split('.').map((text: string) => (
          <p
            className='text-xl text-wrap text-primary/80 whitespace-pre-wrap'
            key={text}
          >
            {text}
          </p>
        ))}
        <div className='mt-5 flex items-stretch justify-between gap-2'>
          <CharNextChap text={`${name} 돕기`} handleChar={handleHelpChar} />
          <CharNextChap
            text={'다른 친구 돕기'}
            handleChar={handleHelpAnotherChar}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterDetailUI;
