import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../reducers/userSlice";

export const fetchUser = createAsyncThunk<User>("user/fetch", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/user");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch user");
  }
});
