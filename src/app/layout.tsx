import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WeatherScope — Real-Time Weather Forecasts",
  description:
    "Get accurate real-time weather conditions and 5-day forecasts for any city worldwide. Powered by OpenWeather API.",
  keywords: ["weather", "forecast", "temperature", "weather app", "OpenWeather"],
  openGraph: {
    title: "WeatherScope — Real-Time Weather Forecasts",
    description: "Beautiful weather app with hourly & 5-day forecasts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
