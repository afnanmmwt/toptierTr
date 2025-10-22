import { useState, useMemo, useCallback, useEffect } from "react";
import useHotelSearch from "./useHotelSearch";
import { setHotels } from "@lib/redux/base";
import { useDispatch } from "react-redux";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { hotel_search_multi } from "@src/actions";
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
}

interface FilterState {
  priceRange: [number, number];
  selectedStars: number[];
  selectedRating: number;
  searchQuery: string;
  selectedAmenities: string[];
  sortBy: 'price_low' | 'price_high' | 'rating' | 'name';
}

interface UseHotelFilterProps {
  hotelsData: HotelData[];
  isLoading?: boolean;
  // formData?: any;
  // setFormData?: (data: any) => void;
}

const useHotelFilter = ({ hotelsData}: UseHotelFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    selectedStars: [],
    selectedRating:1,
    searchQuery: '',
    selectedAmenities: [],
    sortBy: null as any, // default sort
  });
const {hotelSearchMutation,form,hotelModuleNames,removeDuplicates,setIsSearching,isSearching,setIsInitialLoading,handleSubmit,callAllModulesAPI}=useHotelSearch()
    const dispatch = useDispatch();
const queryClient = useQueryClient();
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  // Calculate price range from actual data
// ✅ static price range
const priceRange = useMemo(() => {
  return { min: 0, max: 5000 };
}, []);

// ✅ initialize filters once when component mounts
useEffect(() => {
  setFilters(prev => ({
    ...prev,
    priceRange: [0, 5000],
  }));
}, []);


  // Get unique amenities from data
  const availableAmenities = useMemo(() => {
    if (!hotelsData) return [];

    const amenitiesSet = new Set<string>();
    hotelsData.forEach(hotel => {
      if (hotel.amenities && Array.isArray(hotel.amenities)) {
        hotel.amenities.forEach(amenity => amenitiesSet.add(amenity));
      }
    });

    return Array.from(amenitiesSet);
  }, [hotelsData]);

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    if (!hotelsData || hotelsData?.length === 0) return [];

     const filtered = hotelsData.filter(hotel => {
      // Price filter
      const hotelPrice = parseFloat(hotel.actual_price_per_night) || 0;
      if (hotelPrice < filters.priceRange[0] || hotelPrice > filters.priceRange[1]) {
        return false;
      }

      // Stars filter
      if (filters.selectedStars?.length > 0) {
        const hotelStars = parseInt(hotel.stars) || 0;
        if (!filters.selectedStars.includes(hotelStars)) {
          return false;
        }
      }

      // Rating filter
      const hotelRating = parseFloat(hotel.rating) || 0;

      if (hotelRating < filters.selectedRating) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = hotel.name.toLowerCase().includes(query);
        const matchesLocation = hotel.location.toLowerCase().includes(query);
        const matchesAddress = hotel.address?.toLowerCase().includes(query);

        if (!matchesName && !matchesLocation && !matchesAddress) {
          return false;
        }
      }

      // Amenities filter
      if (filters.selectedAmenities?.length > 0) {
        if (!hotel.amenities || !Array.isArray(hotel.amenities)) {
          return false;
        }

        const hasAllAmenities = filters.selectedAmenities.every(amenity =>
          hotel.amenities.includes(amenity)
        );

        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });

    // Sort hotels
    if (filters.sortBy) {
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_low':
        return (parseFloat(a.actual_price) || 0) - (parseFloat(b.actual_price) || 0);
      case 'price_high':
        return (parseFloat(b.actual_price) || 0) - (parseFloat(a.actual_price) || 0);
      case 'rating':
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      case 'name':
        return a.name.localeCompare(b.name || "");
      default:
        return 0;
    }
  });
}

    return filtered;
  }, [hotelsData, filters]);

  // Filter update functions
//  const updatePriceRange = useCallback(
//   async (newRange: [number, number]) => {
//     setFilters(prev => ({ ...prev, priceRange: newRange }));

//     const [minPrice, maxPrice] = newRange;
//     // if (!minPrice && !maxPrice) return;

//     try {
//       setIsFilterLoading(true);
//       dispatch(setHotels([])); //  Clear old data
//    const savedForm = localStorage.getItem("hotelSearchForm");
//       if (!savedForm) return;

//       const parsedForm: any = JSON.parse(savedForm);
//       // ✅ Fetch for each module
//       const results = await Promise.all(
//         hotelModuleNames.map((mod: string) =>
//           hotelSearchMutation
//             .mutateAsync({
//               ...parsedForm,
//               page: 1,
//               modules: mod,
//               price_from: String(minPrice),
//               price_to: String(maxPrice),
//               rating:  "", // ⭐ still safe
//             })
//             .catch(() => null)
//         )
//       );

