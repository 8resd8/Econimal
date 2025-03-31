// usebackShopItem.ts - 배경 목록 처리 개선
import { backgroundShopConfig } from '@/config/backgroundShopConfig';
import { useEffect, useState } from 'react';
import {
  ShopBackItemTypesRes,
  ShopBackItemTypes,
} from '@/pages/character/types/shop/ShopBackItemTypes';

// 서버 ID와 로컬 ID 매핑 (serverToLocalIdMap과 동일하게 유지)
const serverToLocalIdMap = {
  45: 1774, // 물속 모험의 세계
  46: 1775, // 얼음나라 대탐험
  47: 1776, // 초원의 비밀 정원
  48: 1777, // 자연의 숨결
  49: 1778, // 끝없는 바다 여행
  50: 1779, // 거대한 얼음 왕국
};

export const usebackShopItem = (data: ShopBackItemTypesRes) => {
  const [backShopList, setBackShopList] = useState<ShopBackItemTypes[]>([]);

  useEffect(() => {
    if (!data || !data.products) return;

    const resultData = data.products
      .map((item: ShopBackItemTypes) => {
        // 서버 ID를 로컬 ID로 변환
        const mappedId = serverToLocalIdMap[item.productId] || item.productId;

        // 로컬 구성에서 맞는 배경 찾기
        const configData = backgroundShopConfig.find(
          (back) => back.productId === mappedId,
        );

        // 이름으로 찾기 (ID 매핑이 없는 경우 대비)
        const configByName = !configData
          ? backgroundShopConfig.find(
              (back) => back.characterName === item.characterName,
            )
          : null;

        const finalConfig = configData || configByName;

        if (item !== undefined) {
          return {
            productId: item.productId, // 원래 서버 ID 유지
            userBackgroundId: mappedId, // 매핑된 ID를 userBackgroundId로 저장
            owned: item.owned,
            price: item.price,
            image: finalConfig?.image,
            characterName: item.characterName || finalConfig?.characterName,
          };
        }
        return null;
      })
      .filter(Boolean);

    setBackShopList(resultData);
  }, [data]);

  return { backShopList };
};
