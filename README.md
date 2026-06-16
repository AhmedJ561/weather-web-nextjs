# 🌤️ WeatherScope

A beautiful, modern weather application built with **Next.js 15**, **Tailwind CSS**, and the **OpenWeather API**.

![WeatherScope](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)

## ✨ Features

- 🔍 **City Search** with autocomplete suggestions
- 📍 **Geolocation** — detect your current location
- 🌡️ **Temperature Toggle** — switch between °C and °F
- 📊 **Hourly Forecast** — 24-hour chart with Recharts
- 📅 **5-Day Forecast** with min/max temperature range bars
- 💨 **Weather Stats** — humidity, wind, pressure, visibility & more
- 🎨 **Dynamic Backgrounds** — gradient changes based on weather conditions
- ✨ **Glassmorphism UI** with smooth animations
- 🌙 **Animated Weather Icons** from OpenWeather
- ⚡ **Loading Skeletons** for smooth UX
- 📱 **Fully Responsive** design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- An [OpenWeather API key](https://openweathermap.org/api) (free tier works)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Edit `.env.local` and replace `your_api_key_here` with your actual key:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
OPENWEATHER_API_KEY=your_actual_api_key_here
```

Get your free API key at: https://openweathermap.org/api

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

### Using Docker

```bash
# Build the image
docker build \
  --build-arg NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here \
  -t weatherscope .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here \
  weatherscope
```

### Using Docker Compose

```bash
# Set your API key
export NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# Start the app
docker-compose up -d
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles, animations
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main weather page
├── components/
│   ├── CurrentWeather.tsx   # Current conditions display
│   ├── ErrorDisplay.tsx     # Error state component
│   ├── FiveDayForecast.tsx  # 5-day forecast cards
│   ├── HourlyForecast.tsx   # Hourly chart (Recharts)
│   ├── LoadingSkeleton.tsx  # Loading state
│   ├── SearchBar.tsx        # City search with suggestions
│   ├── UnitToggle.tsx       # °C / °F toggle
│   └── WeatherStats.tsx     # Stat cards grid
├── lib/
│   └── weather.ts       # OpenWeather API service
└── types/
    └── weather.ts       # TypeScript interfaces
```

## 🔑 API Reference

Uses [OpenWeather API v2.5](https://openweathermap.org/api):
- `/data/2.5/weather` — Current weather
- `/data/2.5/forecast` — 5-day / 3-hour forecast

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Hourly temperature chart |
| Lucide React | Icons |
| Axios | HTTP requests |
| date-fns | Date formatting |
| Docker | Containerization |
