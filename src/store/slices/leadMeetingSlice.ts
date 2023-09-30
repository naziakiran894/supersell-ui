import { createSlice } from "@reduxjs/toolkit";
import { IUserPermissions } from "../types/permisssions.types";
import { IMeeting } from "../types/meeting.types";



interface ILeadMeetingState {
  meeting: IMeeting | null;
}

const initialState: ILeadMeetingState = {
  meeting: null,
};
export const leadMeetingSlice = createSlice({
  name: "leadMeeting",
  initialState,
  reducers: {
    getLeadMeeting(state, action) {
      state.meeting = action.payload?.data;
    },
  
  },
});

export const { getLeadMeeting } = leadMeetingSlice.actions;
export default leadMeetingSlice.reducer;
