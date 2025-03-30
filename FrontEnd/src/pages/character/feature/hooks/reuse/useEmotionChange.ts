import { myCharInfoConfig } from '@/config/myCharInfoConfig';
import { useEffect, useState } from 'react';
import { EmotionChangeOptions } from '@/pages/character/types/EmotionChangeOptions';
//myChar -> zustand에 있는 characterType
//data -> 서버에서 받아온 내용, 캐릭터 정보 MyCharInfoRes

export const useEmotionChange = ({
  data,
  myChar,
}: EmotionChangeOptions): { faceImg: string; isLoading: boolean } => {
  const [faceImg, setFaceImg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //감정 fetching에 따라서 이미지 상태가 계속 바뀌는 것
    setIsLoading(true);

    if (data && data.expression) {
      const serverExpression = data.expression;
      const charInfo = myCharInfoConfig.find(
        //config에서 일치하는 캐릭터 찾고
        (item) => item.name === myChar,
      );

      const charExpression = charInfo?.expression.find(
        //일치하는 감정 찾기
        (item) => item.face === serverExpression,
      );

      setFaceImg(charExpression?.faceImg as string);
      console.log(charExpression);
    }
    setIsLoading(false);
  }, [data]);

  return {
    faceImg,
    isLoading,
  };
};
