import IntegrationTable from "./components/IntegrationTable";
import { Card, Typography, Box } from "@mui/material";
import IntegrationFilters from "./components/IntegrationFilters";
import { useState } from "react";
import { DateType } from "../../@core/components/types/forms/reactDatepickerTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const index = () => {
  const currentUser = useSelector(
    (state: RootState) => state.currentUser.currentUser
  );
  return (
    <>
      <Box my={5}>
        <Typography variant="h5">Integration Name</Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "14px", color: "#3A354199" }}
        >
          {/* @ts-ignore */}
          {currentUser?.companyId?.companyName}
        </Typography>
      </Box>
      <IntegrationTable />
    </>
  );
};

export default index;
