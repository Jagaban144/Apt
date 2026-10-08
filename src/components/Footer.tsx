import React from 'react';
import { Compass, ShieldCheck, Lock, Award, Heart, Layers } from 'lucide-react';

interface FooterProps {
  onOpenArchitecture: () => void;
  onSelectDestination: (dest: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitecture, onSelectDestination }) => {
  return (
    <footer className="bg-[#0A192F] text-white border-t border-slate-800 pt-12 pb-20 md:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Best Price Guarantee</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Found a lower rate elsewhere? We match it and grant 10% loyalty credit.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Row-Level ACID Locks</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Zero double-booking risk guaranteed by transactional distributed mutexes.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Verified Luxury Properties</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Every listing is physically audited for hygiene, Wi-Fi speed & amenities.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Open Architecture</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Explore the complete PostgreSQL DDL, Dockerfile & AWS Cloud pipeline.
              </p>
            </div>
          </div>
        </div>

        {/* Global Cities Directory Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Top Global Cities
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onSelectDestination('Paris')} className="hover:text-blue-400 transition">
                  Paris Hotels & Villas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDestination('Tokyo')} className="hover:text-blue-400 transition">
                  Tokyo Skyline Suites
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDestination('New York')} className="hover:text-blue-400 transition">
                  New York Penthouses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDestination('Bali')} className="hover:text-blue-400 transition">
                  Bali Rainforest Villas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDestination('Dubai')} className="hover:text-blue-400 transition">
                  Dubai Palm Beach Resorts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Property Categories
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>Hotels & Boutique Inns</li>
              <li>Luxury Serviced Apartments</li>
              <li>Private Oceanfront Villas</li>
              <li>Spa & Wellness Resorts</li>
              <li>Historic Palazzos & Castles</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Host & Property Managers
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>List your property</li>
              <li>Channel manager integration</li>
              <li>Host community & guidelines</li>
              <li>Damage protection coverage</li>
              <li>Dynamic revenue pricing tool</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Developer & Architecture
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenArchitecture}
                  className="text-blue-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>PostgreSQL DDL & Schema</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenArchitecture}
                  className="text-blue-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Microservices Architecture</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenArchitecture}
                  className="text-blue-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Multi-Stage Dockerfile</span>
                </button>
              </li>
              <li>API Documentation (OpenAPI 3.1)</li>
              <li>System Status: 99.99% Uptime</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-blue-500" />
            <span className="font-black text-white">AuraStay Global Hospitality Platform</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-slate-400">Privacy Policy</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Terms of Service</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Security & PCI-DSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
