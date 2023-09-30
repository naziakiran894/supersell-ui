import { SyntheticEvent, useState, useEffect } from "react";
import { Box, Tab, Typography } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "../../@core/components/icon";
import { useLocation, useNavigate } from "react-router-dom";
import ScheduledCalls from "./ScheduledCalls";
import CallHistory from "./CallHistory";
import APP_ROUTES from "../../Routes/routes";
import { useSelector } from "react-redux";

import { IUserPermissions } from "../../store/types/permisssions.types";
import { RootState } from "../../store";
import Translations from "../../@core/layouts/Translations";

// import Account from "../@core/components/account/Account";
// import ScheduleTable from "./schedule/index";

interface Props {
  tab: string;
  // invoiceData: InvoiceType[];
}

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

const CallSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tab = location.pathname;

  const [activeTab, setActiveTab] = useState<string>(tab);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const permissions: IUserPermissions | null = useSelector(
    (state: RootState) => state?.permissions?.Permissions
  );
  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);
  return (
    <TabContext value={activeTab}>
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example"
      >
        <Tab
          value={APP_ROUTES.callHistory}
          onClick={() => handleNavigate(APP_ROUTES.callHistory)}
          label={
            <Box
              sx={{ display: "flex", alignItems: "center", "& svg": { mr: 2 } }}
            >
              <Icon fontSize={20} icon="mdi:access-time" />
              <Translations text="CALL HISTORY" />
            </Box>
          }
        />

        <Tab
          value={APP_ROUTES.scheduledCalls}
          onClick={() => handleNavigate(APP_ROUTES.scheduledCalls)}
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& svg": { mr: 2 },
              }}
            >
              <Icon fontSize={20} icon="mdi:account-outline" />
              <Translations text="SCHEDULED CALLS" />
            </Box>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box
            sx={{
              mt: 6,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>
              <Translations text={"Loading"} />
              ...
            </Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value={APP_ROUTES.callHistory}>
              <CallHistory />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value={APP_ROUTES.scheduledCalls}>
              <ScheduledCalls />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  );
};

export default CallSchedule;
