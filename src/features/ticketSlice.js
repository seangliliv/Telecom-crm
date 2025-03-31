// src/features/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTickets, createTicket } from "../api";

export const getTickets = createAsyncThunk(
  "tickets/getTickets",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchTickets();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const data = await createTicket(ticketData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default ticketSlice.reducer;
