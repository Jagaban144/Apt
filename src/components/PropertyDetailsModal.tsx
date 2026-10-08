import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Heart, 
  Share2, 
  Check, 
  Sparkles, 
  Users, 
  Bed, 
  Maximize2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { Property, Room, CurrencyCode, Currency, Review, SearchQuery } from '../types';
import { formatPrice, calculateNights } from '../utils/formatters';

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
  currency: CurrencyCode;
  currencies: Currency[];
  searchQuery: SearchQuery;
  reviews: Review[];
  onStartCheckout: (property: Property, room: Room) => void;
  onToggleWishlist: (propertyId: string) => void;
  isSaved: boolean;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  currency,
  currencies,
  searchQuery,
  reviews,
  onStartCheckout,
  onToggleWishlist,
  isSaved,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<string>('All');

  const nights = calculateNights(searchQuery.checkInDate, searchQuery.checkOutDate);

  const filteredReviews = reviews.filter((r) => {
    if (r.propertyId !== property.id) return false;
    if (selectedReviewFilter === 'All') return true;
    return r.travelerType.toLowerCase() === selectedReviewFilter.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {property.propertyType}
            </span>
            <span className="text-xs font-bold text-slate-400">·</span>
            <div className="flex items-center text-amber-500 text-xs">
              {Array.from({ length: property.starRating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            {property.featuredBadge && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-600 text-white uppercase">
                {property.featuredBadge}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleWishlist(property.id)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-rose-500 transition"
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8">
          {/* Title & Location */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {property.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
              <span className="flex items-center text-slate-700 font-semibold">
                <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                {property.address}, {property.neighborhood}, {property.city}, {property.country}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Great Location — {property.categoryScores.location}/10
              </span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="relative rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* Primary Large Image */}
            <div
              onClick={() => {
                setActivePhotoIndex(0);
                setLightboxOpen(true);
              }}
              className="md:col-span-2 h-72 md:h-96 relative group cursor-pointer overflow-hidden rounded-xl bg-slate-900"
            >
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition" />
              <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Click to expand gallery</span>
              </div>
            </div>

            {/* Sub-grid of Photos */}
            <div className="md:col-span-2 grid grid-cols-2 gap-2 h-72 md:h-96">
              {property.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActivePhotoIndex(idx + 1);
                    setLightboxOpen(true);
                  }}
                  className="relative group cursor-pointer overflow-hidden rounded-xl bg-slate-900 h-full"
                >
                  <img
                    src={img}
                    alt={`${property.name} ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {idx === 3 && property.images.length > 4 && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold">
                      +{property.images.length - 4} More Photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Highlights & Ratings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-base font-bold text-slate-900">About this property</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {property.description}
              </p>
              <div className="flex items-center space-x-2 pt-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hosted by <strong className="text-slate-800">{property.hostName}</strong> ({property.hostBadge})</span>
              </div>
            </div>

            {/* Scorecard */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      {property.rating >= 9.5 ? 'Exceptional' : 'Superb'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {property.reviewCount.toLocaleString()} verified reviews
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex items-center justify-center font-black text-base shadow">
                    {property.rating}
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Cleanliness</span>
                    <strong className="text-slate-900">{property.categoryScores.cleanliness}/10</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Location</span>
                    <strong className="text-slate-900">{property.categoryScores.location}/10</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Staff & Service</span>
                    <strong className="text-slate-900">{property.categoryScores.service}/10</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Value for money</span>
                    <strong className="text-slate-900">{property.categoryScores.value}/10</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-blue-600 font-bold text-center">
                Top 1% rated in {property.city}
              </div>
            </div>
          </div>

          {/* Amenities Badges Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Popular Amenities & Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Room Selection Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Available Room Options & Pricing Variants
                </h3>
                <p className="text-xs text-slate-500">
                  Select your preferred suite for {nights} night{nights > 1 ? 's' : ''} ({searchQuery.checkInDate} to {searchQuery.checkOutDate})
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A192F] text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 sm:p-4">Room Type</th>
                    <th className="p-3.5 sm:p-4">Capacity</th>
                    <th className="p-3.5 sm:p-4">Inclusions & Policies</th>
                    <th className="p-3.5 sm:p-4">Price ({nights} Night{nights > 1 ? 's' : ''})</th>
                    <th className="p-3.5 sm:p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {property.rooms.map((room) => {
                    const roomTotal = room.basePricePerNight * nights;

                    return (
                      <tr key={room.id} className="hover:bg-slate-50/80 transition">
                        {/* Room Info */}
                        <td className="p-3.5 sm:p-4 align-top w-1/3">
                          <h4 className="font-bold text-slate-900 text-sm">{room.roomType}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {room.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                            <span className="flex items-center">
                              <Bed className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {room.bedConfiguration}
                            </span>
                            <span className="flex items-center">
                              <Maximize2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {room.roomSizeM2} m²
                            </span>
                          </div>
                          {room.availableInventory <= 2 && (
                            <div className="mt-2 text-[11px] font-bold text-rose-600 flex items-center">
                              <AlertCircle className="w-3.5 h-3.5 mr-1" />
                              Only {room.availableInventory} room{room.availableInventory > 1 ? 's' : ''} left at this price!
                            </div>
                          )}
                        </td>

                        {/* Capacity */}
                        <td className="p-3.5 sm:p-4 align-top">
                          <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span>
                              {room.maxOccupancy.adults} Adults
                              {room.maxOccupancy.children > 0 && `, ${room.maxOccupancy.children} Child`}
                            </span>
                          </div>
                        </td>

                        {/* Inclusions */}
                        <td className="p-3.5 sm:p-4 align-top space-y-1.5">
                          <div className="text-emerald-700 font-semibold flex items-center">
                            <Check className="w-3.5 h-3.5 mr-1" />
                            {room.mealInclusion}
                          </div>
                          <div className="text-blue-700 font-semibold flex items-center">
                            <Check className="w-3.5 h-3.5 mr-1" />
                            {room.cancellationPolicy}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            Pay nothing until arrival day
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-3.5 sm:p-4 align-top">
                          <div className="text-lg font-black text-slate-900">
                            {formatPrice(roomTotal, currency, currencies)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatPrice(room.basePricePerNight, currency, currencies)} / night
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            Taxes & fees included
                          </div>
                        </td>

                        {/* CTA */}
                        <td className="p-3.5 sm:p-4 align-top text-right">
                          <button
                            onClick={() => onStartCheckout(property, room)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition whitespace-nowrap"
                          >
                            Reserve Room
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verified Guest Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Verified Guest Reviews & Category Scores
                </h3>
                <p className="text-xs text-slate-500">
                  100% authenticated reviews by guests who stayed at this property
                </p>
              </div>

              {/* Traveler Filter */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                {['All', 'Couple', 'Solo', 'Family', 'Business'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedReviewFilter(tab)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                      selectedReviewFilter === tab
                        ? 'bg-white text-blue-600 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900">{rev.userName}</div>
                          <div className="text-[11px] text-slate-400">
                            {rev.userCountry} · Traveled as {rev.travelerType}
                          </div>
                        </div>
                      </div>

                      <div className="px-2 py-1 rounded-lg bg-[#0A192F] text-white font-bold text-xs">
                        {rev.ratingScore}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 leading-snug">
                      "{rev.title}"
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>

                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                      <span>Stayed in {rev.roomTypeName}</span>
                      <span>{rev.createdAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No verified reviews found for this traveler type filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/20">
            <div>
              <h3 className="font-bold text-sm sm:text-base">{property.name}</h3>
              <p className="text-xs text-slate-400">
                Photo {activePhotoIndex + 1} of {property.images.length}
              </p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image & Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={() =>
                setActivePhotoIndex(
                  (prev) => (prev - 1 + property.images.length) % property.images.length
                )
              }
              className="absolute left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={property.images[activePhotoIndex]}
              alt={`Gallery preview ${activePhotoIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev + 1) % property.images.length)
              }
              className="absolute right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Thumbnails Strip */}
          <div className="flex justify-center space-x-2 overflow-x-auto py-2">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                  activePhotoIndex === idx
                    ? 'border-blue-500 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
