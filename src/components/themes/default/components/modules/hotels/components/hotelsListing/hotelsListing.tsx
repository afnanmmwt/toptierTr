"use client"

import { useState, useRef, useEffect } from "react";

import { Icon } from "@iconify/react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
import useHotelFilter from "@hooks/useHotelFilter";
import useHotelSearch from "@hooks/useHotelSearch";
import Spinner from "@components/core/Spinner";
// import RatingSlider from "./ratingSlider"
// import useHotelFilter from "./useHotelFilter";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import HotelsListingCard from "./hotelListingCard";
import { PriceRangeSlider } from "@components/core/priceRangeSlider";
import HotelMap from "./hotelMap";
// import { isPending } from "@reduxjs/toolkit";

// Define types
// interface FilterChip {
//   icon?: string;
//   label: string;
//   category?: string;
// }
// Types for your actual hotel data
interface HotelData {
  hotel_id: string;
  name: string;
  location: string;
  actual_price: string;
  actual_price_per_night: string;
  img: string;
  rating: string;
  stars: string;
  amenities: string[];
  favorite: number;
  address: string;
  latitude: string;
  longitude: string;
  currency: string;
  supplier_name: string;
  markup_price: string;
  markup_price_per_night: string;
  booking_currency: string;
}
interface HotelSearchAppProps {
  // hotelData: HotelData[];
  isLoading?: boolean;
}
export default function HotelSearchApp({isLoading}:HotelSearchAppProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  // const [user, setUser] = useState(true);
  // const [loadingMore, setLoadingMore] = useState(false)
  // const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number }>({
  lat: 0,
  lon: 0,
});
const onShowMaphandler=(hotel:any)=>{
  if(!hotel) return
  setCurrentLocation({
    lat:hotel?.latitude,
    lon:hotel?.longitude
  })
// console.log('map icons is clicked for current loaction ', hotel)
}
  // const swiperRef = useRef<any>(null);
  // Filter chips data with placeholder SVGs (replace these with your actual SVGs)
  // const filterChips: FilterChip[] = [
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M12 2L3.09 8.26L12 22L20.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  //     </svg>`,
  //     label: "Luxury Hotel",
  //     category: "luxury"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
  //       <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
  //     </svg>`,
  //     label: "Business",
  //     category: "business"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M3 21L12 2L21 21H3Z" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
  //     </svg>`,
  //     label: "Resort",
  //     category: "resort"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <path d="M12 1V3" stroke="currentColor" stroke-width="2"/>
  //       <path d="M12 21V23" stroke="currentColor" stroke-width="2"/>
  //       <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" stroke-width="2"/>
  //     </svg>`,
  //     label: "Budget",
  //     category: "budget"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" stroke-width="2" fill="currentColor"/>
  //     </svg>`,
  //     label: "Top Rated",
  //     category: "top-rated"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <path d="M12 21.7C17.3 17 20 13 20 10A8 8 0 1 0 4 10C4 13 6.7 17 12 21.7Z" stroke="currentColor" stroke-width="2" fill="none"/>
  //     </svg>`,
  //     label: "City Center",
  //     category: "city-center"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M6 13.87A4 4 0 0 1 7.41 6A5.11 5.11 0 0 1 12 4A5.11 5.11 0 0 1 16.59 6A4 4 0 0 1 18 13.87V21H6Z" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <circle cx="12" cy="10" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
  //     </svg>`,
  //     label: "Fine Dining",
  //     category: "fine-dining"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M2 12C2 17.52 6.48 22 12 22S22 17.52 22 12C22 6.48 17.52 2 12 2" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <path d="M2 12C2 8.69 4.69 6 8 6S14 8.69 14 12" stroke="currentColor" stroke-width="2" fill="none"/>
  //     </svg>`,
  //     label: "Beachfront",
  //     category: "beachfront"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M20 16V8A8 8 0 0 0 4 8V16C4 18.21 5.79 20 8 20H16C18.21 20 20 18.21 20 16Z" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <path d="M4 8C4 5.79 5.79 4 8 4H16C18.21 4 20 5.79 20 8" stroke="currentColor" stroke-width="2" fill="none"/>
  //     </svg>`,
  //     label: "Lake View",
  //     category: "lake-view"
  //   },
  //   {
  //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M21 16V8A2 2 0 0 0 19 6H5A2 2 0 0 0 3 8V16A2 2 0 0 0 5 18H19A2 2 0 0 0 21 16Z" stroke="currentColor" stroke-width="2" fill="none"/>
  //       <polyline points="7,8 12,13 17,8" stroke="currentColor" stroke-width="2" fill="none"/>
  //     </svg>`,
  //     label: "Near Airport",
  //     category: "near-airport"
  //   }
  // ];




  // const [showPrev, setShowPrev] = useState(false);



  // const [showNext, setShowNext] = useState(true);
  const { allHotelsData: hotelsData,  isloadingMore, listRef, allHotelsData: isInitialLoading, detailsBookNowHandler } = useHotelSearch()


  // console.log('is searching ', isSearching)
  // console.log('is laoding more', isloadingMore)
  // console.log('is pendding', isPending)
  const safeHotelsData = Array.isArray(hotelsData) && hotelsData?.length > 0
    ? hotelsData
    : Array.isArray(hotelsData)
      ? hotelsData
      : [];
  //   console.log('hotelslisting after search',hotelsDa


  // Use the hotel filter hook
  const {
    filteredHotels,
    totalResults,
    filters,
    priceRange,
    // availableAmenities,
    updatePriceRange,
    // toggleStarFilter,
    updateRatingFilter,
    updateSearchQuery,
    // toggleAmenityFilter,
    // updateSortBy,
    resetFilters,
    hasActiveFilters,
    selectedStars,
    setSelectedStars,
    isFilterLoading

  } = useHotelFilter({ hotelsData: safeHotelsData ?? [], isLoading });



  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && value > filters.priceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < filters.priceRange[0]) {
      newRange[0] = value;
    }
    updatePriceRange(newRange);
  };


  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Rating");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["Rating", "Price Low to High", "Price High to Low", "Name"];




  return (
    <div className="min-h-screen bg-gray-50" ref={listRef}>
      {/* Custom CSS for sliders */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .swiper-button-next,
        .swiper-button-prev {
          width: 40px;
          height: 40px;
          margin-top: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
          font-weight: 600;
          color: #163C8C;
        }
        .swiper-button-disabled {
          opacity: 0.5;
        }
        .swiper-button-next.swiper-button-disabled,
        .swiper-button-prev.swiper-button-disabled {
          opacity: 0.5;
        }
      `}</style>

      {/* Main Content */}

      <div className="max-w-[1200px] mx-auto appHorizantalSpacing py-4 lg:py-8"  >
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Desktop Sidebar - Advanced Search */}
          {viewMode !== "map" && <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#EBEBEB] p-4">
              <div className="flex items-center justify-between mb-6 border-b pb-5 border-gray-200">
                <h2 className="text-lg font-bold text-[#112233]">Advanced Search</h2>

                {/* <button
                  type="button"
                  onClick={resetFilters}
                  className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.24242 1.0387L6.24242 12.9663C6.24242 13.378 5.90863 13.7118 5.49694 13.7118C5.08525 13.7118 4.75146 13.378 4.75146 12.9663L4.75146 1.0387C4.75146 0.627007 5.08525 0.293221 5.49694 0.293221C5.90863 0.293221 6.24242 0.627007 6.24242 1.0387Z" fill="#163C8C" />
                    <path d="M10.7143 1.0387V12.9663C10.7143 13.378 10.3806 13.7118 9.96886 13.7118C9.55718 13.7118 9.22339 13.378 9.22339 12.9663V1.0387C9.22339 0.627007 9.55718 0.293037 9.96886 0.293037C10.3806 0.293037 10.7143 0.627007 10.7143 1.0387Z" fill="#163C8C" />
                    <path d="M1.76927 1.03851L1.76927 12.9661C1.76927 13.3778 1.43549 13.7116 1.0238 13.7116C0.612107 13.7116 0.27832 13.3778 0.27832 12.9661L0.27832 1.03851C0.27832 0.626824 0.612107 0.293037 1.0238 0.293037C1.43549 0.293037 1.76927 0.626824 1.76927 1.03851Z" fill="#163C8C" />
                  </svg>
                </button> */}

              </div>
              {/* Search Location */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-[#112233] mb-3">Search Hotels</label>
                <div className="relative">
                  <svg width="18" height="17" className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5098 13.4063L16.3686 16.2651M15.4655 8.37544C15.4655 10.2217 14.732 11.9924 13.4265 13.298C12.121 14.6035 10.3503 15.3369 8.50398 15.3369C6.65767 15.3369 4.88699 14.6035 3.58146 13.298C2.27592 11.9924 1.54248 10.2217 1.54248 8.37544C1.54248 6.52913 2.27592 4.75845 3.58146 3.45292C4.88699 2.14738 6.65767 1.41394 8.50398 1.41394C10.3503 1.41394 12.121 2.14738 13.4265 3.45292C14.732 4.75845 15.4655 6.52913 15.4655 8.37544Z" stroke="#0F172B" strokeOpacity="0.6" strokeWidth="1.3923" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="search by hotel names"
                    value={filters.searchQuery}
                    onChange={(e) => updateSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-medium text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Price Range */}
              <div className="mb-8">
                <p className="block text-base font-semibold text-[#112233] mb-3">
                  Price Range (per night)
                </p>
                {/* <PriceSlider
                  min={priceRange.min}
                  max={priceRange.max}
                  values={filters.priceRange}
                  onChange={handlePriceChange}
                /> */}
                <PriceRangeSlider
                  min={priceRange.min}
                  max={priceRange.max}
                  values={filters.priceRange}   // ← [min, max] tuple
                  onChange={handlePriceChange}  // ← (index, value) => void
                />
              </div>

              <div className="mb-8">
                <label className="block text-base font-semibold text-[#112233] mb-3">
                  Hotel Stars
                </label>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div
                      key={stars}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        setSelectedStars(stars);   // ✅ update local state
                        updateRatingFilter(stars); // ✅ call API filter
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Stars */}
                        <div className="flex">
                          {[...Array(stars)].map((_, i) => (
                            <Icon
                              key={i}
                              icon="mdi:star"
                              className={`h-5 w-5 ${selectedStars === stars ? "text-yellow-400" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>


                        {/* Label */}
                        <span
                          className={`text-sm ${selectedStars === stars
                            ? "text-yellow-600 font-medium"
                            : "text-gray-600"
                            }`}
                        >
                          ({stars} Stars)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>





              {/* Guest Rating */}
              <div className="mb-8 border-b border-gray-200 pb-6">

              </div>
              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="w-full py-3 bg-[#E5E7EB] border border-[#E5E7EB] cursor-pointer text-[#163C8C] rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Filters
                </button>
                <button

                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="w-full py-3 bg-[#163C8C] border border-[#163C8C] cursor-pointer text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                >
                  Apply
                </button>
              </div>
            </div>
          </div>}
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white border justify-between border-gray-200 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Filters & Search
                {hasActiveFilters && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 12H17" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 18H14" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            {/* Sort and Results Header */}
            <div className="bg-white rounded-lg lg:rounded-xl border border-gray-200 p-3 lg:p-3 mb-4 lg:mb-6">
              <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
                {/* Left Side: Results Count & Map Filter Button */}
                <div className="flex items-center gap-3 lg:gap-4">
                  {viewMode === "map" && (
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.24242 1.0387L6.24242 12.9663C6.24242 13.378 5.90863 13.7118 5.49694 13.7118C5.08525 13.7118 4.75146 13.378 4.75146 12.9663L4.75146 1.0387C4.75146 0.627007 5.08525 0.293221 5.49694 0.293221C5.90863 0.293221 6.24242 0.627007 6.24242 1.0387Z" fill="#163C8C" />
                        <path d="M10.7143 1.0387V12.9663C10.7143 13.378 10.3806 13.7118 9.96886 13.7118C9.55718 13.7118 9.22339 13.378 9.22339 12.9663V1.0387C9.22339 0.627007 9.55718 0.293037 9.96886 0.293037C10.3806 0.293037 10.7143 0.627007 10.7143 1.0387Z" fill="#163C8C" />
                        <path d="M1.76927 1.03851L1.76927 12.9661C1.76927 13.3778 1.43549 13.7116 1.0238 13.7116C0.612107 13.7116 0.27832 13.3778 0.27832 12.9661L0.27832 1.03851C0.27832 0.626824 0.612107 0.293037 1.0238 0.293037C1.43549 0.293037 1.76927 0.626824 1.76927 1.03851Z" fill="#163C8C" />
                      </svg>
                    </button>
                  )}
                  <span className="text-gray-500 font-medium text-sm lg:text-base pl-2">
                    {/* {(isInitialLoading || isFilterLoading) ? "Loading..." :
                    `${filteredHotels?.length} hotels found`} */}

                    {filteredHotels?.length} hotels found
                  </span>
                </div>

                {/* Right Side: Sort Dropdown & View Mode Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-2 w-full lg:w-auto">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    <span className="text-gray-600 font-medium text-sm lg:text-base whitespace-nowrap">Sort :</span>
                    <div className="relative flex-1 lg:flex-none" ref={dropdownRef}>
                      <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-between w-full lg:w-[200px] cursor-pointer bg-[#F3F3F5] px-4 py-2.5 rounded-3xl border border-[#DFE2E6] text-xs lg:text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#DFE2E6]"
                      >
                        <span>{selected}</span>
                        <Icon
                          icon="mdi:chevron-down"
                          className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      {open && (
                        <div className="absolute mt-1.5 w-full lg:w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSelected(opt);
                                setOpen(false);
                              }}
                              className={`w-full lg:w-[180px] cursor-pointer rounded-md mx-2 my-1.5 text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 ${selected === opt ? "bg-gray-50 font-medium" : ""}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ View Mode Buttons - Now visible on all devices and stacked on mobile */}
                  <div className="flex space-x-1 px-2 py-1 bg-[#F3F3F5] rounded-lg overflow-hidden w-full lg:w-auto">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 lg:flex-none px-3 py-1.5 cursor-pointer transition-colors ${viewMode === 'grid'
                        ? 'bg-white rounded-md text-[#163C8C]'
                        : 'bg-transparent text-gray-700'
                        }`}
                    >
                      <svg
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.1 1.4V4.2H8.9V1.4H6.1ZM10.3 1.4V4.2H13.1V1.4H10.3ZM10.3 5.6V8.4H13.1V5.6H10.3ZM10.3 9.8V12.6H13.1V9.8H10.3ZM8.9 12.6V9.8H6.1V12.6H8.9ZM4.7 12.6V9.8H1.9V12.6H4.7ZM4.7 8.4V5.6H1.9V8.4H4.7ZM4.7 4.2V1.4H1.9V4.2H4.7ZM6.1 8.4H8.9V5.6H6.1V8.4ZM1.9 0H13.1C13.4713 0 13.8274 0.1475 14.0899 0.41005C14.3525 0.672601 14.5 1.0287 14.5 1.4V12.6C14.5 12.9713 14.3525 13.3274 14.0899 13.5899C13.8274 13.8525 13.4713 14 13.1 14H1.9C1.144 14 0.5 13.37 0.5 12.6V1.4C0.5 1.0287 0.6475 0.672601 0.91005 0.41005C1.1726 0.1475 1.5287 0 1.9 0Z"
                          fill={viewMode === 'grid' ? '#163C8C' : 'black'}
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 lg:flex-none px-3 py-2 cursor-pointer transition-colors ${viewMode === 'list'
                        ? 'bg-white rounded-md text-[#163C8C]'
                        : 'bg-transparent text-gray-700'
                        }`}
                    >
                      <svg
                        width="17"
                        height="12"
                        viewBox="0 0 17 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 6H1.00833M1 11H1.00833M1 1H1.00833M5.16667 6H16M5.16667 11H16M5.16667 1H16"
                          stroke={viewMode === 'list' ? '#163C8C' : 'black'}
                          strokeOpacity="0.7"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`flex-1 lg:flex-none px-3 py-2 cursor-pointer transition-colors ${viewMode === 'map'
                        ? 'bg-white rounded-md text-[#163C8C]'
                        : 'bg-transparent text-gray-700'
                        }`}
                    >
                      <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.0452 1.44663C13.8444 1.31318 13.6135 1.23193 13.3733 1.21023C13.1331 1.18853 12.8914 1.22707 12.6699 1.32235L9.712 2.59001L5.77647 0.932938C5.62197 0.866842 5.45568 0.832764 5.28763 0.832764C5.11959 0.832764 4.9533 0.866842 4.7988 0.932938L1.18639 2.45744C0.904789 2.57992 0.665671 2.7829 0.499091 3.04088C0.332511 3.29886 0.245902 3.60032 0.250149 3.90737V13.2284C0.248625 13.4904 0.312174 13.7486 0.435092 13.98C0.55801 14.2114 0.736451 14.4086 0.954403 14.554C1.15524 14.6875 1.38619 14.7687 1.62634 14.7904C1.86649 14.8121 2.10826 14.7736 2.32977 14.6783L5.28763 13.4107L9.22317 15.0677C9.37736 15.1347 9.5439 15.1686 9.712 15.1671C9.88 15.1674 10.0463 15.1336 10.2008 15.0677L13.8132 13.5184C14.0949 13.3959 14.334 13.1929 14.5005 12.9349C14.6671 12.6769 14.7537 12.3755 14.7495 12.0684V2.77228C14.751 2.51029 14.6875 2.25201 14.5645 2.02064C14.4416 1.78926 14.2632 1.59203 14.0452 1.44663ZM5.90903 2.27516L9.0906 3.63396V13.6841L5.90903 12.3253V2.27516ZM1.84093 13.5349C1.80945 13.5531 1.77373 13.5627 1.73737 13.5627C1.70101 13.5627 1.66529 13.5531 1.6338 13.5349C1.58758 13.5026 1.55039 13.459 1.52574 13.4082C1.50109 13.3575 1.4898 13.3013 1.49295 13.2449V3.90737C1.49194 3.84122 1.51126 3.77634 1.5483 3.72152C1.58534 3.66669 1.63832 3.62456 1.70008 3.60082L4.66623 2.31659V12.3253L1.84093 13.5349ZM13.5067 12.0933C13.5097 12.1566 13.4941 12.2195 13.4617 12.274C13.4293 12.3285 13.3815 12.3723 13.3244 12.3998L10.3334 13.6841V3.67539L13.1587 2.46573C13.1902 2.44755 13.2259 2.43798 13.2623 2.43798C13.2986 2.43798 13.3344 2.44755 13.3658 2.46573C13.4121 2.49808 13.4493 2.54169 13.4739 2.59244C13.4985 2.64319 13.5098 2.69938 13.5067 2.75571V12.0933Z" fill="black" fillOpacity="0.7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Loading State */}



            {/*=================>>>>> FOR LIST AND GRID  Hotel Grid */}

            {viewMode !== 'map' && (
              <div className={`${viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start'
                : 'space-y-4 md:space-y-6'
                }`}>
                {filteredHotels.map((hotel: any, index: number) => (
                  <HotelsListingCard
                    key={`${hotel.hotel_id}-${index}`}
                    hotel={hotel}
                    viewMode={viewMode}
                    onBookNow={(hotel: any) => detailsBookNowHandler(hotel)} // pass hotel + form

                  // onUpdateFavourite={handleUpdateFavourite}
                  />

                ))}
              </div>
            )}
            {/* ==============>>> MAP SECTION (Responsive: Stacked on mobile, side-by-side on desktop) */}
           {viewMode === "map" && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    {/* Map Section */}
    <div className="order-1 lg:order-2 w-full h-[400px] lg:h-[800px] bg-gray-100 rounded-3xl shadow-md border border-gray-300 overflow-hidden">
      <HotelMap hotels={filteredHotels} currentLocation={currentLocation} />
    </div>

    {/* Cards Section */}
    <div className="order-2 lg:order-1">
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {filteredHotels.map((hotel: any, index: number) => (
          <HotelsListingCard
            key={`${hotel.hotel_id}-${index}`}
            hotel={hotel}
            viewMode={viewMode}
            onBookNow={(hotel: any) => detailsBookNowHandler(hotel)}
            onMapShow={(hotel:any) =>onShowMaphandler(hotel)}
          />
        ))}
      </div>
    </div>
  </div>
)}

            {/* ============>>> LOAD MORE DATA ON SCROLL  */}
            {isloadingMore &&
              <div className="w-full flex items-center justify-center">
                <div className="w-[50%] py-2 my-5 flex gap-2 items-center justify-center rounded-full border border-blue-900 bg-white ">
                  <Spinner size={30} className="mr-1 text-blue-900" /> <p className="text-base font-medium text-blue-900 ">Loading more</p>
                </div>
              </div>
            }
            {
            (isLoading || isFilterLoading) && !isloadingMore && !hotelsData?.length &&
              <div className="w-full flex items-center justify-center">
                <div className="w-full py-2 my-5 h-full flex gap-2 items-center justify-center  border-blue-900">
                  <Spinner size={30} className="mr-1 text-blue-900" /> <p className="text-base font-medium text-blue-900 ">Searching for Hotels</p>
                </div>
              </div>
            }

            {/* ============>>>NO DATA FOUND  */}
            {!(isLoading || isFilterLoading) && !isloadingMore && filteredHotels?.length === 0 && (
              <div className="text-center py-6 sm:py-8 md:py-15  min-w-full min-h-full flex items-center justify-start flex-col">

                <Icon icon="mdi:hotel-off" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => resetFilters(event)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}




            {/* End of Map Section */}

          </div>
        </div>
      </div>
      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <div className=" fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>

          <div className="absolute bottom-3 left-8 right-8 bg-white rounded-2xl max-h-[90vh] overflow-y-auto mx-4">
            {/* Header */}
            <div className="sticky z-20 top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filters & Search</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon icon="mdi:close" className="h-5 w-5 cursor-pointer" />
              </button>
            </div>
            {/* Content */}
            <div className="p-4 space-y-6 max-w-lg mx-auto w-full">
              {/* Mobile Search */}
              <div>
                <label className="z-10 text-sm font-semibold text-gray-900 mb-3">
                  Search Hotels
                </label>
                <div className="relative">
                  <svg width="18" height="17" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5098 13.4063L16.3686 16.2651M15.4655 8.37544C15.4655 10.2217 14.732 11.9924 13.4265 13.298C12.121 14.6035 10.3503 15.3369 8.50398 15.3369C6.65767 15.3369 4.88699 14.6035 3.58146 13.298C2.27592 11.9924 1.54248 10.2217 1.54248 8.37544C1.54248 6.52913 2.27592 4.75845 3.58146 3.45292C4.88699 2.14738 6.65767 1.41394 8.50398 1.41394C10.3503 1.41394 12.121 2.14738 13.4265 3.45292C14.732 4.75845 15.4655 6.52913 15.4655 8.37544Z" stroke="#0F172B" strokeOpacity="0.6" strokeWidth="1.3923" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search hotels by name or location..."
                    value={filters.searchQuery}
                    onChange={(e) => updateSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Mobile Price Range */}
              <div>
                <label className="block text-sm font-semibold cursor-pointer text-gray-900 mb-3">
                  Price Range (per night)
                </label>
                <PriceRangeSlider
                  min={priceRange.min}
                  max={priceRange.max}
                  values={filters.priceRange}   // ← [min, max] tuple
                  onChange={handlePriceChange}  // ← (index, value) => void
                />
              </div>
              {/* Mobile Hotel Stars */}

              <div className="mb-8">
                <label className="block text-base font-semibold text-[#112233] mb-3">
                  Hotel Stars
                </label>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div
                      key={stars}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        setSelectedStars(stars);   // ✅ update local state
                        updateRatingFilter(stars); // ✅ call API filter
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Stars */}
                        <div className="flex">
                          {[...Array(stars)].map((_, i) => (
                            <Icon
                              key={i}
                              icon="mdi:star"
                              className={`h-5 w-5 ${selectedStars === stars ? "text-yellow-400" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-sm ${selectedStars === stars
                            ? "text-yellow-600 font-medium"
                            : "text-gray-600"
                            }`}
                        >
                          ({stars} Stars)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Rating */}
              <div>
                {/* <label className="block text-sm font-semibold cursor-pointer text-gray-900 mb-3">
                  Minimum Rating
                </label>
                <RatingSlider
                  value={filters.selectedRating}
                  onChange={updateRatingFilter}
                /> */}
              </div>
            </div>
            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3 max-w-lg mx-auto w-full">
              <button
                onClick={(e) => resetFilters(e)}
                disabled={!hasActiveFilters}
                className="w-full py-3 bg-gray-100 text-blue-600 cursor-pointer rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#163C8C] text-white cursor-pointer rounded-lg font-medium hover:bg-[#163C8C] transition-colors"
              >
                Apply Filters ({totalResults} hotels)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
