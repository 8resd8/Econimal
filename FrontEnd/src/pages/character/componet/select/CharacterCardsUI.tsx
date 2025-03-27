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
      <div className='rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col items-center bg-green-50 w-48 h-64'>
        {/* 이미지 영역 */}
        <div className='rounded-lg relative w-36 h-36 mx-auto mb-3 bg-white flex items-center justify-center'>
          <img src={img} alt={name} className='w-full h-full object-contain' />
        </div>

        {/* 이름 - 길어도 줄이기 */}
        <h3 className='text-base font-bold text-primary mb-1 w-full text-center leading-tight'>
          {name}
        </h3>

        {/* 설명 */}
        <p className='text-sm text-primary/80 text-center px-3 leading-snug'>
          {description}
        </p>

        {/* 버튼 */}
        <div className='mt-auto w-full flex justify-center'>
          <CharButton handleEvent={handlePickChar} isSelect={isSelected} />
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCardsUI;
