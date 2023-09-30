import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import { useGetAllTeamsQuery } from "../../store/services";
import { ITeamList } from "../../store/types/team.types";
import TeamScheduleTable from "./components/ScheduleTable";
import { useParams } from "react-router-dom";

import { useGetTeamScheduleQuery } from "../../store/services";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
const TeamSchedule = () => {
  const [teamName, setTeamName] = useState("");
  const { teamId } = useParams();
  const { data: teamdata } = useGetAllTeamsQuery("");
  const { t } = useTranslation();
  const { isFetching, data, refetch } = useGetTeamScheduleQuery(teamId);

  useEffect(() => {
    refetch();
  }, []);
  //@ts-ignore
  const teams: ITeamList[] = teamdata?.data;

  //@ts-ignore
  const schedule = data?.data;
  //@ts-ignore
  const team = data?.data?.team;

  return (
    <Grid container display="flex" flexDirection="column">
      <Grid item xs={12} display="flex" flexDirection="column" gap={4}>
        <Typography variant="h4">
          {" "}
          <Translations text="Team Schedule" />
        </Typography>
        <Typography variant="h5" sx={{ color: " gray" }}>
          {team?.teamName || ""}
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-outlined-label">
            <Translations text={"Use same settings as team"} />
          </InputLabel>
          <Select
            label={t("Use same settings as team")}
            id="demo-simple-select-outlined"
            labelId="demo-simple-select-outlined-label"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value as string)}
            sx={{ maxWidth: "400px" }}
          >
            <MenuItem value="">None</MenuItem>
            {teams?.map((item, index) => (
              <MenuItem key={index} value={item._id}>
                {item.teamName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TeamScheduleTable schedule={schedule} isLoading={isFetching} />
      </Grid>
    </Grid>
  );
};

export default TeamSchedule;
