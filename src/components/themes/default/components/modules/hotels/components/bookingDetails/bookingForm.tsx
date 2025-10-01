// components/booking/BookingForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { boolean, z } from 'zod';
import { Icon } from '@iconify/react';
import useCountries from '@hooks/useCountries';
import { useAppSelector } from '@lib/redux/store';

// Validation schema
const bookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  nationality: z.string().min(1, "Nationality is required"), // read-only
  currentCountry: z.string().min(1, "Current country is required"), // user-selectable (ISO code)
  phoneCountryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string()
    .min(8, "Phone number is required")
    .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid international phone number"),

  travellers: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
    })
  ).min(1, "At least one traveller is required"),

  paymentMethod: z.string().min(1, "Please select a payment method"),

  acceptPolicy: z.boolean().refine(val => val === true, {
    message: "You must accept the cancellation policy",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

const defaultValues: BookingFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  nationality: "", // will be set from session/props
  currentCountry: "",
  phoneCountryCode: "",
  phoneNumber: "",
  travellers: [{ title: "Mr", firstName: "", lastName: "" }],
  paymentMethod: "",
  acceptPolicy: false,
};

// Map country API object to dropdown format
interface CountryOption {
  iso: string;        // e.g., "PK"
  name: string;       // e.g., "Pakistan"
  phonecode: string;  // e.g., "92"
}

export default function BookingForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormValues>({
    defaultValues,
    resolver: zodResolver(bookingSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travellers",
  });

  // Fetch countries
  const { countries: rawCountries, isLoading: loadingCountries } = useCountries();
  const { payment_gateways } = useAppSelector((state) => state.appData?.data);

  const curruntBooking = localStorage.getItem('hotelSearchForm');
  let saveBookingData;
  if (curruntBooking) {
    saveBookingData = JSON.parse(curruntBooking);
  }
  const { adults, children, nationality, currency } = saveBookingData;
  const travelers = adults + children;

  // Get active payment methods
  const activePayments = payment_gateways?.filter((p: any) => p.status)?.map((p: any) => ({
    id: p.id,
    name: p.name,
    label: p.label || p.name,
    icon: p.icon || null
  })) || [];

  // Transform to usable format
  type RawCountry = {
    iso?: string;
    code?: string;
    nicename?: string;
    name?: string;
    phonecode?: number | string;
  };

  const excludedCodes = ["0", "381", "599"]; // add more here
  const countryList: CountryOption[] = (rawCountries || [])
    .map((c: RawCountry) => ({
      iso: c.iso || c.code,
      name: c.nicename || c.name,
      phonecode: c.phonecode?.toString() || "0",
    }))
    .filter((c: any) => !excludedCodes.includes(c.phonecode));

  // Set nationality from saved booking data and initialize travellers
  useEffect(() => {
    // Set nationality from saveBookingData
    if (nationality) {
      setValue("nationality", nationality);
    }

    // Initialize travellers based on adults + children count
    if (travelers > 0) {
      const initialTravellers = Array.from({ length: travelers }, () => ({
        title: "Mr",
        firstName: "",
        lastName: ""
      }));
      setValue("travellers", initialTravellers);
    }
  }, [setValue, nationality, travelers]);

  // Dropdown states
  const [isCurrentCountryOpen, setIsCurrentCountryOpen] = useState(false);
  const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
  const [isTitleOpen, setIsTitleOpen] = useState<number | null>(null);

  const currentCountryRef = useRef<HTMLDivElement>(null);
  const phoneCodeRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currentCountryRef.current && !currentCountryRef.current.contains(e.target as Node)) {
        setIsCurrentCountryOpen(false);
      }
      if (phoneCodeRef.current && !phoneCodeRef.current.contains(e.target as Node)) {
        setIsPhoneCodeOpen(false);
      }
      titleRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(e.target as Node)) {
          setIsTitleOpen(null);
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titles = ["Mr", "Mrs", "Ms", "Dr"];

  const onSubmit = (data: BookingFormValues) => {
    console.log('Booking data:', data);
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <div className="mb-12">
        <h3 className="text-xl text-[#0F172BE5] font-semibold mb-2">Personal Information</h3>
        <p className="text-[#0F172B66] font-medium text-base mb-4">
          Tell us the name of the person checking in.
        </p>
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full max-w-2xl">
            <label htmlFor="firstName" className="block text-base font-medium text-[#5B697E] mb-2">
              First Name
            </label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="firstName"
                  type="text"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                />
              )}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div className="w-full max-w-2xl">
            <label htmlFor="lastName" className="block text-base font-medium text-[#5B697E] mb-2">
              Last Name
            </label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="lastName"
                  type="text"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                />
              )}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex flex-col gap-3 mb-12">
        <h3 className="text-xl text-[#0F172BE5] font-semibold">Contact Information</h3>
        <p className="text-[#0F172B66] text-base font-medium">
          We'll send your confirmation to this email address.
        </p>
        <div className="w-full max-w-2xl">
          <label htmlFor="email" className="block text-base font-medium text-[#5B697E] mb-2">
            Email Address
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="email"
                type="email"
                className="block border mb-4 border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
              />
            )}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Nationality (read-only) */}
        <div className="w-full max-w-2xl">
          <label htmlFor="nationality" className="block text-base font-medium text-[#5B697E] mb-2">
            Nationality
          </label>
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="nationality"
                type="text"
                readOnly
                className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none bg-gray-100 cursor-not-allowed"
              />
            )}
          />
          {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>}
        </div>

        {/* Current Country (user-selectable dropdown) */}
        <div className="w-full max-w-2xl">
          <label htmlFor="currentCountry" className="block text-base font-medium text-[#5B697E] mb-2">
            Current Country
          </label>
          <Controller
            name="currentCountry"
            control={control}
            render={({ field }) => (
              <div className="relative" ref={currentCountryRef}>
                <button
                  type="button"
                  onClick={() => setIsCurrentCountryOpen(!isCurrentCountryOpen)}
                  className="flex items-center justify-between w-full px-3 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-[#163C8C]"
                >
                  {field.value ? (
                    <div className="flex items-center gap-2">
                      <Icon icon={`flagpack:${field.value.toLowerCase()}`} width="24" height="18" />
                      <span>
                        {countryList.find(c => c.iso === field.value)?.name || field.value}
                      </span>
                    </div>
                  ) : (
                    "Select Country"
                  )}
                  <Icon
                    icon="material-symbols:keyboard-arrow-up"
                    width="24"
                    height="24"
                    className={`h-5 w-5 text-gray-500 transition-transform ${isCurrentCountryOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isCurrentCountryOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow max-h-60 overflow-y-auto">
                    {countryList.map((country) => (
                      <div
                        key={country.iso}
                        onClick={() => {
                          field.onChange(country.iso);
                          setIsCurrentCountryOpen(false);
                        }}
                        className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <Icon icon={`flagpack:${country.iso.toLowerCase()}`} width="24" height="18" />
                        <span>{country.name}</span>
                        <span className="text-gray-500 text-sm">+{country.phonecode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
          {errors.currentCountry && <p className="text-red-500 text-sm mt-1">{errors.currentCountry.message}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:max-w-42">
            <label htmlFor="phoneCountryCode" className="block text-base font-medium text-[#5B697E] mb-2">
              Country Code
            </label>
            <Controller
              name="phoneCountryCode"
              control={control}
              render={({ field }) => (
                <div className="relative" ref={phoneCodeRef}>
                  <button
                    type="button"
                    onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                    className="flex items-center justify-between w-full px-3 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-[#163C8C]"
                  >
                    {field.value ? (
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={`flagpack:${countryList.find(c => c.phonecode === field.value.replace('+', ''))?.iso.toLowerCase() || 'us'}`}
                          width="24"
                          height="18"
                        />
                        <span>{field.value}</span>
                      </div>
                    ) : (
                      "Select Code"
                    )}
                    <Icon
                      icon="material-symbols:keyboard-arrow-up"
                      width="24"
                      height="24"
                      className={`h-5 w-5 text-gray-500 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isPhoneCodeOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow max-h-60 overflow-y-auto">
                      {countryList.map((country) => (
                        <div
                          key={country.phonecode}
                          onClick={() => {
                            field.onChange(`+${country.phonecode}`);
                            setIsPhoneCodeOpen(false);
                          }}
                          className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
                        >
                          <Icon icon={`flagpack:${country.iso.toLowerCase()}`} width="24" height="18" />
                          <span>+{country.phonecode}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
            {errors.phoneCountryCode && <p className="text-red-500 text-sm mt-1">{errors.phoneCountryCode.message}</p>}
          </div>
          <div className="w-full sm:max-w-122">
            <label htmlFor="phoneNumber" className="block text-base font-medium text-[#5B697E] mb-2">
              Phone Number
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="phoneNumber"
                  type="tel"
                  className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                />
              )}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>
        </div>
      </div>

      {/* Travelers Information */}
      <div className="flex flex-col gap-3 mb-12">
        <h3 className="text-xl text-[#0F172BE5] font-semibold">Travelers Information</h3>
        <p className="text-[#0F172B66] text-base font-medium mb-4">
          Important details to complete your booking
        </p>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 mb-3">
            <div className="flex justify-between items-center">
              <h4 className="text-lg text-[#0F172BE5] font-medium">
                {index < adults ? `Adult Traveller ${index + 1}` : `Child Traveller ${index - adults + 1}`}
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1.5fr] gap-4">
              <div className="w-full">
                <label htmlFor={`travellers.${index}.title`} className="block text-base font-medium text-[#5B697E] mb-2">
                  Title
                </label>
                <Controller
                  name={`travellers.${index}.title`}
                  control={control}
                  render={({ field }) => (
                    <div className="relative" ref={(el) => {
                      titleRefs.current[index] = el;
                    }}>
                      <button
                        type="button"
                        onClick={() => setIsTitleOpen(isTitleOpen === index ? null : index)}
                        className="flex items-center justify-between w-full px-3 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-[#163C8C]"
                      >
                        {field.value || "Select Title"}
                        <Icon
                          icon="material-symbols:keyboard-arrow-up"
                          width="24"
                          height="24"
                          className={`h-5 w-5 text-gray-500 transition-transform ${isTitleOpen === index ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isTitleOpen === index && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow">
                          {titles.map((title) => (
                            <div
                              key={title}
                              onClick={() => {
                                field.onChange(title);
                                setIsTitleOpen(null);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.travellers?.[index]?.title && <p className="text-red-500 text-sm mt-1">{errors.travellers[index].title?.message}</p>}
              </div>
              <div className="w-full">
                <label htmlFor={`travellers.${index}.firstName`} className="block text-base font-medium text-[#5B697E] mb-2">
                  First Name
                </label>
                <Controller
                  name={`travellers.${index}.firstName`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id={`travellers.${index}.firstName`}
                      type="text"
                      className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                    />
                  )}
                />
                {errors.travellers?.[index]?.firstName && <p className="text-red-500 text-sm mt-1">{errors.travellers[index].firstName?.message}</p>}
              </div>
              <div className="w-full">
                <label htmlFor={`travellers.${index}.lastName`} className="block text-base font-medium text-[#5B697E] mb-2">
                  Last Name
                </label>
                <Controller
                  name={`travellers.${index}.lastName`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id={`travellers.${index}.lastName`}
                      type="text"
                      className="block border border-gray-300 rounded-xl px-3 py-4 text-base w-full outline-none focus:border-[#163C8C] focus:ring-1 focus:ring-[#163C8C]"
                    />
                  )}
                />
                {errors.travellers?.[index]?.lastName && <p className="text-red-500 text-sm mt-1">{errors.travellers[index].lastName?.message}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="flex flex-col gap-3 mb-2">
        <h3 className="text-xl text-[#0F172BE5] font-semibold">Payment Method</h3>
        <p className="text-[#0F172B66] text-base font-medium">
          Safe, secure transactions. Your personal information is protected.
        </p>

    <div className="w-full">
  <Controller
    name="paymentMethod"
    control={control}
    render={({ field }) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activePayments.length > 0 ? (
          activePayments.map((payment: any, index: number) => (
            <div
              key={index}
              onClick={() => field.onChange(payment.name)}
              className={`relative border rounded-xl p-4 cursor-pointer transition-all w-full ${
                field.value === payment.name
                  ? 'border-[#163C8C] bg-[#163C8C]/5'
                  : 'border-gray-300 hover:border-[#163C8C]/50'
              }`}
            >
              {/* Checkmark indicator (top-right corner) */}
              {field.value === payment.name && (
                <div className="absolute top-4 right-2 w-6 h-6 rounded-full bg-[#163C8C] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Payment content (left-aligned) */}
              <div className="flex items-center gap-3">
                {payment.icon ? (
                  <img
                    src={payment.icon}
                    alt={payment.name}
                    className="w-10 h-6 object-contain flex-shrink-0"
                  />
                ) : (
                    <Icon icon="gg:credit-card" width="24" height="24" />
//                  <div className="w-10 h-6 bg-gradient-to-r from-blue-800 to-[#0f2d6b] rounded flex items-center justify-center flex-shrink-0">
//   <span className="text-xs font-medium text-white">
//     {payment.name.substring(0, 2).toUpperCase()}
//   </span>
// </div>
                )}
                <span className="text-base font-medium text-[#0F172B] truncate">
                  {payment.label}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500 py-4">
            No payment methods available
          </div>
        )}
      </div>
    )}
  />
</div>
      </div>

      {/* Cancellation Policy */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl text-[#0F172BE5] font-semibold">Cancellation Policy</h3>
        <div className="flex gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 10.5C1 6.729 1 4.843 2.172 3.672C3.344 2.501 5.229 2.5 9 2.5H13C16.771 2.5 18.657 2.5 19.828 3.672C20.999 4.844 21 6.729 21 10.5V12.5C21 16.271 21 18.157 19.828 19.328C18.656 20.499 16.771 20.5 13 20.5H9C5.229 20.5 3.343 20.5 2.172 19.328C1.001 18.156 1 16.271 1 12.5V10.5Z" stroke="#EB001B" strokeWidth="1.5"/>
            <path d="M6 2.5V1M16 2.5V1M1.5 7.5H20.5" stroke="#EB001B" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 15C6.13261 15 6.25975 15.0527 6.35352 15.1465C6.44728 15.2403 6.5 15.3674 6.5 15.5C6.5 15.6326 6.44728 15.7597 6.35352 15.8535C6.25975 15.9473 6.13261 16 6 16C5.86739 16 5.74025 15.9473 5.64648 15.8535C5.55272 15.7597 5.5 15.6326 5.5 15.5C5.5 15.3674 5.55272 15.2403 5.64648 15.1465C5.74025 15.0527 5.86739 15 6 15ZM11 15C11.1326 15 11.2597 15.0527 11.3535 15.1465C11.4473 15.2403 11.5 15.3674 11.5 15.5C11.5 15.6326 11.4473 15.7597 11.3535 15.8535C11.2597 15.9473 11.1326 16 11 16C10.8674 16 10.7403 15.9473 10.6465 15.8535C10.5527 15.7597 10.5 15.6326 10.5 15.5C10.5 15.3674 10.5527 15.2403 10.6465 15.1465C10.7403 15.0527 10.8674 15 11 15ZM16 15C16.1326 15 16.2597 15.0527 16.3535 15.1465C16.4473 15.2403 16.5 15.3674 16.5 15.5C16.5 15.6326 16.4473 15.7597 16.3535 15.8535C16.2597 15.9473 16.1326 16 16 16C15.8674 16 15.7403 15.9473 15.6465 15.8535C15.5527 15.7597 15.5 15.6326 15.5 15.5C15.5 15.3674 15.5527 15.2403 15.6465 15.1465C15.7403 15.0527 15.8674 15 16 15ZM6 11C6.13261 11 6.25975 11.0527 6.35352 11.1465C6.44728 11.2403 6.5 11.3674 6.5 11.5C6.5 11.6326 6.44728 11.7597 6.35352 11.8535C6.25975 11.9473 6.13261 12 6 12C5.86739 12 5.74025 11.9473 5.64648 11.8535C5.55272 11.7597 5.5 11.6326 5.5 11.5C5.5 11.3674 5.55272 11.2403 5.64648 11.1465C5.74025 11.0527 5.86739 11 6 11ZM11 11C11.1326 11 11.2597 11.0527 11.3535 11.1465C11.4473 11.2403 11.5 11.3674 11.5 11.5C11.5 11.6326 11.4473 11.7597 11.3535 11.8535C11.2597 11.9473 11.1326 12 11 12C10.8674 12 10.7403 11.9473 10.6465 11.8535C10.5527 11.7597 10.5 11.6326 10.5 11.5C10.5 11.3674 10.5527 11.2403 10.6465 11.1465C10.7403 11.0527 10.8674 11 11 11ZM16 11C16.1326 11 16.2597 11.0527 16.3535 11.1465C16.4473 11.2403 16.5 11.3674 16.5 11.5C16.5 11.6326 16.4473 11.7597 16.3535 11.8535C16.2597 11.9473 16.1326 12 16 12C15.8674 12 15.7403 11.9473 15.6465 11.8535C15.5527 11.7597 15.5 11.6326 15.5 11.5C15.5 11.3674 15.5527 11.2403 15.6465 11.1465C15.7403 11.0527 15.8674 11 16 11Z" fill="#EB001B" stroke="#EB001B"/>
          </svg>
          <h3 className="font-medium text-lg text-[#EB001B]">Cancel up to Sat 15 Nov 2025</h3>
        </div>
        <p className="text-[#0F172B66] text-base font-medium">
          The full cost of the booking will be refunded. No cancellation charges apply.
        </p>
        <div className="flex gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.92871 3.92896L18.0697 18.071" stroke="#EB001B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#EB001B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="font-medium text-lg text-[#EB001B]">Cancel on or after Sun 16 Nov 2025</h3>
        </div>
        <p className="text-[#0F172B66] text-base font-medium">
          No refund will be given.
        </p>
        <Controller
          name="acceptPolicy"
          control={control}
          render={({ field }) => (
            <label className="flex gap-2 items-start">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-5 h-5 rounded border border-[#0F172B66] mt-0.5 focus:ring-[#163C8C] focus:border-[#163C8C]"
              />
              <span className="text-[#0F172B66] text-base font-medium">
                I accept the cancellation policy for this booking and the{" "}
                <span className="text-[#163C8C] underline cursor-pointer hover:text-[#0f2d6b]">
                  Terms & Conditions
                </span>
              </span>
            </label>
          )}
        />
        {errors.acceptPolicy && <p className="text-red-500 text-sm mt-1">{errors.acceptPolicy.message}</p>}
      </div>

      <button
        type="submit"
        className="cursor-pointer w-full bg-[#163C8C] text-lg text-white py-3 font-medium rounded-lg mt-5 hover:bg-[#0f2d6b] transition-colors focus:ring-2 focus:ring-[#163C8C] focus:ring-offset-2"
      >
        Confirm & Book
      </button>
    </form>
  );
}