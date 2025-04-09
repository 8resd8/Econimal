// 기본 매핑은 이름 기반으로 유지
export const backgroundToCharacterMap: Record<string, string> = {
  '물속 모험의 세계': '부기부기',
  '얼음나라 대탐험': '팽글링스',
  '초원의 비밀 정원': '호랭이',
};

// 캐릭터와 기본 배경 매핑
export const characterToBackgroundMap: Record<string, string> = {
  부기부기: '물속 모험의 세계',
  팽글링스: '얼음나라 대탐험',
  호랭이: '초원의 비밀 정원',
};

// 각 캐릭터에 허용된 모든 배경 목록
export const characterToAllowedBackgrounds: Record<string, string[]> = {
  부기부기: [
    '물속 모험의 세계',
    '자연의 숨결',
    '끝없는 바다 여행',
    '거대한 얼음 왕국',
  ],
  팽글링스: [
    '얼음나라 대탐험',
    '자연의 숨결',
    '끝없는 바다 여행',
    '거대한 얼음 왕국',
  ],
  호랭이: [
    '초원의 비밀 정원',
    '자연의 숨결',
    '끝없는 바다 여행',
    '거대한 얼음 왕국',
  ],
};

// 범용 배경 목록
export const universalBackgrounds: string[] = [
  '자연의 숨결',
  '끝없는 바다 여행',
  '거대한 얼음 왕국',
];

// 배경이 기본 배경인지 확인하는 함수
export const isBasicBackground = (backgroundName: string): boolean => {
  return Object.keys(backgroundToCharacterMap).includes(backgroundName);
};

// 배경이 특정 캐릭터에 대해 선택 가능한지 확인하는 함수
export const isBackgroundAllowedForCharacter = (
  backgroundName: string,
  characterName: string | undefined,
): boolean => {
  if (!characterName) return true; // 캐릭터가 선택되지 않은 경우 모든 배경 선택 가능

  // 기본 배경인 경우, 해당 캐릭터에 매핑된 배경인지 확인
  if (isBasicBackground(backgroundName)) {
    return backgroundToCharacterMap[backgroundName] === characterName;
  }

  // 범용 배경은 모든 캐릭터가 선택 가능
  return universalBackgrounds.includes(backgroundName);
};

// ID 매핑을 위한 새로운 유틸리티 함수들 (실시간으로 업데이트됨)
// 서버 데이터가 로드될 때마다 이 캐시를 업데이트하는 함수
let currentCharacterIdMap: Record<string, number> = {};
let currentBackgroundIdMap: Record<string, number> = {};

export const updateCharacterIdMap = (characters: any[]) => {
  characters.forEach((char) => {
    if (char.name && char.userCharacterId) {
      currentCharacterIdMap[char.name] = char.userCharacterId;
    }
  });
};

export const updateBackgroundIdMap = (backgrounds: any[]) => {
  backgrounds.forEach((bg) => {
    if (bg.characterName && bg.userBackgroundId) {
      currentBackgroundIdMap[bg.characterName] = bg.userBackgroundId;
    }
  });
};

// 이름으로 현재 ID 조회
export const getCurrentCharacterId = (
  characterName: string,
): number | undefined => {
  return currentCharacterIdMap[characterName];
};

export const getCurrentBackgroundId = (
  backgroundName: string,
): number | undefined => {
  return currentBackgroundIdMap[backgroundName];
};
