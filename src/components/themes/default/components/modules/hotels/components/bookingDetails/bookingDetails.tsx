"use client";
import { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";

type CountryCode = {
  code: string;
  name: string;
  flag?: JSX.Element;
};

export default function BookingDetails() {
  // ✅ States for Country Code Dropdown
  const [inputValue, setInputValue] = useState<string>("");
  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<CountryCode[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ✅ States for Title Dropdown
  const [isTitleOpen1, setIsTitleOpen1] = useState<boolean>(false);
  const [selectedTitle1, setSelectedTitle1] = useState<string>("");
  const [isTitleOpen, setIsTitleOpen] = useState<boolean>(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // ✅ Country codes list
  const countryCodes: CountryCode[] = [
    {
      code: "+92",
      name: "Pakistan",
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="15"
          viewBox="0 0 640 480"
        >
          <path fill="#01411C" d="M0 0h640v480H0z" />
          <path fill="#fff" d="M0 0h240v480H0z" />
          <circle cx="400" cy="240" r="120" fill="#fff" />
          <circle cx="420" cy="240" r="120" fill="#01411C" />
          <path
            fill="#fff"
            d="m465 180-21.6 30.4-34.8-10.8 21.5 30.5-21.5 30.4 34.8-10.8 21.6 30.4v-37.7l34.8-10.8-34.8-10.7z"
          />
        </svg>
      ),
    },
    {
      code: "+91",
      name: "India",
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="15"
          viewBox="0 0 640 480"
        >
          <path fill="#f93" d="M0 0h640v160H0z" />
          <path fill="#fff" d="M0 160h640v160H0z" />
          <path fill="#128807" d="M0 320h640v160H0z" />
          <circle cx="320" cy="240" r="40" fill="#000080" />
        </svg>
      ),
    },
    {
      code: "+1",
      name: "United States",
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="15"
          viewBox="0 0 7410 3900"
        >
          <path fill="#b22234" d="M0 0h7410v3900H0z" />
          <path
            stroke="#fff"
            strokeWidth="300"
            d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410"
          />
          <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
        </svg>
      ),
    },
    { code: "+44", name: "United Kingdom" },
    { code: "+1", name: "Canada" },
    { code: "+966", name: "Saudi Arabia" },
  ];

  // ✅ Filter country options
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions(countryCodes);
    } else {
      setFilteredOptions(
        countryCodes.filter((item) =>
          (item.code + " " + item.name)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
        )
      );
    }
  }, [inputValue]);

  // ✅ Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="bg-[#F9FAFB] w-full">
      <div className="min-h-screen w-full max-w-[1200px] mx-auto justify-between flex flex-col md:flex-row lg:flex-row p-4 md:p-6 lg:p-12 mb-6 gap-8">
        {/* form */}
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
          {/* personal info */}
          <div className="mb-12">
            <h3 className="text-xl text-[#0F172BE5] font-semibold mb-2">
              Personal Information
            </h3>
            <p className="text-[#0F172B66] font-medium text-base mb-4">
              Tell us the name of the person checking in.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {/* firstname */}
              <div className="w-full max-w-2xl">
                <label htmlFor="firstname" className="block text-base font-medium text-[#5B697E] mb-2">
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                  autoComplete="off"
                />
              </div>
              {/* lastname */}
              <div className="w-full max-w-2xl">
                <label htmlFor="lastname" className="block text-base font-medium text-[#5B697E] mb-2">
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          {/* Contact Info */}
          <div className="flex flex-col gap-3 mb-12">
            <h3 className="text-xl text-[#0F172BE5] font-semibold">
              Contact Information
            </h3>
            <p className="text-[#0F172B66] text-base font-medium">
              We'll send your confirmation to this email address.
            </p>
            {/* Email Address */}
            <div className="w-full max-w-2xl">
              <label htmlFor="email" className="block text-base font-medium text-[#5B697E] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="block border mb-4 border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Country Code */}
              <div className="w-full sm:max-w-42">
                <label htmlFor="countrynumber" className="block text-base font-medium text-[#5B697E] mb-2">
                  Country
                </label>
                <div className="relative" ref={dropdownRef}>
                  <input
                    id="countrynumber"
                    type="tel"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setIsCountryOpen(true);
                    }}
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C] [appearance:textfield]"
                    autoComplete="off"
                  />
                  {/* Dropdown */}
                  {isCountryOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow max-h-48 overflow-y-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setInputValue(option.code);
                              setIsCountryOpen(false);
                            }}
                            className="px-3 py-2 flex gap-2 items-center hover:bg-gray-100 cursor-pointer"
                          >
                            {option.flag && <span>{option.flag}</span>}
                            <span>{option.code}</span>
                            <span className="text-gray-600 text-sm">
                              {option.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">
                          No options found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Phone Number */}
              <div className="w-full sm:max-w-122">
                <label htmlFor="number" className="block text-base font-medium text-[#5B697E] mb-2">
                  Number
                </label>
                <input
                  id="number"
                  type="tel"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C] [appearance:textfield]"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          {/* Travelers Information */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl text-[#0F172BE5] font-semibold">
              Travelers Information
            </h3>
            <p className="text-[#0F172B66] text-base font-medium mb-4">
              Important details to complete your booking
            </p>
            {/* Adult Traveler 1 */}
            <div className="space-y-4 mb-3">
              <h4 className="text-lg text-[#0F172BE5] font-medium">Adult Travelers 1</h4>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1.5fr] gap-4">
                {/* Title */}
                <div className="w-full">
                  <label htmlFor="title1" className="block text-base font-medium text-[#5B697E] mb-2">
                    Title
                  </label>
                  
                  <div className="relative">
                    <button
                      id="title1"
                      className="flex pl-4 items-center justify-between w-full px-3 py-4 border border-gray-300 rounded-xl cursor-pointer text-base outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                      onClick={() => setIsTitleOpen1(!isTitleOpen1)}
                    >
                      {selectedTitle1 || "Select Title"}
                      <svg
                        className={`w-4 h-4 fill-current text-gray-600 transition-transform duration-200 ${isTitleOpen1 ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                    {isTitleOpen1 && (
                      <div className="absolute z-10 px-2 py-2 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {["Mr", "Mrs", "Ms", "Dr"].map((title) => (
                          <div
                            key={title}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg ${selectedTitle1 === title ? "bg-gray-100" : ""}`}
                            onClick={() => {
                              setSelectedTitle1(title);
                              setIsTitleOpen1(false);
                            }}
                          >
                            {title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* First Name */}
                <div className="w-full">
                  <label htmlFor="traveler1-firstname" className="block text-base font-medium text-[#5B697E] mb-2">
                    First Name
                  </label>
                  <input
                    id="traveler1-firstname"
                    type="text"
                    className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                    autoComplete="off"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full">
                  <label htmlFor="traveler1-lastname" className="block text-base font-medium text-[#5B697E] mb-2">
                    Last Name
                  </label>
                  <input
                    id="traveler1-lastname"
                    type="text"
                    className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Adult Traveler 2 */}
            <div className="space-y-4 mb-6">
              <h4 className="text-lg text-[#0F172BE5] font-medium">Adult Travelers 2</h4>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1.5fr] gap-4">
                {/* Title */}
                <div className="w-full">
                  <label htmlFor="title2" className="block text-base font-medium text-[#5B697E] mb-2">
                    Title
                  </label>
                  <div className="relative">
                    <button
                      id="title2"
                      className="flex pl-4 items-center justify-between w-full px-3 py-4 border border-gray-300 rounded-xl cursor-pointer text-base outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                      onClick={() => setIsTitleOpen(!isTitleOpen)}
                    >
                      {selectedTitle || "Select Title"}
                      <svg
                        className={`w-4 h-4 fill-current text-gray-600 transition-transform duration-200 ${isTitleOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                    {isTitleOpen && (
                      <div className="absolute z-10 px-2 py-2 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {["Mr", "Mrs", "Ms", "Dr"].map((title) => (
                          <div
                            key={title}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg ${selectedTitle === title ? "bg-gray-100" : ""}`}
                            onClick={() => {
                              setSelectedTitle(title);
                              setIsTitleOpen(false);
                            }}
                          >
                            {title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* First Name */}
                <div className="w-full">
                  <label htmlFor="traveler2-firstname" className="block text-base font-medium text-[#5B697E] mb-2">
                    First Name
                  </label>
                  <input
                    id="traveler2-firstname"
                    type="text"
                    className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                    autoComplete="off"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full">
                  <label htmlFor="traveler2-lastname" className="block text-base font-medium text-[#5B697E] mb-2">
                    Last Name
                  </label>
                  <input
                    id="traveler2-lastname"
                    type="text"
                    className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Payment Method */}
          <div className="flex flex-col gap-3 mb-2">
            <h3 className="text-xl text-[#0F172BE5] font-semibold">
              Payment Method
            </h3>
            <p className="text-[#0F172B66] text-base font-medium">
              Safe, secure transactions. Your personal information is protected.
            </p>
            {/* name of card owner */}
            <div className="w-full max-w-2xl mb-2">
              <label htmlFor="cardownername" className="block text-base font-medium text-[#5B697E] mb-2">
                Name
              </label>
              <input
                id="cardownername"
                type="text"
                className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                autoComplete="off"
              />
            </div>
            {/* card number */}
            <div className="w-full max-w-2xl mb-2">
              <label htmlFor="card" className="block text-base font-medium text-[#5B697E] mb-2">
                Card
              </label>
              <div className="relative">
                <input
                  id="card"
                  type="number"
                  className="block border border-gray-300 rounded-xl px-3 py-4 pr-32 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoComplete="off"
                />
                {/* card svgs */}
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex gap-2 pointer-events-none">
                  <svg
                    width="30"
                    height="19"
                    viewBox="0 0 30 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_401_1485)">
                      <path
                        d="M5.76528 0.245483H13.1094C14.1346 0.245483 14.7722 1.08113 14.5331 2.10978L11.1138 16.7898C10.8726 17.8149 9.84601 18.6512 8.82024 18.6512H1.47671C0.453021 18.6512 -0.186067 17.8149 0.0531016 16.7898L3.47378 2.10978C3.71295 1.08113 4.73883 0.245483 5.76528 0.245483Z"
                        fill="#E21836"
                      />
                      <path
                        d="M12.5011 0.245483H20.9467C21.9717 0.245483 21.5096 1.08113 21.2684 2.10978L17.8496 16.7898C17.6099 17.8149 17.6846 18.6512 16.6574 18.6512H8.21192C7.18477 18.6512 6.54913 17.8149 6.79038 16.7898L10.2089 2.10978C10.4516 1.08113 11.4754 0.245483 12.5011 0.245483Z"
                        fill="#00447C"
                      />
                      <path
                        d="M20.6121 0.245483H27.9562C28.9829 0.245483 29.6205 1.08113 29.3795 2.10978L25.9606 16.7898C25.7194 17.8149 24.6922 18.6512 23.6657 18.6512H16.325C15.2979 18.6512 14.6607 17.8149 14.9014 16.7898L18.3206 2.10978C18.5598 1.08113 19.5849 0.245483 20.6121 0.245483Z"
                        fill="#007B84"
                      />
                      <path
                        d="M7.67807 4.94778C6.92291 4.9555 6.69986 4.94778 6.62858 4.93097C6.60118 5.06109 6.09152 7.41202 6.09014 7.41397C5.9804 7.88955 5.9006 8.22867 5.6293 8.44757C5.47546 8.57481 5.29571 8.6363 5.08729 8.6363C4.75243 8.6363 4.55725 8.46991 4.52454 8.15451L4.51821 8.04627C4.51821 8.04627 4.62023 7.40914 4.62023 7.40557C4.62023 7.40557 5.15511 5.26318 5.25092 4.98003C5.25598 4.96391 5.25736 4.9555 5.25863 4.94778C4.21755 4.957 4.03296 4.94778 4.0203 4.93097C4.01327 4.954 3.98748 5.08689 3.98748 5.08689L3.44132 7.5016L3.39445 7.70634L3.30371 8.37618C3.30371 8.57481 3.34275 8.73706 3.42036 8.8742C3.6692 9.30901 4.37899 9.37419 4.78052 9.37419C5.29778 9.37419 5.78314 9.26422 6.11109 9.06351C6.68029 8.72727 6.82929 8.20149 6.96206 7.73421L7.02367 7.49458C7.02367 7.49458 7.57466 5.26952 7.66828 4.98003C7.67174 4.96391 7.67323 4.9555 7.67807 4.94778ZM9.55273 6.74276C9.41996 6.74276 9.17734 6.775 8.95924 6.88186C8.88013 6.92251 8.80528 6.96938 8.72629 7.01613L8.79757 6.75888L8.75853 6.71558C8.2962 6.8092 8.19268 6.82175 7.76558 6.88186L7.72989 6.9057C7.68026 7.31679 7.63615 7.62597 7.45237 8.43421C7.38196 8.73318 7.3101 9.03181 7.23681 9.33009L7.25639 9.36774C7.69419 9.34471 7.82696 9.34471 8.20742 9.35093L8.23816 9.31754C8.28653 9.06996 8.29275 9.01192 8.39984 8.51044C8.45016 8.27277 8.55506 7.75045 8.60676 7.56448C8.70176 7.52037 8.79561 7.47708 8.88508 7.47708C9.09834 7.47708 9.07232 7.66305 9.06414 7.7372C9.05493 7.86157 8.97732 8.26793 8.89763 8.61684L8.84443 8.84196C8.80747 9.00836 8.76682 9.16991 8.72974 9.33481L8.74586 9.36774C9.17722 9.34471 9.30884 9.34471 9.67721 9.35093L9.7205 9.31754C9.78718 8.93086 9.80664 8.82734 9.92478 8.26436L9.9842 8.00574C10.0997 7.49942 10.1577 7.24274 10.0703 7.03363C9.97798 6.7993 9.7562 6.74276 9.55273 6.74276ZM11.6472 7.2728C11.4178 7.3169 11.2716 7.34615 11.1263 7.36515C10.9822 7.38818 10.8416 7.40925 10.6201 7.44L10.6024 7.45589L10.5863 7.46856C10.5633 7.63368 10.5472 7.77635 10.5165 7.94413C10.4906 8.11755 10.4507 8.31469 10.3857 8.59784C10.3354 8.81456 10.3095 8.89009 10.2808 8.96632C10.2528 9.04267 10.2221 9.11683 10.1656 9.32997L10.1788 9.34966L10.1899 9.36774C10.397 9.35795 10.5325 9.35093 10.6718 9.34966C10.8109 9.34471 10.955 9.34966 11.178 9.35081L11.1975 9.33504L11.2185 9.31742C11.2507 9.12512 11.2555 9.07342 11.2752 8.97968C11.2947 8.87904 11.3284 8.73982 11.4109 8.36777C11.45 8.19309 11.4934 8.01886 11.5339 7.84061C11.5759 7.66305 11.6199 7.48825 11.6618 7.31345L11.6556 7.29237L11.6472 7.2728ZM11.652 6.55817C11.4436 6.43519 11.078 6.47423 10.8318 6.64407C10.5864 6.81058 10.5585 7.04687 10.7662 7.17147C10.9709 7.29099 11.338 7.25541 11.582 7.08407C11.827 6.91399 11.8576 6.67989 11.652 6.55817ZM12.9121 9.40632C13.3337 9.40632 13.7659 9.29001 14.0912 8.94537C14.3414 8.66578 14.4562 8.24974 14.4959 8.0784C14.6252 7.51059 14.5245 7.24551 14.3981 7.08407C14.2058 6.83787 13.8659 6.75888 13.5135 6.75888C13.3016 6.75888 12.7968 6.77984 12.4024 7.14348C12.1191 7.40568 11.9883 7.76161 11.9094 8.10269C11.8297 8.45045 11.7381 9.07618 12.3136 9.30913C12.4912 9.38536 12.7471 9.40632 12.9121 9.40632ZM12.8792 8.12872C12.9764 7.69874 13.0912 7.33786 13.384 7.33786C13.6135 7.33786 13.6302 7.60639 13.5282 8.03775C13.5099 8.13355 13.4262 8.4896 13.3129 8.64114C13.2336 8.75307 13.1401 8.82089 13.0365 8.82089C13.0058 8.82089 12.8227 8.82089 12.8198 8.54902C12.8184 8.41475 12.8458 8.27761 12.8792 8.12872ZM15.5497 9.35104L15.5826 9.31754C15.6294 9.06996 15.6371 9.01181 15.7405 8.51056C15.7923 8.27277 15.8994 7.75056 15.9496 7.56448C16.0448 7.52026 16.1371 7.47696 16.2294 7.47696C16.4412 7.47696 16.4154 7.66293 16.407 7.73709C16.3993 7.86168 16.3215 8.26782 16.2405 8.61673L16.1902 8.84185C16.1517 9.00835 16.1098 9.1698 16.0727 9.33492L16.0888 9.36786C16.5218 9.34483 16.6482 9.34483 17.0188 9.35104L17.0636 9.31754C17.1285 8.93063 17.1461 8.82722 17.2678 8.26436L17.3258 8.00562C17.4418 7.4993 17.5006 7.24286 17.4146 7.03375C17.3196 6.79941 17.0965 6.74287 16.8958 6.74287C16.7628 6.74287 16.5189 6.77489 16.3021 6.88198C16.2246 6.92251 16.1469 6.96926 16.0706 7.01624L16.1371 6.75899L16.1014 6.71547C15.6392 6.8092 15.5337 6.82175 15.107 6.88198L15.0742 6.9057C15.0225 7.3169 14.9805 7.62585 14.7967 8.43433C14.7262 8.73324 14.6544 9.03183 14.5813 9.33009L14.6008 9.36786C15.0392 9.34483 15.17 9.34483 15.5497 9.35104ZM18.7299 9.36774C18.7571 9.23486 18.9188 8.44768 18.9202 8.44768C18.9202 8.44768 19.0578 7.86997 19.0663 7.84901C19.0663 7.84901 19.1096 7.78891 19.1529 7.76507H19.2166C19.8179 7.76507 20.4969 7.76507 21.029 7.37356C21.3912 7.10502 21.6388 6.70856 21.7492 6.22665C21.7779 6.10851 21.7989 5.96802 21.7989 5.82754C21.7989 5.64295 21.762 5.46032 21.6549 5.31765C21.3835 4.938 20.8431 4.93097 20.2192 4.92809L19.9117 4.93097C19.1131 4.94087 18.7929 4.938 18.6613 4.92188C18.6502 4.98003 18.6293 5.08355 18.6293 5.08355C18.6293 5.08355 18.3432 6.40928 18.3432 6.41135L17.6264 9.36291C18.3237 9.3545 18.6096 9.3545 18.7299 9.36774ZM19.26 7.01267C19.26 7.01267 19.564 5.68959 19.5626 5.69465L19.5725 5.62671L19.5767 5.57513L19.6983 5.58756C19.6983 5.58756 20.3256 5.64145 20.3402 5.64284C20.5878 5.73864 20.6898 5.98553 20.6186 6.30772C20.5536 6.60227 20.3626 6.84985 20.1171 6.96938C19.9151 7.07071 19.6675 7.07911 19.4124 7.07911H19.2474L19.26 7.01267ZM21.1535 8.15324C21.0731 8.49582 20.9808 9.12166 21.5534 9.34471C21.7361 9.42232 21.8997 9.44547 22.0658 9.43706C22.2416 9.42762 22.4043 9.33953 22.555 9.21275L22.5141 9.36924L22.5402 9.40263C22.9521 9.38536 23.0799 9.38536 23.5261 9.38881L23.5666 9.35795C23.6317 8.97485 23.6932 8.60291 23.8625 7.86997C23.945 7.51899 24.0273 7.17135 24.112 6.82175L24.0987 6.78329C23.638 6.86862 23.5149 6.88693 23.0716 6.94968L23.038 6.97709C23.0335 7.01279 23.0287 7.04699 23.0245 7.08119C22.9556 6.96984 22.8557 6.87472 22.7016 6.81553C22.5045 6.73792 22.0416 6.83787 21.6437 7.20014C21.364 7.45888 21.2297 7.81332 21.1535 8.15324ZM22.1212 8.1742C22.2199 7.75183 22.3331 7.39463 22.6267 7.39463C22.8124 7.39463 22.9101 7.56586 22.8902 7.858C22.8732 7.93698 22.8555 8.01582 22.8372 8.09452C22.8079 8.22003 22.7761 8.34439 22.7451 8.46899C22.7136 8.5542 22.6768 8.63457 22.6367 8.68812C22.5611 8.79521 22.3814 8.86154 22.2778 8.86154C22.2485 8.86154 22.0673 8.86154 22.0611 8.59439C22.0596 8.4615 22.087 8.32459 22.1212 8.1742ZM27.1748 6.77972L27.1391 6.73907C26.6832 6.83142 26.6006 6.84616 26.1818 6.9027L26.1509 6.93345C26.1496 6.93851 26.1483 6.94612 26.1461 6.95314L26.1447 6.94623C25.8329 7.66569 25.842 7.51047 25.5882 8.07678C25.5867 8.05099 25.5867 8.03498 25.5853 8.00758L25.5218 6.77972L25.4819 6.73907C25.0043 6.83142 24.993 6.84616 24.552 6.9027L24.5175 6.93345C24.5127 6.94819 24.5127 6.96431 24.5098 6.98181L24.5127 6.98815C24.5678 7.2698 24.5546 7.20693 24.6099 7.65165C24.6357 7.86986 24.6701 8.08933 24.6958 8.3049C24.7393 8.66555 24.7637 8.84311 24.8168 9.39365C24.519 9.88511 24.4484 10.0712 24.1616 10.5026L24.1637 10.5068L23.9617 10.8262C23.9387 10.8599 23.9177 10.8829 23.8883 10.8928C23.8561 10.9087 23.8142 10.9116 23.756 10.9116H23.6441L23.4778 11.4648L24.0484 11.4745C24.3833 11.4732 24.5938 11.3166 24.7071 11.1061L25.0659 10.4913H25.0601L25.0979 10.448C25.3392 9.92853 27.1748 6.77972 27.1748 6.77972ZM21.1535 14.0444H20.9115L21.8073 11.0815H22.1044L22.1988 10.7764L22.2078 11.1157C22.1968 11.3255 22.3618 11.5115 22.7953 11.4808H23.2968L23.4693 10.9103H23.2807C23.1722 10.9103 23.1218 10.8829 23.1281 10.8242L23.119 10.4788H22.1906V10.4807C21.8904 10.4869 20.9938 10.5095 20.8123 10.5578C20.5927 10.6143 20.3613 10.7809 20.3613 10.7809L20.4522 10.4753H19.5837L19.4026 11.0815L18.4949 14.0896H18.3187L18.146 14.6561H19.8759L19.818 14.8449H20.6703L20.727 14.6561H20.966L21.1535 14.0444ZM20.4437 11.6835C20.3046 11.722 20.0459 11.8388 20.0459 11.8388L20.2761 11.0815H20.966L20.7996 11.6332C20.7996 11.6332 20.5864 11.6459 20.4438 11.6835M20.4571 12.7653C20.4571 12.7653 20.2404 12.7926 20.0977 12.8247C19.9572 12.8673 19.6936 13.0016 19.6936 13.0016L19.9314 12.2136H20.625L20.4571 12.7653ZM20.0704 14.0513H19.3782L19.5789 13.3863H20.2689L20.0704 14.0513ZM21.7374 12.2136H22.7352L22.5919 12.678H21.5808L21.4291 13.1856H22.3138L21.6438 14.1288C21.597 14.1981 21.5549 14.2226 21.5082 14.2421C21.4613 14.2659 21.3997 14.2939 21.3285 14.2939H21.083L20.9145 14.8499H21.5563C21.89 14.8499 22.0871 14.6981 22.2326 14.4989L22.692 13.8701L22.7906 14.5085C22.8116 14.6281 22.8975 14.6981 22.9556 14.7253C23.0199 14.7575 23.0863 14.8128 23.1802 14.8211C23.2807 14.8253 23.3534 14.8288 23.4017 14.8288H23.7172L23.9065 14.2065H23.7822C23.7108 14.2065 23.5877 14.1945 23.5668 14.1722C23.5458 14.1449 23.5458 14.1031 23.5346 14.0393L23.4344 13.3995H23.0247L23.2045 13.1856H24.2135L24.3688 12.678H23.4345L23.58 12.2136H24.5114L24.6842 11.6409H21.9074L21.7374 12.2136ZM13.3101 14.1806L13.5429 13.4059H14.5002L14.675 12.8296H13.7169L13.8632 12.3528H14.7994L14.9729 11.7948H12.6304L12.4605 12.3528H12.9928L12.8508 12.8295H12.3172L12.1403 13.4156H12.6723L12.3618 14.4407C12.32 14.5764 12.3815 14.6281 12.4206 14.6912C12.4605 14.7526 12.5009 14.7932 12.5919 14.8162C12.6858 14.8372 12.75 14.8497 12.8373 14.8497H13.9164L14.1087 14.2113L13.6303 14.2771C13.538 14.2771 13.2821 14.266 13.3101 14.1806ZM13.4198 10.4718L13.1773 10.9102C13.1255 11.0059 13.0787 11.0654 13.0366 11.0927C12.9995 11.1157 12.9261 11.1255 12.8198 11.1255H12.6932L12.5241 11.6863H12.9444C13.1466 11.6863 13.3017 11.6123 13.3759 11.5752C13.4555 11.5326 13.4765 11.5569 13.538 11.4975L13.68 11.3745H14.9925L15.1667 10.7907H14.2059L14.3736 10.4717L13.4198 10.4718ZM15.3575 14.1919C15.3352 14.1596 15.3513 14.1029 15.3855 13.9847L15.7442 12.7974H17.0204C17.2064 12.7948 17.3405 12.7926 17.428 12.7863C17.5218 12.7764 17.6238 12.7429 17.7349 12.6828C17.8497 12.6198 17.9084 12.5534 17.9579 12.4772C18.0132 12.4012 18.1021 12.2345 18.1783 11.9779L18.6293 10.4753L17.305 10.483C17.305 10.483 16.8972 10.5431 16.7177 10.6096C16.5365 10.6837 16.2777 10.8906 16.2777 10.8906L16.3972 10.4787H15.5792L14.4339 14.2771C14.3932 14.4245 14.3659 14.5316 14.3597 14.5959C14.3576 14.6651 14.4471 14.7338 14.5051 14.7855C14.5737 14.8372 14.675 14.8288 14.7722 14.8372C14.8744 14.8449 15.0198 14.8497 15.2205 14.8497H15.8492L16.0421 14.1981L15.4793 14.2513C15.4191 14.2513 15.3757 14.2191 15.3575 14.1919ZM15.9756 11.9955H17.316L17.2308 12.2625C17.2189 12.2687 17.1902 12.2493 17.0538 12.2654H15.8931L15.9756 11.9955ZM16.2442 11.0996H17.5959L17.4986 11.4213C17.4986 11.4213 16.8616 11.4151 16.7596 11.4339C16.3105 11.5116 16.0483 11.7515 16.0483 11.7515L16.2442 11.0996ZM17.2609 13.1569C17.2498 13.1969 17.2322 13.2212 17.2077 13.2395C17.1804 13.257 17.1363 13.2632 17.0707 13.2632H16.8798L16.8911 12.938H16.0965L16.0643 14.5281C16.0631 14.6428 16.0742 14.7093 16.1581 14.7625C16.2422 14.8288 16.5008 14.8373 16.849 14.8373H17.3468L17.5265 14.242L17.0932 14.2658L16.949 14.2742C16.9294 14.2658 16.9105 14.2581 16.8896 14.2372C16.8714 14.2192 16.8405 14.2302 16.8456 14.1155L16.849 13.7079L17.3034 13.6891C17.5489 13.6891 17.6538 13.6092 17.7433 13.5332C17.8286 13.4603 17.8566 13.3766 17.8889 13.2632L17.9651 12.9023H17.3405L17.2609 13.1569Z"
                        fill="#FEFEFE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_401_1485">
                        <rect
                          width="29.4787"
                          height="18.4242"
                          fill="white"
                          transform="translate(0 0.245483)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <svg
                    width="30"
                    height="23"
                    viewBox="0 0 30 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_401_1490)">
                      <path
                        d="M5.83937 22.802V21.2853C5.83937 20.7038 5.4854 20.3247 4.87867 20.3247C4.57536 20.3247 4.24672 20.4258 4.01918 20.7545C3.84231 20.4764 3.58955 20.3247 3.21036 20.3247C2.95749 20.3247 2.70485 20.4005 2.50253 20.6786V20.3753H1.97168V22.802H2.50253V21.4622C2.50253 21.0326 2.73006 20.8302 3.08404 20.8302C3.43778 20.8302 3.61489 21.0578 3.61489 21.4622V22.802H4.14573V21.4622C4.14573 21.0326 4.39837 20.8302 4.72701 20.8302C5.08099 20.8302 5.25786 21.0578 5.25786 21.4622V22.802H5.83937ZM13.7008 20.3753H12.8415V19.6422H12.3106V20.3753H11.8303V20.8554H12.3105V21.9678C12.3105 22.524 12.5381 22.8525 13.1448 22.8525C13.3723 22.8525 13.625 22.7767 13.8021 22.6756L13.6503 22.2206C13.4986 22.3217 13.3218 22.347 13.1953 22.347C12.9426 22.347 12.8415 22.1953 12.8415 21.9425V20.8554H13.7008V20.3753ZM18.2005 20.3246C17.8972 20.3246 17.695 20.4764 17.5685 20.6786V20.3753H17.0377V22.802H17.5685V21.437C17.5685 21.0326 17.7454 20.805 18.0741 20.805C18.1752 20.805 18.3016 20.8303 18.4027 20.8556L18.5544 20.3501C18.4533 20.3247 18.3016 20.3247 18.2005 20.3247M11.4006 20.5776C11.1477 20.4006 10.7939 20.3248 10.4147 20.3248C9.80805 20.3248 9.40364 20.6281 9.40364 21.1084C9.40364 21.513 9.70695 21.7404 10.2378 21.8163L10.4906 21.8416C10.7686 21.892 10.9203 21.9679 10.9203 22.0944C10.9203 22.2712 10.7181 22.3977 10.3641 22.3977C10.0101 22.3977 9.73217 22.2712 9.55518 22.1449L9.30243 22.5493C9.58052 22.7515 9.95971 22.8526 10.3388 22.8526C11.0466 22.8526 11.4511 22.5241 11.4511 22.069C11.4511 21.6393 11.1225 21.4117 10.6169 21.336L10.3641 21.3106C10.1366 21.2853 9.95971 21.2349 9.95971 21.0832C9.95971 20.9062 10.1366 20.8051 10.4147 20.8051C10.7181 20.8051 11.0214 20.9314 11.1731 21.0073L11.4006 20.5776ZM25.506 20.3248C25.2026 20.3248 25.0004 20.4765 24.874 20.6787V20.3754H24.3431V22.8021H24.874V21.4371C24.874 21.0327 25.0509 20.8051 25.3795 20.8051C25.4807 20.8051 25.6071 20.8305 25.7082 20.8557L25.8599 20.3502C25.7588 20.3248 25.6071 20.3248 25.506 20.3248ZM18.7313 21.5887C18.7313 22.3218 19.2369 22.8526 20.0206 22.8526C20.3744 22.8526 20.6272 22.7769 20.8799 22.5747L20.6272 22.1449C20.425 22.2966 20.2228 22.3723 19.9952 22.3723C19.5655 22.3723 19.2622 22.069 19.2622 21.5887C19.2622 21.1338 19.5655 20.8303 19.9952 20.8051C20.2228 20.8051 20.425 20.8809 20.6272 21.0327L20.8799 20.6029C20.6272 20.4006 20.3744 20.3248 20.0206 20.3248C19.2369 20.3248 18.7313 20.8557 18.7313 21.5887ZM23.6354 21.5887V20.3754H23.1045V20.6787C22.9276 20.4513 22.6748 20.3248 22.3462 20.3248C21.6637 20.3248 21.1328 20.8557 21.1328 21.5887C21.1328 22.3218 21.6637 22.8526 22.3462 22.8526C22.7 22.8526 22.9529 22.7263 23.1045 22.4988V22.8021H23.6354V21.5887ZM21.6889 21.5887C21.6889 21.159 21.967 20.8051 22.4219 20.8051C22.8517 20.8051 23.1551 21.1338 23.1551 21.5887C23.1551 22.0185 22.8517 22.3723 22.4219 22.3723C21.967 22.347 21.6889 22.0185 21.6889 21.5887ZM15.3441 20.3248C14.6362 20.3248 14.1306 20.8303 14.1306 21.5887C14.1306 22.3471 14.6361 22.8526 15.3693 22.8526C15.7231 22.8526 16.0771 22.7515 16.3552 22.5241L16.1023 22.1449C15.9001 22.2966 15.6474 22.3977 15.3946 22.3977C15.066 22.3977 14.7373 22.246 14.6614 21.8162H16.4563V21.6141C16.4816 20.8303 16.0267 20.3248 15.3441 20.3248ZM15.3439 20.7798C15.6725 20.7798 15.9001 20.9821 15.9506 21.3613H14.6867C14.7372 21.0327 14.9647 20.7798 15.3439 20.7798ZM28.514 21.5887V19.4148H27.9832V20.6787C27.8062 20.4513 27.5534 20.3248 27.2248 20.3248C26.5423 20.3248 26.0114 20.8557 26.0114 21.5887C26.0114 22.3218 26.5423 22.8526 27.2248 22.8526C27.5787 22.8526 27.8315 22.7263 27.9832 22.4988V22.8021H28.514V21.5887ZM26.5676 21.5887C26.5676 21.159 26.8456 20.8051 27.3006 20.8051C27.7304 20.8051 28.0337 21.1338 28.0337 21.5887C28.0337 22.0185 27.7304 22.3723 27.3006 22.3723C26.8456 22.347 26.5676 22.0185 26.5676 21.5887ZM8.82202 21.5887V20.3754H8.29117V20.6787C8.11418 20.4513 7.86143 20.3248 7.53278 20.3248C6.85028 20.3248 6.31944 20.8557 6.31944 21.5887C6.31944 22.3218 6.85028 22.8526 7.53278 22.8526C7.88676 22.8526 8.13952 22.7263 8.29117 22.4988V22.8021H8.82202V21.5887ZM6.85028 21.5887C6.85028 21.159 7.12837 20.8051 7.58334 20.8051C8.01308 20.8051 8.3165 21.1338 8.3165 21.5887C8.3165 22.0185 8.01308 22.3723 7.58334 22.3723C7.12837 22.347 6.85028 22.0185 6.85028 21.5887Z"
                        fill="black"
                      />
                      <path
                        d="M11.2285 1.94702H19.1912V16.2547H11.2285V1.94702Z"
                        fill="#FF5F00"
                      />
                      <path
                        d="M11.7304 9.09929C11.7304 6.19231 13.0954 3.61384 15.1935 1.94542C13.6516 0.732075 11.7052 -0.000976562 9.58183 -0.000976562C4.55123 -0.000976562 0.481445 4.06881 0.481445 9.09929C0.481445 14.1298 4.55123 18.1996 9.58172 18.1996C11.7051 18.1996 13.6515 17.4665 15.1935 16.2531C13.0954 14.61 11.7304 12.0063 11.7304 9.09929Z"
                        fill="#EB001B"
                      />
                      <path
                        d="M29.9259 9.09929C29.9259 14.1297 25.8561 18.1996 20.8256 18.1996C18.7023 18.1996 16.7559 17.4665 15.2139 16.2531C17.3373 14.5847 18.677 12.0063 18.677 9.09929C18.677 6.19231 17.3119 3.61384 15.2139 1.94542C16.7557 0.732075 18.7023 -0.000976562 20.8256 -0.000976562C25.8561 -0.000976562 29.9259 4.09414 29.9259 9.09929Z"
                        fill="#F79E1B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_401_1490">
                        <rect
                          width="29.4787"
                          height="22.9151"
                          fill="white"
                          transform="translate(0.478516)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <svg
                    width="31"
                    height="21"
                    viewBox="0 0 31 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_401_1495)">
                      <path
                        d="M26.2292 11.662H24.4636C24.583 11.3464 24.8645 10.583 25.308 9.37174L25.3464 9.25659C25.3805 9.17129 25.4232 9.06041 25.4743 8.92393C25.5255 8.78746 25.5639 8.67657 25.5895 8.59127L25.743 9.29497L26.2292 11.662ZM7.75387 10.8303L7.01179 7.05593C6.91796 6.59532 6.5981 6.36502 6.0522 6.36502H2.62325L2.59766 6.53135C5.2504 7.2052 6.96914 8.63819 7.75387 10.8303ZM10.0441 6.36502L7.97138 11.969L7.75387 10.8303C7.5321 10.2332 7.16959 9.68094 6.66634 9.17343C6.16308 8.66591 5.60439 8.28847 4.99025 8.04111L6.71751 14.5663H8.95656L12.2959 6.36502H10.0441ZM11.8225 14.5791H13.9464L15.2771 6.36502H13.1532L11.8225 14.5791ZM21.6488 6.56973C21.0602 6.33943 20.4248 6.22428 19.7424 6.22428C18.6932 6.22428 17.836 6.47591 17.1707 6.97916C16.5054 7.48241 16.1684 8.13493 16.1599 8.93673C16.1514 9.80676 16.7698 10.5488 18.0151 11.163C18.4245 11.3592 18.7103 11.534 18.8723 11.6876C19.0344 11.8411 19.1154 12.0074 19.1154 12.1865C19.1154 12.4424 18.9875 12.6386 18.7316 12.7751C18.4757 12.9116 18.1814 12.9798 17.8488 12.9798C17.1152 12.9798 16.4499 12.8391 15.8528 12.5576L15.5713 12.4168L15.2771 14.2593C15.9083 14.5493 16.6973 14.6943 17.6441 14.6943C18.7529 14.7028 19.6422 14.4512 20.3117 13.9394C20.9813 13.4276 21.3246 12.7452 21.3417 11.8923C21.3417 10.9881 20.7446 10.246 19.5505 9.66602C19.1325 9.45277 18.8297 9.27365 18.642 9.12864C18.4544 8.98364 18.3606 8.82158 18.3606 8.64245C18.3606 8.4548 18.4651 8.2906 18.674 8.14986C18.883 8.00912 19.1837 7.93875 19.576 7.93875C20.1731 7.93022 20.702 8.03258 21.1626 8.24582L21.3545 8.34818L21.6488 6.56973ZM27.0865 6.36502H25.4487C24.8943 6.36502 24.5233 6.59532 24.3356 7.05593L21.1882 14.5791H23.4144L23.8622 13.3509H26.5747C26.6173 13.5385 26.7026 13.9479 26.8306 14.5791H28.8009L27.0865 6.36502ZM30.4386 2.27076V18.6478C30.4386 19.0913 30.2766 19.4752 29.9524 19.7993C29.6283 20.1234 29.2445 20.2855 28.8009 20.2855H2.59766C2.15412 20.2855 1.77028 20.1234 1.44615 19.7993C1.12203 19.4752 0.959961 19.0913 0.959961 18.6478V2.27076C0.959961 1.82722 1.12203 1.44338 1.44615 1.11925C1.77028 0.795121 2.15412 0.633057 2.59766 0.633057H28.8009C29.2445 0.633057 29.6283 0.795121 29.9524 1.11925C30.2766 1.44338 30.4386 1.82722 30.4386 2.27076Z"
                        fill="#163C8C"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_401_1495">
                        <rect
                          width="29.4787"
                          height="19.6524"
                          fill="white"
                          transform="translate(0.957031 0.631348)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            {/* Expiration and security code */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="w-full sm:max-w-80">
                <label htmlFor="expiration" className="block text-base font-medium text-[#5B697E] mb-2">
                  Expiration
                </label>
                <input
                  id="expiration"
                  type="number"
                  placeholder="MM/YY"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                  autoComplete="off"
                />
              </div>
              <div className="w-full sm:max-w-83">
                <label htmlFor="securitycode" className="block text-base font-medium text-[#5B697E] mb-2">
                  Security Code
                </label>
                <input
                  id="securitycode"
                  type="number"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoComplete="off"
                />
              </div>
            </div>
            {/* zipcode */}
            <div className="w-full max-w-2xl mb-10">
              <label htmlFor="zipcode" className="block text-base font-medium text-[#5B697E] mb-2">
                Zip Code
              </label>
              <input
                id="zipcode"
                type="number"
                className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoComplete="off"
              />
            </div>
          </div>
          {/* Cancellation Policy */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl text-[#0F172BE5] font-semibold">
              Cancellation Policy
            </h3>
            <div className="flex gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 10.5C1 6.729 1 4.843 2.172 3.672C3.344 2.501 5.229 2.5 9 2.5H13C16.771 2.5 18.657 2.5 19.828 3.672C20.999 4.844 21 6.729 21 10.5V12.5C21 16.271 21 18.157 19.828 19.328C18.656 20.499 16.771 20.5 13 20.5H9C5.229 20.5 3.343 20.5 2.172 19.328C1.001 18.156 1 16.271 1 12.5V10.5Z"
                  stroke="#EB001B"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 2.5V1M16 2.5V1M1.5 7.5H20.5"
                  stroke="#EB001B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6 15C6.13261 15 6.25975 15.0527 6.35352 15.1465C6.44728 15.2403 6.5 15.3674 6.5 15.5C6.5 15.6326 6.44728 15.7597 6.35352 15.8535C6.25975 15.9473 6.13261 16 6 16C5.86739 16 5.74025 15.9473 5.64648 15.8535C5.55272 15.7597 5.5 15.6326 5.5 15.5C5.5 15.3674 5.55272 15.2403 5.64648 15.1465C5.74025 15.0527 5.86739 15 6 15ZM11 15C11.1326 15 11.2597 15.0527 11.3535 15.1465C11.4473 15.2403 11.5 15.3674 11.5 15.5C11.5 15.6326 11.4473 15.7597 11.3535 15.8535C11.2597 15.9473 11.1326 16 11 16C10.8674 16 10.7403 15.9473 10.6465 15.8535C10.5527 15.7597 10.5 15.6326 10.5 15.5C10.5 15.3674 10.5527 15.2403 10.6465 15.1465C10.7403 15.0527 10.8674 15 11 15ZM16 15C16.1326 15 16.2597 15.0527 16.3535 15.1465C16.4473 15.2403 16.5 15.3674 16.5 15.5C16.5 15.6326 16.4473 15.7597 16.3535 15.8535C16.2597 15.9473 16.1326 16 16 16C15.8674 16 15.7403 15.9473 15.6465 15.8535C15.5527 15.7597 15.5 15.6326 15.5 15.5C15.5 15.3674 15.5527 15.2403 15.6465 15.1465C15.7403 15.0527 15.8674 15 16 15ZM6 11C6.13261 11 6.25975 11.0527 6.35352 11.1465C6.44728 11.2403 6.5 11.3674 6.5 11.5C6.5 11.6326 6.44728 11.7597 6.35352 11.8535C6.25975 11.9473 6.13261 12 6 12C5.86739 12 5.74025 11.9473 5.64648 11.8535C5.55272 11.7597 5.5 11.6326 5.5 11.5C5.5 11.3674 5.55272 11.2403 5.64648 11.1465C5.74025 11.0527 5.86739 11 6 11ZM11 11C11.1326 11 11.2597 11.0527 11.3535 11.1465C11.4473 11.2403 11.5 11.3674 11.5 11.5C11.5 11.6326 11.4473 11.7597 11.3535 11.8535C11.2597 11.9473 11.1326 12 11 12C10.8674 12 10.7403 11.9473 10.6465 11.8535C10.5527 11.7597 10.5 11.6326 10.5 11.5C10.5 11.3674 10.5527 11.2403 10.6465 11.1465C10.7403 11.0527 10.8674 11 11 11ZM16 11C16.1326 11 16.2597 11.0527 16.3535 11.1465C16.4473 11.2403 16.5 11.3674 16.5 11.5C16.5 11.6326 16.4473 11.7597 16.3535 11.8535C16.2597 11.9473 16.1326 12 16 12C15.8674 12 15.7403 11.9473 15.6465 11.8535C15.5527 11.7597 15.5 11.6326 15.5 11.5C15.5 11.3674 15.5527 11.2403 15.6465 11.1465C15.7403 11.0527 15.8674 11 16 11Z"
                  fill="#EB001B"
                  stroke="#EB001B"
                />
              </svg>

              <h3 className="font-medium text-lg text-[#EB001B]">
                Cancel up to Sat 15 Nov 2025
              </h3>
            </div>
            <p className="text-[#0F172B66] text-base font-medium">
              The full cost of the booking will be refunded. No cancellation
              charges apply.
            </p>
            <div className="flex gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.92871 3.92896L18.0697 18.071"
                  stroke="#EB001B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                  stroke="#EB001B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h3 className="font-medium text-lg text-[#EB001B]">
                Cancel on or after Sun 16 Nov 2025
              </h3>
            </div>
            <p className="text-[#0F172B66] text-base font-medium">
              No refund will be given.
            </p>
            <label className="flex gap-2 items-start">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border border-[#0F172B66] mt-0.5 focus:ring-[#163C8C] focus:border-[#163C8C]"
              />
              <span className="text-[#0F172B66] text-base font-medium">
                I accept the cancellation policy for this booking and the{" "}
                <span className="text-[#163C8C] underline cursor-pointer hover:text-[#0f2d6b]">
                  Terms & Conditions
                </span>
              </span>
            </label>
          </div>
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
          <button className="cursor-pointer w-full bg-[#163C8C] text-lg text-white py-3 font-medium rounded-lg mt-5 hover:bg-[#0f2d6b] transition-colors focus:ring-2 focus:ring-[#163C8C] focus:ring-offset-2">
            Confirm & Book
          </button>
        </div>
      </div>
    </section>
  );
}