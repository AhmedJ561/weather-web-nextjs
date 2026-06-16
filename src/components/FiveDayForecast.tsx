"use client";

import Image from "next/image";
import { DailyForecast as DailyForecastType, TemperatureUnit } from "@/types/weather";
import { celsiusToFahrenheit } from "@/lib/weather";
import { Droplets } from "lucide-react";

interface FiveDayForecastProps {
  data: DailyForecastType[];
  unit: TemperatureUnit;
}

export default function FiveDayForecast({ data, unit }: FiveDayForecastProps) {
  const unitSymbol = unit === "celsius" ? "°C" : "°F";

  const convertTemp = (temp: number) =>
    unit === "celsius" ? Math.round(temp) : Math.round(celsiusToFahrenheit(temp));

  // Find global min/max for bar scaling
  const allTemps = data.flatMap((d) => [d.tempMin, d.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div>
      <h2 className="text-white/70 text-sm uppercase tracking-widest font-medium mb-4">
        5-Day Forecast
      </h2>
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 overflow-hidden">
        {data.map((day, index) => {
          const minBarPos = ((convertTemp(day.tempMin) - convertTemp(globalMin)) / (range === 1 ? 1 : range)) * 100;
          const maxBarWidth = ((convertTemp(day.tempMax) - convertTemp(day.tempMin)) / (range === 1 ? 1 : range)) * 100;

          return (
            <div
              key={day.date}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors duration-200 ${
                index !== data.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              {/* Day Name */}
              <div className="w-24 flex-shrink-0">
                <p className="text-white font-semibold">
                  {index === 0 ? "Today" : day.dayName}
                </p>
                <p className="text-white/40 text-xs">
                  {day.date.split("-").slice(1).join("/")}
                </p>
              </div>

              {/* Weather Icon */}
              <div className="flex items-center gap-2 w-20 flex-shrink-0">
                <div className="relative w-10 h-10">
                  <Image
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                    alt={day.weather.description}
                    fill
                    className="object-contain"
                  />
                </div>
                {day.pop > 0.1 && (
                  <div className="flex items-center gap-0.5">
                    <Droplets className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-300 text-xs">
                      {Math.round(day.pop * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Temperature Range Bar */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-white/50 text-sm w-12 text-right">
                  {convertTemp(day.tempMin)}{unitSymbol}
                </span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                    style={{
                      left: `${minBarPos}%`,
                      width: `${Math.max(maxBarWidth, 10)}%`,
                    }}
                  />
                </div>
                <span className="text-white font-semibold text-sm w-12">
                  {convertTemp(day.tempMax)}{unitSymbol}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
