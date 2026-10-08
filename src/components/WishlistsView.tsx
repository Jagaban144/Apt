import React, { useState } from 'react';
import { Heart, Plus, FolderHeart, Trash2, ArrowRight, Star, MapPin } from 'lucide-react';
import { Wishlist, Property, CurrencyCode, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface WishlistsViewProps {
  wishlists: Wishlist[];
  properties: Property[];
  currency: CurrencyCode;
  currencies: Currency[];
  onSelectProperty: (property: Property) => void;
  onCreateWishlist: (name: string, icon: string) => void;
  onRemoveFromWishlist: (wishlistId: string, propertyId: string) => void;
  onDeleteWishlist: (wishlistId: string) => void;
}

export const WishlistsView: React.FC<WishlistsViewProps> = ({
  wishlists,
  properties,
  currency,
  currencies,
  onSelectProperty,
  onCreateWishlist,
  onRemoveFromWishlist,
  onDeleteWishlist,
}) => {
  const [activeWishlistId, setActiveWishlistId] = useState<string>(wishlists[0]?.id || '');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('✨');

  const activeCollection = wishlists.find((w) => w.id === activeWishlistId) || wishlists[0];

  const savedProperties = activeCollection
    ? properties.filter((p) => activeCollection.propertyIds.includes(p.id))
    : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateWishlist(newName.trim(), newIcon);
    setNewName('');
    setNewModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500 mr-2.5" />
            Saved Wishlists & Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize your dream escapes into bespoke collections for family holidays, solo trips, or work summits.
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/25 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {wishlists.map((w) => {
          const isActive = w.id === activeWishlistId;

          return (
            <button
              key={w.id}
              onClick={() => setActiveWishlistId(w.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition flex-shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{w.icon}</span>
              <span>{w.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {w.propertyIds.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Collection Body */}
      {activeCollection && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{activeCollection.icon}</span>
              <div>
                <h2 className="text-lg font-black text-slate-900">{activeCollection.name}</h2>
                <p className="text-xs text-slate-400">
                  {savedProperties.length} saved propert{savedProperties.length === 1 ? 'y' : 'ies'}
                </p>
              </div>
            </div>

            {wishlists.length > 1 && (
              <button
                onClick={() => onDeleteWishlist(activeCollection.id)}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center space-x-1"
                title="Delete this entire collection"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete List</span>
              </button>
            )}
          </div>

          {savedProperties.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FolderHeart className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">This collection is currently empty</p>
              <p className="text-xs text-slate-400">
                Click the heart icon on any stay across the platform to add it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProperties.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      onClick={() => onRemoveFromWishlist(activeCollection.id, p.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white shadow transition"
                      title="Remove from this wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">{p.city}</span>
                        <div className="flex items-center text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                          <span>{p.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                        <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                        {p.neighborhood}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">From </span>
                        <span className="font-black text-slate-900 text-sm">
                          {formatPrice(p.startingPrice, currency, currencies)}
                        </span>
                        <span className="text-[10px] text-slate-400"> / nt</span>
                      </div>

                      <button
                        onClick={() => onSelectProperty(p)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Wishlist Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Create New Collection</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Ski Trip 2026"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Choose Icon
                </label>
                <div className="flex space-x-2 text-lg">
                  {['✨', '☀️', '💖', '💼', '🌴', '🏔️', '🏰'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      className={`p-2 rounded-xl border text-base ${
                        newIcon === emoji ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
