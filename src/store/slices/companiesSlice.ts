import { createSlice } from "@reduxjs/toolkit";
import { ICompanyType } from "../types/company.types";

interface ICompanyState {
  companies: ICompanyType[];
}

const initialState: ICompanyState = {
  companies: [],
};
const companiesSlice = createSlice({
  name: "companies",
  initialState,

  reducers: {
    getCompanies(state, action) {
      state.companies = action.payload?.data?.list;
    },
  },
});

export const { getCompanies } = companiesSlice.actions;
export default companiesSlice.reducer;
