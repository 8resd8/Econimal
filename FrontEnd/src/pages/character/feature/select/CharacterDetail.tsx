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
  const { myChar, setMyChar } = useCharStore();
  const [subStory, setSubStory] = useState(initialSubStory);
  const [detailStory, setDetailStory] = useState(initialDetailStory);
  const { data: infoData, isLoading } = useCharInfo();

  const { handleFetchMyChar } = useFetchMyChar();
  const nav = useNavigate();

  // if (isLoading) {
  //   return <div>로딩 중...</div>;
  // }

  // if (isError) {
  //   return <div>에러 발생</div>;
  // }

  // 서버에서 상세 정보 로드 시 업데이트
  useEffect(() => {
    if (infoData?.characters) {
      const charInfo = infoData.characters.find(
        (char) => char.userCharacterId === id,
      );

      if (charInfo) {
        if (charInfo.summary) setSubStory(charInfo.summary);
        if (charInfo.description) setDetailStory(charInfo.description);
      }
    }
  }, [infoData, id]);

  // 정보가 없는 경우 config에서 찾기 (백업)
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

  // 지금 캐릭터 돕기 => 이거 상세 id값이어야함
  const handleHelpChar = () => {
    if (myChar?.userCharacterId !== id) return; // ID 기반 검증
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
