"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HotelsListing } from "@components/themes/default";
import { hotel_search_multi } from "@src/actions";
import useHotelSearch from "@hooks/useHotelSearch";
import { setHotels } from "@lib/redux/base";
import { useDispatch } from "react-redux";

interface Props {
  slug: string[];
}

// ✅ Remove "async" — this is a regular function component
const HotelsListingMain = ({ slug }: Props) => {
  const city = slug[0]?.replace(/-/g, " ") || "";
  const dispatch = useDispatch();
  const { hotelModuleNames } = useHotelSearch();

  const isSlugValid = slug.length === 7 && slug.every(Boolean);

  const { data, isLoading, error } = useQuery({
    queryKey: ['hotels', ...slug],
    queryFn: async () => {
      if (!hotelModuleNames?.length || !isSlugValid) return [];

      const result = await hotel_search_multi(
        {
          destination: city,
          checkin: slug[1],
          checkout: slug[2],
          rooms: Number(slug[3]),
          adults: Number(slug[4]),
          children: Number(slug[5]),
          nationality: slug[6],
          page: 1,
          price_from: "0",
          price_to: "5000",
          rating: "",
        },
        hotelModuleNames
      );

      return result.success;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isSlugValid, // ⚠️ important: don't fetch if slug is incomplete
  });
  // console.log('search data',data)

  useEffect(() => {
    dispatch(setHotels([]))
    if (Array.isArray(data)) {
      dispatch(setHotels(data));
    }
  }, [data, dispatch]);

  if (error) return <div>Error loading hotels</div>;

  return <HotelsListing isLoading={isLoading} />;
};

export default HotelsListingMain;