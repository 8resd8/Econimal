import CharButton from './CharButton';
import { motion } from 'framer-motion';
import { CharacterCardTypes } from '../../types/CharacterCardTypes';

const CharacterCardsUI = ({
  name,
  description,
  img,
  handlePickChar, //기능 관련
  isSelected, // 기능 관련
}: CharacterCardTypes) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`rounded-2xl p-12 transition-all duration-300 hover:shadow-lg flex flex-col items-center bg-green-50`}
      >
        <div className='rounded-2xl relative w-40 h-40 mx-auto mb-4 bg-white'>
          <img src={img} alt={name} className='w-full h-full object-contain' />
        </div>
        <h3 className='text-xl font-bold text-primary mb-2'>{name}</h3>
        <p className='text-primary/80'>{description}</p>
        <CharButton handleEvent={handlePickChar} isSelect={isSelected} />
      </div>
    </motion.div>
  );
};

export default CharacterCardsUI;
