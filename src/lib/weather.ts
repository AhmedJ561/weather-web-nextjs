import axios from "axios";
import {
  CurrentWeatherData,
  ForecastData,
  DailyForecast,
  HourlyForecast,
} from "@/types/weather";
import { format, fromUnixTime } from "date-fns";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(
  city: string
): Promise<CurrentWeatherData> {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });
  return response.data;
}

export async function getForecast(city: string): Promise<ForecastData> {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
      cnt: 40,
    },
  });
  return response.data;
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<CurrentWeatherData> {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });
  return response.data;
}

export async function getForecastByCoords(
  lat: number,
  lon: number
): Promise<ForecastData> {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
      cnt: 40,
    },
  });
  return response.data;
}

export function processDailyForecast(forecast: ForecastData): DailyForecast[] {
  const dailyMap = new Map<string, DailyForecast>();

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        dayName: format(new Date(date), "EEEE"),
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        weather: item.weather[0],
        pop: item.pop,
      });
    } else {
      const existing = dailyMap.get(date)!;
      existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
      existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
      if (item.pop > existing.pop) {
        existing.pop = item.pop;
        existing.weather = item.weather[0];
      }
    }
  });

  return Array.from(dailyMap.values()).slice(0, 5);
}

export function processHourlyForecast(
  forecast: ForecastData
): HourlyForecast[] {
  return forecast.list.slice(0, 8).map((item) => ({
    time: format(fromUnixTime(item.dt), "ha"),
    temp: Math.round(item.main.temp),
    weather: item.weather[0],
    pop: item.pop,
  }));
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function getWindDirection(degrees: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getWeatherGradient(weatherId: number, isDay: boolean): string {
  if (weatherId >= 200 && weatherId < 300) {
    return "from-slate-900 via-purple-900 to-slate-900"; // thunderstorm
  } else if (weatherId >= 300 && weatherId < 600) {
    return "from-slate-800 via-blue-900 to-slate-900"; // drizzle/rain
  } else if (weatherId >= 600 && weatherId < 700) {
    return "from-slate-700 via-blue-200 to-slate-400"; // snow
  } else if (weatherId >= 700 && weatherId < 800) {
    return "from-yellow-900 via-orange-800 to-yellow-700"; // atmosphere
  } else if (weatherId === 800) {
    return isDay
      ? "from-sky-500 via-blue-600 to-indigo-700"
      : "from-slate-900 via-indigo-950 to-slate-900"; // clear
  } else if (weatherId > 800) {
    return isDay
      ? "from-slate-600 via-blue-700 to-slate-800"
      : "from-slate-800 via-slate-900 to-slate-950"; // clouds
  }
  return "from-slate-800 via-blue-900 to-slate-900";
}
