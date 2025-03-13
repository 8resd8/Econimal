import CharBackground from './componet/main/CharBackground';

// import useCharStore from '@/store/useCharStore';
const MyCharacter = () => {
  // const { myChar, setMyChar } = useCharStore();

  return (
    <div className='w-screen h-screen'>
      <CharBackground />
    </div>
  );
};

export default MyCharacter;
