import CharButton from './CharButton';
import { motion } from 'framer-motion';
import { CharacterCardTypes } from '../../types/CharacterCardTypes';

const CharacterCardsUI = ({
  name,
  description,
  img,
  handlePickChar,
  isSelected,
}: CharacterCardTypes) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className='rounded-2xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col items-center bg-green-50 w-40 h-52'>
        {/* 이미지 영역 */}
        <div className='rounded-2xl relative w-32 h-32 mx-auto mb-2 bg-white flex items-center justify-center'>
          <img src={img} alt={name} className='w-full h-full object-contain' />
        </div>

        {/* 이름 - 너무 길면 줄이기 */}
        <h3 className='text-sm font-bold text-primary mb-1 w-full text-center truncate'>
          {name}
        </h3>

        {/* 설명 */}
        <p className='text-xs text-primary/80 text-center px-2'>
          {description}
        </p>

        {/* 버튼 */}
        <CharButton handleEvent={handlePickChar} isSelect={isSelected} />
      </div>
    </motion.div>
  );
};

export default CharacterCardsUI;
