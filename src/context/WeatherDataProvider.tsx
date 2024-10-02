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
		cities: string[];
		filteredCities: string[];
		city: string;
		setCity: any;
		previousCity: string;
		setPreviousCity: any;
		unsplashSearchTerm: string | null;
		setUnsplashSearchTerm: any;
		cityBackgroundUrl: string | null;
		setCityBackgroundUrl: any;
		isCityBackgroundLoading: boolean;
		setIsCityBackgroundLoading: any;
		isACityFound: boolean;
		setIsACityFound: any;
		isCityLoading: boolean;
		setIsCityLoading: any;
		isForecastLoading: boolean;
		setIsForecastLoading: any;
		isFogEffectForcedOn: boolean;
		setIsFogEffectForcedOn: any;
		isSunFlareEffectForcedOn: boolean;
		setIsSunFlareEffectForcedOn: any;
		isRainEffectForcedOn: boolean;
		setIsRainEffectForcedOn: any;
		currentWeather: any;
		setCurrentWeather: any;
		// forecastData: any;
		dailyForecastData: any;
		setDailyForecastData: any;
		hourlyForecastData: any;
		setHourlyForecastData: any;
		currentWeatherError: string;
		setCurrentWeatherError: any;
		forecastError: string;
		setForecastError: any;
		getData: any;
		getCityBackground: any;
	}
);

type IForecastDateTime = {
	dt: number;
	dt_txt: string;
	main: any;
	pop: number;
	sys: {
		pod: string;
	};
	visibility: number;
	weather: Array<any>;
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
}

export default function WeatherProvider({ children }: { children: any }) {
	const { cities, currentWeatherApi, forecastWeatherApi } = useOpenWeather();
	const { getImage } = useUnsplashImage();

	const [city, setCity] = useState('');
	const [previousCity, setPreviousCity] = useState('');
	const [isCityLoading, setIsCityLoading] = useState(true);
	const [isForecastLoading, setIsForecastLoading] = useState(true);
	const [isACityFound, setIsACityFound] = useState(false);
	const [currentWeather, setCurrentWeather] = useState<any>(null);
	const [dailyForecastData, setDailyForecastData] = useState<{
		list: Array<IForecastDateTime>;
		message?: number;
		cnt?: number;
		cod?: string;
		city?: any;
	} | null>(null);
	const [hourlyForecastData, setHourlyForecastData] = useState<any | null>(null);
	const [currentWeatherError, setCurrentWeatherError] = useState<string>('');
	const [unsplashSearchTerm, setUnsplashSearchTerm] = useState<string | null>(null);
	const [forecastError, setForecastError] = useState('');
	const [cityBackgroundUrl, setCityBackgroundUrl] = useState(null);
	const [isCityBackgroundLoading, setIsCityBackgroundLoading] = useState(false);
	const [isFogEffectForcedOn, setIsFogEffectForcedOn] = useState<boolean>(false);
	const [isSunFlareEffectForcedOn, setIsSunFlareEffectForcedOn] = useState<boolean>(false);
	const [isRainEffectForcedOn, setIsRainEffectForcedOn] = useState<boolean>(false);
	const foundEntry = samples[Math.floor(Math.random() * samples.length)];

	const getCityBackground = async () => {
		if (isACityFound && (city || foundEntry)) {
			try {
				setIsCityBackgroundLoading(true);
				await getImage(String(unsplashSearchTerm ?? ((city ?? foundEntry) + ' city')))
					.then((res) => {
						if (res.results.length > 0) {
							setCityBackgroundUrl(res?.results[0]?.urls?.full);
							setIsCityBackgroundLoading(false);
						} else {
							setCityBackgroundUrl(null);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} catch (error) {
				console.log(error);
			}
		}
	};

	const getUniqueDays = (oridat: {
		list: Array<any>;
		message?: number;
		cnt?: number;
		cod?: string;
		city?: any;
	}) => {
		let loadFirstDayData = 0;
		let hourlyData: Array<any> = [];
		let cwday: number = -1;
		let uniqueDays: Array<any> = [];
		oridat.list
			.sort((a: { dt: string }, b: { dt: string }) => parseInt(a.dt) - parseInt(b.dt))
			.forEach((day: { dt: string }) => {
				let wday = new Date(parseInt(day.dt) * 1000).getDay();
				if (wday !== cwday) {
					loadFirstDayData++;
					cwday = wday;
					uniqueDays.push(day);
				}
				if (loadFirstDayData < 4) {
					hourlyData.push(day);
				}
			});

		let filteredHours: any = new Object({
			...oridat,
		});
		filteredHours.list = hourlyData;

		oridat.list = uniqueDays;
		let filteredDays: {
			list: Array<any>;
			message?: number;
			cnt?: number;
			cod?: string;
			city?: any;
		} = oridat;

		return [filteredHours, filteredDays];
	};

	async function cityInitHandler() {
		try {
			setIsCityLoading(true);
			setIsForecastLoading(true);
			setIsACityFound(false);
			if (foundEntry) {
				// Update state synchronously, no need to return a new promise
				setPreviousCity((prev: string) => foundEntry);
				setCity((prev: string) => foundEntry);

				// Fetch data and background simultaneously
				await getData();
			}
		} catch (err) {
			console.log("Error while initializing city:", err);
		}
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

			if (temp.list) {
				if (temp.list.length > 6) {
					const [filteredHours, filteredDays] = getUniqueDays(temp);
					// setForecastData((prev: any) => ({ ...filteredDays }));
					setDailyForecastData((prev: any) => filteredDays);
					setHourlyForecastData((prev: any) => filteredHours);
				} else {
					// setForecastData((prev: any) => temp);
					setDailyForecastData((prev: any) => temp);
				}
			}
			if (!init) setIsForecastLoading(false);
		} catch (err) {
			console.log(err);
		}
	}

	const getData = async () => {
		setUnsplashSearchTerm(city || foundEntry);
		setCurrentWeather(null);
		setDailyForecastData(null);
		setHourlyForecastData(null);
		setCityBackgroundUrl(null);
		Promise.all([
			getCurrentWeather(true),
			getForecast(true),
		]).then(() => {
			setTimeout(() => {
				setIsCityLoading(false);
				setIsForecastLoading(false);
				setIsACityFound(true);
			}, 1800);
		});
	};

	useEffect(() => {
		if (isACityFound) {
			getCityBackground();
		}
	}, [isACityFound]);
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
				cities,
				filteredCities,
				city,
				setCity,
				previousCity,
				setPreviousCity,
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