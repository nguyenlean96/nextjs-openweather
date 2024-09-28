import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useWeatherContext } from '@/context/WeatherDataProvider'

export default function WindSpeedPanel({ width, height }: { width: number; height: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const informationSideRef = useRef<HTMLDivElement>(null);
  const windDirectionContainerRef = useRef<HTMLDivElement>(null);
  const { currentWeather } = useWeatherContext();
  const [wdcTranslateX, setWdcTranslateX] = useState<number>(0);
  useEffect(() => {
    // Check whether the wind direction container is out side of the container
    if (containerRef.current && windDirectionContainerRef.current && informationSideRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const windDirectionContainerRect = windDirectionContainerRef.current.getBoundingClientRect();
      const informationSideRect = informationSideRef.current.getBoundingClientRect();
      setWdcTranslateX((prev: number) => (informationSideRect.width / 2 - windDirectionContainerRect.width / 2));
    }
  }, [currentWeather, width, height]);
  return (
    <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full mb-3"
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4 p-1 pt-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2" fill="#fff"
          viewBox="0 0 512 512">
          <path d="M156.7 256H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h142.2c15.9 0 30.8 10.9 33.4 26.6 3.3 20-12.1 37.4-31.6 37.4-14.1 0-26.1-9.2-30.4-21.9-2.1-6.3-8.6-10.1-15.2-10.1H81.6c-9.8 0-17.7 8.8-15.9 18.4 8.6 44.1 47.6 77.6 94.2 77.6 57.1 0 102.7-50.1 95.2-108.6C249 291 205.4 256 156.7 256zM16 224h336c59.7 0 106.8-54.8 93.8-116.7-7.6-36.2-36.9-65.5-73.1-73.1-55.4-11.6-105.1 24.9-114.9 75.5-1.9 9.6 6.1 18.3 15.8 18.3h32.8c6.7 0 13.1-3.8 15.2-10.1C325.9 105.2 337.9 96 352 96c19.4 0 34.9 17.4 31.6 37.4-2.6 15.7-17.4 26.6-33.4 26.6H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16zm384 32H243.7c19.3 16.6 33.2 38.8 39.8 64H400c26.5 0 48 21.5 48 48s-21.5 48-48 48c-17.9 0-33.3-9.9-41.6-24.4-2.9-5-8.7-7.6-14.5-7.6h-33.8c-10.9 0-19 10.8-15.3 21.1 17.8 50.6 70.5 84.8 129.4 72.3 41.2-8.7 75.1-41.6 84.7-82.7C526 321.5 470.5 256 400 256z" />
        </svg>
        <span className="text-white">{String(`Wind`).toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-x-4 px-4 pb-3">
        <div className="w-1/2" ref={informationSideRef}>
          <motion.div className="text-white flex items-center justify-between border-b border-gray-50 p-2.5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>Wind</div>
            <div>{currentWeather?.wind?.speed ? String(`${(parseFloat(currentWeather?.wind?.speed) * 3.6).toFixed(1)} km/h`) : 'N/A'}</div>
          </motion.div>
          <motion.div className="text-white flex items-center justify-between border-b border-gray-50 p-2.5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>Gusts</div>
            <div>{currentWeather?.wind?.gust ? String(`${(parseFloat(currentWeather?.wind?.gust) * 3.6).toFixed(1)} km/h`) : 'N/A'}</div>
          </motion.div>
          <motion.div className="text-white flex items-center justify-between p-2.5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>Direction</div>
            <div>{currentWeather?.wind?.deg}&deg;
              {
                currentWeather?.wind?.deg < 90 ? ' NE' :
                  currentWeather?.wind?.deg < 180 ? ' SE' :
                    currentWeather?.wind?.deg < 270 ? ' SW' :
                      currentWeather?.wind?.deg < 360 ? ' NW' :
                        currentWeather?.wind?.deg === 0 ? ' N' :
                          currentWeather?.wind?.deg === 90 ? ' E' :
                            currentWeather?.wind?.deg === 180 ? ' S' :
                              currentWeather?.wind?.deg === 270 ? ' W' : ' N'
              }
            </div>
          </motion.div>
        </div>
        <div className="relative h-[10rem] w-[10rem]">
          <div className="w-full h-full"
            ref={windDirectionContainerRef}
            style={{
              transform: `translateX(${wdcTranslateX}px) translateY(-.75rem)`,
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-white/80">N</div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-white/80">W</div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-white/80">S</div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-white/80">E</div>
            <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7.8rem] h-[7.8rem] bg-blue-400 rounded-full"></div>
            {
              // Generate 60 markers for the wind direction
              Array.from({ length: 60 }).map((_, index) => (
                <div key={index} className="absolute top-1/2 left-1/2 bg-white/80 z-0 transition-all ease-in-out duration-1000"
                  style={{
                    width: '1px',
                    height: '4.5rem',
                    transform: `rotate(${index * 6}deg)`,
                    transformOrigin: 'top center',
                    display: [59, 0, 1, 14, 15, 16, 29, 30, 31, 44, 45, 46].includes(index) ? 'none' : 'block',
                  }}
                ></div>
              ))
            }
            <div className="z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3rem] h-[3rem] rounded-full bg-blue-400 flex flex-col justify-center ring-1 ring-white/20">
              <p className="text-center text-white leading-none text-lg">{(parseFloat(currentWeather?.wind?.speed) * 3.6).toFixed(0)}</p>
              <p className="text-center text-white text-sm">km/h</p>
            </div>
            <div className="absolute top-0 right-0 w-full h-full z-20">
              <motion.div className="flex justify-center items-center transition-all ease-in-out duration-1000 delay-1000"
                initial={{ rotate: 0 }}
                whileInView={{ rotate: currentWeather?.wind?.deg }}
                exit={{ rotate: 0 }}
                transition={{ 
                  duration: 1,
                  type: 'spring',
                  stiffness: 300,
                }}
              >
                <svg className="scale-75 -translate-y-2"
                  fill="none"
                  strokeWidth="1"
                  stroke="#fff"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.25 5.75 12 3m0 0 3 2.75M12 3v20"></path>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
