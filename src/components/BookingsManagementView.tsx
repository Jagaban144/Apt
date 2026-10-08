import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Calendar, 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Booking, CurrencyCode, Currency } from '../types';
import { formatPrice, generateIcsFile } from '../utils/formatters';

interface BookingsManagementViewProps {
  bookings: Booking[];
  currency: CurrencyCode;
  currencies: Currency[];
  onModifyBookingDates: (bookingId: string, newIn: string, newOut: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const BookingsManagementView: React.FC<BookingsManagementViewProps> = ({
  bookings,
  currency,
  currencies,
  onModifyBookingDates,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedModifyBooking, setSelectedModifyBooking] = useState<Booking | null>(null);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');

  // Selected invoice modal
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    if (activeTab === 'past') return b.status === 'completed';
    return b.status === 'confirmed' || b.status === 'pending';
  });

  const handleOpenModify = (b: Booking) => {
    setSelectedModifyBooking(b);
    setNewCheckIn(b.checkInDate);
    setNewCheckOut(b.checkOutDate);
  };

  const handleConfirmModify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModifyBooking || !newCheckIn || !newCheckOut) return;
    onModifyBookingDates(selectedModifyBooking.id, newCheckIn, newCheckOut);
    setSelectedModifyBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Trips & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your accommodations, modify itinerary dates, download tax invoices, and export calendar vouchers.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Stays
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'past'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Stays
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'cancelled'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No {activeTab} bookings found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse our global destinations to plan your next retreat or vacation stay.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start justify-between"
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <img
                  src={b.propertyImage}
                  alt={b.propertyName}
                  className="w-full sm:w-44 h-36 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Ref: {b.referenceCode}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : b.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{b.propertyName}</h3>

                  <p className="text-xs text-slate-500 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {b.propertyAddress}, {b.propertyCity}, {b.propertyCountry}
                  </p>

                  <div className="text-xs font-semibold text-slate-700 pt-1">
                    Room: <span className="font-bold text-slate-900">{b.roomType}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Check-in: <strong className="ml-1 text-slate-900">{b.checkInDate}</strong>
                    </span>
                    <span>→</span>
                    <span>
                      Check-out: <strong className="text-slate-900">{b.checkOutDate}</strong> ({b.nights} nights)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Pricing & Actions */}
              <div className="w-full md:w-64 flex flex-col justify-between pt-4 md:pt-0 md:border-l md:border-slate-100 md:pl-5 space-y-3">
                <div>
                  <div className="text-[11px] text-slate-400">Total Paid (Taxes incl.)</div>
                  <div className="text-xl font-black text-slate-900">
                    {formatPrice(b.pricing.totalAmount, currency, currencies)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center mt-0.5">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Guaranteed Reservation
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {b.status === 'confirmed' && (
                    <>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleOpenModify(b)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify Dates</span>
                        </button>

                        <button
                          onClick={() => generateIcsFile(b)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center justify-center space-x-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Save .ics</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setInvoiceBooking(b)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>

                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </>
                  )}

                  {b.status === 'completed' && (
                    <button
                      onClick={() => setInvoiceBooking(b)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt / Invoice</span>
                    </button>
                  )}

                  {b.status === 'cancelled' && (
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-semibold text-center">
                      Refund issued to original payment method
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modify Dates Modal */}
      {selectedModifyBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Modify Reservation Dates
            </h3>
            <p className="text-xs text-slate-500">
              Change dates for {selectedModifyBooking.propertyName} ({selectedModifyBooking.referenceCode})
            </p>

            <form onSubmit={handleConfirmModify} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  New Check-in Date
                </label>
                <input
                  type="date"
                  required
                  value={newCheckIn}
                  onChange={(e) => setNewCheckIn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  New Check-out Date
                </label>
                <input
                  type="date"
                  required
                  min={newCheckIn}
                  value={newCheckOut}
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedModifyBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  Update Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-black text-blue-600 uppercase">
                  AuraStay Global Hospitality Ltd.
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">Official Tax Invoice</h2>
                <p className="text-xs text-slate-400">Ref: {invoiceBooking.referenceCode}</p>
              </div>
              <button
                onClick={() => setInvoiceBooking(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Billed to */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <div className="font-bold text-slate-500 uppercase text-[10px]">Billed To:</div>
                <div className="font-bold text-slate-900 mt-1">
                  {invoiceBooking.guestDetails.firstName} {invoiceBooking.guestDetails.lastName}
                </div>
                <div className="text-slate-500">{invoiceBooking.guestDetails.email}</div>
                {invoiceBooking.guestDetails.companyName && (
                  <div className="text-blue-600 font-semibold mt-1">
                    {invoiceBooking.guestDetails.companyName} (VAT: {invoiceBooking.guestDetails.taxId})
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-500 uppercase text-[10px]">Property:</div>
                <div className="font-bold text-slate-900 mt-1">{invoiceBooking.propertyName}</div>
                <div className="text-slate-500">{invoiceBooking.propertyAddress}</div>
                <div className="text-slate-500">{invoiceBooking.checkInDate} to {invoiceBooking.checkOutDate}</div>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 text-slate-800">
                    {invoiceBooking.roomType} ({invoiceBooking.nights} nights)
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-900">
                    {formatPrice(invoiceBooking.pricing.roomTotal, currency, currencies)}
                  </td>
                </tr>
                {invoiceBooking.pricing.addOnsTotal > 0 && (
                  <tr>
                    <td className="py-2.5 text-slate-800">Selected Services & Add-ons</td>
                    <td className="py-2.5 text-right font-mono text-slate-900">
                      +{formatPrice(invoiceBooking.pricing.addOnsTotal, currency, currencies)}
                    </td>
                  </tr>
                )}
                {invoiceBooking.pricing.discountAmount > 0 && (
                  <tr>
                    <td className="py-2.5 text-emerald-600 font-semibold">Loyalty Discount</td>
                    <td className="py-2.5 text-right font-mono text-emerald-600">
                      -{formatPrice(invoiceBooking.pricing.discountAmount, currency, currencies)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-2.5 text-slate-800">Taxes, VAT & Municipality Charges</td>
                  <td className="py-2.5 text-right font-mono text-slate-900">
                    +{formatPrice(invoiceBooking.pricing.taxesAndFees, currency, currencies)}
                  </td>
                </tr>
                <tr className="font-black text-sm border-t border-slate-200">
                  <td className="py-3 text-slate-900">Total Paid (USD / Converted)</td>
                  <td className="py-3 text-right font-mono text-blue-600">
                    {formatPrice(invoiceBooking.pricing.totalAmount, currency, currencies)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400">Payment Gateway ID: {invoiceBooking.paymentGatewayRef}</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
