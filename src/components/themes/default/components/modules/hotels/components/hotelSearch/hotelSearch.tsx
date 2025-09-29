"use client"
import React, { useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import DatePicker from "@components/core/DatePicker";
import useDictionary from "@hooks/useDict";
import useDirection from "@hooks/useDirection";

import { useParams, useRouter } from "next/navigation";

import useHotelSearch from "@hooks/useHotelSearch";
import Dropdown from "@components/core/Dropdown";
import useCountries from "@hooks/useCountries";
import { set } from "lodash";
// import useHotelSearch from "@hooks/useHotelSearch"; // Import the hook

export default function HotelSearch() {
  const { lang } = useParams();
  const { data: dict, isLoading } = useDictionary(lang as any);
  const [direction] = useDirection();
  const router = useRouter();
  const { countries } = useCountries()

  // Use the custom hook
  const {
    form,
    errors,
    hotelLocations,
    locationLoading,
    locationError,
    showDestinationDropdown,
    setShowDestinationDropdown,
    showGuestsDropdown,
    setShowGuestsDropdown,
    activeIndex,
    setActiveIndex,
    totalGuests,
    isSearching,
    handleChange,
    handleSelectLocation,
    handleDestinationKeyDown,
    handleSubmit,
    loadMoreData,
    updateForm,
    setIsSearching,
  } = useHotelSearch();
  const guestsDropdownRef = useRef<HTMLDivElement>(null);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);
  const destInputRef = useRef<HTMLInputElement | null>(null);

  // Outside click handler for dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(e.target as Node)) {
        setShowGuestsDropdown(false);
      }
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(e.target as Node)) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setShowDestinationDropdown, setShowGuestsDropdown]);

  // const onSubmit = async (e: React.FormEvent) => {




  //     setIsSearching(false);
  //   const result = await handleSubmit(e);



  //   if (result?.success) {
  //       router.push("/hotel_search");
  //          setIsSearching(false);
  //   }


  // };
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
setIsSearching(true)
  const params = new URLSearchParams({
    destination: form.destination,
    checkin: form.checkin,
    checkout: form.checkout,
    rooms: String(form.rooms),
    adults: String(form.adults),
    children: String(form.children),
    nationality: form.nationality,
  });
  // ✅ Build the same path format
  const destinationSlug = form.destination.trim().replace(/\s+/g, "-");
 const url = `/hotel/${destinationSlug}/${params.get("checkin")}/${params.get(
  "checkout"
)}/${params.get("rooms")}/${params.get("adults")}/${params.get(
  "children"
)}/${params.get("nationality")}`;
setTimeout(() => {
    setIsSearching(false);
 setIsSearching(false)
router.push(url);
  }, 500); // 1 second delay
};






  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <div className={`flex items-center gap-2 mt-1 w-full text-red-500 text-xs ${direction === "rtl" ? "text-right" : "text-left"}`}>
        <span className="w-3 h-3 flex items-center justify-center rounded-full bg-red-500 p-1 text-white">!</span>
        <span>{error}</span>
      </div>
    ) : null;

  const today = new Date();

  // format helper → yyyy-mm-dd
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // default checkin = today
  const checkin = formatDate(
    new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
  );

  // default checkout = tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const checkout = formatDate(
    new Date(Date.UTC(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()))
  );

  const selectedCountryName = countries?.find(
    (c: any) => c.iso === form.nationality
  )?.nicename || "Pakistan"; // Default fallback

  return (
    <div className="md:w-full mx-auto p-4 rounded-xl">
      <form onSubmit={onSubmit}>
        <div className="bg-white dark:bg-gray-800 dark:text-gray-50 w-full rounded-3xl shadow-lg p-6 space-y-6">
          {/* Destination */}
          <div className="relative" ref={destinationDropdownRef}>
            <label className="block text-sm text-start font-medium text-gray-500 dark:text-gray-300 mb-2">
              {/* {"where to? "}  */} Where to?
            </label>
            <div className="relative">
              <div className={`absolute ${direction === "ltr" ? "left-3" : "right-2"} top-1/2 transform -translate-y-1/2 text-gray-400`}>
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.19514 17.1038C8.04735 17.2098 7.86998 17.2667 7.68803 17.2667C7.50607 17.2667 7.3287 17.2098 7.18091 17.1038C2.80793 13.9933 -1.83309 7.59516 2.85865 2.97186C4.14667 1.70746 5.88127 0.999208 7.68803 1C9.49916 1 11.2369 1.7094 12.5174 2.97096C17.2091 7.59426 12.5681 13.9915 8.19514 17.1038Z" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="1.35554" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.68772 9.13333C8.16806 9.13333 8.62873 8.94291 8.96838 8.60396C9.30803 8.26501 9.49885 7.80529 9.49885 7.32594C9.49885 6.84659 9.30803 6.38688 8.96838 6.04793C8.62873 5.70898 8.16806 5.51855 7.68772 5.51855C7.20738 5.51855 6.74671 5.70898 6.40706 6.04793C6.0674 6.38688 5.87659 6.84659 5.87659 7.32594C5.87659 7.80529 6.0674 8.26501 6.40706 8.60396C6.74671 8.94291 7.20738 9.13333 7.68772 9.13333Z" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="1.35554" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <input
                ref={destInputRef}
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                onFocus={() => {
                  if (form.destination.trim().length >= 3) setShowDestinationDropdown(true);
                }}
                autoComplete="off"
                onKeyDown={handleDestinationKeyDown}
                placeholder={"search city or hotel..."}
                className={`w-full ${direction === "ltr" ? "pl-9" : "pr-9"}  pr-4 py-3 text-sm font-medium dark:text-gray-200 placeholder-gray-700 focus:outline-none hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 transition-all duration-200`}
              />

              {/* Dropdown */}
              {showDestinationDropdown && form.destination.trim().length >= 3 && (
                <div className="absolute z-50 w-full bg-white border dark:bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">

                  {/* Loading */}
                  {locationLoading ? (
                    <div className="bg-white flex items-center justify-center min-h-24 gap-2 p-3 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <>
                      {/* Error */}
                      {locationError ? (
                        <div className="flex bg-white items-center justify-center gap-2 p-4 min-h-25 text-sm text-gray-500">
                          <Icon icon="mdi:map-marker-off-outline" width={18} height={18} />
                          <span>{locationError}</span>
                        </div>
                      ) : hotelLocations.length > 0 ? (
                        /* Results */
                        <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
                          {hotelLocations.map((loc: any, idx: number) => (
                            <li
                              key={loc.id ?? `${loc.city}-${idx}`}
                              onClick={() => handleSelectLocation(loc)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex justify-between items-center ${activeIndex === idx ? "bg-gray-100 dark:bg-gray-700" : ""
                                }`}
                            >
                              <div>
                                <div className="font-bold text-sm text-start text-gray-900 dark:text-gray-50">
                                  {loc.city}
                                </div>
                                <div className="text-xs text-start text-gray-500 dark:text-gray-300">
                                  {loc.country}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">{loc.country_code}</div>
                            </li>
                          ))}
                        </ul>
                      ) : null
                        //  (
                        //   /* No results */
                        //   // <div className="flex bg-white items-center justify-center gap-2 p-4 min-h-25 text-sm text-gray-500">
                        //   //   {/* <Icon icon="mdi:map-marker-off-outline" width={18} height={18} />
                        //   //   <span>No Hotel Destination Found</span> */}
                        //   // </div>
                        // )
                      }
                    </>
                  )}
                </div>
              )}

            </div>
            <ErrorMessage error={errors.destination} />
          </div>

          {/* Dates & Guests row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check-in */}
            <div className="relative">
              <label className="block text-sm text-start font-medium text-gray-500 dark:text-gray-300 mb-2">
                {/* {isLoading ? "Loading..." : dict?.hotel_search?.checkin?.title} */}Check - in
              </label>
              <DatePicker
                direction={direction}
                showCalendarIcon
                className="w-full font-medium pl-1 text-sm placeholder-gray-400 hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 bg-white transition-all duration-200 focus:outline-none"
                defaultDate={new Date(checkin)}
                onSelect={(date) => {
                  const newCheckin = date ? date.toISOString().slice(0, 10) : "";
                  updateForm({ checkin: newCheckin });

                }}
              />
              <ErrorMessage error={errors.checkin} />
            </div>

            {/* Check-out */}
            <div className="relative">
              <label className="block text-sm font-medium text-start text-gray-500 dark:text-gray-300 mb-2">
                {/* {isLoading ? "Loading..." : dict?.hotel_search?.checkout?.title} */} Check - out
              </label>
              <DatePicker
                direction={direction}
                showCalendarIcon
                defaultDate={new Date(checkout)}
                className="w-full font-medium pl-1 text-sm placeholder-gray-400 hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 bg-white transition-all duration-200 focus:outline-none"
                onSelect={(date) => {
                  const newCheckout = date ? date.toISOString().slice(0, 10) : "";
                  updateForm({ checkout: newCheckout });
                }}
              />
              <ErrorMessage error={errors.checkout} />
            </div>

            {/* Guests */}
            <div className="relative" ref={guestsDropdownRef}>
              <label className="block text-sm text-start font-medium text-gray-500 mb-2 dark:text-gray-300">
                {/* {isLoading ? "Loading..." : dict?.hotel_search?.guest_button?.title} */} Guests
              </label>
              <button
                type="button"
                onClick={() => setShowGuestsDropdown((s) => !s)}
                className={`w-full flex items-center justify-between ${direction === "ltr" ? "pl-10 pr-4" : "pr-12 pl-4"} py-2.5 text-xs hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 cursor-pointer dark:hover:bg-gray-700 dark:hover:border-gray-500 transition-all duration-200`}
              >
                <div className={`absolute ${direction === "ltr" ? "left-3" : "right-4"} top-12 transform -translate-y-1/2 text-gray-400`}>
                  <svg width="18" height="18" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.01698 6.91855C8.65463 6.91855 9.98221 5.59097 9.98221 3.95332C9.98221 2.31568 8.65463 0.988098 7.01698 0.988098C5.37933 0.988098 4.05176 2.31568 4.05176 3.95332C4.05176 5.59097 5.37933 6.91855 7.01698 6.91855Z" stroke="#8C96A5" strokeWidth="1.11196" />
                    <path d="M12.9476 12.4783C12.9476 14.3205 12.9476 15.8142 7.01712 15.8142C1.08667 15.8142 1.08667 14.3205 1.08667 12.4783C1.08667 10.6362 3.74203 9.14246 7.01712 9.14246C10.2922 9.14246 12.9476 10.6362 12.9476 12.4783Z" stroke="#8C96A5" strokeWidth="1.11196" />
                  </svg>
                </div>
                <span className="font-medium text-[14px]">
                  {totalGuests}  {totalGuests === 1 ? "Guest" : "Guests"} {form.rooms > 0 ? `, ${form.rooms} ${form.rooms === 1 ? "Room" : "Rooms"}` : ""}
                </span>
                <Icon icon="mdi:chevron-down" width={20} height={20} className={`text-gray-600 transition-transform duration-200 ${showGuestsDropdown ? "rotate-180" : ""}`} />
              </button>

              {showGuestsDropdown && (
                <div className="absolute z-20 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 md:min-w-[350px] max-h-80 overflow-visible">
                  <div className="p-4 space-y-4">
                    {/* Rooms */}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        Rooms
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateForm({ rooms: Math.max(1, form.rooms - 1) })}
                          className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-blue-900 dark:text-blue-300 min-w-[1.25rem] text-center font-medium">
                          {form.rooms}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateForm({ rooms: form.rooms + 1 })}
                          className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors "
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Adults */}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        Adults
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateForm({ adults: Math.max(1, form.adults - 1) })}
                          className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-blue-900 dark:text-blue-300 min-w-[1.25rem] text-center font-medium">
                          {form.adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateForm({ adults: form.adults + 1 })}
                          className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        Children
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateForm({ children: Math.max(0, form.children - 1) })}
                          className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-blue-900 dark:text-blue-300 min-w-[1.25rem] text-center font-medium">
                          {form.children}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateForm({ children: form.children + 1 })}
                          className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* ============ NATIONALITY ============ */}
                    <div className="relative">
                      <label className="block text-sm text-start font-medium text-blue-900 mt-2  ps-1 dark:text-gray-300 mb-2">
                        Nationality
                      </label>

                      <Dropdown
                        key={form.nationality} // ✅ Force re-render when nationality changes
                        label={
                          <div className="flex items-center gap-3">
                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.19514 17.1038C8.04735 17.2098 7.86998 17.2667 7.68803 17.2667C7.50607 17.2667 7.3287 17.2098 7.18091 17.1038C2.80793 13.9933 -1.83309 7.59516 2.85865 2.97186C4.14667 1.70746 5.88127 0.999208 7.68803 1C9.49916 1 11.2369 1.7094 12.5174 2.97096C17.2091 7.59426 12.5681 13.9915 8.19514 17.1038Z" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="1.35554" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M7.68772 9.13333C8.16806 9.13333 8.62873 8.94291 8.96838 8.60396C9.30803 8.26501 9.49885 7.80529 9.49885 7.32594C9.49885 6.84659 9.30803 6.38688 8.96838 6.04793C8.62873 5.70898 8.16806 5.51855 7.68772 5.51855C7.20738 5.51855 6.74671 5.70898 6.40706 6.04793C6.0674 6.38688 5.87659 6.84659 5.87659 7.32594C5.87659 7.80529 6.0674 8.26501 6.40706 8.60396C6.74671 8.94291 7.20738 9.13333 7.68772 9.13333Z" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="1.35554" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{selectedCountryName}</span>
                          </div>
                        }
                        buttonClassName="w-full font-medium cursor-pointer pl-3  py-5 text-sm text-gray-700 placeholder-gray-400 bg-white hover:bg-gray-100 hover:text-gray-700 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none appearance-none flex items-center justify-between"
                        dropDirection="down"
                      >
                        {({ onClose }) => (
                          <div className="max-h-100 overflow-y-auto p-2">
                            {countries?.map((c: any) => (
                              <button
                                key={c.iso}
                                onClick={() => {
                                  updateForm({ nationality: c.iso });
                                  onClose();
                                }}
                                type="button"
                                className={`w-full cursor-pointer text-left px-2 rounded-lg py-4 my-2 text-sm flex justify-between items-center ${form.nationality === c.iso
                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  }`}
                              >
                                <span className="font-medium">{c.nicename}</span>
                                <span className="font-medium">{c.iso}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </Dropdown>
                    </div>


                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mt-3 md:mt-7" />
              <button
                type="submit"
                // disabled={isSearching}
                className="w-full bg-blue-900 py-2 px-6 cursor-pointer font-medium flex items-center hover:bg-gray-800 border border-gray-200 rounded-xl text-white dark:border-gray-600 dark:hover:bg-gray-700 justify-center gap-2 focus:outline-none transition-all duration-200"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.7761 13.5548L15.635 16.4137M14.7318 8.524C14.7318 10.3703 13.9984 12.141 12.6929 13.4465C11.3873 14.7521 9.61664 15.4855 7.77033 15.4855C5.92403 15.4855 4.15335 14.7521 2.84781 13.4465C1.54228 12.141 0.808838 10.3703 0.808838 8.524C0.808838 6.67769 1.54228 4.90701 2.84781 3.60148C4.15335 2.29594 5.92403 1.5625 7.77033 1.5625C9.61664 1.5625 11.3873 2.29594 12.6929 3.60148C13.9984 4.90701 14.7318 6.67769 14.7318 8.524Z" stroke="white" strokeWidth="1.3923" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="hidden md:block text-white dark:text-gray-50 font-normal">
                      {/* {isLoading ? "Loading..." : dict?.hotel_search?.search_btnText} */} Search Homes
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}