import { useState } from 'react';

export function Accordion(
  {
    title,
    position,
    children,
  }: {
    title: string;
    position?: string;
    children?: React.ReactNode;
  }
) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className='w-full'>
      <h2 className='sticky top-0 z-20'>
        <button type="button"
          className={"flex items-center justify-between w-full p-2 px-3 font-medium rtl:text-right dark:border-gray-700 gap-3 " + (isExpanded ? 'text-white bg-blue-500' : 'text-gray-500 border border-gray-200 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800') + ((position === 'first' ? ' rounded-t-xl ' : '') + (position === 'last' ? ' rounded-b-xl' : ''))}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {title}
          <svg data-accordion-icon className={"w-3 h-3 shrink-0 transition-all ease-in-out " + (isExpanded ? 'rotate-0' : 'rotate-180')} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
          </svg>
        </button>
      </h2>
      {
        isExpanded && (
          <div className={"p-5 border-gray-200 dark:border-gray-700 dark:bg-gray-900 border " + (isExpanded ? 'border-b ' : 'border-b-0 ')}>
            {children}
          </div>
        )
      }
    </div>
  );
}
