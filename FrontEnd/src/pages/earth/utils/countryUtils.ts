// countryUtils.ts - 한국어 국가명으로 표시하는 유틸리티

// 백엔드 응답 국가 코드와 이름 매핑 (원본 유지)
export const backendCountries: Record<string, string> = {
  "SE": "Sweden",
  "FI": "Finland",
  "GB": "United Kingdom",
  "GL": "Greenland",
  "FR": "France",
  "DE": "Germany",
  "IT": "Italia",
  "RU": "Russia",
  "IN": "India",
  "MV": "Maldives",
  "KR": "Korea",
  "JP": "Japan",
  "TH": "Thailand",
  "CN": "China",
  "EG": "Egypt",
  "SD": "Sudan",
  "NG": "Nigeria",
  "GH": "Ghana",
  "ZA": "South Africa",
  "CA": "Canada",
  "BR": "Brazil",
  "AR": "Argentina",
  "AQ": "British Antarctic Territory",
  "TV": "Tuvalu",
  "AU": "Australia",
  "US": "United States of America",
  "MN": "Mongolia"
};

// 한국어 국가명 매핑 (주 사용)
export const countryNames: Record<string, string> = {
  "SE": "스웨덴",
  "FI": "핀란드",
  "GB": "영국",
  "GL": "그린란드",
  "FR": "프랑스",
  "DE": "독일",
  "IT": "이탈리아",
  "RU": "러시아",
  "IN": "인도",
  "MV": "몰디브",
  "KR": "대한민국",
  "JP": "일본",
  "TH": "태국",
  "CN": "중국",
  "EG": "이집트",
  "SD": "수단",
  "NG": "나이지리아",
  "GH": "가나",
  "ZA": "남아프리카공화국",
  "CA": "캐나다",
  "BR": "브라질",
  "AR": "아르헨티나",
  "AQ": "남극",
  "TV": "투발루",
  "AU": "호주",
  "US": "미국",
  "MN": "몽골"
};

// 영어 국가명 (필요할 때만 사용)
export const englishCountryNames: Record<string, string> = { ...backendCountries };

// GeoJSON 국가 이름과 백엔드 국가 코드 매핑
export const countryNameToCode: Record<string, string> = {
  // 한국어 국가명 매핑
  "스웨덴": "SE",
  "핀란드": "FI",
  "영국": "GB",
  "그린란드": "GL",
  "프랑스": "FR",
  "독일": "DE",
  "이탈리아": "IT",
  "러시아": "RU",
  "인도": "IN",
  "몰디브": "MV",
  "대한민국": "KR",
  "한국": "KR",
  "일본": "JP",
  "태국": "TH",
  "중국": "CN",
  "이집트": "EG",
  "수단": "SD",
  "나이지리아": "NG",
  "가나": "GH",
  "남아프리카공화국": "ZA",
  "남아공": "ZA",
  "캐나다": "CA",
  "브라질": "BR",
  "아르헨티나": "AR",
  "남극": "AQ",
  "투발루": "TV",
  "호주": "AU",
  "미국": "US",
  "몽골": "MN",
  
  // 영어 국가명 매핑 (기존 매핑도 유지)
  "Sweden": "SE",
  "Finland": "FI",
  "United Kingdom": "GB",
  "Greenland": "GL",
  "France": "FR",
  "Germany": "DE",
  "Italy": "IT",
  "Russia": "RU",
  "India": "IN",
  "Maldives": "MV",
  "South Korea": "KR",
  "Japan": "JP",
  "Thailand": "TH",
  "China": "CN",
  "Egypt": "EG",
  "Sudan": "SD",
  "Nigeria": "NG",
  "Ghana": "GH",
  "South Africa": "ZA",
  "Canada": "CA",
  "Brazil": "BR",
  "Argentina": "AR",
  "Antarctica": "AQ",
  "Tuvalu": "TV",
  "Australia": "AU",
  "United States of America": "US",
  "United States": "US",
  "Mongolia": "MN",
  
  // 다른 영어 표현들
  "UK": "GB",
  "Italia": "IT",
  "Republic of Korea": "KR",
  "Korea": "KR",
  "USA": "US",
  "U.S.A.": "US",
  "British Antarctic Territory": "AQ"
};

