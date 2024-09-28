import localFont from "next/font/local";
import { useEffect, useState, useRef } from "react";
import { useWeatherContext } from "@/context/WeatherDataProvider";
import { useDebounce, useInfiniteLoading } from "@/hooks";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function SearchPanel({ width, height }: { width: number; height: number }) {
  const cityInput = useRef<HTMLInputElement>(null);
  const {
    city,
    cities,
    previousCity,
    setCity,
    isACityFound,
    getData,
  }: {
    city: string;
    cities: string[];
    previousCity: string;
    setCity: any;
    isACityFound: boolean;
    getData: any;
  } = useWeatherContext();
  const loadMoreRef = useRef(null);
  const [searchBox, setSearchBox] = useState<string>(city);
  const [typingCity, setTypingCity] = useState<string>('');
  const [inFocus, setInFocus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredCities, setFilteredCities] = useState<string[]>(cities);

  const triggerUpdateCity = async () => {
    return new Promise((resolve: (value?: any) => void) => {
      getData();
      resolve();
    })
      .catch((error) => {
        console.error('Error updating city: ', error);
      });
  };

  const updateDispCityDebounce = useDebounce((city: string) => {
    setSearchBox((prev: string) => city);
    setCity((prev: string) => city);
    setFilteredCities((prev: string[]) => city.length > 0 ? cities.filter((c: string, index: number) =>
      String(c).toLowerCase().includes(String(city).toLowerCase())
    ) : (typingCity.length > 0
      ? cities.filter((c: string, index: number) =>
        String(c).toLowerCase().includes(String(typingCity).toLowerCase())
      )
      : cities)
    );
  }, 700);

  useEffect(() => {
    if (searchBox.length === 0) {
      setTypingCity(city);
      setSearchBox(city);
    }
  }, [isACityFound]);

  const { items, hasMore, loadItems } = useInfiniteLoading({
    availableItems: filteredCities,
    setIsLoading,
  });

  useEffect(() => {
    setIsLoading(true);
    loadItems(typingCity !== previousCity);
  }, [typingCity, previousCity]);

  useEffect(() => {
    if (loadMoreRef.current && hasMore) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          if (hasMore) loadItems();
        }
      });
      observer.observe(loadMoreRef.current);
      return () => observer.disconnect();
    }
  }, [filteredCities.length, hasMore]);
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] lg:grid lg:grid-cols-1`}
    >
      <div className="bg-gradient-to-br from-slate-500 to-blue-500 w-full h-screen max-h-screen overflow-hidden col-span-1 p-2 flex flex-col">
        <div className="w-full flex items-center sticky top-0 px-2 py-3 rounded">
          <input title="City" type="text" ref={cityInput} placeholder="Enter a city" className="rounded-l-full w-full leading-5 px-3 p-1.5 dark:text-gray-600" value={typingCity}
            onChange={(e) => {
              e.preventDefault();
              setTypingCity(e.target.value);
              updateDispCityDebounce(e.target.value);
            }}
            onFocus={() => setInFocus(true)}
            onBlur={() => setInFocus(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                triggerUpdateCity();
              }
            }} />
          <button type="button" className="min-w-[5rem] p-1 bg-gray-200 text-gray-600 rounded-r-full pr-3" onClick={triggerUpdateCity}>{searchBox === previousCity ? 'Refresh' : 'Search'}</button>
        </div>
        <div className="grow overflow-y-auto bg-white ring-1 ring-black/20 rounded-lg">
          <ul className="h-full">
            {items.map((city, index) => (
              <li key={index} className={"px-3.5 p-2 cursor-pointer hover:bg-gray-100 transition-all ease-in-out border-dotted text-sm dark:text-gray-600 " + ((index !== items.length - 1) && 'border-b')} onClick={() => {
                setTypingCity(city);
                triggerUpdateCity();
                updateDispCityDebounce(city);
              }}
              >{city}</li>
            ))}
            <li
              ref={loadMoreRef}
              className='flex justify-center items-center p-2 text-gray-400 italic'
            >
              {hasMore ? 'Loading...' : 'No more cities to load'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
