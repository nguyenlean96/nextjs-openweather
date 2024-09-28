export default function Toggler({
  value,
  onClick,
}: {
  value: boolean;
  onClick: () => void;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" onClick={() => onClick()} />
      <div className={'h-6 w-11 relative flex items-center rounded-full dark:bg-gray-700 peer px-0.5 ' + (value ? 'bg-blue-500' : 'hover:bg-blue-100 bg-gray-200')}
      >
        <div className={'h-5 w-5 rounded-full bg-white border border-gray-300 dark:border-gray-600 transition-all ' + (value ? 'translate-x-full' : '-translate-x-0')}
        ></div>
      </div>
    </label>
  )
}
