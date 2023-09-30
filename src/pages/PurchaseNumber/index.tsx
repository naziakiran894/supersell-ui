import React from "react";
import PurchaseNumberTable from "./components/PurchaseNumberTable";
import { Box, Typography } from "@mui/material";
import Settings from "../Settings";
import { useGetNumberSettingByIdQuery } from "../../store/services";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Translation } from "react-i18next";
import Translations from "../../@core/layouts/Translations";

const PurchaseNumber = () => {
  const { data: numberSetting, isLoading: isFetching } =
    useGetNumberSettingByIdQuery("");
  const currentUser = useSelector(
    (state: RootState) => state?.currentUser?.currentUser
  );

  //@ts-ignore
  const settings = numberSetting?.data;
  return (
    <>
      <Box mb={10}>
        <Typography sx={{ fontSize: "24px", fontWeight: "500" }}>
          <Translations text="Numbers" />
        </Typography>
        <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "gray" }}>
          {/* @ts-ignore */}
          {currentUser?.companyId?.companyName}
        </Typography>
      </Box>
      <PurchaseNumberTable />
    </>
  );
};

export default PurchaseNumber;
