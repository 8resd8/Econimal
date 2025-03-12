import { CharacterDetailProps } from '@/types/CharacterDetailProps';
import { motion } from 'framer-motion';

const CharacterDetail = ({ subStory, detailStory }: CharacterDetailProps) => {
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
        <h3 className='text-2xl font-bold text-primary mb-2'>{subStory}</h3>
        <p className='text-xl text-wrap text-primary/80'>{detailStory}</p>
      </div>
    </motion.div>
  );
};

export default CharacterDetail;
