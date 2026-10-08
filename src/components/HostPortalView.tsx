import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Bed, 
  Star, 
  MapPin, 
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import { Property, Room, CurrencyCode, Currency, User } from '../types';
import { formatPrice } from '../utils/formatters';

interface HostPortalViewProps {
  properties: Property[];
  currency: CurrencyCode;
  currencies: Currency[];
  user: User;
  onAddProperty: (newProp: Property) => void;
  onUpdateRoomInventory: (propertyId: string, roomId: string, newInventory: number) => void;
}

export const HostPortalView: React.FC<HostPortalViewProps> = ({
  properties,
  currency,
  currencies,
  user,
  onAddProperty,
  onUpdateRoomInventory,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New property form state
  const [newProp, setNewProp] = useState({
    name: '',
    propertyType: 'Hotel' as Property['propertyType'],
    city: 'Paris',
    country: 'France',
    address: '',
    description: '',
    startingPrice: 280,
    roomName: 'Deluxe Executive Suite',
    totalInventory: 5,
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `prop_custom_${Date.now()}`;
    const newPropertyObj: Property = {
      id,
      hostId: user.id,
      hostName: `${user.firstName} ${user.lastName}`,
      hostBadge: 'Verified Premier Host',
      name: newProp.name,
      description: newProp.description || 'Stunning architectural property with world-class guest hospitality.',
      propertyType: newProp.propertyType,
      address: newProp.address || 'Central Boulevard 12',
      city: newProp.city,
      country: newProp.country,
      neighborhood: `${newProp.city} Center`,
      latitude: 48.8566,
      longitude: 2.3522,
      rating: 9.6,
      reviewCount: 1,
      starRating: 5,
      categoryScores: {
        cleanliness: 9.8,
        location: 9.7,
        service: 9.6,
        facilities: 9.5,
        value: 9.3,
        wifi: 9.8,
      },
      amenities: ['Free High-Speed Wi-Fi', 'Indoor Swimming Pool', 'Complimentary Breakfast', 'Luxury Spa & Sauna'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      ],
      isGeniusDiscount: true,
      freeCancellation: true,
      breakfastIncluded: true,
      instantBooking: true,
      startingPrice: Number(newProp.startingPrice),
      checkInTime: '15:00',
      checkOutTime: '11:00',
      rooms: [
        {
          id: `room_${id}_01`,
          propertyId: id,
          roomType: newProp.roomName,
          description: 'Spacious suite with king bed and designer marble bathroom.',
          basePricePerNight: Number(newProp.startingPrice),
          originalPricePerNight: Math.round(Number(newProp.startingPrice) * 1.2),
          maxOccupancy: { adults: 2, children: 1 },
          bedConfiguration: '1 Extra-Large King Bed',
          roomSizeM2: 45,
          totalInventory: Number(newProp.totalInventory),
          availableInventory: Number(newProp.totalInventory),
          mealInclusion: 'Breakfast Included',
          cancellationPolicy: 'Free cancellation until 48h before check-in',
          features: ['Soundproof Windows', 'Marble Bath', 'Espresso Bar'],
          photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
        },
      ],
    };

    onAddProperty(newPropertyObj);
    setAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Host & Property Owner Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Property Portfolio & Inventory Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multi-calendar synchronization, dynamic pricing controls, and reservation ledger.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>List New Property</span>
        </button>
      </div>

      {/* KPI Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue (30d)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatPrice(48250, currency, currencies)}
            </div>
            <div className="text-emerald-600 text-xs font-bold flex items-center mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +18.4% vs last month
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupancy Rate</div>
            <div className="text-2xl font-black text-slate-900 mt-1">88.4%</div>
            <div className="text-blue-600 text-xs font-bold flex items-center mt-1">
              <span>Peak season high</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Listings</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{properties.length}</div>
            <div className="text-slate-500 text-xs font-medium mt-1">All verified & live</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Check-ins</div>
            <div className="text-2xl font-black text-slate-900 mt-1">14 Guests</div>
            <div className="text-slate-500 text-xs font-medium mt-1">Next 72 hours</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Managed Properties & Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Active Listings & Room Inventory</h2>
            <p className="text-xs text-slate-500">
              Manage room availability in real-time to avoid double-bookings and update rates.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={prop.images[0]}
                    alt={prop.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{prop.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {prop.address}, {prop.city} · {prop.propertyType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-bold text-slate-700">
                    Rating: {prop.rating} ★
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Instant Book Active
                  </span>
                </div>
              </div>

              {/* Room Inventory Control Rows */}
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {prop.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{room.roomType}</div>
                      <div className="text-[11px] text-slate-500">
                        {room.bedConfiguration} · Max {room.maxOccupancy.adults} Adults
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Base Rate
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatPrice(room.basePricePerNight, currency, currencies)} / nt
                        </span>
                      </div>

                      {/* Inventory Counter */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Rooms Left:
                        </span>
                        <div className="flex items-center space-x-1.5 bg-slate-100 px-2 py-1 rounded-lg">
                          <button
                            type="button"
                            disabled={room.availableInventory <= 0}
                            onClick={() =>
                              onUpdateRoomInventory(
                                prop.id,
                                room.id,
                                Math.max(0, room.availableInventory - 1)
                              )
                            }
                            className="w-5 h-5 rounded bg-white font-bold text-slate-700 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="font-bold font-mono px-1">
                            {room.availableInventory} / {room.totalInventory}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateRoomInventory(
                                prop.id,
                                room.id,
                                room.availableInventory + 1
                              )
                            }
                            className="w-5 h-5 rounded bg-white font-bold text-slate-700 hover:bg-slate-200 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Property Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">List a New Property</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Horizon Panoramic Villa"
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Property Type
                  </label>
                  <select
                    value={newProp.propertyType}
                    onChange={(e) =>
                      setNewProp({
                        ...newProp,
                        propertyType: e.target.value as Property['propertyType'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Resort">Resort</option>
                    <option value="Guest House">Guest House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newProp.city}
                    onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nightly Base Price ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={newProp.startingPrice}
                    onChange={(e) =>
                      setNewProp({ ...newProp, startingPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Initial Room Units
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProp.totalInventory}
                    onChange={(e) =>
                      setNewProp({ ...newProp, totalInventory: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 Ocean Drive"
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
