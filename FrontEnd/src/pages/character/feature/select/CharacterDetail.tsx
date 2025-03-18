import { CharacterDetailProps } from '@/pages/character/types/CharacterDetailProps';
import { motion } from 'framer-motion';
import CharNextChap from '../../componet/select/CharNextChap';
import useCharStore from '@/store/useCharStore';
import { useNavigate } from 'react-router-dom';
import { useFetchMyChar } from '../hooks/useFetchMyChar';
import { useCharInfo } from './../hooks/useCharInfo';
import { useEffect, useState } from 'react';
import { characterConfig } from '@/config/characterConfig';
const CharacterDetail = ({
  id,
  name,
  subStory: initialSubStory,
  detailStory: initialDetailStory,
}: CharacterDetailProps<number>) => {
  const { myChar, setMyChar, resetMyChar } = useCharStore();
  const [subStory, setSubStory] = useState(initialSubStory);
  const [detailStory, setDetailStory] = useState(initialDetailStory);
  const { data: infoData, isLoading } = useCharInfo();

  const { handleFetchMyChar, isPending: isMutating } = useFetchMyChar();
  const nav = useNavigate();

  // if (isLoading) {
  //   return <div>로딩 중...</div>;
  // }

  // if (isError) {
  //   return <div>에러 발생</div>;
  // }

  // 서버에서 상세 정보 로드 시 업데이트
  // 디버깅용 로그

  // Debug log for initial render
  useEffect(() => {
    console.log('CharacterDetail 렌더링:', {
      id,
      name,
      myCharId: myChar?.id,
      myCharUserId: myChar?.userCharacterId,
    });
  }, [id, name, myChar]);

  // Update stories from server data when available
  useEffect(() => {
    if (infoData?.characters) {
      // Check both ID fields to find a match
      const charInfo = infoData.characters.find(
        (char) => char.userCharacterId === id || char.id === id,
      );

      if (charInfo) {
        console.log('서버에서 받은 상세 정보:', charInfo);
        if (charInfo.summary) setSubStory(charInfo.summary);
        if (charInfo.description) setDetailStory(charInfo.description);
      }
    }
  }, [infoData, id]);

  // Fallback to config data if needed
  useEffect(() => {
    if (!subStory || !detailStory) {
      const configItem = characterConfig.find((char) => char.name === name);
      if (configItem) {
        if (!subStory && configItem.subStory) setSubStory(configItem.subStory);
        if (!detailStory && configItem.detailStory)
          setDetailStory(configItem.detailStory);
      }
    }
  }, [name, subStory, detailStory]);

  // Handle character selection and navigation
  const handleHelpChar = () => {
    // Use either ID field for comparison
    const effectiveId = id;
    const myCharId = myChar?.userCharacterId || myChar?.id;

    console.log('캐릭터 돕기 클릭:', {
      effectiveId,
      myCharId,
    });

    // Check if the current character is selected
    if (effectiveId && effectiveId === myCharId) {
      // Register the character with the server and navigate
      handleFetchMyChar();
      nav('/my');
    } else {
      console.warn('선택된 캐릭터와 현재 캐릭터 ID가 일치하지 않습니다.');
      console.log('현재 선택된 캐릭터:', myChar);
      console.log('현재 상세 페이지 캐릭터 ID:', effectiveId);
    }
  };

  // Reset character selection
  const handleHelpAnotherChar = () => {
    console.log('다른 캐릭터 돕기 클릭');
    resetMyChar();
  };

  // Loading indicator
  if (isLoading || isMutating) {
    return (
      <div className='rounded-2xl p-14 bg-green-50 flex justify-center items-center'>
        <p className='text-xl text-primary'>로딩 중...</p>
      </div>
    );
  }

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
