import { useMemo } from 'react';
import axios from 'axios';
import { cities as listOfCities } from '@/data';

export default function useWeather() {
  const OPEN_WEATHER_API = `${process.env.NEXT_PUBLIC_OPENWEATHER_API}/${process.env.NEXT_PUBLIC_OPENWEATHER_API_VERSION}`;

  async function currentWeatherApi(city: string) {
    try {
      return await axios
        .get(`${OPEN_WEATHER_API}/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
        .then((res) => res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function forecastWeatherApi(city: string) {
		try {
			return await axios
				.get(`${OPEN_WEATHER_API}/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
				.then((res) => res.data);
		} catch (error) {
			console.error(error);
		}
	}

  const cities = 
		useMemo(() =>
			Object.values(listOfCities)
				.map((city) => city.name)
    , []);

    function doesCityExist(targetCity: string) {
      let low = 0;
      let high = cities.length - 1;
  
      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let midCity = cities[mid];
  
        if (midCity < targetCity) {
          low = mid + 1;
        } else if (midCity > targetCity) {
          high = mid - 1;
        } else {
          return true; // City found
        }
      }
      return false; // City not found
    }

  return {
    cities,
    doesCityExist,
    currentWeatherApi,
    forecastWeatherApi
  };
}
