import { useEffect, useState } from 'react';
import { useCharList } from './useCharList';
import { CharacterTypes } from '../../types/CharacterTypes';
import { characterConfig } from '@/config/characterConfig';
import { useCharInfo } from './useCharInfo';
//캐릭터
// import turtleImg from '../../../../assets/char/char_bugi.png';
// import pengImg from '../../../../assets/char/char_peng.png';
// import horangImg from '../../../../assets/char/char_horang.png';
// //백그라운드
// import turbackImg from '../../../../assets/char/background/tur_back.png';
// import pengbackImg from '../../../../assets/char/background/peng_back.png';
// import horangbackImg from '../../../../assets/char/background/horang_back.png';
// //footIcon
// import turfoot from '../../../../assets/char/footitem/bugi_item.png';
// import pengfoot from '../../../../assets/char/footitem/peng_item.png';
// import horangfoot from '../../../../assets/char/footitem/horang_item.png';
// //프로필
// import turProfile from '../../../../assets/char/profile/char_bugiface.png';
// import pengProfile from '../../../../assets/char/profile/char_pengface.png';
// import horangProfile from '../../../../assets/char/profile/char_horangface.png';

export const useProcessedCharList = () => {
  const { data, isLoading } = useCharList();
  const [processedData, setProcessedData] = useState<CharacterTypes<number>[]>(
    [],
  );

  useEffect(() => {
    if (data && data.characters) {
      const processed: CharacterTypes<number>[] = data.characters
        .slice(0, 3)
        .map((item, idx) => {
          const configItem = characterConfig[idx];
          return {
            id: item.userCharacterId,
            name: item.characterName, //여기랑
            description: item.summary,
            img: configItem.img,
            backImg: configItem.backImg,
            profileImg: configItem.profileImg,
            footImg: configItem.footImg,
            subStory: configItem.subStory, //여기랑
            detailStory: configItem.detailStory, //여기랑
          };
        });
      setProcessedData(processed); //type 내용
    }
  }, [data]);

  return {
    processedData,
    isLoading,
  };
};
