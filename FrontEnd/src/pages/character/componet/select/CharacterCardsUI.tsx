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
      <div className='rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col items-center bg-green-50 w-48 h-72'>
        {/* 이미지 영역 - 크기 통일 */}
        <div className='rounded-lg w-32 h-32 bg-white flex items-center justify-center'>
          <img src={img} alt={name} className='w-full h-full object-contain' />
        </div>

        {/* 이름과 설명 간격 조정 */}
        <div className='flex flex-col items-center mt-3 gap-1 text-center'>
          <h3 className='text-base font-bold text-primary truncate w-40'>
            {name}
          </h3>
          <p className='text-sm text-primary/80 w-40 leading-snug'>
            {description}
          </p>
        </div>

        {/* 선택하기 버튼 - 카드 내부에 배치 */}
        <div className='mt-auto w-full flex justify-center pt-3'>
          <CharButton handleEvent={handlePickChar} isSelect={isSelected} />
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCardsUI;
