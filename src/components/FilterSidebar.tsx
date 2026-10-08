import React from 'react';
import { Filter, Star, Sparkles, Check, RotateCcw } from 'lucide-react';
import { FilterState, PropertyType, CurrencyCode, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface FilterSidebarProps {
  filters: FilterState;
  onUpdateFilters: (filters: FilterState) => void;
  currency: CurrencyCode;
  currencies: Currency[];
  totalMatches: number;
}

const PROPERTY_TYPES: PropertyType[] = ['Hotel', 'Apartment', 'Villa', 'Resort', 'Guest House'];

const POPULAR_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'Indoor Swimming Pool',
  'Private Infinity Pool',
  'Complimentary Breakfast',
  'Gourmet Buffet Breakfast',
  'Luxury Spa & Sauna',
  'Airport Chauffeur',
  'Central Park Views',
  'Private Beach Access',
  'Fitness Center',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  currency,
  currencies,
  totalMatches,
}) => {
  const handlePriceChange = (value: number) => {
    onUpdateFilters({
      ...filters,
      priceRange: [filters.priceRange[0], value],
    });
  };

  const toggleStar = (star: number) => {
    const exists = filters.starRatings.includes(star);
    const newStars = exists
      ? filters.starRatings.filter((s) => s !== star)
      : [...filters.starRatings, star];
    onUpdateFilters({ ...filters, starRatings: newStars });
  };

  const togglePropertyType = (type: PropertyType) => {
    const exists = filters.propertyTypes.includes(type);
    const newTypes = exists
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];
    onUpdateFilters({ ...filters, propertyTypes: newTypes });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const newAmenities = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onUpdateFilters({ ...filters, amenities: newAmenities });
  };

  const resetFilters = () => {
    onUpdateFilters({
      priceRange: [0, 800],
      starRatings: [],
      minRatingScore: 0,
      propertyTypes: [],
      amenities: [],
      freeCancellationOnly: false,
      breakfastIncludedOnly: false,
      sortBy: 'recommended',
    });
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Filter Stays
          </h3>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {totalMatches}
          </span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center transition"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </button>
      </div>

      {/* Policies Quick Toggles */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Popular Perks
        </div>

        <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.freeCancellationOnly}
            onChange={(e) =>
              onUpdateFilters({ ...filters, freeCancellationOnly: e.target.checked })
            }
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <span className="font-semibold text-emerald-700">Free cancellation</span>
        </label>

        <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.breakfastIncludedOnly}
            onChange={(e) =>
              onUpdateFilters({ ...filters, breakfastIncludedOnly: e.target.checked })
            }
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <span className="font-semibold text-blue-800">Breakfast included</span>
        </label>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider">
            Max Nightly Budget
          </span>
          <span className="font-mono font-bold text-blue-600">
            {formatPrice(filters.priceRange[1], currency, currencies)}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="800"
          step="25"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>{formatPrice(100, currency, currencies)}</span>
          <span>{formatPrice(450, currency, currencies)}</span>
          <span>{formatPrice(800, currency, currencies)}+</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Star Rating
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[5, 4, 3].map((star) => {
            const active = filters.starRatings.includes(star);
            return (
              <button
                key={star}
                type="button"
                onClick={() => toggleStar(star)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border transition ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{star}</span>
                <Star className={`w-3.5 h-3.5 ${active ? 'fill-white' : 'fill-amber-400 text-amber-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest Review Score */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Guest Review Score
        </div>
        <div className="space-y-1.5">
          {[
            { score: 9.5, label: '9.5+ Exceptional' },
            { score: 9.0, label: '9.0+ Superb' },
            { score: 8.5, label: '8.5+ Very Good' },
            { score: 0, label: 'Any review score' },
          ].map((item) => (
            <label
              key={item.score}
              className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer"
            >
              <input
                type="radio"
                name="minRatingScore"
                checked={filters.minRatingScore === item.score}
                onChange={() => onUpdateFilters({ ...filters, minRatingScore: item.score })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className={filters.minRatingScore === item.score ? 'font-bold text-blue-600' : ''}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Types */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Property Type
        </div>
        <div className="space-y-1.5">
          {PROPERTY_TYPES.map((type) => {
            const checked = filters.propertyTypes.includes(type);
            return (
              <label
                key={type}
                className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePropertyType(type)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className={checked ? 'font-bold text-slate-900' : ''}>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Facilities & Amenities
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {POPULAR_AMENITIES.map((amenity) => {
            const checked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className={`truncate ${checked ? 'font-bold text-slate-900' : ''}`}>
                  {amenity}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
