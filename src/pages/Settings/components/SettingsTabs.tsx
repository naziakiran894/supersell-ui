import { SyntheticEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Tab, Typography, CircularProgress } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import Icon from "../../../@core/components/icon";

import Account from "./account/Account";
import ScheduleTable from "./schedule";
import DaysOff from "./daysofff/components/DayOffTable";
import APP_ROUTES from "../../../Routes/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { userTypes } from "../../../store/types/globalTypes";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

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

const Tabs: React.FC<Props> = ({ tab }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<string>(tab);
  const navigate = useNavigate();
  const permissions: any = useSelector(
    (state: RootState) => state?.permissions.Permissions
  );

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value);
  };

  const { t } = useTranslation();
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
        {((permissions !== null && permissions["Control their own schedule"]) ||
          user?.loginAsClient) && (
          <Tab
            value={APP_ROUTES.schedule}
            onClick={() => handleNavigate(APP_ROUTES.schedule)}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 2 },
                }}
              >
                <Icon fontSize={20} icon="mdi:access-time" />
                {t("MY SCHEDULE")}
              </Box>
            }
          />
        )}
        <Tab
          value={APP_ROUTES.dayOff}
          onClick={() => handleNavigate(APP_ROUTES.dayOff)}
          label={
            <Box
              sx={{ display: "flex", alignItems: "center", "& svg": { mr: 2 } }}
            >
              <Icon fontSize={20} icon="mdi:do-not-disturb-alt" />
              {t("DAYS OFF")}
            </Box>
          }
        />
        <Tab
          value={APP_ROUTES.account}
          onClick={() => handleNavigate(APP_ROUTES.account)}
          label={
            <Box
              sx={{ display: "flex", alignItems: "center", "& svg": { mr: 2 } }}
            >
              <Icon fontSize={20} icon="mdi:account-outline" />
              {t("ACCOUNT")}
            </Box>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        <TabPanel sx={{ p: 0 }} value={APP_ROUTES.account}>
          <Account />
        </TabPanel>
        {((permissions !== null && permissions["Control their own schedule"]) ||
          user?.loginAsClient) && (
          <TabPanel sx={{ p: 0 }} value={APP_ROUTES.schedule}>
            <ScheduleTable />
          </TabPanel>
        )}

        <TabPanel sx={{ p: 0 }} value={APP_ROUTES.dayOff}>
          <DaysOff />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default Tabs;
