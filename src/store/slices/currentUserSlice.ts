import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../types/user.types";

interface IUserState {
  isLoading: boolean;
  currentUser: IUser | null;
}

const initialState: IUserState = {
  isLoading: false,
  currentUser: null,
};
const getCurrentUserSlice = createSlice({
  name: "currentUser",
  initialState,

  reducers: {
    getCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setIsLoading(state, action){
      state.isLoading = action.payload
    }
    
  },
});

export const { getCurrentUser,setIsLoading } = getCurrentUserSlice.actions;
export default getCurrentUserSlice.reducer;
