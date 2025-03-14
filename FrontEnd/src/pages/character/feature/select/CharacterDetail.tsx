import { CharacterDetailProps } from '@/pages/character/types/CharacterDetailProps';
import { motion } from 'framer-motion';
import CharNextChap from '../../componet/select/CharNextChap';
import useCharStore from '@/store/useCharStore';
import { useNavigate } from 'react-router-dom';
import MyCharacter from '../../MyCharacter';
//원래는 detail도 detail기능이랑 feat 기능 분리해야하는데 현재 상태 유지

// 디테일 사이즈 수정
const CharacterDetail = ({
  name,
  subStory,
  detailStory,
}: CharacterDetailProps) => {
  const { myChar, setMyChar } = useCharStore();
  const nav = useNavigate();

  // 지금 캐릭터 돕기기
  const handleHelpChar = () => {
    if (myChar.name !== name) {
      return;
    }
    nav('/my');
    //추후 여기서 서버에 나의 캐릭터 정보를 보내줘야하지 않을까?라는 생각
  };

  // 다른 캐릭터 돕기
  const handleHelpAnotherChar = () => {
    setMyChar({
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
