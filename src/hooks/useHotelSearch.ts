"use client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHotelsLocations, hotel_search, hotel_search_multi } from "@src/actions";
import { z } from "zod";
import { useAppSelector } from "@lib/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { setHotels } from "@lib/redux/base";
import { useDispatch } from "react-redux";

// Schema and interfaces remain the same...
const hotelSearchSchema = z
  .object({
    destination: z.string().min(2, "Destination must be at least 2 characters"),
    checkin: z.string().min(1, "Check-in date is required"),
    checkout: z.string().min(1, "Check-out date is required"),
    rooms: z.number().min(1).max(8),
    adults: z.number().min(1).max(16),
    children: z.number().min(0).max(10),
    nationality: z.string().min(1, "Nationality is required"),
  })
  .refine(
    (data) => {
      if (!data.checkin || !data.checkout) return true; // let min(1) handle empty
      return new Date(data.checkout) > new Date(data.checkin);
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["checkout"], // error will appear on checkout field
    }
  );

interface HotelForm {
  destination: string;
  checkin: string;
  checkout: string;
  rooms: number;
  adults: number;
  children: number;
  nationality: string;
  latitude?: string;
  longitude?: string;
}

interface LocationObj {
  id: string;
  city: string;
  country: string;
  country_code: string;
  latitude?: string;
  longitude?: string;
  status?: string;
}

interface Module {
  id: string;
  name: string;
  active: string;
  type: string;
  status: string;
  c1: string | null;
  c2: string | null;
  c3: string | null;
  c4: string | null;
  c5: string | null;
  c6: string | null;
  dev_mode: string;
  payment_mode: string;
  currency: string;
  module_color: string;
  order: string;
  prn_type: string;
}

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const useHotelSearch = () => {
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const checkin = formatDate(today);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const checkout = formatDate(tomorrow);

  const [form, setForm] = useState<HotelForm>({
    destination: "",
    checkin: checkin,
    checkout: checkout,
    rooms: 1,
    adults: 2,
    children: 0,
    nationality: "PK",
  });
const hotelSearch_path = usePathname();
// console.log("hotelSearch_path", hotelSearch_path);
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [hotelLocations, setHotelLocations] = useState<LocationObj[]>([]);
  const [locationError, setLocationError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isloadingMore, setIsLoadingMore] = useState(false);
  // FIX 1: Add separate loading states
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);

  // Add ref to prevent multiple simultaneous calls
  const isProcessingRef = useRef(false);
  // Add ref to track if initial load has run
  const hasInitialLoadRun = useRef(false);

  const { modules } = useAppSelector((state) => state.appData?.data);
  const router = useRouter();
  const allHotelsData = useAppSelector((state) => state.root.hotels);
  const dispatch = useDispatch();
