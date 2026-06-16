"use client";

import Image from "next/image";
import { HourlyForecast as HourlyForecastType, TemperatureUnit } from "@/types/weather";
import { celsiusToFahrenheit } from "@/lib/weather";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Droplets } from "lucide-react";

interface HourlyForecastProps {
  data: HourlyForecastType[];
  unit: TemperatureUnit;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { temp: number; pop: number } }>;
  label?: string;
  unit: TemperatureUnit;
}

function CustomTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const unitSymbol = unit === "celsius" ? "°C" : "°F";
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-white/70 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold text-sm">
          {payload[0].value}{unitSymbol}
        </p>
        {payload[0].payload.pop > 0 && (
          <p className="text-blue-300 text-xs">
            {Math.round(payload[0].payload.pop * 100)}% rain
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function HourlyForecast({ data, unit }: HourlyForecastProps) {
  const unitSymbol = unit === "celsius" ? "°C" : "°F";

  const chartData = data.map((item) => ({
    time: item.time,
    temp:
      unit === "celsius"
        ? item.temp
        : Math.round(celsiusToFahrenheit(item.temp)),
    pop: item.pop,
    icon: item.weather.icon,
  }));

  return (
    <div>
      <h2 className="text-white/70 text-sm uppercase tracking-widest font-medium mb-4">
        Hourly Forecast
      </h2>
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 overflow-hidden">
        {/* Scrollable icon row */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[70px] gap-1"
            >
              <p className="text-white/60 text-xs font-medium">{item.time}</p>
              <div className="relative w-10 h-10">
                <Image
                  src={`https://openweathermap.org/img/wn/${item.weather.icon}@2x.png`}
                  alt={item.weather.description}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white font-semibold text-sm">
                {unit === "celsius"
                  ? item.temp
                  : Math.round(celsiusToFahrenheit(item.temp))}
                {unitSymbol}
              </p>
              {item.pop > 0 && (
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-300" />
                  <span className="text-blue-300 text-xs">
                    {Math.round(item.pop * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Temperature Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="time"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#tempGradient)"
                dot={{ fill: "#60a5fa", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#93c5fd" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
