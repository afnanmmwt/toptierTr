'use client';

import DatePicker from "@components/core/DatePicker";
import useDirection from "@hooks/useDirection";
import { Icon } from "@iconify/react";
import { HotelForm } from "@hooks/useHotelDetails";
import Dropdown from "@components/core/Dropdown";
import useCountries from "@hooks/useCountries";

interface HotelDetailsSearchProps {
  form: HotelForm;
  errors: Record<string, string>;
  showGuestsDropdown: boolean;
  isSearching: boolean;
  totalGuests: number;
  guestsDropdownRef: React.RefObject<HTMLDivElement | null>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  updateForm: (updates: Partial<HotelForm>) => void;
  toggleGuestsDropdown: () => void;
  onSubmit: (e?: React.FormEvent) => void;
}

// Mock dictionary for i18n (replace with your actual dict)
const dict = {
  hotel_search: {
    checkin: { title: "Check - in" },
    checkout: { title: "Check - out" },
    guest_button: {
      title: "Guests",
      guest_title: "Guests",
      room_title: "Room(s)"
    },
    search_btnText: "Search Homes"
  }
};

export default function HotelDetailsSearch({
  form,
  errors,
  showGuestsDropdown,
  isSearching,
  totalGuests,
  guestsDropdownRef,
  updateForm,
  toggleGuestsDropdown,
  onSubmit,
}: HotelDetailsSearchProps) {
  const [direction] = useDirection();
  const { countries } = useCountries();

  // ✅ Get the selected country name based on current form.nationality
  const selectedCountryName = countries?.find(
    (c: any) => c.iso === form.nationality
  )?.nicename || "Pakistan"; // Default fallback

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <div className={`flex items-center gap-2 mt-1 w-full text-red-500 text-xs ${direction === "rtl" ? "text-right" : "text-left"}`}>
        <span className="w-3 h-3 flex items-center justify-center rounded-full bg-red-500 p-1 text-white">!</span>
        <span>{error}</span>
      </div>
    ) : null;

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white appHorizantalSpacing dark:bg-gray-800 rounded-3xl space-y-4 md:space-y-0 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end">
          {/* Check-in */}
          <div className="relative">
            <label className="block text-sm text-start font-medium text-gray-500 dark:text-gray-300 mb-2">
              {dict?.hotel_search?.checkin?.title}
            </label>
            <DatePicker
              direction={direction}
              showCalendarIcon
              className="w-full font-medium pl-2 text-sm placeholder-gray-400 hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 bg-white transition-all duration-200 focus:outline-none"
              defaultDate={new Date(form.checkin)}
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
              {dict?.hotel_search?.checkout?.title}
            </label>
            <DatePicker
              direction={direction}
              showCalendarIcon
              defaultDate={new Date(form.checkout)}
              className="w-full font-medium pl-2 text-sm placeholder-gray-400 hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 bg-white transition-all duration-200 focus:outline-none"
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
              {dict?.hotel_search?.guest_button?.title}
            </label>
            <button
              type="button"
              onClick={toggleGuestsDropdown}
              className={`w-full flex items-center justify-between ${direction === "ltr" ? "pl-11 pr-4" : "pr-12 pl-4"} py-2.5 text-xs hover:bg-gray-100 hover:border-gray-300 border border-gray-200 rounded-xl text-gray-900 dark:bg-gray-800 dark:border-gray-600 cursor-pointer dark:hover:bg-gray-700 dark:hover:border-gray-500 transition-all duration-200`}
            >
              <div className={`absolute ${direction === "ltr" ? "left-4" : "right-4"} bottom-1 transform -translate-y-1/2 text-gray-400`}>
                <svg width="19" height="19" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.01698 6.91855C8.65463 6.91855 9.98221 5.59097 9.98221 3.95332C9.98221 2.31568 8.65463 0.988098 7.01698 0.988098C5.37933 0.988098 4.05176 2.31568 4.05176 3.95332C4.05176 5.59097 5.37933 6.91855 7.01698 6.91855Z" stroke="#8C96A5" strokeWidth="1.11196" />
                  <path d="M12.9476 12.4783C12.9476 14.3205 12.9476 15.8142 7.01712 15.8142C1.08667 15.8142 1.08667 14.3205 1.08667 12.4783C1.08667 10.6362 3.74203 9.14246 7.01712 9.14246C10.2922 9.14246 12.9476 10.6362 12.9476 12.4783Z" stroke="#8C96A5" strokeWidth="1.11196" />
                </svg>
              </div>
              <span className="font-medium text-[14px]">
                {totalGuests} {dict?.hotel_search?.guest_button?.guest_title}, {form.rooms} {dict?.hotel_search?.guest_button?.room_title}
              </span>
              <Icon icon="mdi:chevron-down" width={20} height={20} className={`text-gray-600 transition-transform duration-200 ${showGuestsDropdown ? "rotate-180" : ""}`} />
            </button>

            {showGuestsDropdown && (
              <div className="absolute z-20 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 md:min-w-[350px] max-h-80 overflow-y-auto">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Adults</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateForm({ adults: Math.max(1, form.adults - 1) })} className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">-</button>
                      <span className="text-blue-900 dark:text-blue-300 min-w-[1.25rem] text-center font-medium">{form.adults}</span>
                      <button type="button" onClick={() => updateForm({ adults: form.adults + 1 })} className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Children</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateForm({ children: Math.max(0, form.children - 1) })} className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">-</button>
                      <span className="text-blue-900 dark:text-blue-300 min-w-[1.25rem] text-center font-medium">{form.children}</span>
                      <button type="button" onClick={() => updateForm({ children: form.children + 1 })} className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Rooms</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateForm({ rooms: Math.max(1, form.rooms - 1) })} className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">-</button>
                      <span className="text-blue-900 dark:text-blue-300 min-w-[1.25rem] text-center font-medium">{form.rooms}</span>
                      <button type="button" onClick={() => updateForm({ rooms: form.rooms + 1 })} className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full border dark:border-gray-600 text-blue-900 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nationality Dropdown */}
          <div className="relative">
            <label className="block text-sm text-start font-medium text-gray-500 dark:text-gray-300 mb-2">
              Nationality
            </label>

            <Dropdown
              key={form.nationality} // ✅ Force re-render when nationality changes
              label={
                <div className="flex items-center gap-2">
                   <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.19514 17.1038C8.04735 17.2098 7.86998 17.2667 7.68803 17.2667C7.50607 17.2667 7.3287 17.2098 7.18091 17.1038C2.80793 13.9933 -1.83309 7.59516 2.85865 2.97186C4.14667 1.70746 5.88127 0.999208 7.68803 1C9.49916 1 11.2369 1.7094 12.5174 2.97096C17.2091 7.59426 12.5681 13.9915 8.19514 17.1038Z" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="1.35554" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.68772 9.13333C8.16806 9.13333 8.62873 8.94291 8.96838 8.60396C9.30803 8.26501 9.49885 7.80529 9.49885 7.32594C9.49885 6.84659 9.30803 6.38688 8.96838 6.04793C8.62873 5.70898 8.16806 5.51855 7.68772 5.51855C7.20738 5.51855 6.74671 5.70898 6.40706 6.04793C6.0674 6.38688 5.87659 6.84659 5.87659 7.32594C5.87659 7.80529 6.0674 8.26501 6.40706 8.60396C6.74671 8.94291 7.20738 9.13333 7.68772 9.13333Z" stroke="#5B697E" strokeOpacity="0.7" strokeWidth="1.35554" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                  <span>{selectedCountryName}</span>
                </div>
              }
              buttonClassName="w-full font-medium cursor-pointer pl-3  py-3 text-sm text-gray-700 placeholder-gray-400 bg-white hover:bg-gray-100 hover:text-gray-700 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none appearance-none flex items-center justify-between"
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
                      className={`w-full cursor-pointer text-left px-2 rounded-lg py-4 my-2 text-sm flex justify-between items-center ${
                        form.nationality === c.iso
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

          {/* Search Button */}
          <div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-blue-900 py-2 px-4 md:px-6 cursor-pointer font-medium flex items-center justify-center hover:bg-gray-800 border border-gray-200 rounded-xl text-white dark:border-gray-600 dark:hover:bg-gray-700 gap-2 focus:outline-none transition-all duration-200"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-white">Searching...</span>
                </>
              ) : (
                <>
                  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.7761 13.5548L15.635 16.4137M14.7318 8.524C14.7318 10.3703 13.9984 12.141 12.6929 13.4465C11.3873 14.7521 9.61664 15.4855 7.77033 15.4855C5.92403 15.4855 4.15335 14.7521 2.84781 13.4465C1.54228 12.141 0.808838 10.3703 0.808838 8.524C0.808838 6.67769 1.54228 4.90701 2.84781 3.60148C4.15335 2.29594 5.92403 1.5625 7.77033 1.5625C9.61664 1.5625 11.3873 2.29594 12.6929 3.60148C13.9984 4.90701 14.7318 6.67769 14.7318 8.524Z" stroke="white" strokeWidth="1.3923" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="hidden md:block text-white">{dict?.hotel_search?.search_btnText}</span>
                  <span className="md:hidden text-white">Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}