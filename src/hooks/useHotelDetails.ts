'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import useHotelSearch from './useHotelSearch';
import { useAppDispatch } from '@lib/redux/store';
import { setSeletecRoom } from '@lib/redux/base';
import { toast } from 'react-toastify';
import { useUser } from './use-user';

export interface HotelForm {
  checkin: string;
  checkout: string;
  rooms: number;
  adults: number;
  children: number;
  nationality: string;
  currency: string;
  children_ages?: number[];
}

export const hotelSearchSchema = z
  .object({
    checkin: z.string().min(1, "Check-in date is required"),
    checkout: z.string().min(1, "Check-out date is required"),
    rooms: z.number().min(1).max(8),
    adults: z.number().min(1).max(16),
    children: z.number().min(0).max(10),
    nationality: z.string().min(1, "Nationality is required"),
    children_ages: z.array(z.number().int().min(0).max(17)).optional(),
  })
  .refine((data) => {
    if (data.children > 0) {
      return (
        data.children_ages &&
        data.children_ages.length === data.children &&
        data.children_ages.every(age => age !== undefined && age !== null)
      );
    }
    return true;
  }, {
    message: "Please select age for each child",
    path: ["children_ages"],
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
  onSearchRefetch?: (formData: HotelForm) => void;
  onSearchStart?: () => void; // ✅ New callback
  onSearchComplete?: () => void; // ✅ New callback
}

export const useHotelDetails = ({
  initialCheckin,
  initialCheckout,
  initialNationality = "US",
  initialCurrency = "USD",
  onSearchSuccess,
  onSearchError,
  onSearchRefetch,
  onSearchStart, // ✅ New
  onSearchComplete, // ✅ New
}: UseHotelDetailsOptions = {}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setSelectedRoom } = useHotelSearch();
  const pathname = usePathname();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const defaultCheckin = initialCheckin || formatDate(today);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const defaultCheckout = initialCheckout || formatDate(tomorrow);

  const storedForm = typeof window !== "undefined"
    ? localStorage.getItem("hotelSearchForm")
    : null;
  const { user } = useUser();

  let initialForm: HotelForm = {
    checkin: defaultCheckin,
    checkout: defaultCheckout,
    rooms: 1,
    adults: 2,
    children: 0,
    children_ages: [],
    nationality: initialNationality || "US",
    currency: initialCurrency || "USD",
  };

  if (storedForm) {
    try {
      const parsed = JSON.parse(storedForm);
      initialForm = {
        ...initialForm,
        ...parsed,
        children_ages: parsed.children_ages || [],
        adults: parsed.adults ?? 2,
        rooms: parsed.rooms ?? 1,
        children: parsed.children ?? 0,
      };
    } catch (error) {
      console.warn("Error parsing hotelSearchForm:", error);
    }
  }

  const [form, setForm] = useState<HotelForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const guestsDropdownRef = useRef<HTMLDivElement | null>(null);
  const totalGuests = form.adults + form.children;
  const isFormValid = Object.keys(errors).length === 0;
  const [roomOptionLoadingId, setRommOptionLoadingId] = useState<null>(null);

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
    if (updates.children !== undefined && updates.children > 12) {
      toast.warning("You've reached the maximum limit of children.");
      return;
    }
    setForm(prev => {
      const newForm = { ...prev, ...updates };

      if (updates.children !== undefined) {
        const newChildren = updates.children;
        const currentAges = prev.children_ages || [];
        if (newChildren > currentAges.length) {
          const newAges = [...currentAges, ...Array(newChildren - currentAges.length).fill(0)];
          newForm.children_ages = newAges;
        } else if (newChildren < currentAges.length) {
          newForm.children_ages = currentAges.slice(0, newChildren);
        }
      }

      return newForm;
    });

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
    // ✅ Call onSearchStart before any async operations
    onSearchStart?.();

    try {
      localStorage.setItem('hotelSearchForm', JSON.stringify(form));

      const currentHotelString = localStorage.getItem("currentHotel");
      if (!currentHotelString) {
        throw new Error("No current hotel found in storage");
      }

      const currentHotel = JSON.parse(currentHotelString);
      const slugName = currentHotel.name.toLowerCase().replace(/\s+/g, "-");

      const childrenAgesParam = form.children_ages?.join(",") || "";
      const url = `/hotelDetails/${currentHotel.hotel_id}/${slugName}/${form.checkin}/${form.checkout}/${form.rooms}/${form.adults}/${form.children}/${form.nationality}${childrenAgesParam ? `/${childrenAgesParam}` : ''}`;

      router.replace(url);

      if (onSearchRefetch) {
        onSearchRefetch(form);
      }

      onSearchSuccess?.(form);

      // ✅ Add small delay to ensure query starts fetching
      setTimeout(() => {
        onSearchComplete?.();
      }, 100);

      return { success: true, data: form };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setErrors({ submit: 'Search failed. Please try again.' });
      onSearchError?.(errorMessage);
      onSearchComplete?.(); // ✅ Also call on error
      return { success: false, error: errorMessage };
    } finally {
      setIsSearching(false);
    }
  }, [form, validateForm, router, errors, onSearchSuccess, onSearchError, onSearchRefetch, onSearchStart, onSearchComplete]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target as Node)) {
        closeGuestsDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeGuestsDropdown]);

  const handleReserveRoom = (room: any, option: any, hotelDetails: any) => {
    const roomData = {
      hotelDetails,
      room,
      option,
    };
    setRommOptionLoadingId(option.id);

    dispatch(setSeletecRoom(roomData));

    if (!user) {
      setTimeout(() => {
        setRommOptionLoadingId(null);
        sessionStorage.setItem('lastRoute', "/bookings");
        router.replace('/auth/login');
      }, 500);
    } else {
      setTimeout(() => {
        setRommOptionLoadingId(null);
        router.push(`/bookings`);
      }, 500);
    }
  };

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
      children_ages: [],
    });
    setErrors({});
    closeGuestsDropdown();
  }, [initialNationality, initialCurrency, closeGuestsDropdown]);

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
    handleReserveRoom,
    roomOptionLoadingId
  };
};