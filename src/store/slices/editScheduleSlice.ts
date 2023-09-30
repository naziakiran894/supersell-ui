import { createSlice } from "@reduxjs/toolkit";

interface IEditScheduleState {
  tab: string;
}

const initialState: IEditScheduleState = {
  tab: "",
};
const editScheduleCallSlice = createSlice({
  name: "editScheduleSlice",
  initialState,

  reducers: {
    currentTab(state, action) {
      state.tab = action.payload;
    },
  },
});

export const { currentTab } = editScheduleCallSlice.actions;
export default editScheduleCallSlice.reducer;
