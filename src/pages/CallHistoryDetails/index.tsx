import React from "react";
import { Typography, Box } from "@mui/material";
import CallHistoryHeader from "./components/CallHistoryDetailsHeader";
import CallHistoryDetailsTable from "./components/CallHistoryDetailsTable";

const CallHistoryDetails = () => {
  return (
    <>
      <Typography mb={10} variant="h5">
        Call history
      </Typography>

      <Box mb={5}>
        <CallHistoryHeader />
      </Box>
      <CallHistoryDetailsTable />
    </>
  );
};

export default CallHistoryDetails;
