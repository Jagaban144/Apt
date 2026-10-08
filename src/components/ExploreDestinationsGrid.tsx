import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Destination } from '../types';

interface ExploreDestinationsGridProps {
  destinations: Destination[];
  onSelectDestination: (destName: string) => void;
  selectedDestination?: string;
}

export const ExploreDestinationsGrid: React.FC<ExploreDestinationsGridProps> = ({
  destinations,
  onSelectDestination,
  selectedDestination,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Curated Global Hotspots</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Explore Trending Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our most booked vacation spots, iconic metropolises, and tranquil coastal retreats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((dest) => {
          const isSelected = selectedDestination?.toLowerCase() === dest.name.toLowerCase();

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isSelected ? 'ring-4 ring-blue-500 shadow-blue-500/20' : ''
              }`}
            >
              {/* Image */}
              <div className="h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
                />
              </div>

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight group-hover:text-amber-300 transition">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">{dest.country}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-blue-600 transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-200">
                  <span className="font-semibold">{dest.propertyCount.toLocaleString()} properties</span>
                  <span className="text-amber-300 font-medium">From $220/nt</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
