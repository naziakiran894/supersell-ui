import { Grid, Box, Button, Typography, MenuItem } from "@mui/material";

import { initalDayCalls } from "..";
import DayCallSmsCard from "./DayCallSmsCard";
import { IFollowUpSetting } from "../../../store/types/teamSettings.types";
import { useMemo } from "react";
import Translations from "../../../@core/layouts/Translations";

type IProps = {
  leadCallDay: IFollowUpSetting[];
  setLeadCallDays: React.Dispatch<React.SetStateAction<IFollowUpSetting[]>>;
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SpecialFollowUpSettings = ({ setLeadCallDays, leadCallDay }: IProps) => {
  const handleAddDay = () => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray.push({ ...initalDayCalls, day: days[newArray.length] });
    setLeadCallDays(newArray);
  };

  const DayOptions = useMemo(() => {
    return days.map((ele, i) => (
      <MenuItem key={i} value={ele}>
        {ele}
      </MenuItem>
    ));
  }, []);

  return (
    <>
      <Grid container my={5}>
        <Typography variant="h6" fontWeight="700">
          <Translations
            text={"Special followup rules which override normal followup rules"}
          />
        </Typography>
        {leadCallDay?.map((values, index) => {
          return (
            <DayCallSmsCard
              key={index}
              values={values}
              setLeadCallDays={setLeadCallDays}
              leadCallDay={leadCallDay}
              currentIndex={index}
              SelectDaysOption={DayOptions}
            />
          );
        })}
        <br />
      </Grid>
      <Box>
        {" "}
        <Button
          onClick={() => handleAddDay()}
          variant="contained"
          sx={{ m: 5 }}
        >
          {leadCallDay.length > 0 ? (
            <Translations text={"ADD DAY"} />
          ) : (
            <Translations text={"ADD FOLLOWUP RULE"} />
          )}
        </Button>
      </Box>
    </>
  );
};

export default SpecialFollowUpSettings;
