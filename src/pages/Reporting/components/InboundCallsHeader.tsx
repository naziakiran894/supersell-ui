import { Box, TextField, Typography } from "@mui/material";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  const { handleFilter, toggle, value } = props;
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>
        <Translations text={"Inbound calls"} />
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={t("Search")}
          onChange={(e) => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default TableHeader;
