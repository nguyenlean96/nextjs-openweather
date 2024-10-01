import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeatherContext } from '@/context/WeatherDataProvider';
export default function HourlyForecast() {
  const { isForecastLoading, hourlyForecastData } = useWeatherContext();
  
  const chartDisplayAreaRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<number[]>([]);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);

  const [chartWidth, setChartWidth] = useState<number | null>(null);
  const [chartHeight, setChartHeight] = useState<number | null>(null);
  useEffect(() => {
    if (hourlyForecastData) {
      if (hourlyForecastData.list) {
        setData(hourlyForecastData.list.map((hour: any) => hour.main.temp));
      }
    }
  }, [hourlyForecastData]);

  useEffect(() => {
    // This useEffect waits for the component to fully render, then grabs the ref's dimensions
    const handleResize = () => {
      if (chartDisplayAreaRef.current) {
        setChartWidth(chartDisplayAreaRef.current.scrollWidth || 600);
        setChartHeight((chartDisplayAreaRef.current.offsetHeight) || 400);
      }

      console.log('Resized');
    };

    // Initially set chart dimensions when the component mounts
    if (chartDisplayAreaRef.current) {
      handleResize();
      setIsChartReady(prev => true); // Once we know the area size, set the chart ready
    }
  }, [chartDisplayAreaRef.current]);

  return (
    <div className='relative'>
      <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-fit p-2 text-white mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.5,
        }}
      >
        <div className="w-full p-1 border-b">
          <span className="text-white">{String(`Hourly forecast`)}</span>
        </div>
        <div className='relative overflow-x-auto overflow-y-hidden pb-3 z-10'>
          {
            hourlyForecastData &&
            <div className='z-10 w-full flex items-center justify-evenly ' ref={chartDisplayAreaRef}>
              {
                hourlyForecastData?.list &&
                hourlyForecastData?.list.map((hour: any, index: number) =>
                (
                  <EachHour key={index} hour={hour} index={index} />
                )
                )
              }
            </div>
          }
          {
            !isForecastLoading && isChartReady && chartWidth && chartHeight &&
            <div className='absolute left-0 right-0 -bottom-3 -z-10'>
              <LineChart data={data} width={chartWidth} height={chartHeight} />
            </div>
          }
        </div>
      </motion.div>
    </div>
  )
}

const EachHour = ({ hour, index }: {
  hour: any;
  index: number;
}): JSX.Element => {
  const hourTileRef = useRef<HTMLDivElement>(null);
  return (
    <div className='min-w-[5rem] p-1 py-2'
      ref={hourTileRef}
    >
      <div className='flex flex-col items-center justify-center text-white bg-white/5 rounded-lg'>
        <div className='text-sm'>{hour.dt_txt.split(' ')[1].slice(0, 5)}</div>
        <div className='flex items-center justify-center'>
          <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt={hour.weather[0].description} className='w-14 h-14 opacity-90' />
        </div>
        <div>{Math.round(hour.main.temp).toFixed(0)}&deg;</div>
      </div>
    </div>
  )
}

const LineChart = ({ data, width, height }: {
  data: number[];
  width?: number;
  height?: number;
}) => {
  const [linePath, setLinePath] = useState<string>('');

  useEffect(() => {
    const maxDataValue = Math.max(...data);
    const minDataValue = Math.min(...data);
    const padding = 40;
    if (width === undefined || height === undefined) return;
    // Scale data to fit the width and height
    const xScale = (value: number, index: number) => (index / (data.length - 1)) * (width - padding * 2) + padding;
    const yScale = (value: number) => height - ((value - minDataValue) / (maxDataValue - minDataValue)) * (height - padding * 2) - padding;

    // Create the line path for the chart and add a smooth curve
    setLinePath(prev => data.map((value, index) =>
      index === 0
        ? `M ${xScale(value, index)} ${yScale(value)}`
        : `L ${xScale(value, index)} ${yScale(value)}`
    ).join(' '))

  }, [data, width, height]);

  return (

    <svg className='opacity-80' width={width} height={height}>
      <path d={linePath} stroke="white" fill="none" strokeWidth="1.6" />
    </svg>
  );
};