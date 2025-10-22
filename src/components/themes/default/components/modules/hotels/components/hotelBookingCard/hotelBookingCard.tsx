import React from "react";

import useLocale from "@hooks/useLocale";
import useDictionary from "@hooks/useDict";
import Image from "next/image";

export interface BookingData {
  bookingNo: string;
  bookingDate: string;
  status: "Cancelled" | "Confirmed" | "Pending";
  hotelName: string;
  hotelImage: string;
  dateRange: string;
  nights: number;
  roomType: string;
  amenities: string[];
  guestName: string;
  guestCount: number;
  price: string;
  currency: string;
}

interface FlightBookingCardProps {
  data: Record<string, any>; // or: data: any;
}

const HotelBookingCard: React.FC<any> = ({ data }) => {
// console.log("hotel data", data ?? "No data received");
  if (!data || !data.booking_data) {
    return null; // or a spinner/loading placeholder
  }


  return (
    <>
    {/* Hotel Booking Card Body */}
<div className="flex md:flex-row flex-col gap-x-4 opacity-90">
  {/* Image */}
  <div className="md:w-[120px] mb-4 md:mb-0 w-full flex-shrink-0">
    <div className="h-36 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
   <Image
      src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D"
      alt="Visa Application"
      width={800}   // ✅ must provide width
      height={600}  // ✅ must provide height
      className="w-full h-full object-cover"
    />
    </div>
  </div>

  {/* Details */}
  <div className="flex flex-col justify-between w-full gap-4 mb-2">
    {/* Title + Price */}
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
        {data?.booking_data?.hotel_name}
      </h3>
      <p className="text-xl font-bold text-gray-900 dark:text-gray-50">
        {data?.booking_data?.currency} {data?.booking_data?.amount}
      </p>
    </div>

    {/* Grid Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-h-3/4 bg-[#F6F8FB] dark:bg-gray-800 px-3 py-2 rounded-lg gap-4">

      {/* Date Range */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {data?.booking_data?.check_in} to {data?.booking_data?.check_out}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {/* Calculate nights based on date if needed */}
          5 nights
        </p>
      </div>

      {/* Room Info */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {data?.booking_data?.rooms} Room{data?.booking_data?.rooms > 1 ? "s" : ""}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Deluxe, Free WiFi, Breakfast Included
        </p>
      </div>

      {/* Guest Info */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {data?.booking_data?.customer_name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data?.booking_data?.guests} guest{data?.booking_data?.guests > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default HotelBookingCard;








  // {data?.map((bookingData) => (
  //        <motion.div
  //         key={bookingData.bookingNo}
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.4, ease: "easeInOut" }}
  //         className="rounded-lg p-4 bg-white dark:bg-gray-900 mb-6 shadow-sm"
  //       >


  //         {/* Body */}
  //         <div className="flex md:flex-row flex-col gap-x-3 opacity-75">
  //           {/* Image */}
  //           <div className="md:w-[120px] mb-2 md:mb-0 w-full flex-shrink-0">
  //             <div className="h-36 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
  //               <img
  //                 src={bookingData.hotelImage}
  //                 alt={bookingData.hotelName}
  //                 className="w-full h-full object-cover"
  //               />
  //             </div>
  //           </div>

  //           {/* Details */}
  //           <div className="flex flex-col justify-between w-full gap-4 mb-2">
  //             <div className="flex justify-between items-start">
  //               <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
  //                 {bookingData.hotelName}
  //               </h3>
  //               <p className="text-xl font-bold text-gray-900 dark:text-gray-50">
  //                 {bookingData.currency} {bookingData.price}
  //               </p>
  //             </div>

  //             <div className="grid grid-cols-3 min-h-3/4 bg-[#F6F8FB] dark:bg-gray-800 px-3 py-2  rounded-lg gap-2">
  //               <div>
  //                 <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
  //                   {bookingData.dateRange}
  //                 </p>
  //                 <p className="text-sm text-gray-500 dark:text-gray-400">
  //                   {bookingData.nights} nights
  //                 </p>
  //               </div>
  //               <div>
  //                 <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
  //                   {bookingData.roomType}
  //                 </p>
  //                 <p className="text-sm text-gray-500 dark:text-gray-400">
  //                   {bookingData.amenities.join(", ")}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
  //                   {bookingData.guestName}
  //                 </p>
  //                 <p className="text-sm text-gray-500 dark:text-gray-400">
  //                   {bookingData.guestCount} guest
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>


  //       </motion.div>
  //     ))}