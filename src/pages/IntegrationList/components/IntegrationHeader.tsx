import { Box, Button } from "@mui/material";
import APP_ROUTES from "../../../Routes/routes";
import { useNavigate } from "react-router-dom";
import Translations from "../../../@core/layouts/Translations";

const TableHeader = () => {
  const navigate = useNavigate();
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
      <Button
        sx={{ mb: 2, backgroundColor: "none" }}
        variant="contained"
        onClick={() => navigate(APP_ROUTES.integrationSetting)}
      >
        <Translations text={"ADD INTEGRATION"} />
      </Button>
    </Box>
  );
};

export default TableHeader;
