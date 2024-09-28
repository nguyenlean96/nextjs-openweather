import { useWeatherContext } from "@/context/WeatherDataProvider";
import { motion } from "framer-motion";
import { getTime } from "@/util";
import { WindSpeedPanel, DailyForecast, HourlyForecast } from "@/components";
import { TheSun, TheMoon } from "@/components/celestial";
import { FogBackgroundEffect } from "@/components/fog-effect";

export default function Main({ width, height, props }: { width: number; height: number; props?: any }) {
  const { city, currentWeather, isCityLoading, isACityFound } = useWeatherContext();
  const { cityBackgroundUrl, isCityBackgroundLoading } = useWeatherContext();

  return (
    <div className="relative">
      {
        currentWeather && (String(currentWeather?.weather[0].icon).startsWith('01d') || String(currentWeather?.weather[0].icon).startsWith('02d') || String(currentWeather?.weather[0].icon).startsWith('03d') || String(currentWeather?.weather[0].icon).startsWith('04d')) && (
          <div className="z-10 absolute top-0 left-0 w-full h-screen"
            style={{
              boxShadow: `inset 0 0 50px #0ff, 
                            inset 20px 0 80px #0ff, 
                            inset 20px 0 300px rgba(255 255 255 / 0.4), 
                            inset -20px 0 80px #fff, 
                            inset -20px 0 300px #fff
                            `
            }}
          ></div>
        )
      }
      {
        currentWeather && (String(currentWeather?.weather[0].icon).startsWith('01n') || String(currentWeather?.weather[0].icon).startsWith('02n') || String(currentWeather?.weather[0].icon).startsWith('03n')) && (
          <div className="z-10 absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-slate-400 via-slate-300/50 to-gray-50/0"></div>
        )
      }
      {
        currentWeather && (String(currentWeather?.weather[0].icon).startsWith('04n')) && (
          <div className="z-10 absolute top-0 left-0 right-0 w-full h-[32dvh] bg-gradient-to-b from-gray-200 via-gray-50/50 to-gray-50/0"></div>
        )
      }
      {
        !isCityBackgroundLoading && cityBackgroundUrl && (
          <>
            <div className="z-0 absolute top-0 left-0 w-full h-screen bg-white/20 backdrop-blur-sm"></div>
            <div className="-z-10 absolute top-0 left-0 w-full h-screen">
              <img src={cityBackgroundUrl} alt="city background" className="object-cover w-full h-full" />
            </div>
          </>
        )
      }
      {
        // currentWeather && (String(currentWeather?.weather[0].icon).includes('50'))
        true
        &&
        <div className="fog absolute top-0 left-0 w-full z-50">
          <FogBackgroundEffect />
        </div>
      }
      <div className="absolute top-0 left-0 right-0 w-full h-screen overflow-y-scroll z-20 p-2 px-10 pt-16">
        {/* CITY NAME */}
        <div>
          <motion.svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24"
            className="w-6 h-6 inline-block mr-0.5"
            // Make the icon bounce
            initial={{ y: -10 }}
            animate={{ y: [-6, -10, -6] }}
            transition={{ duration: 1.5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"></path>
          </motion.svg>
          <h3 className="text-xl xl:text-2xl inline-block">{String(currentWeather?.name)}</h3>
        </div>

        <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50/40 via-gray-100/60 to-gray-200 backdrop-blur-sm mb-3 grid grid-cols-1 xl:grid-cols-2">
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

        <div className="w-full flex justify-center">
          {
            currentWeather?.rain && currentWeather?.rain['1h'] && (
              // Display warning for possible rain
              <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-fit xl:w-4/5 min-w-[18rem] p-2 mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full p-1 border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                    className="w-5 h-5 inline-block mr-2" fill="#fff"
                  >
                    <path d="M183.9 370.1c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm96 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm-192 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm384 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm-96 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zM416 128c-.6 0-1.1 .2-1.6 .2 1.1-5.2 1.6-10.6 1.6-16.2 0-44.2-35.8-80-80-80-24.6 0-46.3 11.3-61 28.8C256.4 24.8 219.3 0 176 0 114.2 0 64 50.1 64 112c0 7.3 .8 14.3 2.1 21.2C27.8 145.8 0 181.5 0 224c0 53 43 96 96 96h320c53 0 96-43 96-96s-43-96-96-96z" />
                  </svg>
                  <span className="text-white">{String(`Possible rain`)}</span>
                </div>
                <div className="text-white">
                  Possible rain in the next hour for up to
                  <span className="px-1">{currentWeather?.rain['1h']}</span>
                  mm/h
                </div>
              </motion.div>
            )
          }
          {
            currentWeather?.snow && currentWeather?.snow['1h'] && (
              <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-fit xl:w-4/5 min-w-[18rem] p-2 mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full p-1 border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                    className="w-5 h-5 inline-block mr-2" fill="#fff"
                  >
                    <path d="M440.1 355.2l-39.2-23 34.1-9.3c8.4-2.3 13.4-11.1 11.1-19.6l-4.1-15.5c-2.2-8.5-10.9-13.6-19.3-11.3L343 298.2 271.2 256l71.9-42.2 79.7 21.7c8.4 2.3 17-2.8 19.3-11.3l4.1-15.5c2.2-8.5-2.7-17.3-11.1-19.6l-34.1-9.3 39.2-23c7.5-4.4 10.1-14.2 5.8-21.9l-7.9-13.9c-4.3-7.7-14-10.3-21.5-5.9l-39.2 23 9.1-34.7c2.2-8.5-2.7-17.3-11.1-19.6l-15.2-4.1c-8.4-2.3-17 2.8-19.3 11.3l-21.3 81-71.9 42.2v-84.5L306 70.4c6.1-6.2 6.1-16.4 0-22.6l-11.1-11.3c-6.1-6.2-16.1-6.2-22.2 0l-24.9 25.4V16c0-8.8-7-16-15.7-16h-15.7c-8.7 0-15.7 7.2-15.7 16v46.1l-24.9-25.4c-6.1-6.2-16.1-6.2-22.2 0L142.1 48c-6.1 6.2-6.1 16.4 0 22.6l58.3 59.3v84.5l-71.9-42.2-21.3-81c-2.2-8.5-10.9-13.6-19.3-11.3L72.7 84c-8.4 2.3-13.4 11.1-11.1 19.6l9.1 34.7-39.2-23c-7.5-4.4-17.1-1.8-21.5 5.9l-7.9 13.9c-4.3 7.7-1.8 17.4 5.8 21.9l39.2 23-34.1 9.1c-8.4 2.3-13.4 11.1-11.1 19.6L6 224.2c2.2 8.5 10.9 13.6 19.3 11.3l79.7-21.7 71.9 42.2-71.9 42.2-79.7-21.7c-8.4-2.3-17 2.8-19.3 11.3l-4.1 15.5c-2.2 8.5 2.7 17.3 11.1 19.6l34.1 9.3-39.2 23c-7.5 4.4-10.1 14.2-5.8 21.9L10 391c4.3 7.7 14 10.3 21.5 5.9l39.2-23-9.1 34.7c-2.2 8.5 2.7 17.3 11.1 19.6l15.2 4.1c8.4 2.3 17-2.8 19.3-11.3l21.3-81 71.9-42.2v84.5l-58.3 59.3c-6.1 6.2-6.1 16.4 0 22.6l11.1 11.3c6.1 6.2 16.1 6.2 22.2 0l24.9-25.4V496c0 8.8 7 16 15.7 16h15.7c8.7 0 15.7-7.2 15.7-16v-46.1l24.9 25.4c6.1 6.2 16.1 6.2 22.2 0l11.1-11.3c6.1-6.2 6.1-16.4 0-22.6l-58.3-59.3v-84.5l71.9 42.2 21.3 81c2.2 8.5 10.9 13.6 19.3 11.3L375 428c8.4-2.3 13.4-11.1 11.1-19.6l-9.1-34.7 39.2 23c7.5 4.4 17.1 1.8 21.5-5.9l7.9-13.9c4.6-7.5 2.1-17.3-5.5-21.7z" />
                  </svg>
                  <span className="text-white">{String(`Possible rain`)}</span>
                </div>
                <div className="text-white">
                  Possible snow in the next hour for up to
                  <span className="px-1">{currentWeather?.snow['1h']}</span>
                  mm per hour
                </div>
              </motion.div>
            )
          }
        </div>
        <div className="col-span-2 w-full">
          <HourlyForecast />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-fit p-2 grid grid-cols-1 xl:grid-cols-3 py-4 text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              {/* MAX TEMPERATURE */}
              <div>
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
                <span className="text-base xl:text-lg">{`H: ${Math.round(currentWeather?.main.temp_max)}`}</span>
                &deg;
              </div>

              {/* MIN TEMPERATURE */}
              <div>
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
                <span className="text-base xl:text-lg">{`L: ${Math.round(currentWeather?.main.temp_min)}`}</span>
                &deg;
              </div>

              {/* FEELS LIKE */}
              <h5 className="text-lg xl:text-xl">
                {`Feels like ${Math.round(currentWeather?.main?.feels_like)}`}&deg;
              </h5>
            </motion.div>
            <div className="grid grid-cols-2 gap-2 h-[10rem] mb-3">
              <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {
                  currentWeather?.sys?.sunrise ? (
                    <div className="px-2 w-full h-full overflow-hidden">
                      <div className="relative w-full h-full">
                        <div className="absolute left-0 top-0 p-1">
                          <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun rises</span> <span className="text-2xl text-white/80 ">{getTime(currentWeather?.sys.sunrise)}</span></div>
                        </div>
                        <div className="absolute left-0 top-2/3 w-full border"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[1rem] -left-1/2 xl:-left-[20%] xl:right-0 z-0 opacity-60">
                          <path d="M 260 110 Q 187.5 6, 125 93 T 6 80" stroke="#eee" strokeWidth="3" strokeLinecap="round"
                            fill="transparent" />
                        </svg>
                        <motion.div
                          className="absolute top-[1rem] -left-1/2 xl:-left-[20%]"
                          style={{
                            zIndex: 50,
                            offsetPath: 'path("M 260 110 Q 187.5 6, 125 93 T 6 80")',
                          }}
                          initial={{
                            offsetDistance: '65%',
                          }}
                          animate={{
                            offsetDistance: '0%',
                          }}
                          transition={{
                            delay: 3,
                            duration: 120,
                            repeat: Infinity,
                          }}
                        >
                          <TheSun />
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 animate-pulse w-full h-full"></div>
                  )
                }
              </motion.div>
              <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {
                  currentWeather?.sys?.sunset ? (
                    <div className="px-2 w-full h-full overflow-hidden">
                      <div className="relative w-full h-full">
                        <div className="absolute left-0 top-0 p-1">
                          <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun sets</span> <span className="text-2xl text-white/80 ">{getTime(currentWeather?.sys.sunset)}</span></div>
                        </div>
                        <div className="absolute left-0 top-2/3 w-full border"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[2rem] -left-1/2 xl:-left-[20%] xl:right-0 z-0 opacity-60">
                          <path d="M 6 90 Q 58.5 6, 135 75 T 270 60" stroke="#eee" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                        </svg>
                        <motion.div
                          className="absolute top-[2rem] -left-1/2 xl:-left-[20%] z-50"
                          style={{
                            zIndex: 50,
                            offsetPath: 'path("M 6 90 Q 58.5 6, 135 75 T 270 60")',
                          }}
                          initial={{
                            offsetDistance: '35%',
                          }}
                          animate={{
                            offsetDistance: '100%',
                          }}
                          transition={{
                            delay: 3,
                            duration: 120,
                            repeat: Infinity,
                          }}
                        >
                          <TheMoon />
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 animate-pulse w-full h-full"></div>
                  )
                }
              </motion.div>
            </div>
            <WindSpeedPanel 
              width={width}
              height={height}
            />
          </div>
          <div>
            <DailyForecast
              width={width}
              height={height}
            />
          </div>
        </div>
      </div>
    </div>
  )
}