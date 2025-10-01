'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Define types
export interface HotelForm {
  checkin: string;
  checkout: string;
  rooms: number;
  adults: number;
  children: number;
  nationality: string;
  currency: string; // Add this line
}
// Validation schema
export const hotelSearchSchema = z
  .object({
    checkin: z.string().min(1, "Check-in date is required"),
    checkout: z.string().min(1, "Check-out date is required"),
    rooms: z.number().min(1).max(8),
    adults: z.number().min(1).max(16),
    children: z.number().min(0).max(10),
    nationality: z.string().min(1, "Nationality is required"),
  })
  .refine((data) => new Date(data.checkout) > new Date(data.checkin), {
    message: "Check-out date must be after check-in date",
    path: ["checkout"],
  });

interface UseHotelDetailsOptions {
  initialCheckin?: string;
  initialCheckout?: string;
  initialNationality?: string;
  initialCurrency?: string;
  onSearchSuccess?: (formData: HotelForm) => void;
  onSearchError?: (error: string) => void;
  // ✅ NEW: for refetching on same page
  onSearchRefetch?: (formData: HotelForm) => void;
}
export const useHotelDetails = ({
  initialCheckin,
  initialCheckout,
  initialNationality = "PK",
  initialCurrency = "USD",
  onSearchSuccess,
  onSearchError,
  onSearchRefetch,

}: UseHotelDetailsOptions = {}) => {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };
  const today = new Date();
  const defaultCheckin = initialCheckin || formatDate(today);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const defaultCheckout = initialCheckout || formatDate(tomorrow);

  const [form, setForm] = useState<HotelForm>({
    checkin: defaultCheckin,
    checkout: defaultCheckout,
    rooms: 1,
    adults: 2,
    children: 0,
    nationality: initialNationality,
    currency: initialCurrency || "USD",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const guestsDropdownRef = useRef<HTMLDivElement | null>(null);
  const totalGuests = form.adults + form.children;
  const isFormValid = Object.keys(errors).length === 0;
  const [seletedRoom, setSelectedRoom]=useState<any>({})

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;
    setForm(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const updateForm = useCallback((updates: Partial<HotelForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        if (newErrors[field]) delete newErrors[field];
      });
      return newErrors;
    });
  }, []);

  const validateForm = useCallback(() => {
    try {
      hotelSearchSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach(err => {
          errorMap[err.path[0] as string] = err.message;
        });
        setErrors(errorMap);
      }
      return false;
    }
  }, [form]);

  const toggleGuestsDropdown = useCallback(() => {
    setShowGuestsDropdown(prev => !prev);
  }, []);

  const closeGuestsDropdown = useCallback(() => {
    setShowGuestsDropdown(false);
  }, []);

  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return { success: false, errors };

    setIsSearching(true);
    try {
      localStorage.setItem('hotelSearchForm', JSON.stringify(form));
    // Get currentHotel from localStorage
    const currentHotelString = localStorage.getItem("currentHotel");
    if (!currentHotelString) {
      throw new Error("No current hotel found in storage");
    }

    const currentHotel = JSON.parse(currentHotelString);

    // Get nationality from form
    const nationality = form.nationality;

    // Generate slug
    const slugName = currentHotel.name.toLowerCase().replace(/\s+/g, "-");

    // Build SAME URL as detailsBookNowHandler
    const url = `/hotelDetails/${currentHotel.hotel_id}/${slugName}/${form.checkin}/${form.checkout}/${form.rooms}/${form.adults}/${form.children}/${nationality}/${currentHotel.supplier_name}`;
      // NEW: Use refetch mode if provided
      if (onSearchRefetch) {
        onSearchRefetch(form);
        return { success: true, data: form };
      }
      // Fallback to normal search flow
      onSearchSuccess?.(form);
      router.push(url);
      return { success: true, data: form };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setErrors({ submit: 'Search failed. Please try again.' });
      onSearchError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSearching(false);
    }
  }, [form, validateForm, router, errors, onSearchSuccess, onSearchError, onSearchRefetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target as Node)) {
        closeGuestsDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeGuestsDropdown]);
//=============== HANDLE RESERVE HOTEL -=======================
const handleReserveRoom=(room : any)=>{
  console.log('reserverbooking dataa===================',room)
  setSelectedRoom(room)
}
  const resetForm = useCallback(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    setForm({
      checkin: formatDate(today),
      checkout: formatDate(tomorrow),
      rooms: 1,
      adults: 2,
      children: 0,
      nationality: initialNationality,
      currency: initialCurrency || "USD",
    });
    setErrors({});
    closeGuestsDropdown();
  }, [initialNationality, closeGuestsDropdown, formatDate]);

  const setExternalForm = useCallback((newForm: Partial<HotelForm>) => {
    setForm(prev => ({ ...prev, ...newForm }));
  }, []);

  return {
    form,
    errors,
    showGuestsDropdown,
    isSearching,
    totalGuests,
    isFormValid,
    guestsDropdownRef,
    handleChange,
    updateForm,
    toggleGuestsDropdown,
    closeGuestsDropdown,
    onSubmit,
    resetForm,
    setExternalForm,
    validateForm,
    formatDate,
    handleReserveRoom,seletedRoom,
  };
};