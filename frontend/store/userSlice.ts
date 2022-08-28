import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface UserState {
  userState: string;
}

const initialState: UserState = {
  userState: '',
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState(state, action) {
      state.userState = action.payload;
    },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.user,
        };
      },
    },

  },
});

export const { setUserState } = userSlice.actions;

export const selectUserState = (state: AppState) => state.user.userState;

export default userSlice.reducer;