// 국가 코드에서 이름을 가져오는 역매핑 (한국어 이름 사용)
export const countryCodeToName: Record<string, string> = {};

// 역매핑 생성 - 한국어 이름으로
Object.entries(countryNames).forEach(([code, name]) => {
  countryCodeToName[code] = name;
});

/**
 * 국가 이름(한글/영어)에서 백엔드 국가 코드 찾기
 * @param name 국가 이름
 * @returns 백엔드 국가 코드 또는 null
 */
export const getCountryCodeByName = (name: string): string | null => {
  // 직접 매핑 시도
  if (countryNameToCode[name]) {
    return countryNameToCode[name];
  }
  
  // 부분 문자열 매칭 시도
  for (const [mappedName, code] of Object.entries(countryNameToCode)) {
    if (name.includes(mappedName) || mappedName.includes(name)) {
      return code;
    }
  }
  
  // 매칭 실패
  return null;
};

/**
 * 백엔드 국가 코드에서 표시용 국가 이름 찾기 (한국어)
 * @param code 백엔드 국가 코드
 * @returns 한국어 국가 이름 또는 코드 자체 (찾지 못한 경우)
 */
export const getCountryNameByCode = (code: string): string => {
  return countryCodeToName[code] || code;
};

/**
 * 백엔드 국가 코드에서 영어 국가 이름 찾기 (필요한 경우만 사용)
 * @param code 백엔드 국가 코드
 * @returns 영어 국가 이름 또는 코드 자체 (찾지 못한 경우)
 */
export const getEnglishCountryNameByCode = (code: string): string => {
  return englishCountryNames[code] || code;
};

/**
 * 모든 국가 코드 배열 반환
 * @returns 백엔드 국가 코드 배열
 */
export const getAllCountryCodes = (): string[] => {
  return Object.keys(backendCountries);
};

/**
 * 모든 국가 정보를 한국어 이름과 함께 반환
 * @returns 국가 코드와 이름을 포함한 객체 배열
 */
export const getAllCountries = (): Array<{code: string, name: string, englishName: string}> => {
  return getAllCountryCodes().map(code => ({
    code,
    name: getCountryNameByCode(code),
    englishName: getEnglishCountryNameByCode(code)
  }));
};

/**
 * 국가 설명 가져오기 (이미 한국어로 작성됨)
 * @param countryCode 백엔드 국가 코드
 * @returns 국가 설명
 */
