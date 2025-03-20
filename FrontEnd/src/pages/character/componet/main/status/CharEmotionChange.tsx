//공통 컴포넌트 -> 데이터가 내려왔을때 공통적으로 나올 내용들
//조건문은 위에서?
//동적 컴포넌트 활용.. => 컴포넌트 자체가 바뀌는 것것
const CharEmotionChange = () => {
  return (
    <div>
      {/* 캐릭터 이미지 */}
      <img
        src={myChar.img}
        alt='감정'
        className='absolute bottom-[30px] left-[50%] -translate-x-1/2 w-full h-auto z-[2]'
      />
    </div>
  );
};

export default CharEmotionChange;
