import React, { useState } from 'react';
import { 
  Compass, 
  Heart, 
  CalendarDays, 
  Building2, 
  HelpCircle, 
  User as UserIcon, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  LogOut, 
  ShieldCheck, 
  Briefcase 
} from 'lucide-react';
import { Currency, CurrencyCode, Language, LanguageCode, User } from '../types';

interface HeaderProps {
  currentTab: 'search' | 'wishlists' | 'bookings' | 'host' | 'architecture';
  onSelectTab: (tab: 'search' | 'wishlists' | 'bookings' | 'host' | 'architecture') => void;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  currencies: Currency[];
  language: LanguageCode;
  onChangeLanguage: (l: LanguageCode) => void;
  languages: Language[];
  user: User;
  onOpenAuth: () => void;
  onOpenSupport: () => void;
  onOpenArchitecture: () => void;
  savedCount: number;
  bookingsCount: number;
  onLogout: () => void;
  onSwitchRole: (role: 'guest' | 'host' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currency,
  onChangeCurrency,
  currencies,
  language,
  onChangeLanguage,
  languages,
  user,
  onOpenAuth,
  onOpenSupport,
  onOpenArchitecture,
  savedCount,
  bookingsCount,
  onLogout,
  onSwitchRole,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeCurrency = currencies.find((c) => c.code === currency) || currencies[0];
  const activeLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0A192F] text-white shadow-md">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-700/60 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="inline-flex items-center text-blue-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Global Best Price Guarantee
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            Over 2,400,000+ luxury hotels, villas & apartments
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Architecture Blueprint Button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-400/30 transition text-xs font-semibold"
            title="Inspect System Architecture, Postgres DDL & DevOps Spec"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Architecture & API Spec</span>
            <span className="sm:hidden">Spec</span>
          </button>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setLanguageDropdownOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-200 transition font-medium"
            >
              <span>{activeCurrency.code} ({activeCurrency.symbol})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                  Select Currency
                </div>
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      onChangeCurrency(c.code);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 transition ${
                      c.code === currency ? 'bg-blue-50/70 text-blue-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-500">{c.code} ({c.symbol})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLanguageDropdownOpen(!languageDropdownOpen);
                setCurrencyDropdownOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-200 transition font-medium"
            >
              <span>{activeLanguage.flag}</span>
              <span className="hidden sm:inline">{activeLanguage.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                  Choose Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLanguage(l.code);
                      setLanguageDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-blue-50 transition ${
                      l.code === language ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help & Support */}
          <button
            onClick={onOpenSupport}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition"
            title="Customer Help Center & FAQ"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('search')}
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-white">AuraStay</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30">
                Global
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-none hidden sm:block">
              Luxury Stays & Property Engine
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => onSelectTab('search')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              currentTab === 'search'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Search & Explore</span>
          </button>

          <button
            onClick={() => onSelectTab('wishlists')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition relative ${
              currentTab === 'wishlists'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Stays</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('bookings')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition relative ${
              currentTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {bookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('host')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              currentTab === 'host'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Host Portal</span>
          </button>
        </nav>

        {/* Right User Utility & Profile */}
        <div className="flex items-center space-x-3">
          {/* List Your Property CTA */}
          <button
            onClick={() => onSelectTab('host')}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-600 hover:border-slate-400 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>List Your Property</span>
          </button>

          {/* User Profile / Auth State */}
          {user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setCurrencyDropdownOpen(false);
                  setLanguageDropdownOpen(false);
                }}
                className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.firstName}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/50"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user.firstName}
                  </div>
                  <div className="text-[10px] font-medium text-blue-400 leading-tight">
                    {user.loyaltyTier}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                      {user.loyaltyTier} · 10-25% Extra Off
                    </div>
                  </div>

                  {/* Role Switcher */}
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Switch Role Mode:
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {(['guest', 'host', 'admin'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            onSwitchRole(r);
                            if (r === 'host') onSelectTab('host');
                          }}
                          className={`px-2 py-1 text-[11px] font-semibold rounded capitalize transition ${
                            user.role === r
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSelectTab('bookings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>My Bookings & Stays</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('wishlists');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Saved Wishlists ({savedCount})</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('host');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>Host Property Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenArchitecture();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Architecture & Relational Schema</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