// console.log('all hotel data',allHotelsData)
 const hotelModuleNames = useMemo(() => {
  return (
    modules
      ?.filter((module: Module) => module.type === "hotels")
      .map((module: Module) => module.name) || []
  );
}, [modules]);

  const debouncedDestination = useDebounce(form.destination, 450);

  // Location search query
  const {
    data: locationData,
    isLoading: locationLoading,
    error: locationsQueryError,
  } = useQuery({
    queryKey: ["hotel-locations", debouncedDestination],
    queryFn: () => fetchHotelsLocations(debouncedDestination.trim()),
    enabled: debouncedDestination.trim()?.length >= 3,
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (locationData?.status && Array.isArray(locationData?.data) && locationData?.data?.length > 0) {
      setHotelLocations(locationData.data);
      setLocationError("");
    } else if (locationData?.error || locationsQueryError) {
      setHotelLocations([]);
      setLocationError("Try different search");
    } else if (debouncedDestination.trim()?.length >= 3) {
      setHotelLocations([]);
      setLocationError("No Hotel Destination Found");
    } else {
      setHotelLocations([]);
      setLocationError("");
    }
  }, [locationData, locationsQueryError, debouncedDestination]);

  // Event handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "destination") {
      setShowDestinationDropdown(true);
      setActiveIndex(-1);
      setLocationError("");
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleSelectLocation = useCallback((loc: LocationObj) => {
    setForm((prev) => ({
      ...prev,
      destination: loc.city,
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
    setShowDestinationDropdown(false);
    setHotelLocations([]);
    setActiveIndex(-1);
  }, []);

  const handleDestinationKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDestinationDropdown) return;
    const maxIndex = hotelLocations?.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < maxIndex ? i + 1 : maxIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && hotelLocations[activeIndex]) {
        handleSelectLocation(hotelLocations[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDestinationDropdown(false);
    }
  }, [showDestinationDropdown, hotelLocations, activeIndex, handleSelectLocation]);

  // Fixed deduplication function
  const removeDuplicates = useCallback((hotels: any[]) => {
    if (!Array.isArray(hotels) || hotels?.length === 0) {
      return [];
    }

    const seen = new Set();
    return hotels.filter(hotel => {
      if (!hotel || !hotel.hotel_id) {
        return false;
      }

      if (seen.has(hotel.hotel_id)) {
        return false;
      }

      seen.add(hotel.hotel_id);
      return true;
    });
  }, []);

  // Fixed mutation - NO onSuccess to prevent data mixing
  const hotelSearchMutation = useMutation({
    mutationFn: hotel_search,
    // Remove onSuccess to prevent data mixing
  });

  // Fixed batch API call function
const callAllModulesAPI = useCallback(
  async (searchParams: any, pageNumber: number = 1) => {
    if (isProcessingRef.current) {
      return { success: false, error: "Already processing" };
    }
    if (!hotelModuleNames || hotelModuleNames.length === 0) {
      return { success: false, error: "No modules available" };
    }
    try {
      isProcessingRef.current = true;

      const promises = hotelModuleNames.map(async (mod: string) => {
        try {
          const result = await hotel_search({
            ...searchParams,
            page: pageNumber,
            modules: mod,
          });
          return { mod, result };
        } catch (err) {
          // console.error(`Module ${mod} failed:`, err);
          return { mod, result: null };
        }
      });

      const results: any[] = [];
      for await (const p of promises) {
        if (p?.result?.response?.length) {
          results.push(...p.result.response);


          // ✅ Emit partial data so UI can render incrementally
          // e.g. setHotels((prev) => [...prev, ...p.result.response]);
        }
      }

      return { success: true, data: results };
    } catch (err) {
      // console.error("Batch API call failed:", err);
      return { success: false, error: (err as Error).message };
    } finally {
      isProcessingRef.current = false;
    }
  },
  [hotelModuleNames]
);


  // FIX 2: Fixed initial load effect with proper loading state
  useEffect(() => {
    if (hasInitialLoadRun.current) return;

    const savedForm = localStorage.getItem("hotelSearchForm");
    if (!savedForm ) return;
    if (!hotelSearch_path?.includes("/hotel_search")) return;
// console.log("Initial load with saved form");
    hasInitialLoadRun.current = true;
    setIsInitialLoading(true); // Set initial loading state
    const parsedForm: HotelForm = JSON.parse(savedForm);

    // Clear existing data first
    dispatch(setHotels([]));
    queryClient.setQueryData(["hotel-search"], []);

    callAllModulesAPI({
      ...parsedForm,
      price_from: "",
      price_to: "",
      rating: ""
    }, 1).then((result) => {
      if (result.success && result.data) {
        // Update both cache and Redux with final data
        queryClient.setQueryData(["hotel-search"], result.data);
        dispatch(setHotels(result.data));
        setPage(1);
      }
    }).finally(() => {
      setIsInitialLoading(false); // Clear initial loading state
    });
  }, [callAllModulesAPI, dispatch, queryClient]);
  // FIX 3: Fixed handle submit with proper error handling
 const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();
    // if ( errors) {
    //   console.log('Search already in progress');
    //   return { success: false, error: "Search already in progress" };
    // }
    // Validate first
    try {

      hotelSearchSchema.parse(form);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msgMap: Record<string, string> = {};
        err.errors.forEach((zErr) => {
          msgMap[zErr.path[0] as string] = zErr.message;
        });
        setErrors(msgMap);
      }
      return { success: false, error: "Form validation failed" };
    }

    // ✅ Start loading AFTER validation


    try {
      // Clear existing data
          setIsSearching(true);
      dispatch(setHotels([]));
      queryClient.setQueryData(["hotel-search"], []);
      localStorage.setItem("hotelSearchForm", JSON.stringify(form));

    // console.log('nationality ', form )
      const result = await callAllModulesAPI({
        ...form,
        price_from: "",
        price_to: "",
        rating: ""
      }, 1);

      if (result.success && result.data) {
        dispatch(setHotels(result.data));
        setPage(1);
        // console.log('Search completed:', result.data.length, 'hotels');

        // ✅ NOW navigate AFTER data is ready
        router.push("/hotel_search");

        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || "Search failed");
      }
    } catch (err) {
      console.error('Search error:', err);
      return { success: false, error: "Search failed" };
    } finally {
      // ✅ ALWAYS turn off loading at the end
      setIsSearching(false);
    }
  },
  [form, callAllModulesAPI, queryClient, router, dispatch, isSearching]
);

  // Fixed load more data
