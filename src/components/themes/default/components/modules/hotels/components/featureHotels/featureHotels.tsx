"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@lib/redux/store";
import { addToFavourite } from "@src/actions"; // :point_left: import API
import { useUser } from "@hooks/use-user";
import { toast } from "react-toastify";
import Image from "next/image";
interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  price: string;
  stars: string;
  left_rooms: string;
  img: string;
  amenities?: string[];
  favorite?: number;
}
const FeaturedHotels: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const { featured_hotels } = useAppSelector((state) => state.appData?.data);
  const { user } = useUser();
  // Amenity keyword → Iconify icon name
  const amenityIcons: Record<string, string> = {
    pool: "mdi:pool",
    swimming: "mdi:pool",
    fitness: "mdi:dumbbell",
    gym: "mdi:dumbbell",
    spa: "mdi:spa",
    restaurant: "mdi:silverware-fork-knife",
    bar: "mdi:glass-cocktail",
    wifi: "mdi:wifi",
    shuttle: "mdi:bus",
    airport: "mdi:airplane",
    non: "mdi:smoke-detector-off", // Non-smoking rooms
    smoke: "mdi:smoke-detector-off",
    coffee: "mdi:coffee",
    tea: "mdi:coffee",
    beach: "mdi:beach",
    breakfast: "mdi:food-croissant",
    room: "mdi:bed",
    hair: "mdi:hair-dryer",
    luxury: "mdi:crown",
  };
  const getAmenityIcon = (amenity: string): string => {
    const lower = amenity.toLowerCase();
    for (const key in amenityIcons) {
      if (lower.includes(key)) {
        return amenityIcons[key];
      }
    }
    return "mdi:check-circle-outline"; // fallback icon
  };

  // simulate userId (replace with real auth value)
  // const userId = "123";
  // Sync redux → local state
  useEffect(() => {
    if (featured_hotels && Array.isArray(featured_hotels)) {
      setHotels(featured_hotels);
    }
  }, [featured_hotels]);

  const renderStars = (stars: number) => {
    const fullStars = Math.floor(stars); // whole stars
    const hasHalfStar = stars % 1 >= 0.5; // check if half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const starsArr = [];
    for (let i = 0; i < fullStars; i++) {
      starsArr.push(
        <Icon
          key={`full-${i}`}
          icon="material-symbols:star-rate-rounded"
          className="text-[#FE9A00]"
          width="24"
          height="24"
        />
      );
    }
    if (hasHalfStar) {
      starsArr.push(
        <Icon
          key="half"
          icon="material-symbols:star-half"
          className="text-[#FE9A00]"
          width="24"
          height="24"
        />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      starsArr.push(
        <Icon
          key={`empty-${i}`}
          icon="material-symbols:star-rate-rounded"
          className="text-gray-300"
          width="20"
          height="20"
        />
      );
    }
    return starsArr;
  };
  // :heart: Handle Favorite API
  const toggleLike = async (hotel: Hotel) => {
    try {
      if (!user) {
        toast.error("User must be logged in to mark as favourite ");
        return;
      }

      const payload = {
        item_id: String(hotel.id),
        module: "hotels",
        user_id: String(user?.user_id) || "",
      };

      const res = await addToFavourite(payload);
      if (res?.error) {
        // console.error("Error updating favourite:", res.error);
        return;
      }
      // update local state
      setHotels((prev) =>
        prev.map((h) =>
          h.id === hotel.id ? { ...h, favorite: h.favorite === 1 ? 0 : 1 } : h
        )
      );
      toast.success(res?.message || "Updated favourites ✅");

    } catch (err) {
      // console.error("toggleLike error:", err);
    }
  };
  const bgColors = [
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-teal-100",
    "bg-orange-100",
  ];
  const getRandomBg = (idx: number) => {
    return bgColors[idx % bgColors.length]; // rotates through colors
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto appHorizantalSpacing py-6">
      <div className="text-center mb-8 md:mb-12">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "Urbanist, sans-serif" }}
        >
          Featured Hotels
        </h1>
        <p
          className="text-base sm:text-lg text-[#697488] max-w-md mx-auto leading-relaxed px-4"
          style={{ fontFamily: "Urbanist, sans-serif" }}
        >
          Experience world-class comfort and unmatched hospitality in the heart
          of paradise
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        {hotels?.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-[#F5F5F5] p-3 rounded-[65px]  cursor-pointer transition-all duration-300 "
            onMouseEnter={() => setHoveredId(hotel.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative overflow-hidden rounded-[55px] aspect-square">
              <Image
                 fill
                src={hotel.img}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h3
                title={hotel.name}
                className="text-xl font-extrabold text-gray-900 mb-2 pl-2
             sm:text-2xl md:text-xl lg:text-2xl
             text-ellipsis overflow-hidden whitespace-nowrap"
                style={{ fontFamily: "Urbanist, sans-serif" }}
              >
                {hotel.name}
              </h3>

              <p className="text-[16px] sm:text-[17px] lg:text-[18px] my-2 font-[400] text-[#5B697E] pl-2">
                {hotel.city}, {hotel.country}
              </p>
              {/* Stars - now above pricing */}
              <div className="flex items-center gap-1 mb-1 pl-1">
                {renderStars(Number(hotel.stars))}
              </div>
              {/* Price & Rooms */}
              <div className="flex justify-between items-center pl-2">
                <div className="flex gap-2 items-center">
                  <p className="text-[24px] sm:text-[28px] lg:text-[30px] font-[900]">
                    ${hotel.price}
                  </p>
                  <p className="text-[14px] sm:text-[16px] lg:text-[17px] font-[400] text-[#5B697E]">
                    /night
                  </p>
                </div>
                {/* Commented out green rooms left text */}
                {/* <div className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:circle"
                    className="text-[#00A63E]"
                    width="11px"
                    height="11px"
                  />
                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#00A63E] font-[500]">
                    {hotel.left_rooms} rooms left
                  </p>
                </div> */}
              </div>
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${hoveredId === hotel.id ? "max-h-[500px]" : "max-h-0"
                  }`}
              >
                <div className="py-[16px]">
                  <div className="border-t border-[#E1E1E1] pt-[20px] mt-[24px] space-y-2">
                    {hotel.amenities && hotel.amenities.length > 0 ? (
                      <div className="grid  grid-cols-2 gap-x-2 gap-y-4">
                        {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div
                              className={`min-w-10 min-h-10  flex items-center justify-center rounded-lg ${getRandomBg(
                                idx
                              )}`}
                            >
                              <Icon
                                icon={getAmenityIcon(amenity)}
                                className="text-gray-700"
                                width={20}
                                height={20}
                              />
                            </div>
                            <p className="text-base font-[500] text-gray-700">
                              {amenity}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-3.5">
                        <p className="text-gray-500 text-sm sm:text-base">No amenities found</p>
                      </div>
                    )}



                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mb-3">
              <button className="flex-1 ml-3 cursor-pointer bg-[#163D8C] hover:bg-gray-800 text-white font-medium py-3 px-3 text-sm sm:text-base md:text-sm lg:text-base rounded-full transition-colors duration-200">
                Book Now
              </button>
              <button
                onClick={() => toggleLike(hotel)}
                className="bg-[#EBEFF4] mr-3 cursor-pointer hover:bg-gray-200 rounded-full transition-all duration-200
             flex items-center justify-center flex-shrink-0
             w-12 h-12 sm:w-14 sm:h-14 lg:w-12 lg:h-12"
                aria-label={`${hotel.favorite === 1 && user ? "Unlike" : "Like"} ${hotel.name}`}
              >
                <svg
                  className="transition-colors duration-200 w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-5 lg:h-5"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.22371 1.44739C3.27589 1.44739 0.885498 3.98725 0.885498 7.11938C0.885498 13.3881 11 20.5526 11 20.5526C11 20.5526 21.1145 13.3881 21.1145 7.11938C21.1145 3.23878 18.7241 1.44739 15.7763 1.44739C13.686 1.44739 11.8766 2.72406 11 4.58288C10.1234 2.72406 8.31404 1.44739 6.22371 1.44739Z"
                    stroke={hotel.favorite === 1 && user ? "#EF4444" : "#6B7280"}
                    strokeOpacity="0.8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill={hotel.favorite === 1 && user ? "#EF4444" : "none"}
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturedHotels;