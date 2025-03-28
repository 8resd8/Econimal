import CharProfile from '@/pages/character/componet/main/status/CharProfile';
import ExpBar from './ExpBar';
import CharCoin from '@/pages/character/componet/main/status/CharCoin';
import useCharStore from '@/store/useCharStore';
import {
  useCharacterCoin,
  useCharacterExp,
  useCharacterLevel,
} from '@/store/useCharStatusStore';

const CharStatusBar = () => {
  const { myChar } = useCharStore();
  const level = useCharacterLevel();
  const exp = useCharacterExp();
  const coin = useCharacterCoin();

  if (
    !myChar ||
    level === undefined ||
    exp === undefined ||
    coin === undefined
  ) {
    return null;
  }

  return (
    <div className='flex items-center justify-between p-6'>
      <div className='flex items-center gap-4'>
        <CharProfile level={level} profileImg={myChar.profileImg} />
        <ExpBar current={exp} max={100} />
      </div>
      <CharCoin coin={coin} />
    </div>
  );
};

export default CharStatusBar;
