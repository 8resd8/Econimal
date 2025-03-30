import { myCharInfoConfig } from '@/config/myCharInfoConfig';
import { useEffect, useState } from 'react';

export const useFootChange = ({
  data,
  myChar,
}): { footImg: string; isFootLoading: boolean } => {
  const [footImg, setFootImg] = useState<string>('');
  const [isFootLoading, setIsFootLoading] = useState(true);

  useEffect(() => {
    setIsFootLoading(true);

    if (data && data.level) {
      const serverLevel = data.level;
      const charInfo = myCharInfoConfig.find((item) => item.name === myChar);
      const charLevel = charInfo?.level.find(
        (item) => item.num === serverLevel,
      );
      setFootImg(charLevel?.footImg as string);
    }
    setIsFootLoading(false);
  }, [data]);

  return {
    footImg,
    isFootLoading,
  };
};
