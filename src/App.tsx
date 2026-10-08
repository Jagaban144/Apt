import React, { useState } from 'react';
import { 
  CURRENCIES, 
  LANGUAGES, 
  INITIAL_USER, 
  POPULAR_DESTINATIONS, 
  PROMOTIONS, 
  PROPERTIES, 
  INITIAL_REVIEWS, 
  INITIAL_WISHLISTS, 
  INITIAL_BOOKINGS 
} from './data/travelMockData';
import { 
  CurrencyCode, 
  LanguageCode, 
  User, 
  Property, 
  Room, 
  SearchQuery, 
  FilterState, 
  Booking, 
  Wishlist, 
  Review 
} from './types';
import { Header } from './components/Header';
import { HeroSearchWidget } from './components/HeroSearchWidget';
import { PromotionsBanner } from './components/PromotionsBanner';
import { ExploreDestinationsGrid } from './components/ExploreDestinationsGrid';
import { PropertyListingsView } from './components/PropertyListingsView';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { BookingsManagementView } from './components/BookingsManagementView';
import { WishlistsView } from './components/WishlistsView';
import { HostPortalView } from './components/HostPortalView';
import { ArchitectureBlueprintModal } from './components/ArchitectureBlueprintModal';
import { AuthModal } from './components/AuthModal';
import { SupportModal } from './components/SupportModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

