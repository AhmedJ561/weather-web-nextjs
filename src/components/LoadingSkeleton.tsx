"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Main weather card skeleton */}
      <div className="flex flex-col items-center text-center py-4 mb-8">
        <div className="h-10 w-48 bg-white/10 rounded-xl mb-2" />
        <div className="h-5 w-36 bg-white/10 rounded-lg mb-6" />
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="w-32 h-32 rounded-full bg-white/10" />
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-48 bg-white/10 rounded-2xl" />
            <div className="h-6 w-36 bg-white/10 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 w-20 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="mb-6">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="mb-6">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="h-52 rounded-2xl bg-white/10" />
      </div>

      {/* 5-day skeleton */}
      <div>
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="rounded-2xl bg-white/10 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-16 ${i !== 4 ? "border-b border-white/5" : ""} flex items-center px-5 gap-4`}
            >
              <div className="w-24 h-5 bg-white/10 rounded" />
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex-1 h-2 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
