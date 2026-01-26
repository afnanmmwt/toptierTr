"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import useCurrency from "@hooks/useCurrency";
import { useRouter } from "next/navigation";
import getCurrencySymbol from "@src/utils/getCurrencySymbals";
import useDictionary from "@hooks/useDict";
import useLocale from "@hooks/useLocale";
import Spinner from "@components/core/Spinner";
const RoomOption: React.FC<{
  room?: any;
  options?: any;
  getAmenityIcon?: (amenity: string) => string;
  onReserve?: (room?: any, option?: any) => void;
  roomImage: string;
  loading: null | string;
}> = ({ room, options, getAmenityIcon, onReserve, roomImage, loading }) => {
  const { locale } = useLocale();
  const { data: dict } = useDictionary(locale as any);
  const amenitiesList: string[] = React.useMemo(() => {
    const a = room?.amenities;
    if (!a) return [];
    if (Array.isArray(a)) return a.map((x) => String(x).trim()).filter(Boolean);
    if (typeof a === "string") return a.split(",").map((s) => s.trim()).filter(Boolean);
    return [String(a)];
  }, [room?.amenities]);

  const { priceRateConverssion } = useCurrency();
  const router = useRouter();

  const [expandedAmenities, setExpandedAmenities] = React.useState<Record<string | number, boolean>>({});

  const toggleAmenities = (key: string | number) => {
    setExpandedAmenities((s) => ({ ...s, [key]: !s[key] }));
  };


  return (
    <div className="rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black">
        {room?.name || dict?.roomOption?.roomNamePlaceholder || "One Bedroom Apartment"}
      </h2>

      <div className="overflow-x-hidden overflow-y-auto max-h-[60vh] sm:overflow-x-auto sm:max-h-none">
        <div className="hidden sm:grid sm:grid-cols-5 bg-[#1C398E] text-white rounded-t-md">
          <div className={`px-4 py-3 ${locale?.startsWith('ar') ? 'text-right' : 'text-left'}`}>
            {dict?.roomOption?.roomImage || "Room Image"}
          </div>
          <div className={`px-4 py-3 ${locale?.startsWith('ar') ? 'text-right' : 'text-left'}`}>
            {dict?.roomOption?.features || "Features"}
          </div>
          <div className={`px-4 py-3 ${locale?.startsWith('ar') ? 'text-right' : 'text-left'}`}>
            {dict?.roomOption?.travellers || "Travellers"}
          </div>
          <div className={`px-4 py-3 ${locale?.startsWith('ar') ? 'text-right' : 'text-left'}`}>
            {dict?.roomOption?.price || "Price"}
          </div>
          <div className={`px-4 py-3 ${locale?.startsWith('ar') ? 'text-right' : 'text-left'}`}></div>
        </div>

        <div className="flex flex-col divide-y divide-gray-200">
          {(room?.options || options?.list || []).map((opt: any, idx: number) => {
            const merged: string[] = [];
            if (opt?.breakfast === "1") merged.push(dict?.roomOption?.freeBreakfast || "Free breakfast");
            if (opt?.dinner === "1") merged.push(dict?.roomOption?.freeDinner || "Free Dinner");
            if (opt?.cancellation === "1") merged.push(dict?.roomOption?.freeCancellation || "Free cancellation");
            if (opt?.room_booked === true) merged.push(dict?.roomOption?.notBookable || "Not Bookable");
            if (opt?.board) merged.push(opt.board);

            let allAmenities = [...merged];
            allAmenities = allAmenities.filter((a) => a.toLowerCase() !== "breakfast");
            const optionAmenities = Array.from(new Set(allAmenities));

            return (
              <div
                key={opt?.id ?? idx}
                className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:items-center sm:py-3 py-4 bg-gray-50 hover:bg-gray-100 px-2 sm:px-0"
              >
                <div className="px-4">
                  <img
                    src={roomImage}
                    alt={dict?.roomOption?.roomImage || "Room"}
                    className="w-36 h-24 object-cover rounded-md mx-auto sm:mx-0"
                  />
                </div>

                <div className="px-4 text-blue-500  font-bold">
                  {optionAmenities.length > 0 ? (
                    <div className="flex justify-center md:justify-start">
                      <ul className="list-disc list-inside space-y-1">
                        {(
                          expandedAmenities[opt?.id ?? idx]
                            ? optionAmenities
                            : optionAmenities.slice(0, 5)
                        ).map((amenity, aidx) => (
                          <li key={aidx} className="flex items-center  gap-2 text-sm text-[#0F172B] font-[500]">
                            {getAmenityIcon ? (
                              <Icon icon={getAmenityIcon(amenity)} width={16} height={16} />
                            ) : null}
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>

                      {optionAmenities.length > 3 && (
                        <button
                          type="button"
                          onClick={() => toggleAmenities(opt?.id ?? idx)}
                          className="text-xs text-normal ps-6 cursor-pointer text-blue-900 hover:underline mt-2"
                          aria-expanded={!!expandedAmenities[opt?.id ?? idx]}
                        >
                          <span className="font-normal mt-2">
                            {expandedAmenities[opt?.id ?? idx]
                              ? dict?.roomOption?.showLess || "Show less"
                              : dict?.roomOption?.showMore || "Show more"}
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm">{dict?.roomOption?.noFeatures || "N/A"}</span>
                  )}
                </div>

                <div className="px-4 font-medium">
                  <div className="flex items-center mb-1 justify-center sm:justify-start">
                    <svg height="18px" width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <g>
                        <path d="M223.092,102.384c36.408,0,43.7-28.298,43.7-43.732V43.724c0-15.434-7.292-43.724-43.7-43.724 c-36.408,0-43.699,28.29-43.699,43.724v14.928C179.393,74.086,186.684,102.384,223.092,102.384z"></path>
                        <path d="M332.816,204.792l-33.502-54.597c-9.812-16.012-22.516-28.507-40.535-28.507h-27.463h-39.106 c-29.406,0-53.24,25.255-53.24,56.404v162.192h35.992V512h34.834l21.521-156.443L252.836,512h34.834V263.901v-40.857l29.47,34.048 l55.89-38.978v-32.932L332.816,204.792z"></path>
                      </g>
                    </svg>
                    <span>
                      {opt?.adults || options?.adults || "0"} {dict?.roomOption?.adults || "Adults"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <svg fill="#000000" width="15px" height="15px" viewBox="-64 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M120 72c0-39.765 32.235-72 72-72s72 32.235 72 72c0 39.764-32.235 72-72 72s-72-32.236-72-72zm254.627 1.373c-12.496-12.497-32.758-12.497-45.254 0L242.745 160H141.254L54.627 73.373c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255L104 213.254V480c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V368h16v112c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V213.254l94.627-94.627c12.497-12.497 12.497-32.757 0-45.254z"></path>
                    </svg>
                    <span>
                      {opt?.child || options?.child || "0"} {dict?.roomOption?.children || "Children"}
                    </span>
                  </div>
                </div>

                <div className="px-4 font-bold flex items-center justify-center sm:justify-start">
                  {getCurrencySymbol(opt.currency)} {opt.markup_price_per_night}
                </div>

                <div className="px-4 py-2 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-2">
                    <button
                      disabled={loading === opt.id}
                      onClick={() => {
                        if (onReserve) return onReserve(room, opt);
                        const roomId = room?.id ?? room?.room_id ?? "";
                        const optId = opt?.id ?? "";
                        if (roomId) router.push(`/rooms/${roomId}?option=${optId}`);
                      }}
                      className="bg-[#1C398E] hover:bg-gray-800 text-white px-4 py-2 rounded-full cursor-pointer"
                    >
                      {loading === opt.id ? (
                        <div className="flex items-center justify-center gap-2 px-5">
                          <Spinner /> <span></span>
                        </div>
                      ) : (
                        dict?.roomOption?.bookNow || "Book Now"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomOption;