import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: 0,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    incrementLoading: (state) => {
      state.loading += 1;
    },
    decrementLoading: (state) => {
      if (state.loading) {
        state.loading -= 1;
      }
    },
  },
});

export const { incrementLoading, decrementLoading } = globalSlice.actions;

export default globalSlice.reducer;
