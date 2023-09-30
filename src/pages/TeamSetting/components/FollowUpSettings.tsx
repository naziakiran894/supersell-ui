import { useMemo } from "react";
import { Grid, Box, Button, MenuItem } from "@mui/material";
import { initalDayCalls } from "..";
import DayCallSmsCard from "./DayCallSmsCard";
import { IFollowUpSetting } from "../../../store/types/teamSettings.types";
import Translations from "../../../@core/layouts/Translations";

type IProps = {
  leadCallDay: IFollowUpSetting[];
  setLeadCallDays: React.Dispatch<React.SetStateAction<IFollowUpSetting[]>>;
};

const DayOne = ({ setLeadCallDays, leadCallDay }: IProps) => {
  const handleAddDay = () => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray.push({ ...initalDayCalls, day: newArray.length + 1});
    setLeadCallDays(newArray);
  };

  return (
    <Grid container>
      {leadCallDay?.map((values, index) => {
        return (
          <DayCallSmsCard
            key={index}
            values={values}
            setLeadCallDays={setLeadCallDays}
            leadCallDay={leadCallDay}
            currentIndex={index}
          />
        );
      })}

      <Box>
        {" "}
        <Button
          onClick={() => handleAddDay()}
          variant="contained"
          sx={{ m: 5 }}
        >
          <Translations text={"ADD DAY"} />
        </Button>
      </Box>
    </Grid>
  );
};

export default DayOne;
