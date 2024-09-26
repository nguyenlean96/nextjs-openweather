import { useEffect, useState, useRef } from "react";
import { useWeatherContext } from "@/context/WeatherDataProvider";
import { useDebounce, useInfiniteLoading } from "@/hooks";
import { motion } from "framer-motion";
import { getTime } from "@/util/Time";
import SearchPanel from "../SearchPanel"



export default function Main() {
  const { city, currentWeather, isCityLoading, isACityFound } = useWeatherContext();

  useEffect(() => { }, [isACityFound, isCityLoading, city]);

  return (
    <div className="grid grid-cols-4">
      <SearchPanel />
      <div className="col-span-3 relative">
        {
          currentWeather && (String(currentWeather?.weather[0].icon).startsWith('01d') || String(currentWeather?.weather[0].icon).startsWith('02d') || String(currentWeather?.weather[0].icon).startsWith('03d')) && (
            <div className="z-0 absolute top-0 left-0 w-full h-[16rem] bg-gradient-to-b from-blue-300 via-blue-200/40 to-blue-100/0"></div>
          )
        }
        {
          currentWeather && (String(currentWeather?.weather[0].icon).startsWith('01n') || String(currentWeather?.weather[0].icon).startsWith('02n') || String(currentWeather?.weather[0].icon).startsWith('03n')) && (
            <div className="z-0 absolute top-0 left-0 w-full h-[16rem] bg-gradient-to-b from-slate-400 via-slate-300/50 to-gray-50/0"></div>
          )
        }
        {
          currentWeather && (String(currentWeather?.weather[0].icon).startsWith('04n')) && (
            <div className="z-0 absolute top-0 left-0 right-0 w-full h-[16rem] bg-gradient-to-b from-gray-200 via-gray-50/50 to-gray-50/0"></div>
          )
        }
        <div className="absolute top-0 left-0 right-0 w-full h-screen z-10">
          {/* MAX TEMPERATURE */}
          <div className="">
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-thermometer-high inline-block'
              viewBox='0 0 16 16'
            >
              <path d='M9.5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585a1.5 1.5 0 0 1 1 1.415z' />
              <path d='M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z' />
            </svg>
            {`H: ${Math.round(currentWeather?.main.temp_max)}`}
            &deg;
          </div>

          {/* MIN TEMPERATURE */}
          <div className="">
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-thermometer-low inline-block'
              viewBox='0 0 16 16'
            >
              <path d='M9.5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585a1.5 1.5 0 0 1 1 1.415z' />
              <path d='M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z' />
            </svg>
            {`L: ${Math.round(currentWeather?.main.temp_min)}`}
            &deg;
          </div>

          {/* CURRENT TEMPERATURE */}
          <div className=''>
            {Math.round(currentWeather?.main.temp)}&deg;
          </div>

          {/* CITY NAME */}
          <div className=''>
            {String(currentWeather?.name)}
          </div>

          {/* WEATHER ICON */}
          <div className=''>
            <img
              className='w-24 h-24'
              src={`http://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}@2x.png`}
              alt='weather icon'
            />
          </div>

          {/* WEATHER DESCRIPTION */}
          <div className=''>
            {String(currentWeather?.weather[0].description)
              .split(' ')
              .map(
                (word, index) =>
                  word.toUpperCase().charAt(0) +
                  word.slice(1) +
                  (index < word.length - 1 ? ' ' : '')
              )}
          </div>


          <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width='24'
              height='24'
              fill='currentColor'
              className="inline-block p-1.5 translate-y-0.5 -translate-x-0.5 transition-all ease-in-out"
              style={{
                rotate: `${(parseInt(currentWeather?.wind?.deg) - 45)}deg`,
              }}
            >
              <path d="M444.5 3.5L28.7 195.4c-48 22.4-32 92.8 19.2 92.8h175.9v175.9c0 51.2 70.4 67.2 92.8 19.2l191.9-415.8c16-38.4-25.6-80-64-64z" />
            </svg>
            {currentWeather?.wind?.speed?.toFixed(2)} m/s
          </div>

          <div className="">
            <svg
              className='w-6 h-6 transition-all ease-in-out inline-block'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
              />
            </svg>
            {getTime(currentWeather?.sys.sunrise)}
          </div>

          <div className="">
            <svg
              className='w-6 h-6 transition-all ease-in-out inline-block'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z'
                clipRule='evenodd'
              />
            </svg>
            {getTime(currentWeather?.sys.sunset)}
          </div>
          <div className=""></div>
          <div className=""></div>
          <div className=""></div>
          <div className=""></div>

          <div className=''>
            <div className=''>
              <div className="">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}


function Cloud({ colorClass, props }: { colorClass?: string, props?: any }) {
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