export const getCountryDescription = (countryCode: string): string => {
  const descriptions: { [key: string]: string } = {
    "SE": "스웨덴은 북유럽에 위치한 환경 선진국으로, 재생 에너지 활용과 탄소 배출 감소에 앞장서고 있습니다.",
    "FI": "핀란드는 풍부한 숲과 호수를 보유한 국가로, 자연 보전과 지속 가능한 산림 관리의 모범 사례를 보여줍니다.",
    "GB": "영국은 기후 변화 대응 정책을 선도하며 해상 풍력 발전과 같은 재생 에너지 확대에 중점을 두고 있습니다.",
    "GL": "그린란드는 거대한 빙하를 보유한 지역으로, 기후 변화에 따른 빙하 감소와 생태계 변화의 최전선에 있습니다.",
    "FR": "프랑스는 원자력 발전과 더불어 친환경 정책과 재생 에너지 확대를 통해 기후 변화에 대응하고 있습니다.",
    "DE": "독일은 에너지 전환 정책(Energiewende)으로 재생 에너지 비중을 높여가는 환경 선도국입니다.",
    "IT": "이탈리아는 지중해성 기후를 가진 국가로, 태양광 발전 등 재생 에너지 개발과 문화유산 보존에 힘쓰고 있습니다.",
    "RU": "러시아는 광활한 영토와 다양한 기후대를 보유한 국가로, 시베리아의 영구 동토층 보존과 환경 보전에 노력하고 있습니다.",
    "IN": "인도는 급속한 경제 성장과 함께 환경 보호와 지속 가능한 발전 사이의 균형을 추구하고 있습니다.",
    "MV": "몰디브는 낮은 해발고도로 인해 해수면 상승의 직접적인 위협을 받는 국가로, 기후 변화 대응에 적극적입니다.",
    "KR": "대한민국은 동아시아의 기술 혁신과 문화 강국으로, 그린 뉴딜 정책을 통한 지속 가능한 발전을 추진하고 있습니다.",
    "JP": "일본은 첨단 기술과 전통이 공존하는 국가로, 재해 대비와 친환경 기술 개발에 큰 관심을 기울이고 있습니다.",
    "TH": "태국은 풍부한 생물다양성을 자랑하는 국가로, 산호초와 맹그로브 숲 보존 등 자연 생태계 보전에 노력하고 있습니다.",
    "CN": "중국은 급속한 산업화와 함께 증가한 환경 과제에 대응하며 재생 에너지 분야에 대규모 투자를 진행하고 있습니다.",
    "EG": "이집트는 나일강을 중심으로 발전한 국가로, 수자원 관리와 사막화 방지를 위한 환경 정책을 추진하고 있습니다.",
    "SD": "수단은 사하라 사막과 사헬 지대에 위치한 국가로, 기후 변화로 인한 가뭄과 사막화 문제에 직면해 있습니다.",
    "NG": "나이지리아는 아프리카에서 가장 인구가 많은 국가로, 석유 생산과 환경 보전 사이의 균형을 모색하고 있습니다.",
    "GH": "가나는 서아프리카의 국가로, 지속 가능한 광업과 산림 보존을 위한 정책을 추진하고 있습니다.",
    "ZA": "남아프리카공화국은 다양한 생태계와 자원을 가진 국가로, 재생 에너지 확대와 생물다양성 보전에 힘쓰고 있습니다.",
    "CA": "캐나다는 광활한 자연 환경을 보유한 국가로, 북극 지역 보존과 기후 변화 대응에 노력하고 있습니다.",
    "BR": "브라질은 아마존 열대우림의 상당 부분을 차지하는 국가로, 산림 보존과 지속 가능한 개발의 중요성을 강조하고 있습니다.",
    "AR": "아르헨티나는 다양한 기후대와 풍부한 자연 자원을 가진 국가로, 환경 보호와 지속 가능한 농업을 추진하고 있습니다.",
    "AQ": "남극 영토는 국제 협약으로 보호되는 지역으로, 기후 변화 연구와 생태계 보존의 중요한 장소입니다.",
    "TV": "투발루는 태평양에 위치한 작은 섬나라로, 해수면 상승으로 인한 국가 존립의 위기에 직면해 있습니다.",
    "AU": "호주는 독특한 생태계와 생물다양성을 가진 국가로, 기후 변화로 인한 산불과 산호초 백화 문제에 대응하고 있습니다.",
    "US": "미국은 다양한 환경과 생태계를 가진 국가로, 기후 변화 대응과 환경 정책의 변화를 경험하고 있습니다.",
    "MN": "몽골은 광활한 초원 지대를 가진 국가로, 사막화 방지와 전통적 유목 생활 방식의 지속 가능성을 추구하고 있습니다."
  };

  return descriptions[countryCode] || `${getCountryNameByCode(countryCode)}은(는) 광활한 영토와 다양한 기후대를 보유한 국가로, 환경 보존과 지속 가능한 발전을 위해 노력하고 있습니다.`;
};

/**
 * 어린이 친화적인 국가 설명 가져오기
 * @param countryCode 백엔드 국가 코드
 * @returns 어린이 친화적인 국가 설명
 */
