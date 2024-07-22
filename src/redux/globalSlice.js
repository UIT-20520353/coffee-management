import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: 0,
  accessToken: undefined,
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
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { incrementLoading, decrementLoading, setAccessToken } =
  globalSlice.actions;

export default globalSlice.reducer;
