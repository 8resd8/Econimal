import MyHouse from './components/MyHouse';
import RecyclingCenter from './components/RecyclingCenter';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import Vehicle from './components/Vehicle';
import Court from './components/Court';

const Town = () => {
  return (
    <>
      <div>🏙️ 마을에 온 걸 환영해</div>
      <MyHouse />
      <RecyclingCenter />
      <SewageTreatmentCenter />
      <Vehicle />
      <Court />
    </>
  );
};
export default Town;
