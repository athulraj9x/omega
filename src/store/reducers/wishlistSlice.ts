// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import api from "@/utils/api";

// // -----------------
// // Type Definitions
// // -----------------
// export interface Item {
//   id: number;
//   title: string;
//   oldPrice: number;
//   waight: string;
//   image: string;
//   imageTwo: string;
//   date: string;
//   status: string;
//   rating: number;
//   newPrice: number;
//   location: string;
//   brand: string;
//   sku: number;
//   category: string;
//   quantity: number;
// }

// interface WishlistState {
//   wishlist: Item[];
//   loading: boolean;
//   error: string | null;
// }

// // -----------------
// // Initial State
// // -----------------
// const initialState: WishlistState = {
//   wishlist: [],
//   loading: false,
//   error: null,
// };

// // -----------------
// // Async Thunks
// // -----------------

// // Fetch all wishlist items from backend
// export const fetchWishlist = createAsyncThunk<Item[]>(
//   "wishlist/fetchWishlist",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/api/v1/wishlist");
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Fetch failed");
//     }
//   }
// );

// // Add new item to wishlist (POST)
// export const addWishlistItem = createAsyncThunk<Item, Item>(
//   "wishlist/addWishlistItem",
//   async (item, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/api/v1/wishlist", item);
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Add failed");
//     }
//   }
// );

// // Remove item from wishlist by ID (DELETE)
// export const removeWishlistItem = createAsyncThunk<number, number>(
//   "wishlist/removeWishlistItem",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/api/v1/wishlist/${id}`);
//       return id;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Remove failed");
//     }
//   }
// );

// // -----------------
// // Slice
// // -----------------
// const wishlistSlice = createSlice({
//   name: "wishlist", // 🔹 A name for this slice (used in Redux devtools and action types)
//   initialState,     // 🔹 Your initial state (wishlist array, loading, error)
//   reducers: {},     // 🔹 No synchronous reducers here — we're only using async thunks

//   extraReducers: (builder) => {
//     builder
//       // FETCH
//       .addCase(fetchWishlist.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Item[]>) => {
//         state.wishlist = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchWishlist.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // ADD
//       .addCase(addWishlistItem.fulfilled, (state, action: PayloadAction<Item>) => {
//         state.wishlist.push(action.payload);
//       })
//       .addCase(addWishlistItem.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       // REMOVE
//       .addCase(removeWishlistItem.fulfilled, (state, action: PayloadAction<number>) => {
//         state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
//       })
//       .addCase(removeWishlistItem.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// // -----------------
// // Export
// // -----------------
// export default wishlistSlice.reducer;
