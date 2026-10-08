import React, { useState } from 'react';
import { Sparkles, Tag, ArrowRight, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { PromotionOffer } from '../types';

interface PromotionsBannerProps {
  promotions: PromotionOffer[];
  onApplyPromo: (promoCode: string) => void;
}

export const PromotionsBanner: React.FC<PromotionsBannerProps> = ({
  promotions,
  onApplyPromo,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onApplyPromo(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Seasonal Promotions & Travel Deals</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Exclusive Deals & Member Discounts
          </h2>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            aria-label="Previous promo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            aria-label="Next promo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map((promo, idx) => (
          <div
            key={promo.id}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-lg transition flex flex-col justify-between"
          >
            {/* Top Image & Badge */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md">
                <Tag className="w-3 h-3" />
                <span>{promo.tag}</span>
              </div>

              {/* Discount Callout */}
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-2xl font-black text-amber-300">
                  {promo.discountPercentage}% OFF
                </span>
                <span className="text-xs text-slate-200 ml-1.5 font-medium">or more</span>
              </div>

              {/* Expiry */}
              <div className="absolute bottom-3 right-3 flex items-center text-[10px] text-slate-200 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 mr-1 text-amber-300" />
                <span>{promo.expiresInDays} days left</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition">
                  {promo.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {promo.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Code:</span>
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {promo.promoCode}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(promo.promoCode)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    copiedCode === promo.promoCode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {copiedCode === promo.promoCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Deal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
