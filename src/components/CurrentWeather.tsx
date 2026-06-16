"use client";

import Image from "next/image";
import { CurrentWeatherData, TemperatureUnit } from "@/types/weather";
import { celsiusToFahrenheit, getWindDirection } from "@/lib/weather";
import { Eye, Droplets, Wind, Gauge, Sunrise, Sunset } from "lucide-react";
import { format, fromUnixTime } from "date-fns";

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const temp = unit === "celsius"
    ? Math.round(data.main.temp)
    : Math.round(celsiusToFahrenheit(data.main.temp));
  const feelsLike = unit === "celsius"
    ? Math.round(data.main.feels_like)
    : Math.round(celsiusToFahrenheit(data.main.feels_like));
  const tempMax = unit === "celsius"
    ? Math.round(data.main.temp_max)
    : Math.round(celsiusToFahrenheit(data.main.temp_max));
  const tempMin = unit === "celsius"
    ? Math.round(data.main.temp_min)
    : Math.round(celsiusToFahrenheit(data.main.temp_min));
  const unitSymbol = unit === "celsius" ? "°C" : "°F";
  const isDay =
    data.dt > data.sys.sunrise && data.dt < data.sys.sunset;

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* Location & Date */}
      <div className="mb-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {data.name}
          </h1>
          <span className="text-2xl md:text-3xl font-light text-white/70">
            {data.sys.country}
          </span>
        </div>
        <p className="text-white/60 text-lg">
          {format(fromUnixTime(data.dt), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Weather Icon & Temperature */}
      <div className="flex flex-col md:flex-row items-center gap-4 my-4">
        <div className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl animate-float">
          <Image
            src={iconUrl}
            alt={data.weather[0].description}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-start">
            <span className="text-8xl md:text-9xl font-thin text-white leading-none">
              {temp}
            </span>
            <span className="text-4xl font-light text-white/70 mt-4">
              {unitSymbol}
            </span>
          </div>
          <p className="text-xl md:text-2xl text-white/80 capitalize font-light mt-1">
            {data.weather[0].description}
          </p>
          <p className="text-white/60 mt-1">
            Feels like {feelsLike}{unitSymbol} · H:{tempMax}{unitSymbol} L:{tempMin}{unitSymbol}
          </p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-white/70">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-300" />
          <span className="text-sm">{(data.visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-300" />
          <span className="text-sm">{data.main.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-blue-300" />
          <span className="text-sm">
            {(data.wind.speed * 3.6).toFixed(1)} km/h {getWindDirection(data.wind.deg)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-300" />
          <span className="text-sm">{data.main.pressure} hPa</span>
        </div>
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-amber-300" />
          <span className="text-sm">{format(fromUnixTime(data.sys.sunrise), "h:mm a")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="w-4 h-4 text-orange-300" />
          <span className="text-sm">{format(fromUnixTime(data.sys.sunset), "h:mm a")}</span>
        </div>
      </div>
    </div>
  );
}
