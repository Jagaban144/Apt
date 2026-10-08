import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Plane, 
  Clock, 
  Coffee, 
  Leaf, 
  FileText, 
  Download, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  QrCode, 
  Building,
  CheckCircle2,
  Star
} from 'lucide-react';
import { 
  Property, 
  Room, 
  CurrencyCode, 
  Currency, 
  User, 
  Booking, 
  AddOnSelection, 
  PaymentMethod, 
  SearchQuery 
} from '../types';
import { 
  formatPrice, 
  formatPricePrecise, 
  calculateNights, 
  generateBookingReference, 
  generateIcsFile 
} from '../utils/formatters';

interface CheckoutModalProps {
  property: Property;
  room: Room;
  searchQuery: SearchQuery;
  user: User;
  currency: CurrencyCode;
  currencies: Currency[];
  onClose: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  property,
  room,
  searchQuery,
  user,
  currency,
  currencies,
  onClose,
  onBookingConfirmed,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  
  // 15-minute countdown for row-level lock hold
  const [secondsLeft, setSecondsLeft] = useState(900);

  useEffect(() => {
    if (currentStep === 4) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const nights = calculateNights(searchQuery.checkInDate, searchQuery.checkOutDate);

  // Step 1: Guest Details State
  const [guestDetails, setGuestDetails] = useState({
    firstName: user.firstName || 'Denzy',
    lastName: user.lastName || 'Architect',
    email: user.email || 'denzy1212@gmail.com',
    phone: user.phone || '+1 (555) 234-5678',
    specialRequests: '',
    travelingForWork: searchQuery.travelingForWork,
    companyName: 'AuraStay Global Enterprise',
    taxId: 'US-8924018',
  });

  // Step 2: Add-ons
  const [addOns, setAddOns] = useState<AddOnSelection>({
    airportTransfer: false,
    earlyCheckIn: false,
    breakfastBuffet: false,
    carbonOffset: true,
  });

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmed booking state
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Cost calculations
  const roomBaseTotal = room.basePricePerNight * nights;
  const transferCost = addOns.airportTransfer ? 45 : 0;
  const earlyCheckInCost = addOns.earlyCheckIn ? 30 : 0;
  const breakfastCost = addOns.breakfastBuffet ? 25 * nights : 0;
  const carbonOffsetCost = addOns.carbonOffset ? 6 : 0;
  const addOnsTotal = transferCost + earlyCheckInCost + breakfastCost + carbonOffsetCost;
  const discountAmount = property.isGeniusDiscount ? Math.round(roomBaseTotal * 0.1) : 0;
  const taxesAndFees = Math.round((roomBaseTotal + addOnsTotal - discountAmount) * 0.11);
  const totalAmount = roomBaseTotal + addOnsTotal + taxesAndFees - discountAmount;

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleProceedToStep3 = () => {
    setCurrentStep(3);
  };

  const handleFinalPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const ref = generateBookingReference();
      const newBooking: Booking = {
        id: `bk_${Date.now()}`,
        referenceCode: ref,
        userId: user.id,
        guestDetails: { ...guestDetails },
        propertyId: property.id,
        propertyName: property.name,
        propertyCity: property.city,
        propertyCountry: property.country,
        propertyAddress: property.address,
        propertyImage: property.images[0],
        roomId: room.id,
        roomType: room.roomType,
        checkInDate: searchQuery.checkInDate,
        checkOutDate: searchQuery.checkOutDate,
        nights,
        guests: {
          adults: searchQuery.adults,
          children: searchQuery.children,
          rooms: searchQuery.rooms,
        },
        addOns,
        pricing: {
          roomRatePerNight: room.basePricePerNight,
          roomTotal: roomBaseTotal,
          addOnsTotal,
          taxesAndFees,
          discountAmount,
          totalAmount,
          currency,
        },
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod,
        paymentGatewayRef: `ch_${Date.now()}_stripe_success`,
        createdAt: new Date().toISOString(),
      };

      setCreatedBooking(newBooking);
      onBookingConfirmed(newBooking);
      setIsProcessing(false);
      setCurrentStep(4);

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Secure Booking Engine
              </h2>
              <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                <span className="text-emerald-600 font-semibold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
                  256-bit SSL Encrypted
                </span>
                <span>·</span>
                <span className="text-amber-600 font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-0.5" />
                  Price held for {formatTimer(secondsLeft)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Stepper Header */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Guest Details' },
              { num: 2, label: 'Add-ons' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center justify-center space-x-1.5 py-1 rounded-lg ${
                  currentStep === s.num
                    ? 'bg-blue-600 text-white font-bold'
                    : currentStep > s.num
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-black/10">
                  {currentStep > s.num ? <Check className="w-3 h-3" /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Body Grid: Form Steps + Order Summary */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left Form Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Guest Details */}
            {currentStep === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-black text-slate-900 text-base">Step 1: Who is staying?</h3>
                  <p className="text-xs text-slate-500">
                    We will send booking confirmation & check-in voucher to this contact.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestDetails.firstName}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestDetails.lastName}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestDetails.email}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, email: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestDetails.phone}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Traveling for work details */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center space-x-2 text-xs text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestDetails.travelingForWork}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, travelingForWork: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>I'm booking for business / work</span>
                  </label>

                  {guestDetails.travelingForWork && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={guestDetails.companyName}
                          onChange={(e) =>
                            setGuestDetails({ ...guestDetails, companyName: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          VAT / Tax ID
                        </label>
                        <input
                          type="text"
                          value={guestDetails.taxId}
                          onChange={(e) =>
                            setGuestDetails({ ...guestDetails, taxId: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={guestDetails.specialRequests}
                    onChange={(e) =>
                      setGuestDetails({ ...guestDetails, specialRequests: e.target.value })
                    }
                    placeholder="e.g. Quiet room, late check-in at 8:00 PM, baby cot needed..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>Continue to Add-ons</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Add-ons */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-black text-slate-900 text-base">Step 2: Customize Your Stay</h3>
                  <p className="text-xs text-slate-500">
                    Add optional bespoke concierge services to your reservation.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Airport Transfer */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      addOns.airportTransfer
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={addOns.airportTransfer}
                        onChange={(e) =>
                          setAddOns({ ...addOns, airportTransfer: e.target.checked })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center">
                          <Plane className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                          Airport Chauffeur Transfer
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Private Mercedes executive meet-and-greet right at the arrival terminal.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      +{formatPrice(45, currency, currencies)}
                    </span>
                  </label>

                  {/* Early Check-in */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      addOns.earlyCheckIn
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={addOns.earlyCheckIn}
                        onChange={(e) =>
                          setAddOns({ ...addOns, earlyCheckIn: e.target.checked })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                          Guaranteed Early Check-in (11:00 AM)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Access your room 4 hours earlier without waiting for normal 3:00 PM check-in.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      +{formatPrice(30, currency, currencies)}
                    </span>
                  </label>

                  {/* Daily Gourmet Breakfast */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      addOns.breakfastBuffet
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={addOns.breakfastBuffet}
                        onChange={(e) =>
                          setAddOns({ ...addOns, breakfastBuffet: e.target.checked })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center">
                          <Coffee className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                          Artisan Breakfast Buffet ({nights} days)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Daily farm-to-table breakfast with fresh barista roast & artisanal bakeries.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      +{formatPrice(25 * nights, currency, currencies)}
                    </span>
                  </label>

                  {/* Carbon Offset */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      addOns.carbonOffset
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={addOns.carbonOffset}
                        onChange={(e) =>
                          setAddOns({ ...addOns, carbonOffset: e.target.checked })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center">
                          <Leaf className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                          Climate Neutral Eco-Contribution
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Certified Gold Standard carbon credit reforestation offsetting your stay.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      +{formatPrice(6, currency, currencies)}
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Integrated Payment Gateway */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-black text-slate-900 text-base">Step 3: Payment & Authorization</h3>
                  <p className="text-xs text-slate-500">
                    Row-level database lock active. No charge until authorization completes.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                    { id: 'apple_pay', label: 'Apple Pay', icon: Sparkles },
                    { id: 'local_bank', label: 'Bank / SEPA', icon: Building },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                        paymentMethod === pm.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <pm.icon className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">{pm.label}</span>
                    </button>
                  ))}
                </div>

                {/* Stripe Elements Mock Card Container */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Card details (Stripe PCI-DSS Compliant)</span>
                      <span className="font-mono text-emerald-600 font-bold">● TEST MODE</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Card Number
                      </label>
                      <div className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                        <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs font-mono font-bold text-slate-800 bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== 'card' && (
                  <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-center space-y-2">
                    <p className="text-xs font-bold text-blue-900">
                      Redirecting to {paymentMethod.replace('_', ' ').toUpperCase()} Secure Checkout
                    </p>
                    <p className="text-[11px] text-blue-700">
                      You will be prompted to authenticate with your biometric device token or bank routing ID.
                    </p>
                  </div>
                )}

                <div className="pt-3 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleFinalPayment}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing & Locking Inventory...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay & Confirm ({formatPricePrecise(totalAmount, currency, currencies)})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Booking Confirmation & Voucher */}
            {currentStep === 4 && createdBooking && (
              <div className="space-y-6 animate-in zoom-in-95 duration-200">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-emerald-900 text-sm">
                      Booking Confirmed & Guaranteed!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Reference Code: <strong className="font-mono">{createdBooking.referenceCode}</strong>
                    </p>
                  </div>
                </div>

                {/* Voucher Pass Card */}
                <div className="p-5 rounded-2xl border-2 border-slate-800 bg-white shadow-xl space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                        Official AuraStay Guest Voucher
                      </span>
                      <h4 className="text-base font-black text-slate-900">{createdBooking.propertyName}</h4>
                      <p className="text-xs text-slate-500">{createdBooking.propertyAddress}, {createdBooking.propertyCity}</p>
                    </div>

                    {/* QR Code Validation Box */}
                    <div className="p-2 bg-slate-900 rounded-xl text-white flex flex-col items-center">
                      <QrCode className="w-10 h-10 text-white" />
                      <span className="text-[8px] font-mono mt-0.5">SCAN AT CHECK-IN</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Check-in</span>
                      <span className="font-bold text-slate-900">{createdBooking.checkInDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Check-out</span>
                      <span className="font-bold text-slate-900">{createdBooking.checkOutDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Room</span>
                      <span className="font-bold text-slate-900 truncate block">{createdBooking.roomType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Guest</span>
                      <span className="font-bold text-slate-900 truncate block">{createdBooking.guestDetails.firstName} {createdBooking.guestDetails.lastName}</span>
                    </div>
                  </div>

                  {/* Actions: Download PDF Voucher & .ics Calendar */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => generateIcsFile(createdBooking)}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow transition"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Add to Calendar (.ics)</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Voucher (PDF)</span>
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Return to AuraStay Explore Feed
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4 h-fit">
            <div className="flex gap-3">
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-blue-600 uppercase">
                  {property.propertyType}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {property.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">{property.city}, {property.country}</p>
                <div className="flex items-center text-amber-500 text-xs font-bold mt-1">
                  <Star className="w-3 h-3 fill-current mr-0.5" />
                  <span>{property.rating} Exceptional</span>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Dates:</span>
                <span className="font-semibold text-slate-900">
                  {searchQuery.checkInDate} — {searchQuery.checkOutDate} ({nights} nights)
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Room:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                  {room.roomType}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Guests:</span>
                <span className="font-semibold text-slate-900">
                  {searchQuery.adults} Adults{searchQuery.children > 0 && `, ${searchQuery.children} Children`}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Base rate ({nights} nights × {formatPrice(room.basePricePerNight, currency, currencies)})</span>
                <span className="font-mono text-slate-900">
                  {formatPrice(roomBaseTotal, currency, currencies)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Genius loyalty discount</span>
                  <span className="font-mono">
                    -{formatPrice(discountAmount, currency, currencies)}
                  </span>
                </div>
              )}

              {addOnsTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Selected add-ons</span>
                  <span className="font-mono text-slate-900">
                    +{formatPrice(addOnsTotal, currency, currencies)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Taxes & service fees (11%)</span>
                <span className="font-mono text-slate-900">
                  +{formatPrice(taxesAndFees, currency, currencies)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-black text-slate-900">Total Price</span>
                <span className="font-black text-xl text-blue-600 font-mono">
                  {formatPricePrecise(totalAmount, currency, currencies)}
                </span>
              </div>
            </div>

            {/* Protection Notice */}
            <div className="pt-2 text-[10px] text-slate-400 space-y-1">
              <p className="flex items-center">
                <Check className="w-3 h-3 text-emerald-500 mr-1 flex-shrink-0" />
                Free cancellation up to 48h before check-in date
              </p>
              <p className="flex items-center">
                <Check className="w-3 h-3 text-emerald-500 mr-1 flex-shrink-0" />
                No credit card booking fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