//   const loadMoreData = useCallback(
//     async (e?: React.SyntheticEvent) => {
//       e?.preventDefault();
//     // console.log('loadmore hittting')
//       if (isloadingMore || isProcessingRef.current) return;

//       setIsLoadingMore(true);

//       try {
//         const savedForm = localStorage.getItem("hotelSearchForm");
//         if (!savedForm) return;

//         const parsedForm: HotelForm = JSON.parse(savedForm);
//         const nextPage = page + 1;


//         const result = await callAllModulesAPI({
//           ...parsedForm,
//           price_from: "",
//           price_to: "",
//           rating: ""
//         }, nextPage);
// console.log('load more data', result)
//         if (result.success && result.data && result.data.length > 0) {
//           // Get existing IDs

//       setIsLoadingMore(false);
//           const existingIds = new Set(allHotelsData.map(h => h.hotel_id));

//           // Filter only truly new hotels
//           const newHotels = result.data.filter(hotel => {
//             return hotel && hotel.hotel_id && !existingIds.has(hotel.hotel_id);
//           });

//           if (newHotels.length > 0) {
//             const updatedHotels = [...allHotelsData, ...newHotels];
//             dispatch(setHotels(updatedHotels));
//             queryClient.setQueryData(["hotel-search"], updatedHotels);
//             setPage(nextPage);
//             return { success: true, data: newHotels };
//           } else {
//             return { success: false, error: "No new data" };
//           }
//         } else {
//           return { success: false, error: "No more data" };
//         }
//       } catch (err) {
//         console.error('Load more error:', err);
//         return { success: false, error: "Load more failed" };
//       } finally {
//         setIsLoadingMore(false);
//       }
//     },
//     [page, allHotelsData, callAllModulesAPI, dispatch, queryClient, isloadingMore]
//   );
// multi module aproad in server
const loadMoreData = useCallback(
  async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (isloadingMore || isProcessingRef.current) return;

    setIsLoadingMore(true);

    try {
      const savedForm = localStorage.getItem("hotelSearchForm");
      if (!savedForm) return;

      const parsedForm: HotelForm = JSON.parse(savedForm);
      const nextPage = page + 1;

      // ✅ Use hotel_search_multi for pagination
      const result = await hotel_search_multi(
        {
          destination: parsedForm.destination,
          checkin: parsedForm.checkin,
          checkout: parsedForm.checkout,
          rooms: parsedForm.rooms,
          adults: parsedForm.adults,
          children: parsedForm.children,
          nationality: parsedForm.nationality,
          page: nextPage, //  next page
          price_from: "0", // or keep current filters if needed
          price_to: "5000",
          rating: "",
        },
        hotelModuleNames
      );
      if (result.success.length > 0) {
        // const existingIds = new Set(allHotelsData.map((h) => h.hotel_id));
        // const newHotels = result.success.filter(
        //   (hotel) => hotel?.hotel_id && !existingIds.has(hotel.hotel_id)
        // );

        if (result.success.length > 0) {
          const updatedHotels = [...allHotelsData, ...result.success];
          dispatch(setHotels(updatedHotels));
          queryClient.setQueryData(["hotel-search"], updatedHotels);
          setPage(nextPage);
          return { success: true, data: result.success };
        } else {
          return { success: false, error: "No new hotels found" };
        }
      } else {
        return { success: false, error: "No more data" };
      }
    } catch (err) {
      console.error("Load more error:", err);
      return { success: false, error: "Load more failed" };
    } finally {
      setIsLoadingMore(false);
    }
  },
  [page, allHotelsData, hotelModuleNames, dispatch, queryClient, isloadingMore]
);
  // Scroll effect for load more
  useEffect(() => {
    const handleScroll = () => {
      if (isloadingMore || !allHotelsData?.length || isProcessingRef.current) return;

      if (listRef.current) {
        const rect = listRef.current.getBoundingClientRect();
        if (rect.bottom <= window.innerHeight) {
          loadMoreData();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreData, isloadingMore, allHotelsData?.length]);
// DETAISL BOOK NOW HANDLER
const detailsBookNowHandler = async (hotel: any) => {
  // if (!hotel?.hotel_id || !hotel?.name || !hotel?.supplier_name) return;

  // 👉 store full hotel object in localStorage
  localStorage.setItem("currentHotel", JSON.stringify(hotel));
  const selectedNationality=localStorage.getItem('hotelSearchForm')
  // 👉 generate slug
  const slugName = hotel.name.toLowerCase().replace(/\s+/g, "-");
  let nationality;
if (selectedNationality) {
  const parsedData = JSON.parse(selectedNationality); // now it's an object

   nationality = parsedData.nationality; // safely access nationality
  // console.log("Nationality:", nationality);
}
  // 👉 construct URL
  const url = `/hotelDetails/${hotel.hotel_id}/${slugName}/${form.checkin}/${form.checkout}/${form.rooms}/${form.adults}/${form.children}/${nationality}/${hotel.supplier_name}`;

  // 👉 navigate
  router.push(url);

  // console.log("Book Now clicked for hotel ID:", hotel.hotel_id);
};

  // Other utility functions
  const updateForm = useCallback((updates: Partial<HotelForm>) => {
    setForm((prev) => ({ ...prev, ...updates }));

    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        if (newErrors[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });
  }, []);
  // HANDLE BOOK NOW TO FOR DETAILS PAGE


  const resetForm = useCallback(() => {
    setForm({
      destination: "",
      checkin: checkin,
      checkout: checkout,
      rooms: 1,
      adults: 2,
      children: 0,
      nationality: "PK",
    });
    setErrors({});
    setShowDestinationDropdown(false);
    setShowGuestsDropdown(false);
    setHotelLocations([]);
    setActiveIndex(-1);
    dispatch(setHotels([]));
    queryClient.setQueryData(["hotel-search"], []);
    setPage(1);
    hasInitialLoadRun.current = false;
    // Reset loading states
    setIsSearching(false);
    setIsInitialLoading(false);
    setIsLoadingMore(false);
  }, []);

  const validateForm = useCallback(() => {
    try {
      hotelSearchSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          errorMap[err.path[0] as string] = err.message;
        });
        setErrors(errorMap);
      }
      return false;
    }
  }, [form]);

  const hotels_Data = useQueryClient().getQueryData<any[]>(['hotel-search']);
  const totalGuests = form.adults + form.children;
  const isFormValid = Object.keys(errors)?.length === 0;
  const hasLocationResults = hotelLocations?.length > 0;
  const isPending = hotelSearchMutation.isPending;

  return {
    // Form state
    form,
    setForm,
    updateForm,
    resetForm,
    errors,
    setErrors,
    isFormValid,
    totalGuests,
    validateForm,

    // Location search
    hotelLocations,
    locationLoading,
    locationError,
    hasLocationResults,
    showDestinationDropdown,
    setShowDestinationDropdown,
    activeIndex,
    setActiveIndex,
    removeDuplicates,

    // Guests dropdown
    showGuestsDropdown,
    setShowGuestsDropdown,

    // Search state - FIX 6: Return proper loading states
    hotelSearchMutation,
    isSearching, // For submit button loading
    isInitialLoading, // For page reload loading
    setIsInitialLoading,
    isPending,
    setIsLoadingMore,
    isloadingMore, // For load more button
    allHotelsData,
    hotels_Data,
    searchError: hotelSearchMutation.error,
    listRef,
    hotelModuleNames,
    setIsSearching,
    callAllModulesAPI, // Export for use in filters

    // Event handlers
    handleChange,
    handleSelectLocation,
    handleDestinationKeyDown,
    handleSubmit,
    loadMoreData,
    detailsBookNowHandler,
    // Schema for external validation
    hotelSearchSchema,
  };
};

export default useHotelSearch;