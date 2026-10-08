import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  User as UserIcon,
  Globe
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'magic' | 'forgot'>('signin');
  const [email, setEmail] = useState('denzy1212@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [firstName, setFirstName] = useState('Denzy');
  const [lastName, setLastName] = useState('Architect');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleOAuthSignIn = (provider: 'Google' | 'Apple' | 'Facebook') => {
    const socialUser: User = {
      id: `usr_oauth_${Date.now()}`,
      email: `${provider.toLowerCase()}.user@aurastay.com`,
      firstName: provider,
      lastName: 'Traveler',
      phone: '+1 (555) 777-9999',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      loyaltyTier: 'Genius Level 2',
      memberSince: '2024',
      isLoggedIn: true,
    };
    onLoginSuccess(socialUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'magic') {
      setMagicLinkSent(true);
      setTimeout(() => {
        const magicUser: User = {
          id: `usr_magic_${Date.now()}`,
          email,
          firstName: 'Denzy',
          lastName: 'Architect',
          phone: '+1 (555) 234-5678',
          role: 'guest',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          loyaltyTier: 'Genius Level 2',
          memberSince: '2024',
          isLoggedIn: true,
        };
        onLoginSuccess(magicUser);
        onClose();
      }, 1500);
      return;
    }

    if (authMode === 'forgot') {
      setResetSent(true);
      return;
    }

    const authenticatedUser: User = {
      id: `usr_${Date.now()}`,
      email,
      firstName: authMode === 'register' ? firstName : 'Denzy',
      lastName: authMode === 'register' ? lastName : 'Architect',
      phone: '+1 (555) 234-5678',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      loyaltyTier: 'Genius Level 2',
      memberSince: '2024',
      isLoggedIn: true,
    };
    onLoginSuccess(authenticatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AuraStay Identity & Pass</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {authMode === 'signin' && 'Sign in to your account'}
            {authMode === 'register' && 'Create your AuraStay account'}
            {authMode === 'magic' && 'Passwordless Magic Link Sign In'}
            {authMode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unlock 10-25% Genius member rates and track your bookings worldwide.
          </p>
        </div>

        {/* Social OAuth 2.0 Integration */}
        {(authMode === 'signin' || authMode === 'register') && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('Google')}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-1 transition shadow-sm"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignIn('Apple')}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-1 transition shadow-sm"
              >
                <span>Apple</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignIn('Facebook')}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-1 transition shadow-sm"
              >
                <span>Facebook</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">
                Or with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <div className="flex items-center px-3 py-2 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
              <Mail className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {(authMode === 'signin' || authMode === 'register') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="flex items-center px-3 py-2 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                <Lock className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          )}

          {magicLinkSent && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
              ✓ Magic login token dispatched to {email}! Authenticating...
            </div>
          )}

          {resetSent && (
            <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold text-center">
              ✓ Password recovery instructions sent to {email}.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {authMode === 'signin' && 'Sign In'}
            {authMode === 'register' && 'Create Account'}
            {authMode === 'magic' && 'Send One-Click Magic Link'}
            {authMode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1.5">
          {authMode === 'signin' && (
            <>
              <div>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Register now
                </button>
              </div>
              <div>
                Prefer passwordless?{' '}
                <button
                  onClick={() => setAuthMode('magic')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Use Magic Link
                </button>
              </div>
            </>
          )}

          {(authMode === 'register' || authMode === 'magic' || authMode === 'forgot') && (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-blue-600 font-bold hover:underline"
              >
                Back to Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
