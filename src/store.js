// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./features/customerSlice";
import invoiceReducer from "./features/invoiceSlice";
import ticketReducer from "./features/ticketSlice";

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    invoices: invoiceReducer,
    tickets: ticketReducer,
  },
});
