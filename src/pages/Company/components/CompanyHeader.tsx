import { Box, Button, TextField } from "@mui/material";
import Icon from "../../../@core/components/icon";
import DialogAddCompany from "./AddCompanyDialog";
import { useState } from "react";
import Translations from "../../../@core/layouts/Translations";

interface TableHeaderProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const CompanyHeader = ({ value, setValue }: TableHeaderProps) => {
  const [show, setShow] = useState(false);

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder="Search Client"
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          sx={{ mb: 2, backgroundColor: "none" }}
          variant="contained"
          onClick={() => setShow(true)}
        >
          <Translations text={"ADD CLIENT"} />
        </Button>
        <DialogAddCompany setShow={setShow} show={show} />
      </Box>
    </Box>
  );
};

export default CompanyHeader;
