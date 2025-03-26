// const CharProfile = () => {
const CharProfile = ({
  level,
  profileImg,
}: {
  level: number;
  profileImg: string;
}) => {
  return (
    <div className='relative'>
      <div className='absolute -left-3 -top-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white font-bold text-base px-4 py-1 rounded-lg z-20 shadow-md border-2 border-white'>
        {/* 레벨 */}
        LV {level}
      </div>
      <div className='w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-blue-300 shadow-lg'>
        <img
          src={profileImg}
          alt='프로필'
          width={96}
          height={96}
          className='object-cover'
        ></img>
      </div>
    </div>
  );
};

export default CharProfile;
