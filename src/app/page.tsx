"use client";

import { useState, useCallback, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherStats from "@/components/WeatherStats";
import HourlyForecast from "@/components/HourlyForecast";
import FiveDayForecast from "@/components/FiveDayForecast";
import UnitToggle from "@/components/UnitToggle";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  getCurrentWeather,
  getForecast,
  getWeatherByCoords,
  getForecastByCoords,
  processDailyForecast,
  processHourlyForecast,
  getWeatherGradient,
} from "@/lib/weather";
import { CurrentWeatherData, ForecastData, TemperatureUnit } from "@/types/weather";
import { Wind } from "lucide-react";

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("celsius");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<string>("London");

  const fetchWeatherData = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    setLastSearch(city);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && err.message.includes("404")
        ? `City "${city}" not found. Please check the spelling and try again.`
        : err instanceof Error && err.message.includes("401")
        ? "Invalid API key. Please check your OpenWeather API key in .env.local"
        : "Failed to fetch weather data. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [weatherData, forecastData] = await Promise.all([
            getWeatherByCoords(latitude, longitude),
            getForecastByCoords(latitude, longitude),
          ]);
          setCurrentWeather(weatherData);
          setForecast(forecastData);
          setLastSearch(weatherData.name);
        } catch {
          setError("Failed to fetch weather for your location.");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please search for a city instead.");
        setIsLoading(false);
      }
    );
  }, []);

  // Load default city on mount
  useEffect(() => {
    fetchWeatherData("London");
  }, [fetchWeatherData]);

  const isDay = currentWeather
    ? currentWeather.dt > currentWeather.sys.sunrise &&
      currentWeather.dt < currentWeather.sys.sunset
    : true;

  const gradient = currentWeather
    ? getWeatherGradient(currentWeather.weather[0].id, isDay)
    : "from-sky-500 via-blue-600 to-indigo-700";

  const dailyForecast = forecast ? processDailyForecast(forecast) : [];
  const hourlyForecast = forecast ? processHourlyForecast(forecast) : [];

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000 relative overflow-hidden`}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Glass overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.07)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              WeatherScope
            </span>
          </div>
          <UnitToggle unit={unit} onToggle={() => setUnit(u => u === "celsius" ? "fahrenheit" : "celsius")} />
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar
            onSearch={fetchWeatherData}
            onGeoLocation={fetchByGeolocation}
            isLoading={isLoading}
          />
        </div>

        {/* Content */}
        {isLoading && !currentWeather ? (
          <LoadingSkeleton />
        ) : error && !currentWeather ? (
          <ErrorDisplay message={error} onRetry={() => fetchWeatherData(lastSearch)} />
        ) : currentWeather ? (
          <div className={`transition-all duration-500 ${isLoading ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"}`}>
            {/* Error banner (while having previous data) */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Current Weather */}
            <div className="mb-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 shadow-2xl">
              <CurrentWeather data={currentWeather} unit={unit} />
            </div>

            {/* Stats */}
            <div className="mb-6">
              <WeatherStats data={currentWeather} unit={unit} />
            </div>

            {/* Hourly Forecast */}
            {hourlyForecast.length > 0 && (
              <div className="mb-6">
                <HourlyForecast data={hourlyForecast} unit={unit} />
              </div>
            )}

            {/* 5-Day Forecast */}
            {dailyForecast.length > 0 && (
              <div className="mb-6">
                <FiveDayForecast data={dailyForecast} unit={unit} />
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-8 pb-4">
              <p className="text-white/30 text-xs">
                Powered by OpenWeather API · WeatherScope
              </p>
            </div>
          </div>
        ) : (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6 animate-float">
              <Wind className="w-12 h-12 text-white/70" />
            </div>
            <h2 className="text-3xl font-light text-white mb-3">
              Search for a city
            </h2>
            <p className="text-white/50 max-w-sm">
              Enter a city name above to get the current weather conditions and
              5-day forecast.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
