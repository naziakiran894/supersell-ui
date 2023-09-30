import { createSlice } from "@reduxjs/toolkit";
import { IUserPermissions } from "../types/permisssions.types";

interface IPermissionState {
  Permissions: IUserPermissions | null;
  isLoading: boolean;
}

const initialState: IPermissionState = {
  Permissions: null,
  isLoading: true,
};
export const PermissionsSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    getPermissionsData(state, action) {
      state.Permissions = action.payload?.data;
    },
    removePermission(state, payload) {
      state.Permissions = null;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { getPermissionsData, setIsLoading, removePermission } =
  PermissionsSlice.actions;
export default PermissionsSlice.reducer;
