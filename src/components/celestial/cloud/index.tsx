import React from 'react'

export default function Cloud({ colorClass, props }: { colorClass?: string, props?: any }) {
  return (
    <div className="relative h-80 overflow-visible">
      <div className={"absolute bottom-0 left-0 w-52 h-16 rounded-full overflow-visible " + (colorClass ?? 'bg-gray-100')}>
        <div className="relative h-full overflow-visible">
          <div className={"absolute top-0 -translate-y-1/2 translate-x-1/4 left-0 w-28 h-28 rounded-full z-10 " + (colorClass ?? 'bg-gray-100')}></div>
          <div className={"absolute top-0 -translate-y-1/2 -translate-x-1/2 right-0 w-16 h-16 rounded-full z-10 " + (colorClass ?? 'bg-gray-100')}></div>
        </div>
      </div>
    </div>
  )
}
