const CharNextChap = ({ text, help }: { text: string; help: string }) => {
  return (
    <button className='mt-4 rounded-lg text-black p-5 bg-white hover:bg-red-50/70 text-lg'>
      {text}
    </button>
  );
};
export default CharNextChap;
