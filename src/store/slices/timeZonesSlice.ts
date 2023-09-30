import { createSlice } from "@reduxjs/toolkit";
import { ITimezone } from "../types/timezone.types";

interface ITimezoneState {
  timezone?: ITimezone[];
}

const initialState: ITimezoneState = {
  timezone: [],
};
const timezoneSlice = createSlice({
  name: "timezones",
  initialState,

  reducers: {
    getTimezone(state, action) {
      state.timezone = action.payload.data;
    },
  },
});

export const { getTimezone } = timezoneSlice.actions;
export default timezoneSlice.reducer;
