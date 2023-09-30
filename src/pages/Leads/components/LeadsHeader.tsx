import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Icon from "../../../@core/components/icon";
import DialogAddLead from "../../../@core/components/AddLead/DialogAddLead";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useDownloadLeadMutation } from "../../../store/services";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

interface TableHeaderProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  selected: string[];
}

const TableHeader = ({ value, setValue, selected }: TableHeaderProps) => {
  const permissions = useSelector(
    (state: RootState) => state?.permissions?.Permissions
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [show, setShow] = useState<boolean>(false);
  const [handleDownloadCsv] = useDownloadLeadMutation();
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
      <Box>
        {((permissions !== null && permissions?.Downloads) ||
          user?.loginAsClient) &&
          selected?.length > 0 && (
            <Button
              sx={{ mr: 4, mb: 2 }}
              color="secondary"
              variant="outlined"
              onClick={async () => handleDownloadCsv({})}
              startIcon={<Icon icon="mdi:download" fontSize={20} />}
            >
              <Translations text="Download" />
            </Button>
          )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          sx={{ mr: 4, mb: 2 }}
          placeholder={t("Search Lead")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          sx={{ mb: 2, backgroundColor: "none" }}
          variant="contained"
          onClick={() => setShow(true)}
        >
          <Translations text="ADD LEAD" />
        </Button>
        <DialogAddLead setShow={setShow} show={show} />
      </Box>
    </Box>
  );
};

export default TableHeader;
