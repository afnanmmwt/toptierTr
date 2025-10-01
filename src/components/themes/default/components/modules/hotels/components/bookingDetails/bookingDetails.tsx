// app/(main)/booking_details/page.tsx
'use client';

import { useState } from 'react';
import BookingForm from './bookingForm';

export default function BookingDetails() {
  const currenthotel=localStorage.getItem('hotelSearchForm')
  console.log('currnt hotel ',currenthotel)
  // console.log('')
  return (
    <section className="bg-[#F9FAFB] w-full">
      <div className="min-h-screen w-full max-w-[1200px] mx-auto justify-between flex flex-col md:flex-row lg:flex-row p-4 md:p-6 lg:p-12 mb-6 gap-8">
        {/* Form */}
        <div className="flex-1 space-y-8">
          {/* Back Button and Header */}
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 cursor-pointer rounded-full bg-gray-50 border border-[#CACACA] flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7L15 7M1 7L7 1M1 7L7 13" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold text-[#0F172B]">
              Booking Details
            </h2>
          </div>
          <div className="border-b border-[#CACACA] mb-8"></div>

          {/* Render the new form */}
          <BookingForm />
        </div>

        {/* Right Side Summary */}
        <div className="w-full sm:max-w-full md:max-w-95 lg:max-w-95 border border-[#CACACA] shadow rounded-xl p-5 h-fit">
          <div className="flex gap-3 mb-4">
            <img
              src="/images/fh4.jpg"
              alt="Hotel"
              className="w-19 h-18 rounded-md object-cover"
            />
            <div>
              <h3 className="font-semibold text-[#0F172B] text-lg">
                The Serene Vista Manor & Spa
              </h3>
              <p className="text-sm font-semibold text-[#0F172B]">
                Monday, Jul 28 → Tuesday, Jul 29
              </p>
              <p className="text-sm font-semibold text-[#0F172B]">2 adults</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-[#0F172B]">
                Experience
              </span>
              <span className="text-lg font-bold text-[#0F172B]">$247.20</span>
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-medium text-base text-[#72726D]">
                Classic Double Room (King size double bed){" "}
                <span className="w-1 h-1 rounded-full bg-[#72726D] inline-block mb-0.5"></span>
              </p>
              <p className="font-medium text-base text-[#72726D]">
                Estate access{" "}
                <span className="w-1 h-1 rounded-full bg-[#72726D] inline-block mb-0.5"></span>{" "}
                Indoor pool access{" "}
                <span className="w-1 h-1 rounded-full bg-[#72726D] inline-block mb-0.5"></span>{" "}
                Indoor hot
              </p>
              <p className="font-medium text-base text-[#72726D]">
                Tub access{" "}
                <span className="w-1 h-1 rounded-full bg-[#72726D] inline-block mb-0.5"></span>{" "}
                Sauna access{" "}
                <span className="w-1 h-1 rounded-full bg-[#72726D] inline-block mb-0.5"></span>{" "}
                Hammam access
              </p>
              <p className="font-medium text-base text-[#72726D]">
                Gym access{" "}
                <span className="w-1 h-1 rounded-full bg-[#72726D] inline-block mb-0.5"></span>{" "}
                Breakfast{" "}
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-[#0F172B]">
                TopTier fee
              </span>
              <span className="text-lg font-bold text-[#0F172B]">$2.90</span>
            </div>
          </div>
          <p className="font-medium text-base text-[#72726D] my-3 w-73">
            This covers the cost of running the toptier service
          </p>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-lg font-semibold text-[#0F172B]">Total</span>
            <span className="text-lg font-bold text-[#0F172B]">$250.10</span>
          </div>
        </div>
      </div>
    </section>
  );
}