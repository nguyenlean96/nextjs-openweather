import { useRef } from 'react';
import { motion } from 'framer-motion';
import { getTime } from '@/util';
import { useWeatherContext } from '@/context/WeatherDataProvider';
import { TheMoon } from '@/components/celestial';

export default function SunSet() {
  const { currentWeather }: { currentWeather: any } = useWeatherContext();
  const sunsetDisplayingAreaRef = useRef<HTMLDivElement>(null);
  const sunsetAnimationDivRef = useRef<SVGSVGElement | null>(null);

  return (
    <div className={"bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-full " + (currentWeather?.sys?.sunset ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-12')}
      ref={sunsetDisplayingAreaRef}
    >
      {
        currentWeather?.sys?.sunset ? (
          <div className="px-2 w-full h-full overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute left-0 top-0 p-1">
                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun sets</span> <span className="text-2xl text-white/80 ">{getTime(currentWeather?.sys.sunset)}</span></div>
              </div>
              <div className="absolute left-0 top-2/3 w-full border"></div>
              <div
                style={{
                  transform: `translateX(${(sunsetDisplayingAreaRef.current && sunsetAnimationDivRef.current) ?
                    ((sunsetDisplayingAreaRef.current.clientWidth - sunsetAnimationDivRef.current.clientWidth) / 2)
                    : 0}px)`,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[2rem] left-0 xl:right-0 z-0 opacity-60"
                  ref={sunsetAnimationDivRef}
                >
                  <path d="M 6 90 Q 58.5 6, 135 75 T 270 60" stroke="#eee" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                </svg>
                <motion.div
                  className="absolute top-[2rem] left-0 z-50"
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
          </div>
        ) : (
          <div className="bg-gray-50 animate-pulse w-full h-full rounded-lg"></div>
        )
      }
    </div>
  )
}
