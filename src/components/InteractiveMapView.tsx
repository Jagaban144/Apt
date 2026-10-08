import React, { useState } from 'react';
import { 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Star, 
  Heart, 
  ArrowRight, 
  Navigation,
  Compass,
  X
} from 'lucide-react';
import { Property, CurrencyCode, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface InteractiveMapViewProps {
  properties: Property[];
  currency: CurrencyCode;
  currencies: Currency[];
  onSelectProperty: (property: Property) => void;
  onToggleWishlist: (propertyId: string) => void;
  savedPropertyIds: string[];
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  properties,
  currency,
  currencies,
  onSelectProperty,
  onToggleWishlist,
  savedPropertyIds,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapTheme, setMapTheme] = useState<'clean' | 'satellite'>('clean');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(properties[0]?.id || null);

  const selectedProperty = properties.find((p) => p.id === selectedPinId) || properties[0];

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 flex flex-col">
      {/* Map Header Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200">
        <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" />
        <span className="text-xs font-bold text-slate-800">
          Showing {properties.length} Geo-Verified Stays
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        {/* Style Toggle */}
        <div className="flex bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1">
          <button
            onClick={() => setMapTheme('clean')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              mapTheme === 'clean' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Light Modern
          </button>
          <button
            onClick={() => setMapTheme('satellite')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              mapTheme === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dark Satellite
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spatial Map Canvas Simulation */}
      <div 
        className={`relative flex-1 overflow-hidden transition-colors duration-500 ${
          mapTheme === 'clean' ? 'bg-[#EBF2FA]' : 'bg-[#0A192F]'
        }`}
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        {/* Vector Grid & Map Topography lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke={mapTheme === 'clean' ? '#94A3B8' : '#334155'} 
                strokeWidth="0.8" 
                strokeDasharray="3 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Waterway / River Curves Simulation */}
          <path
            d="M -100 280 C 200 240, 400 360, 800 310 C 1100 260, 1300 400, 1600 350"
            fill="none"
            stroke={mapTheme === 'clean' ? '#BAE6FD' : '#1E293B'}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 220 -50 C 260 200, 320 400, 380 700"
            fill="none"
            stroke={mapTheme === 'clean' ? '#CBD5E1' : '#1E3A5F'}
            strokeWidth="12"
          />
          <path
            d="M 680 -50 C 720 220, 780 440, 850 700"
            fill="none"
            stroke={mapTheme === 'clean' ? '#CBD5E1' : '#1E3A5F'}
            strokeWidth="14"
          />
        </svg>

        {/* Property Price Pins Distributed across the Canvas */}
        {properties.map((property, idx) => {
          const isSelected = selectedPinId === property.id;
          const isSaved = savedPropertyIds.includes(property.id);

          // Calculate visual coordinates across canvas based on index / hash
          const positions = [
            { top: '32%', left: '26%' },
            { top: '48%', left: '42%' },
            { top: '24%', left: '60%' },
            { top: '65%', left: '30%' },
            { top: '38%', left: '76%' },
            { top: '68%', left: '66%' },
            { top: '18%', left: '38%' },
            { top: '78%', left: '50%' },
          ];
          const pos = positions[idx % positions.length];

          return (
            <div
              key={property.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                type="button"
                onClick={() => setSelectedPinId(property.id)}
                className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-black text-xs transition duration-200 shadow-lg ${
                  isSelected
                    ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110 z-30'
                    : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white hover:scale-105 border border-slate-200'
                }`}
              >
                <span>{formatPrice(property.startingPrice, currency, currencies)}</span>
                {property.starRating === 5 && (
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                )}
              </button>

              {/* Pin Arrow Tip */}
              <div
                className={`w-2 h-2 mx-auto rotate-45 -mt-1 shadow-sm transition ${
                  isSelected ? 'bg-blue-600' : 'bg-white group-hover:bg-blue-600'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Property Preview Card at Bottom */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex gap-3">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(selectedProperty.id);
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:text-rose-500 shadow"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    savedPropertyIds.includes(selectedProperty.id)
                      ? 'fill-rose-500 text-rose-500'
                      : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {selectedProperty.propertyType}
                  </span>
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold ml-0.5">{selectedProperty.rating}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  {selectedProperty.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-0.5 flex-shrink-0 text-slate-400" />
                  {selectedProperty.neighborhood}, {selectedProperty.city}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900">
                    {formatPrice(selectedProperty.startingPrice, currency, currencies)}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">/ night</span>
                </div>

                <button
                  onClick={() => onSelectProperty(selectedProperty)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
