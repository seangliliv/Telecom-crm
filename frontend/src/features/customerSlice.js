import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCustomers } from '../api';

export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCustomers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
