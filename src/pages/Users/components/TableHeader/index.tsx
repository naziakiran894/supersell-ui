import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import AddUserDialog from "../AddUserDialog/AddUserDialog";
import Translations from "../../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TableHeader = ({ value, setValue }: IProps) => {
  const [show, setShow] = useState(false);
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
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          sx={{ mr: 4, mb: 2 }}
          placeholder={t("Search User")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Box>
      <Button
        sx={{ mb: 2, backgroundColor: "none" }}
        variant="contained"
        onClick={() => setShow(true)}
      >
        <Translations text="ADD USER" />
      </Button>
      <AddUserDialog setShow={setShow} show={show} />
    </Box>
  );
};

export default TableHeader;
