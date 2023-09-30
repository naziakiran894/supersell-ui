import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import AddTeamDialog from "../../../pages/Teams/components/addTeam/AddTeamDialog";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TeamsHeader = ({ value, setValue }: IProps) => {
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
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={t("Search Team")}
          onChange={(e) => setValue(e.target.value)}
        />
      </Box>
      <Button
        sx={{ mb: 2, backgroundColor: "none" }}
        variant="contained"
        onClick={() => setShow(true)}
      >
        <Translations text="ADD TEAM" />
      </Button>
      <AddTeamDialog setShow={setShow} show={show} />
    </Box>
  );
};

export default TeamsHeader;
