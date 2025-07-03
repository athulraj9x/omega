import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthResponse } from "../reducers/authSlice";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload>("auth/login", async (payload, thunkAPI) => {
  try {
    const response = await axios.post("/api/login", payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});
