import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Components
import WorldMap from './components/WorldMap';
// import ExtinctionCardGame from './components/ExtinctionCardGame';
// import AnalyticsGraph from './components/AnalyticsGraph';
// import EnvironmentContribution from './components/EnvironmentContribution';
import RegionInfo from './components/RegionInfo';

// Features (API 관련)
// import { fetchWorldData } from './features/worldDataApi';
// import { fetchExtinctionSpecies } from './features/extinctionSpeciesApi';
// import { fetchAnalyticsData } from './features/analyticsApi';
// import { fetchUserContribution } from './features/userContributionApi';
// import { fetchRegionInfo } from './features/regionInfoApi';

// styled-components 타입 추가
const EarthContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

// 인터페이스 정의
interface RegionData {
  name: string;
  description: string;
  [key: string]: any;
}

const Earth: React.FC = () => {
  // 각 기능별 상태 관리
  const [worldData, setWorldData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
//   const [extinctionSpecies, setExtinctionSpecies] = useState<any[]>([]);
//   const [analyticsData, setAnalyticsData] = useState<any>(null);
//   const [userContribution, setUserContribution] = useState<any>(null);
  const [regionInfo, setRegionInfo] = useState<RegionData | null>(null);
  
  // 초기 데이터 로딩
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 실제 API 연동 시 주석 해제
        // const worldDataResponse = await fetchWorldData();
        // setWorldData(worldDataResponse);
        
        // 임시 데이터
        setWorldData({});
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      }
    };
    
    loadInitialData();
  }, []);
  
  // 지역 선택 핸들러
  const handleRegionSelect = async (region: string) => {
    setSelectedRegion(region);
    try {
      // 실제 API 연동 시 주석 해제
      // const regionData = await fetchRegionInfo(region);
      // setRegionInfo(regionData);
      
      // 임시 데이터
      setRegionInfo({
        name: region,
        description: `${region}에 대한 설명`,
      });
    } catch (error) {
      console.error('지역 정보 로딩 실패:', error);
    }
  };
  
  return (
    <div className='bg-slate-500'>
      <EarthContainer>
        {/* 세계지도 구현 섹션 */}
        <Section>
          <WorldMap 
            data={worldData} 
            onRegionSelect={handleRegionSelect} 
          />
          {selectedRegion && <RegionInfo data={regionInfo} />}
        </Section>
        
        {/* 멸종위기종 돌봄 카드 짝 맞추기 게임 */}
        {/* <Section>
          <ExtinctionCardGame />
        </Section> */}
        
        {/* AI 분석 그래프 구현 */}
        {/* <Section>
          <AnalyticsGraph data={analyticsData} />
        </Section> */}
        
        {/* 내 환경 기여도 표시 */}
        {/* <Section>
          <EnvironmentContribution data={userContribution} />
        </Section> */}
      </EarthContainer>
    </div>
  );
};

export default Earth;