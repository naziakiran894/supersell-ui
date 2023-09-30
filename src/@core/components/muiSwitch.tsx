import { Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ISwitchProps {
  value:boolean;
  onChange:((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void)
}


const MuiSwitch = ({value, onChange}:ISwitchProps) => {
  const {t} = useTranslation()


  return (
    <>
      <Switch
        checked={value}
        onChange={onChange}
      />
      <span style={{ marginLeft: "8px" }}>{value ? t("Yes") : t("No")}</span>
    </>
  );
};

export default MuiSwitch;
