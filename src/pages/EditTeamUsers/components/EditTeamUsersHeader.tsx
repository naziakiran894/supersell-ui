import { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const EditTeamUsersHead = ({ setValue, value }: IProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <TextField
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ mr: 4, mb: 2 }}
        placeholder={t("Search User")}
      />
    </Box>
  );
};

export default EditTeamUsersHead;