export const getKidsCountryDescription = (countryCode: string): string => {
  const kidsDescriptions: { [key: string]: string } = {
    "SE": "스웨덴은 북쪽에 있는 나라예요. 깨끗한 물과 숲이 많고, 태양과 바람으로 전기를 많이 만들어요!",
    "FI": "핀란드는 호수가 정말 많은 나라예요. 겨울에는 눈이 많이 쌓이고, 산타클로스가 살고 있대요!",
    "GB": "영국은 섬나라예요. 빅벤이라는 큰 시계탑이 있고, 여왕님이 사는 멋진 궁전도 있어요.",
    "GL": "그린란드는 세계에서 가장 큰 섬이에요. 온통 하얀 눈과 얼음으로 덮여 있고, 북극곰이 살아요!",
    "FR": "프랑스는 에펠탑이라는 높은 탑이 있는 나라예요. 맛있는 빵과 치즈로 유명하죠!",
    "DE": "독일은 자동차를 많이 만드는 나라예요. 숲이 많고 동화 속 성들도 많아요!",
    "IT": "이탈리아는 부츠 모양의 나라예요. 맛있는 피자와 파스타가 이 나라에서 시작됐어요!",
    "RU": "러시아는 세계에서 가장 큰 나라예요. 정말 넓고 추운 곳도 많아요!",
    "IN": "인도는 사람이 정말 많은 나라예요. 코끼리가 신성하게 여겨지고, 맛있는 카레로 유명해요!",
    "MV": "몰디브는 작은 섬들이 모인 나라예요. 바다가 정말 파랗고 맑아서 물고기를 잘 볼 수 있어요!",
    "KR": "대한민국은 우리나라예요! 김치, 태권도, 케이팝이 유명하고 빠른 인터넷으로도 알려져 있어요.",
    "JP": "일본은 후지산이라는 큰 산이 있는 나라예요. 로봇과 만화, 스시로 유명해요!",
    "TH": "태국은 코끼리가 많은 나라예요. 항상 날씨가 따뜻하고 맛있는 음식이 많아요!",
    "CN": "중국은 사람이 가장 많은 나라예요. 만리장성이라는 정말 긴 벽이 있어요!",
    "EG": "이집트는 사막에 있는 나라예요. 피라미드와 스핑크스 같은 아주 오래된 건물들이 있어요!",
    "SD": "수단은 아프리카에 있는 더운 나라예요. 큰 나일강이 지나가고 있어요.",
    "NG": "나이지리아는 아프리카에서 사람이 가장 많은 나라예요. 음악과 춤을 정말 좋아해요!",
    "GH": "가나는 친절한 사람들이 사는 나라예요. 맛있는 초콜릿을 만드는 카카오가 많이 자라요!",
    "ZA": "남아프리카공화국은 다이아몬드가 많이 나는 나라예요. 사자, 기린 같은 멋진 동물들이 살고 있어요!",
    "CA": "캐나다는 단풍잎으로 유명한 나라예요. 정말 넓고 호수가 많아요!",
    "BR": "브라질은 축구를 정말 잘하는 나라예요. 아마존이라는 세계에서 가장 큰 열대우림이 있어요!",
    "AR": "아르헨티나는 탱고 춤으로 유명한 나라예요. 맛있는 고기 요리로도 알려져 있어요!",
    "AQ": "남극은 나라가 아니라 대륙이에요. 펭귄이 살고 있고, 일 년 내내 눈과 얼음으로 덮여 있어요!",
    "TV": "투발루는 태평양에 있는 작은 섬나라예요. 아름다운 바다와 해변이 있어요!",
    "AU": "호주는 캥거루와 코알라가 사는 나라예요. 큰 산호초도 있어서 다양한 물고기들이 살고 있어요!",
    "US": "미국은 자유의 여신상이 있는 나라예요. 디즈니랜드와 같은 재미있는 놀이공원이 많아요!",
    "MN": "몽골은 넓은 초원이 있는 나라예요. 말을 타고 다니는 유목민들이 아직도 있어요!"
  };

  return kidsDescriptions[countryCode] || `${getCountryNameByCode(countryCode)}은(는) 멋진 나라예요! 특별한 문화와 아름다운 자연이 있답니다.`;
};

export default {
  getCountryCodeByName,
  getCountryNameByCode,
  getEnglishCountryNameByCode,
  getAllCountryCodes,
  getAllCountries,
  getCountryDescription,
  getKidsCountryDescription,
  countryNameToCode,
  countryCodeToName,
  countryNames,
  englishCountryNames,
  backendCountries
};