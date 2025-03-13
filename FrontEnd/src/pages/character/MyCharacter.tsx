import useCharStore from '@/store/useCharStore';

const MyCharacter = () => {
  const { myChar, setMyChar } = useCharStore();
  console.log(myChar); //지금 실제  backImg가 없긴 함함
  //서버에서 fetching 받아올 경우 이거 해결되긴 함함
  console.log(myChar.backImg);

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-white'>
      <img
        src={myChar.backImg}
        alt='캐릭터_배경'
        className='w-full h-full object-cover'
      />
      {/* 나의 캐릭터 */}
    </div>
  );
};

export default MyCharacter;
