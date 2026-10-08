export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'JPY' | 'CAD' | 'AUD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // e.g. USD: 1, EUR: 0.92, GBP: 0.79, NGN: 1540, JPY: 152, CAD: 1.36, AUD: 1.52
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export type UserRole = 'guest' | 'host' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  loyaltyTier: 'Genius Level 1' | 'Genius Level 2' | 'VIP Platinum';
  memberSince: string;
  isLoggedIn: boolean;
}

export type PropertyType = 'Hotel' | 'Apartment' | 'Villa' | 'Resort' | 'Guest House';

export interface CategoryScores {
  cleanliness: number;
  location: number;
  service: number;
  facilities: number;
  value: number;
  wifi: number;
}

export interface Room {
  id: string;
  propertyId: string;
  roomType: string;
  description: string;
  basePricePerNight: number;
  originalPricePerNight: number;
  maxOccupancy: {
    adults: number;
    children: number;
  };
  bedConfiguration: string;
  roomSizeM2: number;
  totalInventory: number;
  availableInventory: number;
  mealInclusion: 'Room Only' | 'Breakfast Included' | 'Half Board (Breakfast + Dinner)' | 'All Inclusive';
  cancellationPolicy: 'Free cancellation until 48h before check-in' | 'Non-refundable' | 'Flexible cancellation';
  features: string[];
  photos: string[];
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCountry: string;
  travelerType: 'Couple' | 'Solo' | 'Family' | 'Business' | 'Friends';
  propertyId: string;
  ratingScore: number;
  title: string;
  comment: string;
  createdAt: string;
  roomTypeName: string;
}

export interface Property {
  id: string;
  hostId: string;
  hostName: string;
  hostBadge: string;
  name: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  country: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  starRating: 3 | 4 | 5;
  categoryScores: CategoryScores;
  amenities: string[];
  images: string[];
  isGeniusDiscount: boolean;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  instantBooking: boolean;
  featuredBadge?: string;
  rooms: Room[];
  startingPrice: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  propertyCount: number;
  tagline: string;
}

export interface PromotionOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  promoCode: string;
  tag: string;
  expiresInDays: number;
  image: string;
  accentColor: string;
}

export interface SearchQuery {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  travelingForWork: boolean;
}

export interface FilterState {
  priceRange: [number, number];
  starRatings: number[];
  minRatingScore: number;
  propertyTypes: PropertyType[];
  amenities: string[];
  freeCancellationOnly: boolean;
  breakfastIncludedOnly: boolean;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating_desc' | 'reviews_desc';
}

export interface AddOnSelection {
  airportTransfer: boolean;
  earlyCheckIn: boolean;
  breakfastBuffet: boolean;
  carbonOffset: boolean;
}

export interface BookingGuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  travelingForWork: boolean;
  companyName?: string;
  taxId?: string;
}

export type PaymentMethod = 'card' | 'paypal' | 'apple_pay' | 'local_bank';

export interface Booking {
  id: string;
  referenceCode: string;
  userId: string;
  guestDetails: BookingGuestDetails;
  propertyId: string;
  propertyName: string;
  propertyCity: string;
  propertyCountry: string;
  propertyAddress: string;
  propertyImage: string;
  roomId: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  addOns: AddOnSelection;
  pricing: {
    roomRatePerNight: number;
    roomTotal: number;
    addOnsTotal: number;
    taxesAndFees: number;
    discountAmount: number;
    totalAmount: number;
    currency: CurrencyCode;
  };
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: PaymentMethod;
  paymentGatewayRef: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  name: string;
  icon: string;
  propertyIds: string[];
  createdAt: string;
}
