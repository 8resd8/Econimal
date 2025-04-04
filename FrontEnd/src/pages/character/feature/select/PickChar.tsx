import CharacterCards from './CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../../componet/select/CharacterCardsList';
import CharacterDetail from './CharacterDetail';
import { useEffectiveId } from '../hooks/reuse/useEffectiveId';
import {
  useBackImg,
  useCharFootImg,
  useCharImg,
  useCharProfileImg,
  useMyBackgroundId,
  useMyCharacterId,
  useMyCharDescription,
  useMyCharDetailStory,
  useMyCharName,
  useMyCharSubStory,
} from '@/store/useMyCharStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PickChar = () => {
  //맨처음에는 myChar에 대한 정보가 없을 것
  const { myChar } = useCharStore(); //사용자가 선택한 나의 캐릭터 데이터들이 담긴 store
  const characterId = useMyCharacterId();
  const backgroundId = useMyBackgroundId();
  const name = useMyCharName();
  const description = useMyCharDescription();
  const subStory = useMyCharSubStory();
  const detailStory = useMyCharDetailStory();
  const charImg = useCharImg();
  const profileImg = useCharProfileImg();
  const footImg = useCharFootImg();
  const backImg = useBackImg();

  // const { effectiveId, hasValidSelection } = useEffectiveId(myChar);
  const { effectiveId, hasValidSelection } = useEffectiveId(characterId);
  const nav = useNavigate();
  useEffect(() => {
    if (characterId && characterId > 0) {
      // 이미 선택된 캐릭터가 있으면 메인 페이지로 이동
      const timer = setTimeout(() => {
        nav('/');
      }, 300); // 약간의 지연을 주어 상태 업데이트 시간 확보

      return () => clearTimeout(timer);
    }
  }, [characterId, nav]);

  if (!hasValidSelection) {
    //그렇다면, 선택을 하지 않은 것으로 간주되기 떄문에 전체 캐릭터 리스트 확인 가능(캐릭 선택)
    return <CharacterCardsList />;
  }

  // 사용자가 캐릭터를 선택했을 때 나타나는 내용들
  // const description = myChar?.description || '';

  return (
    <div className='flex flex-col m-8'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center text-white'>
        {/* {myChar.description.slice(0, -2)} "{myChar.name}" */}
        {description.slice(0, -2)} "{name}"
      </h2>
      <div className='flex justify-center items-center gap-9'>
        <CharacterCards
          img={charImg}
          name={name}
          description={description}
          userCharacterId={characterId}
          userBackgroundId={backgroundId}
          backImg={backImg}
          profileImg={profileImg}
          footImg={footImg}
          subStory={subStory}
          detailStory={detailStory}
        />
        {/* detail에 id값이 정확하게 전달되는 것이 중요함 : 추후 서버에 id값을 보내야하기 때문에*/}
        <CharacterDetail
          id={characterId}
          // name={myChar.name}
          name={name}
          subStory={
            // myChar.subStory
            subStory
              ? // ? myChar.subStory
                subStory
              : '안녕, 우린 에코니멀의 친구들이야'
          }
          detailStory={
            // myChar.detailStory
            detailStory
              ? detailStory
              : // ? myChar.detailStory
                '자세한 이야기는 추 후 업데이트 될 예정이야'
          }
        />
      </div>
    </div>
  );
};

export default PickChar;
