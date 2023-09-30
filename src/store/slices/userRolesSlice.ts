import { createSlice } from "@reduxjs/toolkit";
import { IUserRoles } from "../types/user.types";

interface IUserRolesState {
  userRoles:IUserRoles[]
}


const initialState:IUserRolesState = { 
  userRoles: [],
}
const userRoleSlice = createSlice({
  name: "userRole",
  initialState,

  reducers: {
    getUserRole(state, action) {
      state.userRoles = action.payload.data;
    },
  },
});

export const { getUserRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
