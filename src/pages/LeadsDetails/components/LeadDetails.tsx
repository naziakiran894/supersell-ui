import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Box,
  Container,
  Tab,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";

import { useParams } from "react-router-dom";

import { TabPanel, TabContext } from "@mui/lab";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { styled } from "@mui/material/styles";
import Icon from "../../../@core/components/icon";
import ScheduleCall from "./ScheduleCall/ScheduleCall";
import AddMeeting from "./AddMeeting";
import Overview from "./Overview/Overview";
import { useGetLeadDetailsByIdQuery } from "../../../store/services/index";
import { useSnackbar } from "notistack";
import { ILead } from "../../../store/types/lead.types";
import PageLoader from "../../../@core/components/loader/PageLoader";
import SideCards from "./SideCards";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { currentTab } from "../../../store/slices/editScheduleSlice";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

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

const LeadDetails = () => {
  const { leadId } = useParams();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState("overview");
  const editSchedule = useSelector((state: RootState) => state.currentTab.tab);

  const { data, isLoading, error, refetch } =
    useGetLeadDetailsByIdQuery(leadId);

  //@ts-ignore
  const leadDetails: ILead = data?.data[0];

  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(<Translations text="Error fetching data!" />, {
        variant: "error",
      });
    }
  }, [error]);

  let queryParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const showSchedule = queryParams.get("showSchedule");
    if (showSchedule) {
      setActiveTab("schedule");
    }
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (editSchedule && editSchedule !== activeTab) {
      setActiveTab(editSchedule);
    }
  }, [editSchedule]);

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value);
    dispatch(currentTab(value));
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Container maxWidth="xl">
      <Header leadDetails={leadDetails} />
      <TabContext value={activeTab}>
        <TabList
          sx={{ m: 3 }}
          variant="scrollable"
          scrollButtons="auto"
          value={activeTab}
          onChange={handleChange}
          aria-label="forced scroll tabs example"
        >
          {tabs.map((e, index: number) => {
            return (
              <Tab
                key={index}
                value={e.value}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& svg": { mr: 2 },
                    }}
                  >
                    <Icon fontSize={20} icon={e.icon} />
                    <Translations text={e.key} />{" "}
                  </Box>
                }
              />
            );
          })}
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
              <Grid container>
                <Grid item sm={4} xs={12}>
                  <SideCards leadDetails={leadDetails} />
                </Grid>
                <Grid item sm={8} xs={12}>
                  <TabPanel sx={{ ml: 5, p: 0 }} value="overview">
                    <Overview leadDetails={leadDetails} />
                  </TabPanel>
                  <TabPanel sx={{ ml: 5, p: 0 }} value="schedule">
                    <ScheduleCall />
                  </TabPanel>

                  <TabPanel sx={{ p: 0 }} value="meeting">
                    <AddMeeting leadDetails={leadDetails} />
                  </TabPanel>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </TabContext>
    </Container>
  );
};

export default LeadDetails;

const tabs = [
  {
    key: "OVERVIEW",
    value: "overview",
    icon: "mdi:account-outline",
  },
  {
    key: "ADD MEETING",
    value: "meeting",
    icon: "mdi:access-time",
  },
  {
    key: "SCHEDULE CALL",
    value: "schedule",
    icon: "mdi:account-outline",
  },
];
