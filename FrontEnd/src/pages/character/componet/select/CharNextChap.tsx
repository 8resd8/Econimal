const CharNextChap = ({
  text,
  handleChar,
}: {
  text: string;
  handleChar: () => void;
}) => {
  return (
    <button
      className='mt-4 rounded-lg text-black p-5 bg-white hover:bg-red-50/70 text-lg'
      onClick={handleChar}
    >
      {text}
    </button>
  );
};
export default CharNextChap;
