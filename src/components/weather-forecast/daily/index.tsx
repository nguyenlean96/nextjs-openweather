import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMonth, getDayOfWeek, getDateString } from '@/util';
import { useWeatherContext } from '@/context/WeatherDataProvider';

export default function DailyForecast({ width, height, props }: { width: number; height: number; props?: any }) {
  const {
    // forecastData,
    dailyForecastData,
    isCityLoading,
    isForecastLoading,
    currentWeatherError,
    forecastError
  }: {
    dailyForecastData: {
      list: Array<any>;
      message?: number;
      cnt?: number;
      cod?: string;
      city?: any;
    };
    isCityLoading: boolean;
    isForecastLoading: boolean;
    currentWeatherError: any;
    forecastError: any;
  } = useWeatherContext();

  function getTempMax() {
    if (dailyForecastData) {
      return Math.max(...dailyForecastData?.list.map((day: {
        main: any;
      }) => day.main.temp_max));
    }
    return -1;
  }
  function getTempMin() {
    if (dailyForecastData) {
      return Math.min(...dailyForecastData?.list.map((day: {
        main: any;
      }) => day.main.temp_min));
    }
    return -1;
  }

  function getTempPos(temp: number) {
    //prettier-ignore
    return getTempMax() === getTempMin() ? 0 : ((temp - getTempMin()) / (getTempMax() - getTempMin()));
  }

  return (
    !isCityLoading && !isForecastLoading &&
    dailyForecastData && (
      <>
        <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full p-2 mb-3 grid gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full p-1 border-b">
            <span className="text-white">{String(`Next 6-day forecast`)}</span>
          </div>
          <div className='w-full px-4'>
            {dailyForecastData?.list
              .sort((a: any, b: any) => parseInt(a.dt) - parseInt(b.dt))
              .map((day: any, index: number) => (
                <div className="w-full" key={index}>
                  {
                    day?.weather[0] &&
                    <ForecastDayDisplay
                      position={index}
                      isCityLoading={isCityLoading}
                      isForecastLoading={isForecastLoading}
                      day={day}
                      width={width}
                      height={height}
                      tempResolve={getTempPos}
                    />
                  }
                </div>
              ))
            }
          </div>
        </motion.div>
      </>
    )
  )
}

const ForecastDayDisplay = (props: any) => {
  const tempRangeBar = useRef<HTMLDivElement>(null);
  const tempIndicator = useRef<HTMLDivElement>(null);
  const { position, day, width, height, tempResolve } = props;
  const [tempPos, setTempPos] = useState<string>('');

  useEffect(() => {
    if (tempRangeBar.current && tempIndicator.current) {
      let indicatorOffset = (tempResolve(day.main.temp).toFixed(4) * tempRangeBar.current?.offsetWidth);

      if (indicatorOffset + tempIndicator.current?.offsetWidth > tempRangeBar.current?.offsetWidth) {
        indicatorOffset = (indicatorOffset - tempIndicator.current?.offsetWidth) * .99;
      }
      setTempPos(
        (prev) =>
          `${
          // tempResolve(Math.round(day.main.temp)) *
          //   (width > 1280 ? 12 : width > 1024 ? 10 : 8) <
          //   0
          //   ? 0
          //   : tempResolve(Math.round(day.main.temp)) *
          //     (width > 1280 ? 12 : width > 1024 ? 10 : 8) >
          //     tempResolve(Math.round(day.main.temp_max)) *
          //     (width > 1280 ? 12 : width > 1024 ? 10 : 8)
          //     ? tempResolve(Math.round(day.main.temp_max)) *
          //     (width > 1280 ? 12 : width > 1024 ? 10 : 8)
          //     : tempResolve(Math.round(day.main.temp)) *
          //     (width > 1280 ? 12 : width > 1024 ? 10 : 8)
          indicatorOffset

          }px`
      );
    }
  }, [day.main.temp, day.main.temp_max, width, height]);

  return (
    <div className='grid grid-cols-11 w-full'>
      <div className='text-gray-50 col-span-2'>
        <div className={'text-xl ' + (position === 0 ? 'font-semibold' : '')}>{getDayOfWeek(day.dt)}</div>
      </div>
      <div className='col-span-2 flex items-center justify-center'>
        {
          day?.weather[0]?.icon && (
            <img className='-translate-y-2' src={`http://openweathermap.org/img/wn/${day?.weather[0]?.icon}.png`} alt={day?.weather[0]?.description} />
          )
        }
      </div>
      <div className='col-span-7'>
        <div className='grid grid-cols-12 w-full gap-x-2'>
          <div className='text-blue-200 xl:text-xl text-center'>
            {Math.round(day.main.temp_min)}
            &deg;
          </div>
          <div className='col-span-10 w-full flex items-center justify-center px-2'>
            <div className='flex items-center border border-[#fff] bg-gradient-to-r from-blue-600 via-green-500 to-orange-600 h-2 lg:h-2.5 xl:h-3 rounded-full animate-gradient-x w-full mb-2 translate-y-1'
              ref={tempRangeBar}
            >
              <div ref={tempIndicator}
                className='rounded-full border border-[#333] bg-[#fff] lg:w-2 xl:w-[0.6rem] h-full z-10 drop-shadow-sm'
                style={{
                  marginLeft: tempPos,
                }}
              ></div>
            </div>
          </div>
          <div className='text-white xl:text-xl text-center'>
            {Math.round(day.main.temp_max)}
            &deg;
          </div>
        </div>
      </div>
    </div>
  );
}