import { useNavigate } from 'react-router-dom';

const CharProfile = ({
  level,
  profileImg,
  userId,
  current = 75,
  max = 100,
}: {
  level: number;
  profileImg: string;
  userId: string;
  current?: number;
  max?: number;
}) => {
  const navigate = useNavigate();
  const percentage = (current / max) * 100;

  const handleProfileClick = () => {
    navigate(`/my`);
  };

  return (
    <div
      className='flex items-center bg-slate-50 rounded-full px-3 py-2 shadow-md cursor-pointer'
      onClick={handleProfileClick}
      role='button'
      aria-label='마이 페이지로 이동'
    >
      {/* 프로필 이미지 */}
      <div className='w-14 h-14 rounded-full overflow-hidden border-2 border-slate-300'>
        <img
          src={profileImg}
          alt='프로필'
          className='w-full h-full object-cover'
        />
      </div>

      {/* 레벨 정보와 물방울 */}
      <div className='ml-3 flex flex-col justify-center'>
        {/* 레벨 텍스트 */}
        <div className='text-slate-700 font-bold'>LV {level}</div>

        {/* 물방울 아이콘 - 5개로 변경하여 20%씩 채워짐 */}
        {/* <div className="flex mt-1 gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                i * 20 < percentage ? 'opacity-100' : 'opacity-30'
              } -ml-1 first:ml-0`}
            >
              <path
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                fill={i * 20 < percentage ? '#e0f7ff' : '#cbd5e1'}
                stroke={i * 20 < percentage ? '#0ea5e9' : '#94a3b8'}
                strokeWidth="2"
              />
            </svg>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default CharProfile;
