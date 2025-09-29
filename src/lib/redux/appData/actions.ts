// import { useUser } from "@hooks/use-user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAppData } from "@src/actions";

export const setAppData = createAsyncThunk(
  "websiteContent/fetchWebContent",
  async (_, { rejectWithValue }) => {
   
    try {
      const response = await fetchAppData();

      if (!response || response.error) {
        // if your API wraps errors in { error: "..." }
        throw new Error(response.error || "Invalid response from API");
      }

      const { data } = response;
      return data;
    } catch (err: any) {
      // console.error("❌ Failed fetching App Data:", err);
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);
