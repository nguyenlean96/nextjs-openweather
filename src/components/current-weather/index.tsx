import { useWeatherContext } from '@/context/WeatherDataProvider'
import { motion } from 'framer-motion'

export default function CurrentWeather() {
  const { isACityFound, currentWeather } = useWeatherContext();
  return (
    <div>
      {/* CITY NAME */}
      {
        isACityFound
        &&
        <div className="bg-gray-50/60 backdrop-blur-sm p-0.5 px-3 rounded w-fit mb-3 resize-none hover:resize hover:ring-1 ring-black/10">
          <motion.svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24"
            className="w-5 h-5 inline-block mr-0.5"
            // Make the icon bounce
            initial={{ y: -18 }}
            animate={{ y: [-4, -8, -4] }}
            transition={{ duration: 1.5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"></path>
          </motion.svg>
          <h3 className="text-base xl:text-lg inline-block text-gray-600">{String(currentWeather?.name)}</h3>
        </div>
      }

      {
        isACityFound &&
        <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50/20 md:from-gray-50/40 via-gray-100/40 md:via-gray-100/60 to-gray-200/50 md:to-gray-200 backdrop-blur-sm mb-3 grid grid-cols-1 xl:grid-cols-2">
          <div className="p-6">
            {/* CURRENT TEMPERATURE */}
            <h3 className="text-center xl:text-start text-5xl xl:text-7xl py-6 text-gray-600">{Math.round(currentWeather?.main.temp)}&deg;</h3>
            {/* WEATHER DESCRIPTION */}
            <div className='text-gray-600 text-lg xl:text-xl text-center xl:text-start'>
              {String(currentWeather?.weather[0].description)
                .split(' ')
                .map(
                  (word, index) =>
                    word.toUpperCase().charAt(0) +
                    word.slice(1) +
                    (index < word.length - 1 ? ' ' : '')
                )}
            </div>
          </div>
          {/* WEATHER ICON */}
          <div className='flex justify-center xl:justify-end h-full items-center -translate-y-8 xl:-translate-x-8'>
            <img
              className='w-24 md:w-32 xl:w-36 h-24 md:h-32 xl:h-36'
              src={`http://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}@2x.png`}
              alt='weather icon'
            />
          </div>
        </div>
      }
    </div>
  )
}
