import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { ITeam } from "../../../store/types/team.types";
import { useTranslation } from "react-i18next";

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("md")]: {
      minWidth: 130,
    },
  },
}));

export interface ITeamUserProps {
  teamDetails: Partial<ITeam>;
  setTeamDetails: React.Dispatch<React.SetStateAction<Partial<ITeam>>>;
  setAllTeamUsers: React.Dispatch<React.SetStateAction<boolean>>;
  teamAllUsers: boolean;
}

const Tabs: React.FC<ITeamUserProps> = ({
  teamDetails,
  setTeamDetails,
  teamAllUsers,
  setAllTeamUsers,
}) => {
  const { t } = useTranslation();
  return (
    <FormGroup sx={{ my: 3 }}>
      <FormControlLabel
        control={
          <Switch
            checked={teamDetails?.callRecording || false}
            onChange={(e) =>
              setTeamDetails({
                ...teamDetails,
                callRecording: e.target.checked,
              })
            }
          />
        }
        label={`Call Recording ${teamDetails?.callRecording ? "ON" : "OFF"}`}
      />
      <FormControlLabel
        control={
          <Switch
            checked={teamAllUsers}
            onChange={(e) => setAllTeamUsers(e.target.checked)}
          />
        }
        label={t("All users belong to the team")}
      />
    </FormGroup>
  );
};

export default Tabs;
