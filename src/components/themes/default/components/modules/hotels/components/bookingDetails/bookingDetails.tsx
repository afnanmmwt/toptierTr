// app/(main)/booking_details/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import BookingForm from './bookingForm';
import { useAppSelector } from '@lib/redux/store';
import Image from 'next/image';
import useCurrency from '@hooks/useCurrency';
import useDictionary from '@hooks/useDict';
import useLocale from '@hooks/useLocale';
import StripeProvider from '@lib/stripeProvider';
import getCurrencySymbol from '@src/utils/getCurrencySymbals';

export default function BookingDetails() {
  const selectedRoom = useAppSelector((state) => state.root.selectedRoom);
  const curruntBooking = localStorage.getItem('hotelSearchForm');
  const saveBookingData = curruntBooking ? JSON.parse(curruntBooking) : {};
  const router = useRouter();
  const { priceRateConverssion } = useCurrency();
  const { hotelDetails, room, option } = selectedRoom || {};
  const { locale } = useLocale();
  const { data: dict } = useDictionary(locale as any);

  const { checkin, checkout, adults = 0, children = 0, rooms = 1 } = saveBookingData;
  const { price = 0, markup_price = 0, currency = 'USD' } = option || {};

  // Calculate stay duration (in nights)
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const nights = Math.max(1, (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
  const persons = Number(adults) + Number(children);

  // Base total for all rooms and nights
  const baseTotal = Number(price) * nights * Number(rooms);

  // Calculate toptier fee (can’t be negative)
  const toptierFee = Math.max(0, Number(price) - Number(markup_price));

  // Add markup only if toptierFee is greater than 0
  const finalTotal = baseTotal + (toptierFee > 0 ? toptierFee : 0);
 console.log('=================selectedRoom',option)
  return (
    <section className="bg-[#F9FAFB] w-full">
      <div className="min-h-screen w-full max-w-[1200px] mx-auto justify-between flex flex-col md:flex-row lg:flex-row p-4 md:p-6 lg:p-12 mb-6 gap-8 appHorizantalSpacing">
        {/* Form */}
        <div className="flex-1 space-y-8">
          {/* Back Button and Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 cursor-pointer rounded-full bg-gray-50 border border-[#CACACA] flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={locale === "ar" ? "rotate-180" : ""}
              >
                <path
                  d="M1 7L15 7M1 7L7 1M1 7L7 13"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-extrabold text-[#0F172B]">
              {dict?.bookingDetails?.pageTitle}
            </h2>
          </div>

          <div className="border-b border-[#CACACA] mb-8"></div>

          {/* Render the form */}
          <StripeProvider>
            <BookingForm />
          </StripeProvider>

        </div>

        {/* Right Side Summary */}
        <div className="w-full sm:max-w-full md:max-w-95 lg:max-w-95 border border-[#CACACA] shadow rounded-xl p-5 h-fit">
          <div className="flex gap-3 items-center mb-2">
            <Image
              src={selectedRoom?.hotelDetails?.img?.[0] || 'https://toptiertravel.vip/uploads/7xd0llauy5gkwcgwk.jpg'}
              alt="Hotel"
              width={200}
              height={200}
              className="w-19 h-18 rounded-md object-cover"
            />
            <div>
              <h4 className="font-semibold text-[#0F172B] text-base text-ellipsis">
                {hotelDetails?.name}
              </h4>
              <h3 className="font-semibold text-gray-500 text-xs text-ellipsis">
                {hotelDetails?.address}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-xl space-y-4 text-sm">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-[#0F172B]">
                {dict?.bookingDetails?.bookingSummary}
              </h2>
              <span className="text-sm text-gray-500">{currency}</span>
            </div>

            {/* Room Info */}
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.roomName}</span>
                <span className="font-semibold text-[#0F172B]">
                  {selectedRoom?.room?.name || "Standard Room"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.checkinDate}</span>
                <span className="font-semibold text-[#0F172B]">{checkin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.checkoutDate}</span>
                <span className="font-semibold text-[#0F172B]">{checkout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.roomQuantity}</span>
                <span className="font-semibold text-[#0F172B]">{rooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.nights}</span>
                <span className="font-semibold text-[#0F172B]">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.guests}</span>
                <span className="font-semibold text-[#0F172B]">
                  {adults} {dict?.bookingDetails?.adults}
                  {children > 0 ? `, ${children} ${dict?.bookingDetails?.children}` : ""}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-gray-600">{dict?.bookingDetails?.roomPrice}</span>
                <span className="font-semibold text-[#0F172B]">
                   {getCurrencySymbol(currency)}{" "}{markup_price}

                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.bookingDetails?.toptierFee}</span>
                <span className="font-semibold text-[#0F172B]">
{toptierFee === 0
                    ? `${getCurrencySymbol(currency as any)} 0`
                    : `${getCurrencySymbol(currency)} ${markup_price}`}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-300 pt-3 mt-2">
                <span className="text-lg font-semibold text-[#0F172B]">
                  {dict?.bookingDetails?.total}
                </span>
                <span className="text-lg font-bold text-[#163C8C]">
                  {getCurrencySymbol(currency)} {finalTotal}

                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}