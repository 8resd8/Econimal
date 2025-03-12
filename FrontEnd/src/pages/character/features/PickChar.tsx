import { characterConfig } from '@/config/characterConfig';
import CharacterCards from '../component/CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../component/CharacterCardsList';

const PickChar = () => {
  // store값의 유무에 따라서 return 값이 달라지는 것
  const { myChar, setMyChar } = useCharStore();

  if (!myChar.name) {
    // !myChar로 하니까 안될듯 => 초기화로 ''로 해도 myChar 자체로 인식을 해서
    //데이터가 ""인지 아닌지를 봐야할듯
    return <CharacterCardsList />;
  }

  return (
    <div>
      <CharacterCards {...myChar} />
    </div>
  );
};

export default PickChar;
