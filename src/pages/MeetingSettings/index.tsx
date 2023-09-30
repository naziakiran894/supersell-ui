import { useEffect, useState, useRef } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";

import MeetingSettings from "./MeetingSettings";
import PageLoader from "../../@core/components/loader/PageLoader";

import { useGetMeetingSettingQuery } from "../../store/services";

import {
  IMeetingSettingRes,
  IMeetingSettingsApiData,
} from "../../store/types/meetingSettings.types";

import Translations from "../../@core/layouts/Translations";

const index = () => {
  const [meetings, setMeetings] = useState<IMeetingSettingsApiData[]>([]);

  const { data, isSuccess, isFetching, refetch } =
    useGetMeetingSettingQuery("");
  //@ts-ignore
  const meetingSettings: IMeetingSettingRes = data?.data;
  const newMeetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (meetingSettings?.meetings) {
      setMeetings(meetingSettings?.meetings);
    }
  }, [meetingSettings?.meetings]);

  const handleAddNewMeeting = () => {
    const newArray = [...meetings];
    // @ts-ignore
    newArray.push({ dummy: "" });
    setMeetings(newArray);
  };

  useEffect(() => {
    if (newMeetingRef.current) {
      newMeetingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [meetings]);

  useEffect(() => {
    refetch();
  }, []);

  if (isFetching) {
    return <PageLoader />;
  }

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column" }}>
      <Grid item my={5}>
        <Typography variant="h5">
          <Translations text="Meeting Settings" />
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "14px", color: "#3A3541" }}
        >
          {meetingSettings?.company}
        </Typography>
      </Grid>
      <Grid item sx={{ alignSelf: "end", my: "20px" }}>
        <Button onClick={handleAddNewMeeting} variant="contained">
          <Translations text="ADD NEW MEETING" />
        </Button>
      </Grid>
      <Grid item>
        {meetings?.map((data: IMeetingSettingsApiData, index: number) => {
          return (
            <Box
              key={index}
              my={5}
              ref={index === meetings.length - 1 ? newMeetingRef : null}
            >
              <MeetingSettings
                meetings={meetings}
                setMeetings={setMeetings}
                meetingSettings={data}
                currentIndex={index}
              />
            </Box>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default index;
