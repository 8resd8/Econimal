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
  
  export default {
    getCountryCodeByName,
    getCountryNameByCode,
    getAllCountryCodes,
    countryNameToCode,
    countryCodeToName,
    backendCountries
  };