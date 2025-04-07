const CharEmotionChange = ({ faceImg }: { faceImg: string }) => {
  return (
    <div>
      <img
        src={faceImg}
        alt='감정'
        className='absolute bottom-[30%] left-[50%] -translate-x-1/2 w-full h-auto z-[2] scale-110'
      />
    </div>
  );
};

export default CharEmotionChange;