//       // ✅ Collect valid results
//    const finalData = results
//   .filter((r) => r.status === "fulfilled" && r.value?.status === true) // only successful API responses
//   .flatMap((r: any) => r.value.response || []); // collect all response arrays

//       dispatch(setHotels(finalData));


//     } catch (err) {
//       console.error("Filter fetch failed", err);
//       setIsFilterLoading(false);
//     } finally {
//       setIsFilterLoading(false);
//     }
//   },
//   [hotelModuleNames, form, queryClient, dispatch, filters.selectedRating, removeDuplicates]
// );
const updatePriceRange = useCallback(
  async (newRange: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: newRange }));

    try {
      setIsFilterLoading(true);
      dispatch(setHotels([])); // ✅ Clear old data

      const savedForm = localStorage.getItem("hotelSearchForm");
      if (!savedForm) return;

      const parsedForm = JSON.parse(savedForm);

      // ✅ Use hotel_search_multi instead of manual loop
      const result = await hotel_search_multi(
        {
          destination: parsedForm.destination,
          checkin: parsedForm.checkin,
          checkout: parsedForm.checkout,
          rooms: parsedForm.rooms,
          adults: parsedForm.adults,
          children: parsedForm.children,
          nationality: parsedForm.nationality,
          page: 1,
          price_from: String(newRange[0]),
          price_to: String(newRange[1]),
          rating: "", // keep current rating
        },
        hotelModuleNames
      );

      // ✅ Dispatch merged results
      dispatch(setHotels(result.success));

      // Optional: update React Query cache if used elsewhere
      queryClient.setQueryData(["hotel-search"], result.success);
    } catch (err) {
      console.error("Price filter fetch failed", err);
    } finally {
      setIsFilterLoading(false);
    }
  },
  [hotelModuleNames, filters.selectedRating, dispatch, queryClient]
);
// filter using api
// useEffect(() => {
//   const fetchFilteredHotels = async () => {
//     if (!filters.priceRange || !filters.selectedRating) return;

//     const [minPrice, maxPrice] = filters.priceRange;

//     try {
//       dispatch(setHotels([])); // ✅ Clear old data
//       setIsSearching(true);

//       // ✅ Fetch for each module
//       const results = await Promise.all(
//         hotelModuleNames.map((mod: string) =>
//           hotelSearchMutation
//             .mutateAsync({
//               ...form,
//               page: 1, // Always start from page 1 on filter change
//               modules: mod,
//               price_from: String(minPrice),
//               price_to: String(maxPrice),
//               rating: String(filters.selectedRating),
//             })
//             .catch(() => null)
//         )
//       );

//       // ✅ Filter valid
//       const validResults = results.filter(
//         (res) => res && res.response && res.response?.length > 0
//       );

//       let finalData: any[] = [];
//       if (validResults?.length === 1) {
//         finalData = validResults[0].response;
//       } else if (validResults?.length > 1) {
//         finalData = validResults.flatMap((res) => res.response);
//       }

//       // ✅ DEDUPE before saving!
//       finalData = removeDuplicates(finalData);

//       // ✅ Update cache + Redux
//       queryClient.setQueryData(["hotel-search"], finalData);
//       dispatch(setHotels(finalData));

//       // ✅ Reset page to 1
//       // setPage(1);

//     } catch (err) {
//       console.error("Filter fetch failed", err);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   fetchFilteredHotels();
// }, [filters.priceRange, filters.selectedRating]);

  const toggleStarFilter = useCallback((stars: number) => {
    setFilters(prev => ({
      ...prev,
      selectedStars: prev.selectedStars.includes(stars)
        ? prev.selectedStars.filter(s => s !== stars)
        : [...prev.selectedStars, stars]
    }));
  }, []);

// const updateRatingFilter = useCallback(
//   async (rating: number) => {
//     // console.log("Updating rating filter to:", rating);

//     setFilters((prev) => ({ ...prev, selectedRating: rating }));

//     try {
//       dispatch(setHotels([])); // ✅ Clear old data
//       setIsFilterLoading(true);

//       const savedForm = localStorage.getItem("hotelSearchForm");
//       if (!savedForm) return;

//       const parsedForm: any = JSON.parse(savedForm);

//       // ✅ Fetch for each module
//       const results = await Promise.all(
//         hotelModuleNames.map((mod: string) =>
//           hotelSearchMutation
//             .mutateAsync({
//               ...parsedForm,
//               page: 1,
//               modules: mod,
//               price_from: String(filters.priceRange[0]), // ✅ keep price range
//               price_to: String(filters.priceRange[1]),
//               rating: String(rating), // ✅ apply rating filter
//             })
//             .catch(() => null)
//         )
//       );

