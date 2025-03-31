// src/features/invoiceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchInvoices, createInvoice } from "../api";

export const getInvoices = createAsyncThunk(
  "invoices/getInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchInvoices();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addInvoice = createAsyncThunk(
  "invoices/addInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const data = await createInvoice(invoiceData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default invoiceSlice.reducer;
