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
    unsplashSearchTerm,
    setUnsplashSearchTerm,
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
    isFogEffectForcedOn,
    setIsFogEffectForcedOn,
    isSunFlareEffectForcedOn,
    setIsSunFlareEffectForcedOn,
    isRainEffectForcedOn,
    setIsRainEffectForcedOn,
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
    getCityBackground,
  } = useWeatherContext();
  const debugButtonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleUpdate = (key: string | number, updatedData: any, property: any, setProperty: (data: any) => void) => {
    setProperty({
      ...property,
      [key]: updatedData
    });
  };

  return (
    <div className='fixed top-0 right-0 z-50'
      style={{
        width: debugButtonRef.current ? debugButtonRef.current?.offsetWidth : 0,
      }}
    >
      <div className='relative'>
        <div className='absolute top-4 right-0'>
          <button type='button' ref={debugButtonRef}
            className='text-white bg-blue-500 text-sm rounded-tl-lg p-1 px-4 w-[12rem] -rotate-90 translate-y-[4rem] translate-x-[5rem] hover:bg-blue-600 transition-all ease-in-out'
            onClick={() => setIsOpen(!isOpen)}
          >
            Open Control Panel
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
                  <li className='border-b p-1.5'>
                    <div>
                      <div>{'Unsplash Search Term:'}</div>
                      <input title='Unsplash Search Term' className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                        type='text' value={unsplashSearchTerm ?? ''} onChange={(e) => setUnsplashSearchTerm(e.target.value)} />
                    </div>
                  </li>
                  <li className='border-b p-1.5'>
                    <div>
                      <div>{'City Background Url:'}</div>
                      <div className='p-2'>
                        <input title='City Background Url' className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full mb-2'
                          type='text' value={cityBackgroundUrl ?? ''} onChange={(e) => setCityBackgroundUrl(e.target.value)} />
                        <div>
                          <button type='button' onClick={() => getCityBackground()}
                            className='p-1 px-2 text-white bg-blue-500 text-sm rounded ml-2'
                          >Re-generate</button>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'A City Found: ' + isACityFound}</div>
                    <Input.Toggler value={isACityFound} onClick={() => setIsACityFound(!isACityFound)} />
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'City Loading: ' + isCityLoading}</div>
                    <Input.Toggler value={isCityLoading} onClick={() => setIsCityLoading(!isCityLoading)} />
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'Forecast Loading: ' + isForecastLoading}</div>
                    <Input.Toggler value={isForecastLoading} onClick={() => setIsForecastLoading(!isForecastLoading)} />
                  </li>
                  <li className='flex justify-between items-center p-2'>
                    <div>{'City Background Loading: ' + isCityBackgroundLoading}</div>
                    <Input.Toggler value={isCityBackgroundLoading} onClick={() => setIsCityBackgroundLoading(!isCityBackgroundLoading)} />
                  </li>
                </ul>
              </Utils.Accordion>
              <Utils.Accordion title={'Weather Effects'}>
                <ul>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'Force Sun Flare Effect On: ' + isSunFlareEffectForcedOn}</div>
                    <Input.Toggler value={isSunFlareEffectForcedOn} onClick={() => setIsSunFlareEffectForcedOn(!isSunFlareEffectForcedOn)} />
                  </li>
                  <li className='flex justify-between items-center p-2 border-b'>
                    <div>{'Force Rain Effect On: ' + isRainEffectForcedOn}</div>
                    <Input.Toggler value={isRainEffectForcedOn} onClick={() => setIsRainEffectForcedOn(!isRainEffectForcedOn)} />
                  </li>
                  <li className='flex justify-between items-center p-2'>
                    <div>{'Force Fog Effect On: ' + isFogEffectForcedOn}</div>
                    <Input.Toggler value={isFogEffectForcedOn} onClick={() => setIsFogEffectForcedOn(!isFogEffectForcedOn)} />
                  </li>
                </ul>
              </Utils.Accordion>
              <Utils.Accordion title={'Current Weather'}>
                <div className='relative p-2'>
                  <RecursiveRenderer data={currentWeather} onUpdate={(key, value) => handleUpdate(key, value, currentWeather, setCurrentWeather)} />
                </div>
              </Utils.Accordion>
              <Utils.Accordion title={'Daily Forecast'}>
                <div className='relative p-2'>
                  <RecursiveRenderer data={dailyForecastData} onUpdate={(key, value) => handleUpdate(key, value, dailyForecastData, setDailyForecastData)} />
                </div>
              </Utils.Accordion>
              <Utils.Accordion title={'Hourly Forecast'}>
                <div className='relative p-2'>
                  <RecursiveRenderer data={hourlyForecastData} onUpdate={(key, value) => handleUpdate(key, value, hourlyForecastData, setHourlyForecastData)} />
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

const RecursiveRenderer = ({ data, onUpdate }:
  {
    data: any;
    onUpdate: (key: string, value: any) => void;
  }
) => {
  const handleChange = (key: string | number, value: any, parentKey: string, parentData: any) => {
    const updatedParentData = {
      ...parentData,
      [key]: value
    };
    onUpdate(parentKey, updatedParentData);
  };

  const renderNestedData = (data: any, parentKey = '') => {
    return (
      <ul>
        {Object.keys(data).map((key, index) => {
          if (typeof data[key] === 'object') {
            // If the data is an object or array, recurse into it
            return (
              <li key={index} className={'p-2 ' + (index !== Object.keys(data).length - 1 ? 'border-b' : '')}>
                <div>{key}</div>
                <ul>{renderNestedData(data[key], key)}</ul>
              </li>
            );
          } else {
            // Otherwise, display the value with an input field
            return (
              <li key={index} className={'p-2 ' + (index !== Object.keys(data).length - 1 ? 'border-b' : '')}>
                <div>{key + ': ' + data[key]}</div>
                <input
                  title={key}
                  className='p-0.5 px-1.5 text-gray-800 border border-gray-200 rounded-lg w-full'
                  type='text'
                  value={data[key]}
                  onChange={(e) => handleChange(key, e.target.value, parentKey, data)}
                />
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return <div>{renderNestedData(data)}</div>;
};