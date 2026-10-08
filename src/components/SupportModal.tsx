import React, { useState } from 'react';
import { X, HelpCircle, Phone, MessageSquare, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportModalProps {
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does Free Cancellation work with AuraStay?',
      a: 'If your booking includes Free Cancellation, you can cancel directly from your "My Bookings" portal with zero fees up to 48 hours prior to local check-in time. Your refund is automatically routed to your original payment instrument.',
    },
    {
      q: 'What is the Genius Loyalty program?',
      a: 'All registered AuraStay accounts start with Genius perks. Level 2 members receive 10-25% discounts on select premier properties, complimentary daily breakfast upgrades, and priority late check-outs.',
    },
    {
      q: 'How does row-level inventory locking prevent double-booking?',
      a: 'When you proceed to checkout, our database acquires an exclusive 15-minute transactional hold on the selected room using PostgreSQL row-level locks and Redis distributed mutexes, ensuring nobody else can book that room while you enter payment details.',
    },
    {
      q: 'Can I request early check-in or airport chauffeur transfers?',
      a: 'Yes! Step 2 of the secure checkout process allows you to select bespoke add-ons, including executive airport transfers, early 11:00 AM check-ins, and carbon offset contributions.',
    },
  ];

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 Global Guest Concierge</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">How can we assist your stay?</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse our instant FAQ answers or contact our multilingual customer support team.
          </p>
        </div>

        {/* Hotlines */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Emergency Hotline</div>
            <div className="font-bold text-slate-900 mt-0.5 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1 text-blue-600" />
              +1 (800) 555-AURA
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Average Response Time</div>
            <div className="font-bold text-emerald-600 mt-0.5 flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              &lt; 3 minutes live chat
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Frequently Asked Questions
          </div>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden text-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-3 font-bold text-slate-800 bg-white hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-3 bg-slate-50 text-slate-600 border-t border-slate-200 leading-relaxed text-[11px]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Ticket */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Send an Instant Inquiry to Concierge
          </div>
          {submitted ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center">
              <Check className="w-4 h-4 mr-1.5" />
              Inquiry dispatched! Ticket #AUR-9921 generated.
            </div>
          ) : (
            <form onSubmit={handleTicket} className="space-y-2 text-xs">
              <input
                type="text"
                required
                placeholder="Topic: Booking modification, special dietary requirement, billing..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
              <textarea
                rows={2}
                required
                placeholder="Describe your request..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
              >
                Dispatch Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
