"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "@iconify/react";

const containerStyle = {
  width: "100%",
  height: "800px",
};

// Fallback center (London)
const fallbackCenter: [number, number] = [51.505, -0.09];

interface HotelMapProps {
  hotels: {
    hotel_id: string;
    img?: string;
    latitude: string | number;
    longitude: string | number;
    actual_price: string | number;
    location: string;
    name?: string;
    city?: string;
    stars?: string;
    address: string;
  }[];
  currentLocation: {
    lat: number;
    lon: number;
  } | null;
}

// Regular price icon (red pin)
const priceIcon = (price: number | string) =>
  L.divIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
        <div style="
          background: white;
          border: 1px solid gray;
          color: black;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
          min-width: 48px;
          z-index: 1;
        ">
          $${price}
        </div>
        <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 0C10.134 0 7 3.13401 7 7C7 12.25 14 24 14 24C14 24 21 12.25 21 7C21 3.13401 17.866 0 14 0Z"
            fill="#E53E3E"
          />
        </svg>
      </div>
    `,
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 24],
  });

// Highlighted icon (blue for current location)
const highlightedIcon = (price: number | string) =>
  L.divIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
        <div style="
          background: #ADD8E6;
          border: 1px solid #1E90FF;
          color: black;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 16px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          text-align: center;
          min-width: 48px;
          z-index: 1;
        ">
          $${price}
        </div>
        <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 0C10.134 0 7 3.13401 7 7C7 12.25 14 24 14 24C14 24 21 12.25 21 7C21 3.13401 17.866 0 14 0Z"
            fill="#1E90FF"
          />
        </svg>
      </div>
    `,
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 24],
  });

// Helper to check if hotel matches current location (with tolerance)
const isSameLocation = (
  hotelLat: number,
  hotelLng: number,
  current: { lat: number; lon: number } | null,
  tolerance = 0.0001 // ~10 meters
): boolean => {
  if (!current) return false;
  return (
    Math.abs(hotelLat - current.lat) < tolerance &&
    Math.abs(hotelLng - current.lon) < tolerance
  );
};

