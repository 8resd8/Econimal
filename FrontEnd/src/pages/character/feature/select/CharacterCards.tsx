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
  const effectiveId = userCharacterId || id || 0;

  // Log card details when rendered
  useEffect(() => {
    console.log(`${name} 카드 렌더링:`, {
      id,
      userCharacterId,
      effectiveId,
    });
  }, [name, id, userCharacterId, effectiveId]);

  // Check if this character is currently selected
  // Important: Only compare using effectiveId for consistency
  const isSelected =
    myChar &&
    (myChar.userCharacterId === effectiveId || myChar.id === effectiveId);

  useEffect(() => {
    console.log(
      `${name} 선택 상태:`,
      isSelected,
      '현재 카드 ID:',
      effectiveId,
      '선택된 캐릭터 ID:',
      myChar?.userCharacterId || myChar?.id,
    );
  }, [name, isSelected, effectiveId, myChar]);

  const handlePickChar = () => {
    console.log(`${name} 선택 버튼 클릭. 현재 상태:`, isSelected);

    if (isSelected) {
      // 이미 선택된 캐릭터면 선택 해제
      resetMyChar();
    } else {
      // 선택되지 않은 캐릭터면 선택
      // IMPORTANT: Always store both id and userCharacterId as effectiveId
      // This ensures consistency when checking selection status
      const charData: CharacterTypes<number> = {
        id: effectiveId,
        userCharacterId: effectiveId,
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
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-character-id={effectiveId}
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
