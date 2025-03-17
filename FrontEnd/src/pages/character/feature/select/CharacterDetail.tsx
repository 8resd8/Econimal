import { CharacterDetailProps } from '@/pages/character/types/CharacterDetailProps';
import { motion } from 'framer-motion';
import CharNextChap from '../../componet/select/CharNextChap';
import useCharStore from '@/store/useCharStore';
import { useNavigate } from 'react-router-dom';
import { useFetchMyChar } from '../hooks/useFetchMyChar';
import { useCharInfo } from './../hooks/useCharInfo';
const CharacterDetail = ({
  id,
  name,
  subStory,
  detailStory,
}: CharacterDetailProps<number>) => {
  const { myChar, setMyChar } = useCharStore();
  const { data, isLoading, isError, error } = useCharInfo();
  const { handleFetchMyChar } = useFetchMyChar();
  const nav = useNavigate();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생</div>;
  }

  // 지금 캐릭터 돕기 => 이거 상세 id값이어야함
  const handleHelpChar = () => {
    if (myChar.name !== name) {
      return;
    }
    handleFetchMyChar();
    nav('/my');
  };

  // 다른 캐릭터 돕기
  const handleHelpAnotherChar = () => {
    setMyChar({
      id: '',
      name: '',
      description: '',
      img: '',
    });
  };

  // -------------------------------------------------

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

export default CharacterDetail;