export function App() {
  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState<'search' | 'wishlists' | 'bookings' | 'host' | 'architecture'>('search');

  // Currencies & Languages
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // User Authentication
  const [user, setUser] = useState<User>(INITIAL_USER);

  // Core Data Collections
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [wishlists, setWishlists] = useState<Wishlist[]>(INITIAL_WISHLISTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Search Query
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    destination: '',
    checkInDate: '2026-11-12',
    checkOutDate: '2026-11-16',
    adults: 2,
    children: 0,
    childrenAges: [],
    rooms: 1,
    travelingForWork: false,
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 800],
    starRatings: [],
    minRatingScore: 0,
    propertyTypes: [],
    amenities: [],
    freeCancellationOnly: false,
    breakfastIncludedOnly: false,
    sortBy: 'recommended',
  });

  // Active Modals & Flow Controls
  const [selectedPDPProperty, setSelectedPDPProperty] = useState<Property | null>(null);
  const [checkoutTarget, setCheckoutTarget] = useState<{ property: Property; room: Room } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Saved Property IDs set
  const savedPropertyIds = Array.from(new Set(wishlists.flatMap((w) => w.propertyIds)));

  // Wishlist toggle handler
  const handleToggleWishlist = (propertyId: string) => {
    const isSaved = savedPropertyIds.includes(propertyId);

    if (isSaved) {
      setWishlists((prev) =>
        prev.map((w) => ({
          ...w,
          propertyIds: w.propertyIds.filter((id) => id !== propertyId),
        }))
      );
      showToast('Removed stay from saved wishlist');
    } else {
      // Add to default/first wishlist
      setWishlists((prev) => {
        const next = [...prev];
        if (next.length === 0) {
          next.push({
            id: `wish_${Date.now()}`,
            name: 'Favorite Stays',
            icon: '💖',
            propertyIds: [propertyId],
            createdAt: new Date().toISOString(),
          });
        } else {
          next[0] = {
            ...next[0],
            propertyIds: [...next[0].propertyIds, propertyId],
          };
        }
        return next;
      });
      showToast('Saved to your wishlist collection!');
    }
  };

  // Add new wishlist collection
  const handleCreateWishlist = (name: string, icon: string) => {
    const newW: Wishlist = {
      id: `wish_${Date.now()}`,
      name,
      icon,
      propertyIds: [],
      createdAt: new Date().toISOString(),
    };
    setWishlists((prev) => [...prev, newW]);
    showToast(`Created collection "${name}"`);
  };

  const handleRemoveFromWishlist = (wishlistId: string, propertyId: string) => {
    setWishlists((prev) =>
      prev.map((w) =>
        w.id === wishlistId
          ? { ...w, propertyIds: w.propertyIds.filter((id) => id !== propertyId) }
          : w
      )
    );
    showToast('Removed from collection');
  };

  const handleDeleteWishlist = (wishlistId: string) => {
    setWishlists((prev) => prev.filter((w) => w.id !== wishlistId));
    showToast('Collection deleted');
  };

  // Booking handlers
  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Also decrement room available inventory
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== newBooking.propertyId) return p;
        return {
          ...p,
          rooms: p.rooms.map((r) =>
            r.id === newBooking.roomId
              ? { ...r, availableInventory: Math.max(0, r.availableInventory - 1) }
              : r
          ),
        };
      })
    );
    showToast(`Booking ${newBooking.referenceCode} Confirmed & Inventory Locked!`);
  };

  const handleModifyBookingDates = (bookingId: string, newIn: string, newOut: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              checkInDate: newIn,
              checkOutDate: newOut,
            }
          : b
      )
    );
    showToast('Reservation dates updated successfully');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    showToast('Reservation cancelled and refund processed.');
  };

  // Host Portal Handlers
  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    showToast(`Published "${newProp.name}" to global inventory!`);
  };

  const handleUpdateRoomInventory = (propertyId: string, roomId: string, newInventory: number) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              rooms: p.rooms.map((r) =>
                r.id === roomId ? { ...r, availableInventory: newInventory } : r
              ),
            }
          : p
      )
    );
    showToast('Room inventory updated');
  };

  // Quick Promo Code apply
  const handleApplyPromo = (code: string) => {
    showToast(`Promo code "${code}" applied to search session!`);
  };

  const handleDestinationSelect = (destName: string) => {
    setSearchQuery((prev) => ({ ...prev, destination: destName }));
    setCurrentTab('search');
    const el = document.getElementById('stays-feed');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#0A192F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-blue-400/40 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currency={currency}
        onChangeCurrency={setCurrency}
        currencies={CURRENCIES}
        language={language}
        onChangeLanguage={setLanguage}
        languages={LANGUAGES}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        savedCount={savedPropertyIds.length}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
        onLogout={() => {
          setUser({ ...user, isLoggedIn: false });
          showToast('Signed out of AuraStay');
        }}
        onSwitchRole={(newRole) => {
          setUser({ ...user, role: newRole });
          showToast(`Switched user role to "${newRole}"`);
        }}
      />

      {/* Main Body per Tab */}
      <main className="flex-1">
        {currentTab === 'search' && (
          <>
            {/* Hero Banner Section */}
            <div className="relative bg-[#0A192F] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
              <div className="max-w-7xl mx-auto space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold">
                  <span>Explore 2,400,000+ Verified Luxury Stays Worldwide</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
                  Find Your Next Escape with Total Peace of Mind.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Boutique city penthouses, secluded private villas, and 5-star beachfront resorts with transparent pricing and instant free cancellation.
                </p>
              </div>
            </div>

            {/* Hero Search Bar Overlay */}
            <HeroSearchWidget
              query={searchQuery}
              onUpdateQuery={setSearchQuery}
              onSearch={() => {
                const el = document.getElementById('stays-feed');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              destinationSuggestions={POPULAR_DESTINATIONS.map((d) => ({
                name: d.name,
                country: d.country,
                count: d.propertyCount,
              }))}
            />

            {/* Promotions Banner Carousel */}
            <PromotionsBanner
              promotions={PROMOTIONS}
              onApplyPromo={handleApplyPromo}
            />

            {/* Explore Destinations Grid */}
            <ExploreDestinationsGrid
              destinations={POPULAR_DESTINATIONS}
              onSelectDestination={handleDestinationSelect}
              selectedDestination={searchQuery.destination}
            />

            {/* Main Property Listings & Filtering Engine */}
            <PropertyListingsView
              properties={properties}
              searchQuery={searchQuery}
              filters={filters}
              onUpdateFilters={setFilters}
              currency={currency}
              currencies={CURRENCIES}
              onSelectProperty={(prop) => setSelectedPDPProperty(prop)}
              onToggleWishlist={handleToggleWishlist}
              savedPropertyIds={savedPropertyIds}
            />
          </>
        )}

        {/* Tab 2: Saved Wishlists */}
        {currentTab === 'wishlists' && (
          <WishlistsView
            wishlists={wishlists}
            properties={properties}
            currency={currency}
            currencies={CURRENCIES}
            onSelectProperty={(prop) => setSelectedPDPProperty(prop)}
            onCreateWishlist={handleCreateWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onDeleteWishlist={handleDeleteWishlist}
          />
        )}

        {/* Tab 3: My Bookings & Stays */}
        {currentTab === 'bookings' && (
          <BookingsManagementView
            bookings={bookings}
            currency={currency}
            currencies={CURRENCIES}
            onModifyBookingDates={handleModifyBookingDates}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {/* Tab 4: Host & Property Portal */}
        {currentTab === 'host' && (
          <HostPortalView
            properties={properties}
            currency={currency}
            currencies={CURRENCIES}
            user={user}
            onAddProperty={handleAddProperty}
            onUpdateRoomInventory={handleUpdateRoomInventory}
          />
        )}

        {/* Tab 5: Architecture & API Blueprint */}
        {currentTab === 'architecture' && (
          <div className="py-6">
            <ArchitectureBlueprintModal onClose={() => setCurrentTab('search')} />
          </div>
        )}
      </main>

      {/* Modals */}
      {/* Property Details Page Modal */}
      {selectedPDPProperty && (
        <PropertyDetailsModal
          property={selectedPDPProperty}
          onClose={() => setSelectedPDPProperty(null)}
          currency={currency}
          currencies={CURRENCIES}
          searchQuery={searchQuery}
          reviews={reviews}
          onStartCheckout={(prop, room) => {
            setSelectedPDPProperty(null);
            setCheckoutTarget({ property: prop, room });
          }}
          onToggleWishlist={handleToggleWishlist}
          isSaved={savedPropertyIds.includes(selectedPDPProperty.id)}
        />
      )}

      {/* Checkout Modal */}
      {checkoutTarget && (
        <CheckoutModal
          property={checkoutTarget.property}
          room={checkoutTarget.room}
          searchQuery={searchQuery}
          user={user}
          currency={currency}
          currencies={CURRENCIES}
          onClose={() => setCheckoutTarget(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(authedUser) => {
            setUser(authedUser);
            showToast(`Welcome back, ${authedUser.firstName}!`);
          }}
        />
      )}

      {/* Support Modal */}
      {supportModalOpen && (
        <SupportModal onClose={() => setSupportModalOpen(false)} />
      )}

      {/* Architecture Modal when opened from header/footer button */}
      {architectureModalOpen && (
        <ArchitectureBlueprintModal onClose={() => setArchitectureModalOpen(false)} />
      )}

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedPropertyIds.length}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
        onOpenAuth={() => setAuthModalOpen(true)}
        isLoggedIn={user.isLoggedIn}
      />

      {/* Global Footer */}
      <Footer
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        onSelectDestination={handleDestinationSelect}
      />
    </div>
  );
}

export default App;

