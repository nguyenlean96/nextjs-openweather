import { useEffect, useState, createContext, useContext } from 'react';
import {
	useWeather as useOpenWeather,
	useUnsplashImage,
} from '@/hooks';

const samples = [
	'London',
	'Oshawa',
	'Sudbury',
	'Toronto',
	'Windsor',
	'Winnipeg',
	'Halifax',
	'Hamilton',
	'Kitchener',
	'New York',
	'Paris',
	'Los Angeles',
	'Chicago',
	'Las Vegas',
	'Berlin',
	'Amsterdam',
	'Barcelona',
	'Vienna',
	'Prague',
	'Brussels',
	'Zurich',
	'Frankfurt',
	'Oslo',
	'Stockholm',
	'Copenhagen',
	'Helsinki',
	'Warsaw',
	'Krakow',
	'Gdansk',
	'Wroclaw',
	'Poznan',
	'Katowice',
	'Gdynia',
	'Sopot',
	'Gliwice',
	'Zakopane',
	'Zamosc',
	'Zielona Gora',
];

export const WeatherContext = createContext(
	{} as {
		filteredCities: string[];
		cities: string[];
		city: string;
		setCity: any;
		previousCity: string;
		cityBackgroundUrl: string | null;
		isCityBackgroundLoading: boolean;
		isACityFound: boolean;
		isCityLoading: boolean;
		isForecastLoading: boolean;
		currentWeather: any;
		forecastData: any;
		currentWeatherError: string;
		forecastError: string;
		getData: any;
	}
);

export default function WeatherProvider({ children }: { children: any }) {
	const { cities, currentWeatherApi, forecastWeatherApi } = useOpenWeather();
	const { getImage } = useUnsplashImage();

	const [city, setCity] = useState('');
	const [previousCity, setPreviousCity] = useState('');
	const [isCityLoading, setIsCityLoading] = useState(false);
	const [isForecastLoading, setIsForecastLoading] = useState(false);
	const [isACityFound, setIsACityFound] = useState(false);
	const [currentWeatherError, setCurrentWeatherError] = useState('');
	const [forecastError, setForecastError] = useState('');
	const [currentWeather, setCurrentWeather] = useState(null);
	const [forecastData, setForecastData] = useState(null);
	const [cityBackgroundUrl, setCityBackgroundUrl] = useState(null);
	const [isCityBackgroundLoading, setIsCityBackgroundLoading] = useState(false);
	const foundEntry = samples[Math.floor(Math.random() * samples.length)];

	const getCityBackground = async () => {
		if (isACityFound && city && city !== previousCity && currentWeather && forecastData) {
			try {
				setIsCityBackgroundLoading(true);
				const cityImgs = await getImage(String(city))
					.then((res) => {
						if (res.results.length > 0) {
							setCityBackgroundUrl(res?.results[0]?.urls?.full);
						} else {
							setCityBackgroundUrl(null);
						}
					})
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						setTimeout(() => {
							setIsCityBackgroundLoading(false);
						}, 3000);
					});
			} catch (error) {
				console.log(error);
			}
		}
	};

	const getUniqueDays = (oridat: {
		list: Array<{ dt: string }>;
	}) => {
		let cwday = -1;
		let uniqueDays: Array<any> = [];
		oridat.list.forEach((day: { dt: string }) => {
			let wday = new Date(parseInt(day.dt) * 1000).getDay();
			if (wday !== cwday) {
				cwday = wday;
				uniqueDays.push(day);
				uniqueDays[uniqueDays.length - 1].inner = [];
				uniqueDays[uniqueDays.length - 1].inner.push(day);
			} else {
				uniqueDays[uniqueDays.length - 1].inner.push(day);
			}
		});
		oridat.list = uniqueDays;
		let filteredDays = oridat;
		return filteredDays;
	};

	async function cityInitHandler() {
		setPreviousCity((prev) => foundEntry);
		setIsACityFound(false);
		setIsCityLoading(true);
		setIsForecastLoading(true);
		const setEntryCity = setInterval(() => {
			setCity((prev) => {
				if (prev.length < foundEntry.length) {
					return foundEntry.slice(0, prev.length + 1);
				} else {
					setIsCityLoading(false);
					setTimeout(async () => {
						setIsACityFound(true);
						setIsForecastLoading(false);
						await getCityBackground();
						clearInterval(setEntryCity);
					}, 600);
					return prev;
				}
			});
		}, 500);


		Promise.all([
			getData(),
		]);
	}

	async function getCurrentWeather(init = false) {
		setCurrentWeatherError('');
		setPreviousCity((prev) => city || prev);
		setIsACityFound(false);
		setIsCityLoading(true);

		try {
			const res = await currentWeatherApi(city || foundEntry);

			if (res) {
				if (res.message) {
					setIsACityFound(false);
					throw new Error(res.message);
				}
			}

			if (!init) {
				setIsACityFound(true);
				setIsCityLoading(false);
			}
			setCurrentWeather(res);
		} catch (error: any) {
			setCurrentWeatherError(error?.message);
			console.log(error);
		}
	}

	async function getForecast(init = false) {
		setIsForecastLoading(true);
		try {
			let temp = await forecastWeatherApi(city || foundEntry);

			setForecastData(
				temp.list ? (temp.list.length > 6 ? { ...getUniqueDays(temp) } : temp) : null
			);
			if (!init) setIsForecastLoading(false);
		} catch (err) {
			console.log(err);
		}
	}

	const getData = async () => {
		setCurrentWeather(null);
		setForecastData(null);
		Promise.all([
			getCurrentWeather(true), 
			getForecast(true), 
			getCityBackground(),
		]);

		const checkDataRetrieval = await setInterval(() => {
			if (currentWeather && forecastData) {
				setTimeout(() => {
					setIsCityLoading(false);
					setIsForecastLoading(false);
					setIsACityFound(true);
				}, 1800);
			}
		}, 2000);
		return () => clearInterval(checkDataRetrieval);
	};

	useEffect(() => {
		cityInitHandler();
	}, []);

	const filteredCities =
		city.length > 0
			? cities.filter((keyword: string, index: number) =>
				keyword.toLowerCase().includes(city.toLowerCase())
			)
			// .filter(
				// 	(city, index, self) => self.findIndex((t) => t.name === city.name) === index
				// )
		    .sort() // JavaScript's default sort method compares strings lexicographically
			: cities;

	return (
		<WeatherContext.Provider
			value={{
				city,
				cities,
				filteredCities,
				setCity,
				previousCity,
				cityBackgroundUrl,
				isACityFound,
				isCityLoading,
				isForecastLoading,
				isCityBackgroundLoading,
				currentWeather,
				forecastData,
				currentWeatherError,
				forecastError,
				getData,
			}}
		>
			{children}
		</WeatherContext.Provider>
	);
}

// export useWeatherContext
const useWeatherContext = () => {
	const context = useContext(WeatherContext);
	if (context === undefined) {
		throw new Error('useWeatherContext must be used within a WeatherProvider');
	}
	return context;
};

export { useWeatherContext };