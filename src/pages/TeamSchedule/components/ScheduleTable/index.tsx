import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { CircularProgress, FormControlLabel, Switch } from "@mui/material";
import Button from "@mui/material/Button";
import Translations from "../../../../@core/layouts/Translations";
import { useSnackbar } from "notistack";

import {
  useGetTeamScheduleQuery,
  useUpdateDoNotDisturbStatusMutation,
  useUpdateDoNotDisturbTeamStatusMutation,
  useUpdateTeamScheduleMutation,
} from "../../../../store/services";
import TeamScheduleTable, { ITableData } from "./TeamScheduleTable";
import PageHeader from "../../../../@core/page-header";
import { RootState } from "../../../../store";
import { Trans, useTranslation } from "react-i18next";

export const weekDays: { [day: string]: string } = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const initialTableData: ITableData[] = Object.entries(weekDays).map(
  ([key, value]: [string, any]) => ({
    day: weekDays[key],
    onCall: false,
    availability: [
      {
        startTime: "0",
        endTime: "",
      },
    ],
  })
);

interface IProps {
  schedule: any;
  isLoading: boolean;
}

const ScheduleTable: React.FC<IProps> = ({ schedule, isLoading }) => {
  const { teamId } = useParams();

  const [tableData, setTableData] = useState(initialTableData);
  const [doNotDisturbStatus, setDoNotDisturbStatus] = useState(false);

  const [updateSchedule, { isLoading: isUpdating, isSuccess, error }] =
    useUpdateTeamScheduleMutation();

  const [handleUpdateStatus, { isSuccess: isUpdated, error: hasError }] =
    useUpdateDoNotDisturbTeamStatusMutation();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (schedule?.mon) {
      const days: any[] = [];
      let newSchedule = Object.assign({}, schedule);
      Object.entries(newSchedule).forEach(([key, value]: any) => {
        let day = weekDays[key];
        if (day) {
          days.push({
            day: day,
            onCall: value.active,
            availability: !value.allDay
              ? [...value.availability]
              : [{ startTime: "0", endTime: "" }],
          });
        }
      });

      setTableData([...days]);
    }
    setDoNotDisturbStatus(schedule?.team?.doNotDisturbStatus);
  }, [schedule]);

  useEffect(() => {
    if (isUpdated) {
      enqueueSnackbar(
        <Translations text="Do Not Disturb Status Updated Successfully" />,
        {
          variant: "success",
        }
      );
    } else if (hasError) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [hasError, isUpdated]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Schedule Updated Successfully" />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text="Something went wrong" />, {
        variant: "error",
      });
    }
  }, [isSuccess, error]);

  const handleUpdateTeamSchedule = async () => {
    const newData = [...tableData];
    const converted: any = {};
    newData.forEach((day) => {
      let dayCode = day.day.slice(0, 3).toLowerCase();
      let allDay = day.availability[0].startTime === "0";
      converted[dayCode] = {
        active: day?.onCall,
        allDay: allDay,
        availability: !allDay ? day.availability : [],
      };
    });
    if (teamId) {
      await updateSchedule({
        teamId: teamId,
        ...converted,
      });
    }
  };

  return (
    <Grid container display="flex" flexDirection="column">
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={6}>
          <PageHeader
            title={
              schedule?.user?.firstName && (
                <Typography variant="h5">
                  {schedule?.user?.firstName + " " + schedule?.user?.lastName ||
                    ""}
                </Typography>
              )
            }
          />
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => {
                  handleUpdateStatus({
                    id: teamId,
                    doNotDisturbStatus: e.target.checked,
                  });
                  setDoNotDisturbStatus(e.target.checked);
                }}
                checked={doNotDisturbStatus}
                sx={{ m: 1 }}
              />
            }
            label={t("DO NOT DISTURB")}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TeamScheduleTable
            isLoading={isLoading}
            setTableData={setTableData}
            tableData={tableData}
            col={col}
          />
        </Card>
      </Grid>
      <Grid item m={2}></Grid>
      <Grid m={2} display="flex" gap="5px">
        <Button
          disabled={isLoading}
          onClick={handleUpdateTeamSchedule}
          variant="contained"
          sx={{ width: "145px" }}
        >
          {isUpdating ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            <Translations text="SAVE CHANGES" />
          )}
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          <Translations text="Cancel" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default ScheduleTable;

const col = ["DAY", "ON CALL", "START TIME", "END TIME", "ACTIONS"];
