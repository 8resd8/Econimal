// countryUtils.ts - 백엔드 응답 국가에 맞춘 매핑 함수

// 백엔드 응답 국가 코드와 이름 매핑
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
  
  // GeoJSON 국가 이름과 백엔드 국가 코드 매핑
  export const countryNameToCode: Record<string, string> = {
    // 정확한 국가 이름 매핑
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
    "South Korea": "KR", // GeoJSON에서는 'South Korea'로 표시됨
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
    "Antarctica": "AQ", // GeoJSON에서는 'Antarctica'로 표시됨
    "Tuvalu": "TV",
    "Australia": "AU",
    "United States of America": "US",
    "United States": "US", // 동의어
    "Mongolia": "MN",
    
    // GeoJSON에서 사용되는 다른 이름 추가
    "UK": "GB",
    "Italia": "IT",
    "Republic of Korea": "KR",
    "Korea": "KR",
    "USA": "US",
    "U.S.A.": "US",
    "British Antarctic Territory": "AQ"
  };
  
  // 국가 코드에서 이름을 가져오는 역매핑
  export const countryCodeToName: Record<string, string> = {};
  
  // 역매핑 생성
  Object.entries(backendCountries).forEach(([code, name]) => {
    countryCodeToName[code] = name;
  });
  
  /**
   * GeoJSON 형식의 국가 이름에서 백엔드 국가 코드 찾기
   * @param name GeoJSON에서 사용되는 국가 이름
   * @returns 백엔드 국가 코드 또는 null
   */
  export const getCountryCodeByName = (name: string): string | null => {
    // 직접 매핑 시도
    if (countryNameToCode[name]) {
      return countryNameToCode[name];
    }
    
    // 부분 문자열 매칭 시도 (예: "United States of America"가 "United States"를 포함)
    for (const [mappedName, code] of Object.entries(countryNameToCode)) {
      if (name.includes(mappedName) || mappedName.includes(name)) {
        return code;
      }
    }
    
    // 매칭 실패
    return null;
  };
  
  /**
   * 백엔드 국가 코드에서 표시용 국가 이름 찾기
   * @param code 백엔드 국가 코드
   * @returns 국가 이름 또는 코드 자체 (찾지 못한 경우)
   */
  export const getCountryNameByCode = (code: string): string => {
    return countryCodeToName[code] || code;
  };
  
  /**
   * 모든 국가 코드 배열 반환
   * @returns 백엔드 국가 코드 배열
   */
  export const getAllCountryCodes = (): string[] => {
    return Object.keys(backendCountries);
  };

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
  
    return descriptions[countryCode] || `${getCountryNameByCode(countryCode) || countryCode}는 광활한 영토와 다양한 기후대를 보유한 국가로, 환경 보존과 지속 가능한 발전을 위해 노력하고 있습니다.`;
  };
  
  export default {
    getCountryCodeByName,
    getCountryNameByCode,
    getAllCountryCodes,
    getCountryDescription,
    countryNameToCode,
    countryCodeToName,
    backendCountries
  };