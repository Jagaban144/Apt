import React, { useState } from 'react';
import { 
  Grid3X3, 
  List, 
  Map, 
  Star, 
  Heart, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowUpDown,
  Building
} from 'lucide-react';
import { Property, CurrencyCode, Currency, FilterState, SearchQuery } from '../types';
import { formatPrice, calculateNights } from '../utils/formatters';
import { InteractiveMapView } from './InteractiveMapView';
import { FilterSidebar } from './FilterSidebar';

interface PropertyListingsViewProps {
  properties: Property[];
  searchQuery: SearchQuery;
  filters: FilterState;
  onUpdateFilters: (f: FilterState) => void;
  currency: CurrencyCode;
  currencies: Currency[];
  onSelectProperty: (p: Property) => void;
  onToggleWishlist: (propertyId: string) => void;
  savedPropertyIds: string[];
}

export const PropertyListingsView: React.FC<PropertyListingsViewProps> = ({
  properties,
  searchQuery,
  filters,
  onUpdateFilters,
  currency,
  currencies,
  onSelectProperty,
  onToggleWishlist,
  savedPropertyIds,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

  const nights = calculateNights(searchQuery.checkInDate, searchQuery.checkOutDate);

  // Filter properties
  const filteredProperties = properties
    .filter((p) => {
      // Destination text match
      if (
        searchQuery.destination &&
        !p.city.toLowerCase().includes(searchQuery.destination.toLowerCase()) &&
        !p.country.toLowerCase().includes(searchQuery.destination.toLowerCase()) &&
        !p.name.toLowerCase().includes(searchQuery.destination.toLowerCase())
      ) {
        return false;
      }
      // Max price
      if (p.startingPrice > filters.priceRange[1]) return false;
      // Stars
      if (filters.starRatings.length > 0 && !filters.starRatings.includes(p.starRating)) {
        return false;
      }
      // Minimum rating
      if (filters.minRatingScore > 0 && p.rating < filters.minRatingScore) {
        return false;
      }
      // Property type
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(p.propertyType)) {
        return false;
      }
      // Amenities
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) => p.amenities.includes(a));
        if (!hasAll) return false;
      }
      // Free Cancellation
      if (filters.freeCancellationOnly && !p.freeCancellation) return false;
      // Breakfast
      if (filters.breakfastIncludedOnly && !p.breakfastIncluded) return false;

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
      if (filters.sortBy === 'price_desc') return b.startingPrice - a.startingPrice;
      if (filters.sortBy === 'rating_desc') return b.rating - a.rating;
      if (filters.sortBy === 'reviews_desc') return b.reviewCount - a.reviewCount;
      return 0; // recommended
    });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="stays-feed">
      {/* Listing View Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
            {searchQuery.destination ? `${searchQuery.destination}: ` : 'Featured: '}
            <span className="text-blue-600 ml-1.5">{filteredProperties.length} Properties Found</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prices for {nights} night{nights > 1 ? 's' : ''}, {searchQuery.adults} adult{searchQuery.adults > 1 ? 's' : ''} · Taxes and fees included
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recommended">Our Top Recommendations</option>
              <option value="price_asc">Price (Lowest first)</option>
              <option value="price_desc">Price (Highest first)</option>
              <option value="rating_desc">Guest Rating Score</option>
              <option value="reviews_desc">Most Reviewed</option>
            </select>
          </div>

          {/* View Mode Toggle: List vs Grid vs Map */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Interactive Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Property Cards or Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onUpdateFilters={onUpdateFilters}
            currency={currency}
            currencies={currencies}
            totalMatches={filteredProperties.length}
          />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          {viewMode === 'map' ? (
            <InteractiveMapView
              properties={filteredProperties}
              currency={currency}
              currencies={currencies}
              onSelectProperty={onSelectProperty}
              onToggleWishlist={onToggleWishlist}
              savedPropertyIds={savedPropertyIds}
            />
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching properties found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, clearing amenity filters, or searching for another global city.
              </p>
              <button
                onClick={() =>
                  onUpdateFilters({
                    ...filters,
                    priceRange: [0, 800],
                    starRatings: [],
                    minRatingScore: 0,
                    propertyTypes: [],
                    amenities: [],
                  })
                }
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* List View */
            <div className="space-y-4">
              {filteredProperties.map((property) => {
                const isSaved = savedPropertyIds.includes(property.id);
                const originalPrice = Math.round(property.startingPrice * 1.18);

                return (
                  <div
                    key={property.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-blue-200 transition duration-300 p-3 sm:p-4 flex flex-col sm:flex-row gap-4 relative"
                  >
                    {/* Property Thumbnail with Heart */}
                    <div className="relative sm:w-64 h-52 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Wishlist Heart */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(property.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-500 shadow-md transition"
                        title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>

                      {/* Featured Badge */}
                      {property.featuredBadge && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                          {property.featuredBadge}
                        </div>
                      )}

                      {/* Genius Discount Tag */}
                      {property.isGeniusDiscount && (
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-sm text-amber-300 text-[10px] font-bold flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Genius Special Deal
                        </div>
                      )}
                    </div>

                    {/* Middle Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Star Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-1 text-amber-400 mb-1">
                              {Array.from({ length: property.starRating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                              <span className="text-[11px] font-semibold text-slate-400 ml-1">
                                {property.propertyType}
                              </span>
                            </div>

                            <h3
                              onClick={() => onSelectProperty(property)}
                              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer"
                            >
                              {property.name}
                            </h3>

                            <p className="text-xs text-slate-500 flex items-center mt-1">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                              {property.address}, {property.city}
                              <span className="mx-1.5 text-slate-300">·</span>
                              <span className="text-blue-600 font-medium">Show on map</span>
                            </p>
                          </div>

                          {/* Review Score Badge */}
                          <div className="flex items-center space-x-2 text-right flex-shrink-0">
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {property.rating >= 9.5 ? 'Exceptional' : 'Superb'}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {property.reviewCount.toLocaleString()} reviews
                              </div>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-[#0A192F] text-white flex items-center justify-center font-black text-xs shadow-sm">
                              {property.rating}
                            </div>
                          </div>
                        </div>

                        {/* Property Highlights */}
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {property.description}
                        </p>

                        {/* Inclusions Perks */}
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                          {property.freeCancellation && (
                            <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3 mr-1" />
                              Free Cancellation
                            </span>
                          )}
                          {property.breakfastIncluded && (
                            <span className="inline-flex items-center text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3 mr-1" />
                              Breakfast Included
                            </span>
                          )}
                          <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            No prepayment needed
                          </span>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                        <div>
                          <div className="text-[11px] text-slate-400">
                            {nights} night{nights > 1 ? 's' : ''}, {searchQuery.adults} adult{searchQuery.adults > 1 ? 's' : ''}
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(originalPrice * nights, currency, currencies)}
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-slate-900">
                              {formatPrice(property.startingPrice * nights, currency, currencies)}
                            </span>
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            + Includes taxes and charges
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectProperty(property)}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition"
                        >
                          <span>See Availability</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProperties.map((property) => {
                const isSaved = savedPropertyIds.includes(property.id);
                const originalPrice = Math.round(property.startingPrice * 1.18);

                return (
                  <div
                    key={property.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-xl transition duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(property.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-slate-700 hover:text-rose-500 shadow transition"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                      {property.featuredBadge && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black uppercase">
                          {property.featuredBadge}
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-500">{property.city}</span>
                          <div className="flex items-center space-x-1 font-bold text-slate-900">
                            <span className="px-1.5 py-0.5 bg-[#0A192F] text-white rounded text-[10px]">
                              {property.rating}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              ({property.reviewCount})
                            </span>
                          </div>
                        </div>

                        <h3
                          onClick={() => onSelectProperty(property)}
                          className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition cursor-pointer line-clamp-1"
                        >
                          {property.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {property.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Nightly from</div>
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(originalPrice, currency, currencies)}
                            </span>
                            <span className="text-base font-black text-slate-900">
                              {formatPrice(property.startingPrice, currency, currencies)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectProperty(property)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                        >
                          View Stay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
