import { useWeatherContext } from '@/context/WeatherDataProvider';
import { useEffect, useState, useRef } from 'react';
import { Utils, Input } from '@/components';


/**
 * This component display all json fields' value from the context
 * And allow dev to modify the value and see the changes in real time
 * @returns 
 */
export default function DebugPanel({
  width,
  height,
  props
}: {
  width: number;
  height: number;
  props?: any
}) {
  const {
    city,
    setCity,
    previousCity,
    cityBackgroundUrl,
    setCityBackgroundUrl,
    isACityFound,
    setIsACityFound,
    isCityLoading,
    setIsCityLoading,
    isForecastLoading,
    setIsForecastLoading,
    isCityBackgroundLoading,
    setIsCityBackgroundLoading,
    currentWeather,
    setCurrentWeather,
    dailyForecastData,
    setDailyForecastData,
    hourlyForecastData,
    setHourlyForecastData,
    currentWeatherError,
    setCurrentWeatherError,
    forecastError,
    setForecastError,
    getData,
  } = useWeatherContext();
  const debugButtonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className='fixed top-0 right-0 z-50'
      style={{
        width: debugButtonRef.current ? debugButtonRef.current?.offsetWidth : 0,
      }}
    >
      <div className='relative'>
        <div className='absolute top-4 right-0'>
          <button type='button' ref={debugButtonRef}
            className='text-white bg-blue-500 text-sm rounded-tl-lg -rotate-90 p-1 px-4'
            onClick={() => setIsOpen(!isOpen)}
          >
            Debug
          </button>
        </div>
        <div className={'absolute top-0 right-0 h-screen p-3 transition-all ease-in-out bg-white rounded-l-xl shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 w-96 ' + (isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0')}>
          <div className='relative w-full h-full flex flex-col text-sm'>
            <div className='w-full bg-white p-1 border-b mb-3'>
              <div className='w-4 h-4 cursor-pointer z-10'
                onClick={() => setIsOpen(false)}
              >
                <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>

            <div className='w-full grow overflow-y-auto overflow-x-hidden'>
              <Utils.Accordion title={'City'}
                position={'first'}
              >
                <ul>
                  <li className='flex items-center justify-between gap-2 border-b p-2'>
                    <input title='City' className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg'
                      type='text' value={city} onChange={(e) => setCity(e.target.value)} />
                    <button type='button' onClick={() => getData()}
                      className='p-1 px-2 text-white bg-blue-500 text-sm rounded'
                    >Get Data</button>
                  </li>
                  <li className='border-b p-1.5'>{'Previous City: ' + previousCity}</li>
                  <li className='border-b'>
                    <div>
                      <div>{'City Background Url:'}</div>
                      <div className='p-2'>
                        <input title='City Background Url' className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full mb-2'
                          type='text' value={cityBackgroundUrl ?? ''} onChange={(e) => setCityBackgroundUrl(e.target.value)} />
                        <button type='button' onClick={() => setIsCityBackgroundLoading(true)}
                          className='p-1 px-2 text-white bg-blue-500 text-sm rounded'
                        >Load Background</button>
                      </div>
                    </div>
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'Is A City Found: ' + isACityFound}</div>
                    <Input.Toggler value={isACityFound} onClick={() => setIsACityFound(!isACityFound)} />
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'Is City Loading: ' + isCityLoading}</div>
                    <Input.Toggler value={isCityLoading} onClick={() => setIsCityLoading(!isCityLoading)} />
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'Is Forecast Loading: ' + isForecastLoading}</div>
                    <Input.Toggler value={isForecastLoading} onClick={() => setIsForecastLoading(!isForecastLoading)} />
                  </li>
                  <li className='flex justify-between items-center p-2'>
                    <div>{'Is City Background Loading: ' + isCityBackgroundLoading}</div>
                    <Input.Toggler value={isCityBackgroundLoading} onClick={() => setIsCityBackgroundLoading(!isCityBackgroundLoading)} />
                  </li>
                </ul>
              </Utils.Accordion>
              <Utils.Accordion title={'Current Weather'}>
                <div className='relative p-2'>
                  <ul>
                    {currentWeather &&
                      Object.keys(currentWeather).map((key, index) => (
                        typeof currentWeather[key] === 'object' ? (
                          <li key={index} className={'p-2 ' + (index !== Object.keys(currentWeather).length - 1 ? 'border-b' : '')}>
                            <div>{key}</div>
                            <ul>
                              {
                                Object.keys(currentWeather[key]).map((subKey, subIndex) => (
                                  <li key={subIndex} className={'p-2 ' + (subIndex !== Object.keys(currentWeather[key]).length - 1 ? 'border-b' : '')}>
                                    <div>{subKey + ': ' + currentWeather[key][subKey]}</div>
                                    <input title={subKey} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                                      type='text' value={currentWeather[key][subKey]} onChange={(e) => setCurrentWeather({ ...currentWeather, [key]: { ...currentWeather[key], [subKey]: e.target.value } })} />
                                  </li>
                                ))
                              }
                            </ul>
                          </li>
                        ) : (
                          <li key={index} className={'p-2 ' + (index !== Object.keys(currentWeather).length - 1 ? 'border-b' : '')}>
                            <div>{key + ': ' + currentWeather[key]}</div>
                            <input title={key} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                              type='text' value={currentWeather[key]} onChange={(e) => setCurrentWeather({ ...currentWeather, [key]: e.target.value })} />
                          </li>
                        )
                      ))
                    }
                  </ul>
                </div>
              </Utils.Accordion>
              <Utils.Accordion title={'Daily Forecast'}>
                <div className='relative p-2'>
                  <ul>
                    {dailyForecastData &&
                      Object.keys(dailyForecastData).map((key, index) => (
                        typeof dailyForecastData[key] === 'object' ? (
                          <li key={index} className={'p-2 ' + (index !== Object.keys(dailyForecastData).length - 1 ? 'border-b' : '')}>
                            <div>{key}</div>
                            <ul>
                              {
                                key === 'list' ? hourlyForecastData[key].map((subKey, subIndex) => (
                                  <li key={subIndex} className='p-2 border-b'>
                                    <ul>
                                      {
                                        Object.keys(subKey).map((subSubKey, subSubIndex) => (
                                          <li key={subSubIndex} className='p-2 border-b'>
                                            <div>{subSubKey + ': ' + subKey[subSubKey]}</div>
                                            <input title={subSubKey} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                                              type='text' value={subKey[subSubKey]} onChange={(e) => setHourlyForecastData({ ...hourlyForecastData, [key]: hourlyForecastData[key].map((item, i) => i === subIndex ? { ...item, [subSubKey]: e.target.value } : item) })} />
                                          </li>
                                        ))
                                      }
                                    </ul>
                                  </li>
                                ))
                                  :
                                  Object.keys(dailyForecastData[key]).map((subKey, subIndex) => (
                                    <li key={subIndex} className={'p-2 ' + (subIndex !== Object.keys(dailyForecastData[key]).length - 1 ? 'border-b' : '')}>
                                      <div>{subKey + ': ' + dailyForecastData[key][subKey]}</div>
                                      <input title={subKey} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                                        type='text' value={dailyForecastData[key][subKey]} onChange={(e) => setDailyForecastData({ ...dailyForecastData, [key]: { ...dailyForecastData[key], [subKey]: e.target.value } })} />
                                    </li>
                                  ))
                              }
                            </ul>
                          </li>
                        ) : (
                          <li key={index} className={'p-2 ' + (index !== Object.keys(dailyForecastData).length - 1 ? 'border-b' : '')}>
                            <div>{key + ': ' + dailyForecastData[key]}</div>
                            <input title={key} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                              type='text' value={dailyForecastData[key]} onChange={(e) => setDailyForecastData({ ...dailyForecastData, [key]: e.target.value })} />
                          </li>
                        )
                      ))
                    }
                  </ul>
                </div>
              </Utils.Accordion>
              <Utils.Accordion title={'Hourly Forecast'}>
                <div className='relative p-2'>
                  <ul>
                    {hourlyForecastData &&
                      Object.keys(hourlyForecastData).map((key, index) => (
                        typeof hourlyForecastData[key] === 'object' ? (
                          <li key={index} className={'p-2 ' + (index !== Object.keys(hourlyForecastData).length - 1 ? 'border-b' : '')}>
                            <div>{key}</div>
                            <ul>
                              {
                                key === 'list' ? hourlyForecastData[key].map((subKey, subIndex) => (
                                  <li key={subIndex} className='p-2 border-b'>
                                    <ul>
                                      {
                                        Object.keys(subKey).map((subSubKey, subSubIndex) => (
                                          <li key={subSubIndex} className='p-2 border-b'>
                                            <div>{subSubKey + ': ' + subKey[subSubKey]}</div>
                                            <input title={subSubKey} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                                              type='text' value={subKey[subSubKey]} onChange={(e) => setHourlyForecastData({ ...hourlyForecastData, [key]: hourlyForecastData[key].map((item, i) => i === subIndex ? { ...item, [subSubKey]: e.target.value } : item) })} />
                                          </li>
                                        ))
                                      }
                                    </ul>
                                  </li>
                                ))
                                  :
                                  Object.keys(hourlyForecastData[key]).map((subKey, subIndex) => (
                                    <li key={subIndex} className={'p-2 ' + (subIndex !== Object.keys(hourlyForecastData[key]).length - 1 ? 'border-b' : '')}>
                                      <div>{subKey + ': ' + hourlyForecastData[key][subKey]}</div>
                                      <input title={subKey} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                                        type='text' value={hourlyForecastData[key][subKey]} onChange={(e) => setHourlyForecastData({ ...hourlyForecastData, [key]: { ...hourlyForecastData[key], [subKey]: e.target.value } })} />
                                    </li>
                                  ))
                              }
                            </ul>
                          </li>
                        ) : (
                          <li key={index} className={'p-2 ' + (index !== Object.keys(hourlyForecastData).length - 1 ? 'border-b' : '')}>
                            <div>{key + ': ' + hourlyForecastData[key]}</div>
                            <input title={key} className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                              type='text' value={hourlyForecastData[key]} onChange={(e) => setHourlyForecastData({ ...hourlyForecastData, [key]: e.target.value })} />
                          </li>
                        )
                      ))
                    }
                  </ul>
                </div>
              </Utils.Accordion>
              <Utils.Accordion title={'Current Weather Error'}>
                <ul>
                  <li className='p-2'>
                    <div>{'Current Weather Error: ' + currentWeatherError}</div>
                    <input title='Current Weather Error' className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                      type='text' value={currentWeatherError} onChange={(e) => setCurrentWeatherError(e.target.value)} />
                  </li>
                </ul>
              </Utils.Accordion>
              <Utils.Accordion title={'Forecast Error'}
                position={'last'}
              >
                <ul>
                  <li className='p-2'>
                    <div>{'Current Weather Error: ' + currentWeatherError}</div>
                    <input title='Forecast Error' className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                      type='text' value={forecastError} onChange={(e) => setForecastError(e.target.value)} />
                  </li>
                </ul>
              </Utils.Accordion>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
