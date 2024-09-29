import { motion } from 'framer-motion';
import { useWeatherContext } from '@/context/WeatherDataProvider';
export default function HourlyForecast() {
  const { isForecastLoading, hourlyForecastData } = useWeatherContext();
  return (!isForecastLoading &&
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
        <div className='flex items-center justify-evenly overflow-x-auto pb-3'>
          {
            hourlyForecastData && hourlyForecastData?.list.map((hour: any, index: number) =>
            (
              <div key={index} className='flex flex-col items-center justify-center text-white min-w-[5rem] py-2'>
                <div className='text-sm'>{hour.dt_txt.split(' ')[1].slice(0, 5)}</div>
                <div className='flex items-center justify-center'>
                  <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt={hour.weather[0].description} className='w-14 h-14 opacity-90' />
                </div>
                <div>{Math.round(hour.main.temp).toFixed(0)}&deg;</div>
              </div>
            )
            )}
        </div>
      </motion.div>
    </div>
  )
}
