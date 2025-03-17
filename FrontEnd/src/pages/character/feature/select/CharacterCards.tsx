import useCharStore from '@/store/useCharStore';
import CharButton from '../../componet/select/CharButton';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { motion } from 'framer-motion';
//원래는 card도 card기능이랑 feat 기능 분리해야하는데 현재 상태 유지

//CharacterCardProps와 관련된 interface type 설정 => props 설정
// interface CharacterCardProps extends CharacterTypes<string> {}

const CharacterCards = ({
  name,
  description,
  img,
  backImg,
  profileImg,
  footImg,
  subStory,
  detailStory,
  id,
}: CharacterTypes<string>) => {
  const { myChar, setMyChar } = useCharStore();
  console.log(myChar); //담기는 것 확인됨 => 근데 왜 3번뜨는지?

  const handlePickChar = () => {
    if (!myChar.name) {
      // 캐릭터 정보 들어가는 것
      setMyChar({
        name,
        description,
        img,
        backImg,
        profileImg,
        footImg,
        subStory,
        detailStory,
        id,
      });
    } else {
      setMyChar({
        //다시 객체 배열 초기화 상태
        name: '',
        description: '',
        img: '',
        backImg: '',
        profileImg: '',
        footImg: '',
        subStory: '',
        detailStory: '',
        id: '', //다시 빈값으로
      });
    }
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
          <img src={img} alt={name} className='w-full h-full object-contain' />
        </div>
        <h3 className='text-xl font-bold text-primary mb-2'>{name}</h3>
        <p className='text-primary/80'>{description}</p>
        <CharButton
          handleEvent={handlePickChar}
          isSelect={myChar.name ? true : false}
        />
      </div>
    </motion.div>
  );
};

export default CharacterCards;
