import useCharStore from '@/store/useCharStore';
import CharButton from '../features/CharButton';
import { CharacterTypes } from '@/types/CharacterTypes';
import { motion } from 'framer-motion';

//CharacterCardProps와 관련된 interface type 설정 => props 설정
interface CharacterCardProps extends CharacterTypes<string> {}

const CharacterCards = ({
  name,
  description,
  img,
  subStory,
  detailStory,
}: CharacterCardProps) => {
  const { myChar, setMyChar } = useCharStore();

  // 직접적 event.type 발생 여부X
  const handlePickChar = () => {
    setMyChar({
      name,
      description,
      img,
      // subStory
      // detailStory
    });
  };

  return (
    // motion.div로 감싸면 그 `div` 1번쨰 요소에 애니메이션 효과가 적용됨
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
          <img src={img} alt={name} className='w-full h-full object-cover' />
        </div>
        <h3 className='text-xl font-bold text-primary mb-2'>{name}</h3>
        <p className='text-primary/80'>{description}</p>
        <CharButton handleEvent={handlePickChar} />
      </div>
    </motion.div>
  );
};

export default CharacterCards;
