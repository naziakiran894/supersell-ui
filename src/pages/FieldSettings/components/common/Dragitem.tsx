import React, { useCallback } from "react";
import { Box, Card, Typography, IconButton } from "@mui/material";
import Icon from "../../../../@core/components/icon/index";
import { FormItem } from "../..";
import { Translation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

const FormItemComponent: React.FC<Partial<FormItem>> = ({
  keyName,
  visible,
  onToggleVisibility,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: 3,
        borderBottom: "1px solid lightgrey",
      }}
    >
      <Typography>
        {" "}
        <Translations text={keyName || ""} />
      </Typography>
      <Box sx={{ display: "flex" }}>
        <IconButton size="small">
          <Icon icon={"mdi:hamburger-menu"} />
        </IconButton>{" "}
        <IconButton size="small" sx={{ ml: 3 }} onClick={onToggleVisibility}>
          <Icon icon={visible ? "mdi:eye-outline" : "mdi:eye-off-outline"} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FormItemComponent;
