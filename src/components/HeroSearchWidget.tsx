import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Briefcase, 
  X, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight,
  PlaneTakeoff,
  Building
} from 'lucide-react';
import { SearchQuery } from '../types';

interface HeroSearchWidgetProps {
  query: SearchQuery;
  onUpdateQuery: (query: SearchQuery) => void;
  onSearch: () => void;
  destinationSuggestions: { name: string; country: string; count: number }[];
}

export const HeroSearchWidget: React.FC<HeroSearchWidgetProps> = ({
  query,
  onUpdateQuery,
  onSearch,
  destinationSuggestions,
}) => {
  const [destFocused, setDestFocused] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const destRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestFocused(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setGuestPickerOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDatePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = destinationSuggestions.filter(
    (d) =>
      d.name.toLowerCase().includes(query.destination.toLowerCase()) ||
      d.country.toLowerCase().includes(query.destination.toLowerCase())
  );

  const handleAdultsChange = (delta: number) => {
    const newAdults = Math.max(1, Math.min(16, query.adults + delta));
    onUpdateQuery({ ...query, adults: newAdults });
  };

  const handleRoomsChange = (delta: number) => {
    const newRooms = Math.max(1, Math.min(8, query.rooms + delta));
    onUpdateQuery({ ...query, rooms: newRooms });
  };

  const handleChildrenChange = (delta: number) => {
    const newCount = Math.max(0, Math.min(6, query.children + delta));
    let newAges = [...query.childrenAges];
    if (delta > 0) {
      newAges.push(7); // default 7 yo
    } else if (delta < 0 && newAges.length > 0) {
      newAges.pop();
    }
    onUpdateQuery({ ...query, children: newCount, childrenAges: newAges });
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...query.childrenAges];
    newAges[index] = age;
    onUpdateQuery({ ...query, childrenAges: newAges });
  };

  // Quick preset stay dates
  const setPresetDates = (daysFromNow: number, stayDuration: number) => {
    const now = new Date();
    const inDate = new Date();
    inDate.setDate(now.getDate() + daysFromNow);
    const outDate = new Date();
    outDate.setDate(now.getDate() + daysFromNow + stayDuration);

    onUpdateQuery({
      ...query,
      checkInDate: inDate.toISOString().split('T')[0],
      checkOutDate: outDate.toISOString().split('T')[0],
    });
    setDatePickerOpen(false);
  };

  return (
    <div className="relative z-30 -mt-8 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border-4 border-amber-400 p-2 sm:p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDestFocused(false);
            setGuestPickerOpen(false);
            setDatePickerOpen(false);
            onSearch();
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-2"
        >
          {/* Destination Field */}
          <div ref={destRef} className="relative lg:col-span-4">
            <div
              className={`flex items-center px-3.5 py-3 rounded-xl border transition ${
                destFocused
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Where are you going?
                </label>
                <input
                  type="text"
                  value={query.destination}
                  onChange={(e) => onUpdateQuery({ ...query, destination: e.target.value })}
                  onFocus={() => {
                    setDestFocused(true);
                    setDatePickerOpen(false);
                    setGuestPickerOpen(false);
                  }}
                  placeholder="Paris, Tokyo, New York, Bali..."
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none truncate"
                />
              </div>
              {query.destination && (
                <button
                  type="button"
                  onClick={() => onUpdateQuery({ ...query, destination: '' })}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Auto-completing Suggestions Dropdown */}
            {destFocused && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in max-h-72 overflow-y-auto">
                <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Popular Destinations
                </div>
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onUpdateQuery({ ...query, destination: item.name });
                        setDestFocused(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-blue-50 flex items-center justify-between text-xs transition"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">{item.country}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {item.count.toLocaleString()} stays
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3.5 py-3 text-xs text-slate-500 text-center">
                    No matching destinations found. Press enter to search anywhere.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dates Dual-Calendar Picker */}
          <div ref={dateRef} className="relative lg:col-span-4">
            <button
              type="button"
              onClick={() => {
                setDatePickerOpen(!datePickerOpen);
                setDestFocused(false);
                setGuestPickerOpen(false);
              }}
              className={`w-full text-left flex items-center px-3.5 py-3 rounded-xl border transition ${
                datePickerOpen
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Check-in — Check-out
                </span>
                <span className="block text-sm font-semibold text-slate-900 truncate">
                  {query.checkInDate || 'Add date'} — {query.checkOutDate || 'Add date'}
                </span>
              </div>
            </button>

            {/* Date Range Modal */}
            {datePickerOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Select Travel Dates</div>
                  <button
                    type="button"
                    onClick={() => setDatePickerOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 my-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={query.checkInDate}
                      onChange={(e) => onUpdateQuery({ ...query, checkInDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={query.checkOutDate}
                      min={query.checkInDate}
                      onChange={(e) => onUpdateQuery({ ...query, checkOutDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">Quick Presets:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPresetDates(2, 3)}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-md font-medium transition"
                    >
                      This Weekend (3 nights)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDates(7, 7)}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-md font-medium transition"
                    >
                      Next Week (7 nights)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDates(30, 14)}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-md font-medium transition"
                    >
                      Next Month (2 weeks)
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDatePickerOpen(false)}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guests & Rooms Popover Modal */}
          <div ref={guestRef} className="relative lg:col-span-3">
            <button
              type="button"
              onClick={() => {
                setGuestPickerOpen(!guestPickerOpen);
                setDestFocused(false);
                setDatePickerOpen(false);
              }}
              className={`w-full text-left flex items-center px-3.5 py-3 rounded-xl border transition ${
                guestPickerOpen
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <Users className="w-5 h-5 text-blue-600 mr-2.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Guests & Rooms
                </span>
                <span className="block text-sm font-semibold text-slate-900 truncate">
                  {query.adults} Adults · {query.children} Child · {query.rooms} Room
                </span>
              </div>
            </button>

            {/* Popover Specification */}
            {guestPickerOpen && (
              <div className="absolute right-0 w-80 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-xs font-bold text-slate-900">Guests & Room Setup</span>
                  <button
                    type="button"
                    onClick={() => setGuestPickerOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Adults</div>
                    <div className="text-[11px] text-slate-400">Ages 18 or above</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      disabled={query.adults <= 1}
                      onClick={() => handleAdultsChange(-1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{query.adults}</span>
                    <button
                      type="button"
                      onClick={() => handleAdultsChange(1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="py-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Children</div>
                      <div className="text-[11px] text-slate-400">Ages 0 to 17</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        disabled={query.children <= 0}
                        onClick={() => handleChildrenChange(-1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{query.children}</span>
                      <button
                        type="button"
                        disabled={query.children >= 6}
                        onClick={() => handleChildrenChange(1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children Age Selectors */}
                  {query.children > 0 && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-[11px] font-semibold text-slate-600 mb-2">
                        Specify Child Ages (required for best room rate):
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {query.childrenAges.map((age, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200">
                            <span className="text-[11px] text-slate-600">Child {idx + 1}:</span>
                            <select
                              value={age}
                              onChange={(e) => handleChildAgeChange(idx, Number(e.target.value))}
                              className="text-xs font-bold text-blue-600 bg-transparent focus:outline-none"
                            >
                              {Array.from({ length: 18 }, (_, a) => (
                                <option key={a} value={a}>
                                  {a} yrs
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rooms */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Rooms</div>
                    <div className="text-[11px] text-slate-400">Total room units</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      disabled={query.rooms <= 1}
                      onClick={() => handleRoomsChange(-1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{query.rooms}</span>
                    <button
                      type="button"
                      onClick={() => handleRoomsChange(1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setGuestPickerOpen(false)}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Apply Setup
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search CTA Button */}
          <div className="lg:col-span-1">
            <button
              type="submit"
              className="w-full h-full min-h-[52px] bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition text-sm"
              title="Search available properties"
            >
              <Search className="w-5 h-5 lg:mr-0 mr-2" />
              <span className="lg:hidden">Search Stays</span>
            </button>
          </div>
        </form>

        {/* Bottom Filter Checkbox: Traveling for work */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 px-1">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={query.travelingForWork}
              onChange={(e) => onUpdateQuery({ ...query, travelingForWork: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="font-semibold text-slate-800 flex items-center">
              <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-500" />
              I'm traveling for work
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (unlock corporate rates, high-speed Wi-Fi & VAT invoices)
            </span>
          </label>

          <div className="hidden md:flex items-center space-x-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center">
              <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              Free Cancellation on most rooms
            </span>
            <span className="flex items-center">
              <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              No Hidden Fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
