import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Icon from "../../../@core/components/icon";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useDownloadMeetingMutation } from "../../../store/services";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TableHeader = ({ value, setValue }: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  const permissions = useSelector(
    (state: RootState) => state.permissions.Permissions
  );

  const user: any = useSelector((state: RootState) => state.auth.user);

  const [handleDownloadCsv] = useDownloadMeetingMutation();
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
        {(permissions !== null && permissions?.Downloads) ||
          (user?.loginAsClient && (
            <Button
              sx={{ mr: 4, mb: 2 }}
              color="secondary"
              variant="outlined"
              onClick={async () => handleDownloadCsv({})}
              startIcon={<Icon icon="mdi:download" fontSize={20} />}
            >
              <Translations text="Download" />
            </Button>
          ))}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={t("Search Meeting")}
          onChange={(e) => setValue(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default TableHeader;
