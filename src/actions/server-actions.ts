"use server";
import { createSession, getSession, logout } from "@lib/session";
import { baseUrl, api_key } from "./actions";
import { decodeBearerToken } from "@src/utils/decodeToken";
import { cookies, headers } from "next/headers";


// console.log("base",baseUrl);

// ============== GET DYNAMIC DOMAIN ===============
export async function getDomain(): Promise<string> {
  const h =await  headers();
  const host = h.get("domain") || "booknow.co";

  if (host.includes("localhost")) {
    return "booknow.co"; // default for local dev
  }

  const parts = host.split(".");
  if (parts.length > 2) {
    return parts.slice(-2).join(".");
  }

  return host;
}
// ============== COMMON HEADER ================
export async function getHeaders(contentType: string = "application/x-www-form-urlencoded") {
  // const domain = await getDomain();

  const headers: Record<string, string> = {
    Accept: "application/json",
    // Authorization: `Bearer ${token}`,

  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
}

// ---------------- Fetch App Data ---------------- //
// define what your session looks like
interface SessionUser {
  user?: {
    id?: string;
    user_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    // ... add other fields you need
  };
  iat?: number;
  exp?: number;
}

export const fetchAppData = async () => {
  try {
    // explicitly type userinfo
    const userinfo = (await getSession()) as SessionUser | null;
    const user_id = userinfo?.user?.user_id ?? "";

    const formData = new FormData();
    formData.append("api_key", api_key ?? "");
    formData.append("language", "en");
    formData.append("currency", "usd");

    if (user_id) {
      formData.append("user_id", user_id);
    }

    const response = await fetch(`${baseUrl}/app`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }


    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};


//--------------------------- FETCH COUNTRY LIST ----------------------//

export const fetchCountries = async () => {
  try {
    const formData = new FormData();
    formData.append("api_key", api_key ?? "");

    const response = await fetch(`${baseUrl}/countries`, {
      method: "POST",
      body: formData,
      headers: await getHeaders("application/json"), // do NOT set Content-Type manually
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};
//=============== FETCH HOTEL DESTINATIN FOR HOTEL SEARCH ==================
export const fetchHotelsLocations = async (city: string) => {
  try {
    const url = new URL(`${baseUrl}/hotels_locations`);
    url.searchParams.append("city", city); // attach query param

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};
//================ NEWSLATTER =========================
interface Payload {
  name: string;
  email: string;
}

export const subscribe_to_newsLatter = async (payload: Payload) => {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("email", payload.email);

    const response = await fetch(`${baseUrl}/newsletter-subscribe`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};
//================ NEWSLATTER =========================
interface newsLaterPayload {
  item_id: string;
  module: string;
  user_id:string
}

export const addToFavourite = async (payload: newsLaterPayload) => {


  try {
    const formData = new FormData();
    formData.append("item_id", payload.item_id);
    formData.append("module", payload.module);
     formData.append("user_id", payload.user_id);

    const response = await fetch(`${baseUrl}/favourites`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};
// ---------------------------- FETCH DISTINATION FOR FLIGHT INPUT ------------------------//

export const fetchDestinations = async (city: string) => {
  try {
    const formData = new FormData();
    formData.append("city", city); // <-- Make sure to send the city

    const response = await fetch(`${baseUrl}/flights-cities`, {
      method: "POST",
      body: formData,
     headers: await getHeaders("application/json"),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }
    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};


//---------------------------- SIGN UP --------------------------------------//
export const sign_up = async (signUpData: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone_country_code: number | string;
  password: string;
  // terms?: boolean;
}) => {
  try {
    const formData = new FormData();
    formData.append("first_name", signUpData.first_name);
    formData.append("last_name", signUpData.last_name);
    formData.append("email", signUpData.email);
    formData.append("phone", signUpData.phone);
    formData.append("phone_country_code", String(signUpData.phone_country_code));
    formData.append("password", signUpData.password);
    formData.append("api_key", api_key ?? "");
    formData.append("user_type", "agent");

    // if (signUpData.terms !== undefined) {
    //   formData.append("terms", signUpData.terms ? "1" : "0");
    // }

    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};


//---------------------------- LOGIN --------------------------------------//
export const signIn = async (payload: { email: string; password: string }) => {
  try {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("api_key", api_key ?? ""); // ✅ add api_key if needed
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      body: formData,
      // ❌ don't set Content-Type, browser sets it for FormData
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }
const userinfo=data?.data
    // const user = decodeBearerToken(data.data);
    await createSession(userinfo);

    return { success: "Logged in successfully" };
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};

export const signOut = async () => {
  try {
    await logout();
    return { success: "Logged out successfully" };
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user;
};

//------------------------ FORGET PASSWORD -----------------------------//
export const forget_password = async (payload: {
  email: string;

  // terms: boolean;
}) => {
  try {
    const response = await fetch(`${baseUrl}/forget-password`, {
      method: "POST",
      body: new URLSearchParams({


        email: payload.email,

        // terms: signUpData.terms.toString(),
      }).toString(),
            headers: await getHeaders("application/x-www-form-urlencoded"),

    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};

// --------------------- ACTIVATE ACCOUNT --------------------------------------//
export const activate_account = async (payload: {
  user_id: string;
  email_code: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("user_id", payload.user_id);
    formData.append("email_code", payload.email_code);
    // formData.append("api_key", api_key ?? ""); // ✅ if your API always needs api_key

    const response = await fetch(`${baseUrl}/activation`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};


//---------------------------- UPDATE PROFILE ---------------------------
interface User {
  address1: string;
  country_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_id: string;
}
export const update_profile = async (payload: User) => {
  const formData = new URLSearchParams(
    Object.entries({
      ...payload,
    }).reduce((acc, [key, value]) => {
      acc[key] = String(value); // ✅ convert all values to string
      return acc;
    }, {} as Record<string, string>)
  );

  try {
    const response = await fetch(`${baseUrl}/update-profile`, {
      method: "POST",
      body: formData.toString(),
            headers: await getHeaders("application/x-www-form-urlencoded"),

    });
    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }
    const user = decodeBearerToken(data.data);
    await createSession(user);
    return { success: "Logged in successfully" };
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};

//====================== CHANGE PASSWORD =========================//

export const change_password = async (payload: {
  user_id: string;
  old_pass: string;
  new_pass: string;
  c_pass: string;
}) => {
  try {
    const response = await fetch(`${baseUrl}/update-password`, {
      method: "POST",
      body: new URLSearchParams({

        ...payload,
      }).toString(),
           headers: await getHeaders("application/x-www-form-urlencoded"),

    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};

// =================== HOTEL SEARCH ===================
// interface HotelSearchPayload {
//   destination: string;
//   checkin: string;
//   checkout: string;
//   rooms: number;
//   adults: number;
//   children: number;
//   nationality: string;
//   page:number
//   modules:string
//    price_from: string,
//     price_to: string,
//     rating: string
// }

// export const hotel_search = async (payload: HotelSearchPayload) => {
//   try {
//     //  const cookieStore = cookies();
//     // // read modules from cookie
//     // const modulesCookie = cookieStore.get("modules");
//     // // const modules = modulesCookie ? modulesCookie.split(",") : ["stuba"]; // fallback
//     // console.log('stored modules in http only coooo', modulesCookie)
//     const formData = new FormData();
//     formData.append("city", String(payload.destination));
//     formData.append("checkin", payload.checkin);
//     formData.append("checkout", payload.checkout);
//     formData.append("rooms", String(payload.rooms));
//     formData.append("adults", String(payload.adults));
//     formData.append("childs", String(payload.children));
//     formData.append("nationality", payload.nationality);
//     formData.append("language","en")
//     formData.append("currency","usd")
//     formData.append("child_age","0")
//     formData.append('module_name',payload.modules)
//     formData.append("pagination", String(payload.page));
//     formData.append("price_from",payload.price_from || "")
//     formData.append('price_to',payload.price_to || "")
//     formData.append('price_low_to_high', "")
//     formData.append('rating',payload.rating || "")



//     console.log('seaarch_payaod',formData)
//     const response = await fetch(`${baseUrl}/hotel_search`, {
//       method: "POST",
//       body: formData,
//       headers: {
//         Accept: "application/json, text/plain, */*",
//       },
//     });

//     const data = await response.json().catch(() => null);
//     console.log('search result',data.response.length)
//     if (!response.ok || data?.status === false) {
//       return { error: data?.message || "Something went wrong" };
//     }

//     return data;
//   } catch (error) {
//     return { error: (error as Error).message || "An error occurred" };
//   }
// };


// for multi models
interface HotelSearchPayload {
  destination: string;
  checkin: string;
  checkout: string;
  rooms: number;
  adults: number;
  children: number;
  nationality: string;
  page: number;
  price_from: string;
  price_to: string;
  rating: string;
  // Remove `modules` from this interface if you're handling it externally
}
// This function handles ONE module
export const hotel_search = async (payload: HotelSearchPayload & { modules: string }) => {
  const formData = new FormData();
  formData.append("city", String(payload.destination));
  formData.append("checkin", payload.checkin);
  formData.append("checkout", payload.checkout);
  formData.append("rooms", String(payload.rooms));
  formData.append("adults", String(payload.adults));
  formData.append("childs", String(payload.children));
  formData.append("nationality", payload.nationality);
  formData.append("language", "en");
  formData.append("currency", "usd");
  formData.append("child_age", "0");
  formData.append("module_name", payload.modules); // ✅ single module
  formData.append("pagination", String(payload.page));
  formData.append("price_from", payload.price_from || "");
  formData.append("price_to", payload.price_to || "");
  formData.append("price_low_to_high", "");
  formData.append("rating", payload.rating || "");

  try {
    const response = await fetch(`${baseUrl}/hotel_search`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong", module: payload.modules };
    }

    return { ...data, module: payload.modules }; // ✅ attach module name to result
  } catch (error) {
    return { error: (error as Error).message || "An error occurred", module: payload.modules };
  }
};
// New function: accepts array of modules
export const hotel_search_multi = async (
  basePayload: Omit<HotelSearchPayload, 'modules'>,
  modules: string[]
) => {
  if (!modules?.length) {
    throw new Error("At least one module is required");
  }
  const promises = modules.map((module) =>
    hotel_search({
      ...basePayload,
      modules: module, // pass single module
    })
  );

  // Use allSettled to avoid one failure breaking all
  const results = await Promise.allSettled(promises);




  const successful = results
  .map((result) => {
    if (result.status === "fulfilled") {
      const value = result.value;
      if (!value.error && value.response?.length) {
        return value.response; // ✅ just hotels
      }
    }
    return null;
  })
  .filter(Boolean) // remove nulls
  .flat(); // flatten into single array

  return {
    success: successful,
    total: successful.length,
  };
};
//====================== HOTEL DETAILS ===================
interface HotelDetailsPayload {
  hotel_id: string;
  checkin: string;
  checkout: string;
  rooms: number;
  adults: number;
  childs: number;
  child_age: string;
  nationality: string;
  language: string;
  currency: string;
  supplier_name: string;
}

export const hotel_details = async (payload: HotelDetailsPayload) => {
  try {

    const formData = new FormData();

    // ✅ match exactly with API keys
    formData.append("hotel_id", String(payload.hotel_id));
    formData.append("checkin", payload.checkin);
    formData.append("checkout", payload.checkout);
    formData.append("rooms", String(payload.rooms));
    formData.append("adults", String(payload.adults));
    formData.append("childs", String(payload.childs));
    formData.append("child_age", payload.child_age || "0");
    formData.append("nationality", payload.nationality || "PK");
    formData.append("language", payload.language || "en");
    formData.append("currency", payload.currency || "usd");
    formData.append("supplier_name", payload.supplier_name || "stuba");

    // console.log("hotel_details_payload", Object.fromEntries(formData));

    const response = await fetch(`${baseUrl}/hotel_details`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);
    // console.log("hotel_details_result", data);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};


// ================ COMPLETE BOOKING API ======================
interface BookingPayload {
  price_original: number;
  price_markup: number;
  vat: number;
  tax: number;
  gst: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone_country_code: string;
  phone: string;
  country: string;
  stars: number;
  hotel_id: string;
  hotel_name: string;
  hotel_phone: string;
  hotel_email: string;
  hotel_website: string;
  hotel_address: string;
  room_data: any[]; // array of objects
  location: string;
  location_cords: string;
  hotel_img: string;
  checkin: string;
  checkout: string;
  adults: number;
  childs: number;
  child_ages: string | number;
  currency_original: string;
  currency_markup: string;
  booking_data: Record<string, any>;
  supplier: string;
  user_id?: string;
  guest: any[]; // array of traveller info
  nationality: string;
  payment_gateway?: string;
  user_data: Record<string, any>;
}

export const hotel_booking = async (payload: BookingPayload) => {
  try {
    const formData = new FormData();
    // ✅ Append normal fields
    formData.append("price_original", String(payload.price_original));
    formData.append("price_markup", String(payload.price_markup));
    formData.append("vat", String(payload.vat));
    formData.append("tax", String(payload.tax));
    formData.append("gst", String(payload.gst));
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("email", payload.email);
    formData.append("address", payload.address);
    formData.append("phone_country_code", payload.phone_country_code);
    formData.append("phone", payload.phone);
    formData.append("country", payload.country);
    formData.append("stars", String(payload.stars));
    formData.append("hotel_id", payload.hotel_id);
    formData.append("hotel_name", payload.hotel_name);
    formData.append("hotel_phone", payload.hotel_phone);
    formData.append("hotel_email", payload.hotel_email);
    formData.append("hotel_website", payload.hotel_website);
    formData.append("hotel_address", payload.hotel_address);
    formData.append("location", payload.location);
    formData.append("location_cords", payload.location_cords);
    formData.append("hotel_img", payload.hotel_img);
    formData.append("checkin", payload.checkin);
    formData.append("checkout", payload.checkout);
    formData.append("adults", String(payload.adults));
    formData.append("childs", String(payload.childs));
    formData.append("child_ages", String(payload.child_ages));
    formData.append("currency_original", payload.currency_original);
    formData.append("currency_markup", payload.currency_markup);
    formData.append("supplier", payload.supplier);
    formData.append("nationality", payload.nationality);
    formData.append("payment_gateway", payload.payment_gateway ?? "");
    formData.append("user_id", payload.user_id ?? "");

    // ✅ Append JSON fields (must stringify)
    formData.append("room_data", JSON.stringify(payload.room_data));
    formData.append("booking_data", JSON.stringify(payload.booking_data));
    formData.append("guest", JSON.stringify(payload.guest));
    formData.append("user_data", JSON.stringify(payload.user_data));

    // console.log("hotel_booking_payload", Object.fromEntries(formData));

    const response = await fetch(`${baseUrl}/hotel_booking`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    const data = await response.json().catch(() => null);
    // console.log("hotel_booking_result", data);

    if (!response.ok || data?.status === false) {
      return { error: data?.message || "Something went wrong" };
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message || "An error occurred" };
  }
};




