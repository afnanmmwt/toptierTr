
import React from 'react';

type Hotel = {
  id: number;
  username:string;
  name: string;
  city: string;
  country: string;
  price: number;
  stars: number;
  image: string;
  dates: string;
  status: string;
};

const DashboardCard = (hotel:any) => {
    console.log("🏨 Hotel Data:====================", hotel.hotel);
    const hotelData=hotel.hotel;
  const HOTELS: Hotel[] = [
    {
      id: 1,
      username:"Ahmad",
      name: "Hotel Le Meurice",
      city: "Paris",
      country: "France",
      price: 199,
      stars: 5,
      dates: "Jan 12 - Jan 18, 2024",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
       username:"Shahzar",
      name: "The Ritz-Carlton",
      city: "Bali",
      country: "Indonesia",
      price: 159,
      stars: 5,
      dates: "Feb 5 - Feb 12, 2024",
      status: "Pending",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
       username:"Faisal",
      name: "Marina Bay Sands",
      city: "Singapore",
      country: "Singapore",
      price: 249,
      stars: 5,
      dates: "Mar 1 - Mar 7, 2024",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
       username:"Afnan Marwat",
      name: "Burj Al Arab",
      city: "Dubai",
      country: "UAE",
      price: 299,
      stars: 5,
      dates: "Apr 10 - Apr 17, 2024",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
       username:"Rana Usman",
      name: "The Plaza Hotel",
      city: "New York",
      country: "USA",
      price: 279,
      stars: 5,
      dates: "May 3 - May 9, 2024",
      status: "Cancelled",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
       username:"Faraz Ahmad",
      name: "Four Seasons Resort",
      city: "Maldives",
      country: "Maldives",
      price: 499,
      stars: 5,
      dates: "Jun 15 - Jun 22, 2024",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    },
  ];

 const getStatusColor = (status: string) => {
  const s = (status || "").trim().toLowerCase();
  switch (s) {
    case "confirmed":
      return "bg-green-600 ";
    case "pending":
      return "bg-yellow-600";
    case "cancelled":
      return "bg-red-600 ";
    default:
      return "bg-gray-200 text-gray-800";
  }
};



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {HOTELS.map((hotel) => (
          <div
            key={hotel.id}
            className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            style={{ height: "320px" }}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`${getStatusColor(
                  hotel.status
                )} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}
              >
                {hotel.status}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              {/* <h2 className="text-2xl font-bold mb-1"> {hotel?.address}</h2> */}
              <p className="text-sm text-gray-200 mb-2">{hotel.dates}</p>
              <div className="flex justify-between">
              <span className="text-lg font-semibold">{hotel.username}</span>
              <button className='text-sm font-medium px-4 py-2 rounded-lg hover:bg-black bg-black/40 cursor-pointer'>More Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;