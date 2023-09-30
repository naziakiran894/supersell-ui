import { createSlice } from "@reduxjs/toolkit";
import { IAuthUser } from "../types/user.types";

interface IAuthState {
  isLoading: boolean;
  user: IAuthUser | null;

  token: string | null;
}

const initialState: IAuthState = {
  isLoading: true,
  user: null,
  token: null,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    updateUser(state, action) {
      state.user = action.payload.data;
      state.token = action.payload.data.token;
      state.isLoading = true;
    },
    logoutUser(state, action) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("persist:Authuser");
      state.user = null;
      state.token = null;
    },
   
  },
});

export const { updateUser, logoutUser } = AuthSlice.actions;
export default AuthSlice.reducer;

