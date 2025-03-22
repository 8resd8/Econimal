const ChecklistItem = ({
  description,
  exp,
}: {
  description: string;
  exp: number;
}) => {
  return (
    <div>
      <h3 className='font-bold flex items-center space-x-2'>
        <span className='flex items-center text-yellow-500 border-solid border-yellow-100'>
          <p className='text-sm text-gray-600'>{description}</p>⭐{' '}
          <span className='ml-1 text-sm'>{exp}</span>
        </span>
      </h3>
    </div>
  );
};

export default ChecklistItem;
