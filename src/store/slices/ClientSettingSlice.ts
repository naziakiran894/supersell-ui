import { createSlice } from "@reduxjs/toolkit";
import { ICompanyDetailsByID } from "../types/company.types";

interface IClientSettingsState {
  ClientSetting: ICompanyDetailsByID | null;
  isLoading: boolean;
}

const initialState:IClientSettingsState = {
  ClientSetting: null,
  isLoading: true,
};

export const clientSettingSlice = createSlice({
  name: "clientSetting",
  initialState,

  reducers: {
    getClientSetting(state, action) {
      state.ClientSetting = action.payload;
      state.isLoading = action.payload;
    },
  },
});

export const { getClientSetting } = clientSettingSlice.actions;
export default clientSettingSlice.reducer;