// Auto-fit bounds
function FitBounds({ hotels }: { hotels: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (hotels.length === 0) return;
    const bounds = L.latLngBounds(
      hotels.map((h) => [Number(h.latitude), Number(h.longitude)])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [hotels, map]);
  return null;
}

// Custom Controls (Zoom In, Zoom Out, Locate)
function CustomControls() {
  const map = useMap();
  const zoomIn = () => map.setZoom(map.getZoom() + 1);
  const zoomOut = () => map.setZoom(map.getZoom() - 1);
  const locateUser = () => map.locate({ setView: true, maxZoom: 14 });
  return (
    <div className="absolute top-22 right-5 flex flex-col gap-3 z-[1000]">
      <button
        onClick={zoomIn}
        className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
        aria-label="Zoom in"
      >
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.15381 16H25.0546" stroke="black" strokeWidth="1.27863" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.1045 7.04962V24.9504" stroke="black" strokeWidth="1.27863" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={zoomOut}
        className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
        aria-label="Zoom out"
      >
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.15381 16H25.0546" stroke="black" strokeWidth="1.27863" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={locateUser}
        className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
        aria-label="Locate me"
      >
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.2795 25.7153C17.3137 25.8005 17.3731 25.8732 17.4498 25.9237C17.5265 25.9741 17.6168 25.9999 17.7085 25.9976C17.8003 25.9952 17.8892 25.9648 17.9632 25.9105C18.0372 25.8562 18.0928 25.7806 18.1226 25.6937L23.9712 8.5979C24 8.51818 24.0054 8.4319 23.987 8.34916C23.9686 8.26643 23.9269 8.19066 23.867 8.13072C23.807 8.07078 23.7313 8.02915 23.6485 8.0107C23.5658 7.99225 23.4795 7.99774 23.3998 8.02654L6.30395 13.8751C6.21712 13.9049 6.14147 13.9605 6.08717 14.0345C6.03286 14.1085 6.0025 14.1974 6.00015 14.2892C5.9978 14.3809 6.02357 14.4712 6.07402 14.5479C6.12446 14.6246 6.19716 14.684 6.28236 14.7182L13.4176 17.5795C13.6432 17.6698 13.8481 17.8049 14.0201 17.9765C14.192 18.1482 14.3275 18.3529 14.4182 18.5783L17.2795 25.7153Z"
            stroke="black"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}


export default function HotelMap({ hotels, currentLocation }: HotelMapProps) {
  const [validHotels, setValidHotels] = useState<typeof hotels>([]);
  console.log(hotels)
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filtered = hotels.filter((hotel) => {
      const lat = Number(hotel.latitude);
      const lng = Number(hotel.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });
    setValidHotels(filtered);
  }, [hotels]);

  if (hotels.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
        <p className="text-gray-500">No hotels to display on map</p>
      </div>
    );
  }

  if (validHotels.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-600 font-medium">⚠️ No valid coordinates found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[800px] rounded-4xl overflow-hidden">
      {/* Fullscreen toggle - MOVED to top-4 to avoid overlap */}
      <div
        className="absolute top-9 right-5 z-[1001] cursor-pointer"
        onClick={() => setShowModal(true)}
        aria-label="Open fullscreen map"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 21.308L8.442 17.75l.714-.713L11.5 19.38V14.5h1v4.875l2.339-2.344l.719.719zm-5.75-5.75L2.692 12l3.552-3.552l.714.714L4.619 11.5H9.5v1H4.625l2.344 2.339zm11.5 0l-.713-.714L19.38 12.5H14.5v-1h4.875l-2.344-2.339l.719-.719L21.308 12zM11.5 9.5V4.62L9.156 6.963l-.714-.714L12 2.692l3.558 3.558l-.714.714L12.5 4.618V9.5z"
            />
          </svg>
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] rounded-md bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            <button
              className="absolute top-11 cursor-pointer right-6 z-[3000] text-white bg-gray-600 rounded-full p-1.5"
              onClick={() => setShowModal(false)}
              aria-label="Close fullscreen map"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
            <MapContainer
              style={{ width: "100%", height: "100%" }}
              center={fallbackCenter}
              zoom={7}
              scrollWheelZoom={true}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              <FitBounds hotels={validHotels} />
              {validHotels.map((hotel) => {
                const lat = Number(hotel.latitude);
                const lng = Number(hotel.longitude);
                const isCurrent = isSameLocation(lat, lng, currentLocation);

                return (
                  <Marker
                    key={hotel.hotel_id}
                    position={[lat, lng]}
                    icon={isCurrent ? highlightedIcon(hotel.actual_price) : priceIcon(hotel.actual_price)}
                  >
                    <Tooltip direction="top"
                      offset={L.point(0, -10)}
                      opacity={1}
                    >
                      <div
                        className={`text-sm w-70 h-auto overflow-hidden text-wrap py-1 leading-[1.4]   ${isCurrent ? "bg-blue-100 border border-gray-400 rounded-sm" : "bg-white border rounded-sm border-gray-300"
                          }`}
                      >
                        <div className="p-2">
                          <h3 className="text-sm font-semibold text-wrap">{hotel.name || "Hotel"}</h3>

                          <p className="text-gray-500 text-xs mt-1 text-wrap">
                            {hotel.address || hotel.city || ""}
                          </p>
                          {/* Stars (agar hotel.stars aaye to show karein) */}
                          {hotel.stars && (
                            <div className="flex items-center text-yellow-500 text-sm mt-1">
                              {Array.from({ length: Number(hotel.stars) }).map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                          )}


                          <p className="text-black font-bold mt-1 text-sm">
                            ${hotel.actual_price}
                          </p>
                        </div>
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}
              <CustomControls />
            </MapContainer>
          </div>
        </div>
      )}

      {/* MAIN MAP */}
      <div className="relative z-0">
        <MapContainer
          style={containerStyle}
          center={fallbackCenter}
          zoom={7}
          scrollWheelZoom={true}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          <FitBounds hotels={validHotels} />
          {validHotels.map((hotel) => {
            const lat = Number(hotel.latitude);
            const lng = Number(hotel.longitude);
            const isCurrent = isSameLocation(lat, lng, currentLocation);

            return (
              <Marker
                    key={hotel.hotel_id}
                    position={[lat, lng]}
                    icon={isCurrent ? highlightedIcon(hotel.actual_price) : priceIcon(hotel.actual_price)}
                  >
                    <Tooltip direction="top"
                      offset={L.point(0, -10)}
                      opacity={1}
                    >
                      <div
                        className={`text-sm w-70 h-auto overflow-hidden text-wrap  px-2 py-1 leading-[1.4]   ${isCurrent ? "bg-blue-100 border border-gray-400 rounded-sm" : "bg-white border rounded-sm border-gray-300"
                          }`}
                      >
                        <div className="p-2">
                          <h3 className="text-sm font-semibold text-wrap">{hotel.name || "Hotel"}</h3>

                          <p className="text-gray-500 text-xs mt-1 text-wrap">
                            {hotel.address || hotel.city || ""}
                          </p>
                          {/* Stars (agar hotel.stars aaye to show karein) */}
                          {hotel.stars && (
                            <div className="flex items-center text-yellow-500 text-sm mt-1">
                              {Array.from({ length: Number(hotel.stars) }).map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                          )}


                          <p className="text-black font-bold mt-1 text-sm">
                            ${hotel.actual_price}
                          </p>
                        </div>
                      </div>
                    </Tooltip>
                  </Marker>
            );
          })}
          <CustomControls />
        </MapContainer>
      </div>
    </div>
  );
}