import { Currency, CurrencyCode, Booking } from '../types';

export function formatPrice(amountInUSD: number, currencyCode: CurrencyCode, currencies: Currency[]): string {
  const currency = currencies.find((c) => c.code === currencyCode) || currencies[0];
  const converted = amountInUSD * currency.rateAgainstUSD;

  if (currencyCode === 'JPY' || currencyCode === 'NGN') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPricePrecise(amountInUSD: number, currencyCode: CurrencyCode, currencies: Currency[]): string {
  const currency = currencies.find((c) => c.code === currencyCode) || currencies[0];
  const converted = amountInUSD * currency.rateAgainstUSD;

  if (currencyCode === 'JPY' || currencyCode === 'NGN') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate.getTime() - inDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function generateBookingReference(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = Math.floor(100000 + Math.random() * 900000);
  const suffix = letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length));
  return `AUR-${numbers}-${suffix}`;
}

export function generateIcsFile(booking: Booking): void {
  const start = booking.checkInDate.replace(/-/g, '');
  const end = booking.checkOutDate.replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AuraStay Global//Booking Engine RFC-5545//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.referenceCode}@aurastay.global`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:Stay at ${booking.propertyName} (${booking.roomType})`,
    `DESCRIPTION:Reservation Reference: ${booking.referenceCode}\\nRoom: ${booking.roomType}\\nGuests: ${booking.guests.adults} Adults, ${booking.guests.children} Children\\nAddress: ${booking.propertyAddress}\\nStatus: Confirmed`,
    `LOCATION:${booking.propertyAddress}, ${booking.propertyCity}, ${booking.propertyCountry}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Your upcoming stay with AuraStay starts tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `AuraStay-${booking.referenceCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
