import { backgroundShopConfig } from '@/config/backgroundShopConfig';
import { useEffect, useState } from 'react';
import {
  ShopBackItemTypesRes,
  ShopBackItemTypes,
} from '@/pages/character/types/shop/ShopBackItemTypes';

export const usebackShopItem = (data: ShopBackItemTypesRes) => {
  const [backShopList, setBackShopList] = useState<ShopBackItemTypes[]>([]);

  useEffect(() => {
    if (!data || !data.products) return;
    console.log(data.products, 'data내용 확인하기');
    const resultData = data.products.map(
      (item: ShopBackItemTypes, idx: number) => {
        console.log(item.productId, '서버 패칭 productId');
        console.log(
          backgroundShopConfig[idx].productId,
          'config 정적 productId',
        );
        if (item.productId === backgroundShopConfig[idx].productId) {
          return {
            productId: item.productId,
            characterName: backgroundShopConfig[idx].characterName,
            image: backgroundShopConfig[idx].image,
            price: item.price,
            ownded: item.owned,
          };
        }
        return backgroundShopConfig[idx];
      },
    );
    setBackShopList(resultData);
  }, [data]);

  return {
    backShopList,
  };
};
