import { createSlice } from "@reduxjs/toolkit";
import { IField } from "../types/fields.types";

interface IFieldState {
  fields: IField | null;
}

const initialState: IFieldState = {
  fields: null,
};
const fieldsSlice = createSlice({
  name: "fields",
  initialState,

  reducers: {
    getFields(state, action) {
      state.fields = action.payload?.data;
    },
  },
});

export const { getFields } = fieldsSlice.actions;
export default fieldsSlice.reducer;