//       // ✅ Collect valid results
//       const finalData: any[] = [];
//       results.forEach((res) => {
//         if (res?.response?.length) {
//           finalData.push(...res.response);
//           setIsFilterLoading(false);
//         }
//       });

//       // ✅ Remove duplicates
//       // finalData = removeDuplicates(finalData);


//       // ✅ Update cache + Redux
//       queryClient.setQueryData(["hotel-search"], finalData);
//       dispatch(setHotels(finalData));
//     } catch (err) {
//       console.error("Rating filter fetch failed", err);
//     } finally {
//       setIsFilterLoading(false);
//     }
//   },
//     [
//       hotelModuleNames,
//       queryClient,
//       dispatch,
//       removeDuplicates,
//       filters.priceRange,
//     ]
// );

const updateRatingFilter = useCallback(
  async (rating: number) => {
    setFilters((prev) => ({ ...prev, selectedRating: rating }));
    try {

      dispatch(setHotels([])); // Clear old data
      setIsFilterLoading(true);

      const savedForm = localStorage.getItem("hotelSearchForm");
      if (!savedForm) return;

      const parsedForm = JSON.parse(savedForm);

      // ✅ Use hotel_search_multi instead of manual loop
      const result = await hotel_search_multi(
        {
          destination: parsedForm.destination,
          checkin: parsedForm.checkin,
          checkout: parsedForm.checkout,
          rooms: parsedForm.rooms,
          adults: parsedForm.adults,
          children: parsedForm.children,
          nationality: parsedForm.nationality,
          page: 1,
          price_from: String(filters.priceRange[0]),
          price_to: String(filters.priceRange[1]),
          rating: String(rating),
        },
        hotelModuleNames
      );
console.log('filter range', result)
      // ✅ Sync to Redux
      dispatch(setHotels(result.success));

      // Optional: update React Query cache if you're using it elsewhere
      queryClient.setQueryData(["hotel-search"], result.success);
    } catch (err) {
      console.error("Rating filter fetch failed", err);
    } finally {
      setIsFilterLoading(false);
    }
  },
  [
    hotelModuleNames,
    queryClient,
    dispatch,
    filters.priceRange,
    // removeDuplicates is now handled inside hotel_search_multi if needed
  ]
);

  const updateSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const toggleAmenityFilter = useCallback((amenity: string) => {
    setFilters(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity]
    }));
  }, []);

  const updateSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);
const resetFilters = useCallback(async (e?: any) => {
    try {
      setIsFilterLoading(true);

      // Reset filter state first
      setFilters({
        priceRange: [priceRange.min, priceRange.max],
        selectedStars: [],
        selectedRating: 1,
        searchQuery: '',
        selectedAmenities: [],
        sortBy: 'price_low'
      });
      setSelectedStars(null);

      // Clear existing data
      dispatch(setHotels([]));
      queryClient.setQueryData(["hotel-search"], []);

      // Get saved form data for reset
      const savedForm = localStorage.getItem("hotelSearchForm");
      if (!savedForm) {
        // console.error('No saved form data found');
        return;
      }

      const parsedForm = JSON.parse(savedForm);

      // FIX 3: Use callAllModulesAPI directly instead of handleSubmit
      const result = await callAllModulesAPI({
        ...parsedForm,
        price_from: "", // Reset to no price filter
        price_to: "",
        rating: "" // Reset to no rating filter
      }, 1);

      if (result.success && result.data) {
        // Update both cache and Redux with reset data
        queryClient.setQueryData(["hotel-search"], result.data);
        dispatch(setHotels(result.data));
      } else {
        // console.error('Reset failed:', result.error);
      }

    } catch (error) {
      console.error('Reset filters error:', error);
    } finally {
      setIsFilterLoading(false);
    }
  }, [callAllModulesAPI, dispatch, queryClient, priceRange]);


  const hasActiveFilters = useMemo(() => {
    return (
      filters.selectedStars?.length > 0 ||
      filters.selectedRating > 1 ||
      filters.searchQuery.trim() !== '' ||
      filters.selectedAmenities?.length > 0 ||
      filters.priceRange[0] > priceRange.min ||
      filters.priceRange[1] < priceRange.max
    );
  }, [filters, priceRange]);

  return {
    // Filtered data
    filteredHotels,
    totalResults: filteredHotels?.length,

    // Filter state
    filters,
    hasActiveFilters,

    // Data info
    priceRange,
    availableAmenities,


    // Update functions
    updatePriceRange,
    toggleStarFilter,
    updateRatingFilter,
    updateSearchQuery,
    toggleAmenityFilter,
    updateSortBy,
    resetFilters,
    selectedStars, setSelectedStars,isFilterLoading
  };
};

export default useHotelFilter;