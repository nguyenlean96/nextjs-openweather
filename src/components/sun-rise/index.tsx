import { useRef } from 'react';
import { motion } from "framer-motion";
import { useWeatherContext } from "@/context/WeatherDataProvider";
import { getTime } from "@/util";
import { TheSun } from "@/components/celestial";

export default function SunRise() {
  const { currentWeather }: { currentWeather: any } = useWeatherContext();
  const sunriseDisplayingAreaRef = useRef<HTMLDivElement>(null);
  const sunriseAnimationDivRef = useRef<SVGSVGElement | null>(null);
  return (
    <div className={"bg-blue-500/80 backdrop-blur-sm rounded-xl w-full " + (currentWeather?.sys?.sunrise ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-12')}
      ref={sunriseDisplayingAreaRef}
    >
      {
        currentWeather?.sys?.sunrise ? (
          <div className="px-2 w-full h-full overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute left-0 top-0 p-1">
                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun rises</span> <span className="text-2xl text-white/80 ">{getTime(currentWeather?.sys.sunrise)}</span></div>
              </div>
              <div className="absolute left-0 top-2/3 w-full border"></div>
              <div
                style={{
                  transform: `translateX(${(sunriseDisplayingAreaRef.current && sunriseAnimationDivRef.current) ?
                    ((sunriseDisplayingAreaRef.current.clientWidth - sunriseAnimationDivRef.current.clientWidth) / 2)
                    : 0}px)`,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[1rem] left-0 xl:right-0 z-0 opacity-60"
                  ref={sunriseAnimationDivRef}
                >
                  <path d="M 260 110 Q 187.5 6, 125 93 T 6 80" stroke="#eee" strokeWidth="3" strokeLinecap="round"
                    fill="transparent" />
                </svg>
                <motion.div
                  className="absolute top-[1rem] left-0"
                  style={{
                    zIndex: 50,
                    offsetPath: 'path("M 260 110 Q 187.5 6, 125 93 T 6 80")',
                  }}
                  initial={{
                    offsetDistance: '100%',
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
          </div>
        ) : (
          <div className="bg-gray-50 animate-pulse w-full h-full rounded-lg"></div>
        )
      }
    </div>
  )
}
