import { useState, useEffect, useRef } from 'react';
import { m, motion } from 'framer-motion';
import { getDayOfWeek } from '@/util';
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
      return Math.max(...dailyForecastData?.list
        // Filter out days with max temp only
        .map((day: { main: any; }) => day.main.temp_max)
      );
    }
    return -1;
  }
  function getTempMin() {
    if (dailyForecastData) {
      return Math.min(...dailyForecastData?.list
        // Filter out days with min temp only
        .map((day: { main: any; }) => day.main.temp_min)
      );
    }
    return -1;
  }

  function getTempPos(temp: number) {
    const tempMax = getTempMax();
    const tempMin = getTempMin();
    const tempAvg = tempMax === tempMin ? 0 : ((temp - tempMin) / (tempMax - tempMin));
    //prettier-ignore
    return {
      min: tempMin,
      max: tempMax,
      avg: tempAvg,
    }
  }

  return (
    !isCityLoading && !isForecastLoading &&
    dailyForecastData && (
      <>
        <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full p-2 mb-3 grid gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 1,
            duration: 0.5,
          }}
        >
          <div className="w-full p-1 border-b">
            <span className="text-gray-50/80 font-semibold">{String(`Next 6-day forecast`)}</span>
          </div>
          <div className='w-full'>
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
  const [tempPos, setTempPos] = useState<number>(0);
  const [tempMax, setTempMax] = useState<number>(0);
  const [tempMin, setTempMin] = useState<number>(0);
  const [thisTempRange, setThisTempRange] = useState<number>(0);

  useEffect(() => {
    const { min, max, avg } = tempResolve(day.main.temp);
    setTempMax(max);
    setTempMin(min);
    setThisTempRange(prev => ((day.main.temp_max - day.main.temp_min) / (max - min)));
    if (tempRangeBar.current && tempIndicator.current) {
      // console.log('min', min, 'max', max, 'avg', avg);
      let indicatorOffset = (avg.toFixed(4) * tempRangeBar.current?.offsetWidth);

      if (indicatorOffset + tempIndicator.current?.offsetWidth > tempRangeBar.current?.offsetWidth) {
        indicatorOffset = (indicatorOffset - tempIndicator.current?.offsetWidth) * .99;
      }
      setTempPos((prev) => indicatorOffset);
    }
  }, [day.main.temp, day.main.temp_max, tempRangeBar.current, tempIndicator.current]);

  return (
    <div className='grid grid-cols-11 w-full pr-4'>
      <div className='text-gray-50 col-span-2'>
        <div className={'text-base ' + (position === 0 ? 'font-semibold' : '')}>{getDayOfWeek(day.dt)}</div>
      </div>
      <div className='col-span-2 flex items-center justify-center'>
        {
          day?.weather[0]?.icon && (
            <img className='-translate-y-2 w-4/5' src={`http://openweathermap.org/img/wn/${day?.weather[0]?.icon}.png`} alt={day?.weather[0]?.description} />
          )
        }
      </div>
      <div className='col-span-7'>
        <div className='hidden bg-gradient-to-r from-blue-600 via-green-500 to-orange-600 w-full h-2 rounded ring-1 ring-white'></div>
        <div className='grid grid-cols-12 w-full gap-x-2'>
          <div className='text-blue-200 text-base xl:text-lg text-center font-semibold'>
            {Math.floor(day.main.temp_min)}
            &deg;
          </div>
          <div className='col-span-10 w-full flex items-center justify-center px-2'>
            <div className='relative ring-1 ring-white bg-indigo-600/40 h-2 lg:h-2 2xl:h-2.5 rounded-full animate-gradient-x w-full mb-2 translate-y-1'
              ref={tempRangeBar}
            >
              <div ref={tempIndicator}
                className=' absolute top-0 z-10 rounded-full border border-[#333] bg-[#fff] h-full drop-shadow-sm'
                style={{
                  width: (tempIndicator.current ? (tempIndicator.current?.offsetHeight) : '0.6rem'),
                  marginLeft: `${tempPos}px`,
                }}
              ></div>
              {tempMax !== tempMin && (
                <div className='hidden top-0 z-0 bg-gradient-to-r from-orange-500 via-orange-500/90 to-orange-500 rounded-full ring-1 ring-white h-full opacity-90'
                  style={{
                    width: (thisTempRange * (tempRangeBar.current ? tempRangeBar.current.offsetWidth : 0)).toFixed(2) + 'px',
                    marginLeft: `${tempPos === 0 ? 0 : (tempPos - ((thisTempRange * (tempRangeBar.current ? tempRangeBar.current.offsetWidth : 0) / 2)))}px`,
                  }}
                ></div>
              )}
            </div>
          </div>
          <div className='text-white text-base xl:text-lg text-start font-semibold'>
            {Math.round(day.main.temp_max)}
            &deg;
          </div>
        </div>
      </div>
    </div>
  );
}