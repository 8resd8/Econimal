import useCharStore from '@/store/useCharStore';
import CharButton from '../../componet/select/CharButton';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
//원래는 card도 card기능이랑 feat 기능 분리해야하는데 현재 상태 유지

const CharacterCards = ({
  id,
  userCharacterId,
  name,
  description,
  img,
  backImg,
  profileImg,
  footImg,
  subStory,
  detailStory,
}: CharacterTypes<number>) => {
  const { myChar, setMyChar, resetMyChar } = useCharStore();

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log(`${name} 카드 렌더링:`, { id, userCharacterId });
  }, [name, id, userCharacterId]);

  // 현재 선택된 캐릭터인지 확인 (서버 ID 기준)
  const currentId = id || userCharacterId || 0; // 두 ID 중 하나라도 있는 값 사용
  const isSelected =
    myChar && (myChar.id === currentId || myChar.userCharacterId === currentId);

  useEffect(() => {
    console.log(
      `${name} 선택 상태:`,
      isSelected,
      '현재 ID:',
      currentId,
      '선택된 ID:',
      myChar.id,
    );
  }, [name, isSelected, currentId, myChar.id]);

  const handlePickChar = () => {
    console.log(`${name} 선택 버튼 클릭. 현재 상태:`, isSelected);
    console.log('전달할 ID 값:', currentId);

    if (isSelected) {
      // 이미 선택된 캐릭터면 선택 해제
      resetMyChar();
    } else {
      // 선택되지 않은 캐릭터면 선택
      const charData: CharacterTypes<number> = {
        id: currentId,
        userCharacterId: currentId,
        name,
        description,
        img,
        backImg,
        profileImg,
        footImg,
        subStory: subStory || '',
        detailStory: detailStory || '',
      };

      console.log('선택할 캐릭터 데이터:', charData);
      setMyChar(charData);
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
      data-character-id={currentId} // 디버깅 용도로 DOM에 ID 추가
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

export default CharacterCards;
