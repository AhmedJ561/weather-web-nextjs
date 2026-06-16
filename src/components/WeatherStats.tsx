"use client";

import { CurrentWeatherData, TemperatureUnit } from "@/types/weather";
import { celsiusToFahrenheit, getWindDirection } from "@/lib/weather";
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Thermometer,
  Cloud,
  Compass,
} from "lucide-react";

interface WeatherStatsProps {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${color}`}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-xl ${color} bg-opacity-20`}>
            {icon}
          </div>
        </div>
        <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-semibold">{value}</p>
        {subValue && (
          <p className="text-white/50 text-sm mt-1">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export default function WeatherStats({ data, unit }: WeatherStatsProps) {
  const unitSymbol = unit === "celsius" ? "°C" : "°F";
  const feelsLike =
    unit === "celsius"
      ? Math.round(data.main.feels_like)
      : Math.round(celsiusToFahrenheit(data.main.feels_like));

  const getHumidityLabel = (humidity: number) => {
    if (humidity < 30) return "Dry";
    if (humidity < 60) return "Comfortable";
    if (humidity < 80) return "Humid";
    return "Very Humid";
  };

  const getVisibilityLabel = (visibility: number) => {
    if (visibility >= 10000) return "Excellent";
    if (visibility >= 5000) return "Good";
    if (visibility >= 1000) return "Moderate";
    return "Poor";
  };

  const getPressureLabel = (pressure: number) => {
    if (pressure < 1009) return "Low pressure";
    if (pressure < 1023) return "Normal";
    return "High pressure";
  };

  const getWindLabel = (speed: number) => {
    const kmh = speed * 3.6;
    if (kmh < 20) return "Light breeze";
    if (kmh < 40) return "Moderate wind";
    if (kmh < 60) return "Fresh wind";
    return "Strong wind";
  };

  return (
    <div>
      <h2 className="text-white/70 text-sm uppercase tracking-widest font-medium mb-4">
        Weather Details
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Droplets className="w-5 h-5 text-blue-300" />}
          label="Humidity"
          value={`${data.main.humidity}%`}
          subValue={getHumidityLabel(data.main.humidity)}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Wind className="w-5 h-5 text-cyan-300" />}
          label="Wind Speed"
          value={`${(data.wind.speed * 3.6).toFixed(1)} km/h`}
          subValue={getWindLabel(data.wind.speed)}
          color="bg-cyan-500"
        />
        <StatCard
          icon={<Gauge className="w-5 h-5 text-purple-300" />}
          label="Pressure"
          value={`${data.main.pressure} hPa`}
          subValue={getPressureLabel(data.main.pressure)}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-green-300" />}
          label="Visibility"
          value={`${(data.visibility / 1000).toFixed(1)} km`}
          subValue={getVisibilityLabel(data.visibility)}
          color="bg-green-500"
        />
        <StatCard
          icon={<Thermometer className="w-5 h-5 text-orange-300" />}
          label="Feels Like"
          value={`${feelsLike}${unitSymbol}`}
          subValue="Apparent temp"
          color="bg-orange-500"
        />
        <StatCard
          icon={<Cloud className="w-5 h-5 text-slate-300" />}
          label="Cloud Cover"
          value={`${data.clouds.all}%`}
          subValue={data.clouds.all > 80 ? "Overcast" : data.clouds.all > 40 ? "Partly cloudy" : "Clear sky"}
          color="bg-slate-500"
        />
        <StatCard
          icon={<Compass className="w-5 h-5 text-rose-300" />}
          label="Wind Direction"
          value={getWindDirection(data.wind.deg)}
          subValue={`${data.wind.deg}°`}
          color="bg-rose-500"
        />
        {data.wind.gust && (
          <StatCard
            icon={<Wind className="w-5 h-5 text-indigo-300" />}
            label="Wind Gust"
            value={`${(data.wind.gust * 3.6).toFixed(1)} km/h`}
            subValue="Peak gust speed"
            color="bg-indigo-500"
          />
        )}
      </div>
    </div>
  );
}
