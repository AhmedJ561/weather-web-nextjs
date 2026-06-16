"use client";

import { TemperatureUnit } from "@/types/weather";
import { Thermometer } from "lucide-react";

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 group"
      title="Toggle temperature unit"
    >
      <Thermometer className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
      <div className="flex items-center gap-1">
        <span
          className={`text-sm font-semibold transition-colors ${
            unit === "celsius" ? "text-white" : "text-white/40"
          }`}
        >
          °C
        </span>
        <span className="text-white/30 text-sm">|</span>
        <span
          className={`text-sm font-semibold transition-colors ${
            unit === "fahrenheit" ? "text-white" : "text-white/40"
          }`}
        >
          °F
        </span>
      </div>
    </button>
  );
}
