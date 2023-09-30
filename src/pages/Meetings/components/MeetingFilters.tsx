import {
  Grid,
  FormControl,
  Card,
  InputLabel,
  Select,
  MenuItem,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete, {
  AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import { useGetMeetingFilterQuery } from "../../../store/services/index";
import { meetingList } from "../../../store/types/meeting.types";
import {
  useGetAllTeamsQuery,
  useGetUsersListQuery,
} from "../../../store/services";
import PickersRange from "../../../@core/components/RangeDatePicker";
import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";
import { useTranslation } from "react-i18next";

interface IProps {
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setStartDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  startDateRange: DateType;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  endDateRange: DateType;
}
interface IProps {
  meeting: string;
  setMeeting: React.Dispatch<React.SetStateAction<string>>;
}

const MeetingsFilters = ({
  meeting,
  setMeeting,
  teamName,
  setTeamName,
  userName,
  setUserName,
  setStartDateRange,
  startDateRange,
  setEndDateRange,
  endDateRange,
}: IProps) => {
  const { data, isLoading, error } = useGetMeetingFilterQuery("");

  const { data: teamData } = useGetAllTeamsQuery("");
  const { data: apiData } = useGetUsersListQuery("");

  //@ts-ignore
  const teams: ITeamList[] = teamData?.data;
  //@ts-ignore
  const users: IUserList[] = apiData?.data;
  //@ts-ignore
  const meetings: meetingList[] = data?.data?.meetings;

  // const {
  //   data: leads,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useGetLeadDetailsByIdQuery(leadId);

  //@ts-ignore
  const leadDetails: ILead = data?.data[0];
  const { t } = useTranslation();

  return (
    <Grid item xs={12} sx={{ mb: "2rem" }}>
      <Card>
        <CardHeader title={t(" Filters")} />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item sm={3} xs={12}>
              {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Team
                </InputLabel>
                <Select
                  label="Select Team"
                  id="demo-simple-select-outlined"
                  labelId="demo-simple-select-outlined-label"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value as string)}
                >
                  <MenuItem value="">None</MenuItem>
                  {teams?.map((item, index) => (
                    <MenuItem key={index} value={item._id}>
                      {item.teamName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <FormControl fullWidth>
                <Autocomplete
                  value={teams?.find((item) => item?._id === teamName) || null}
                  onChange={(e, value) => {
                    setTeamName(value?._id || "");
                  }}
                  options={teams || []}
                  getOptionLabel={(option) => option?.teamName}
                  renderInput={(params) => (
                    <TextField
                      name="Select Team"
                      {...params}
                      label={t("Select Team")}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  value={users?.find((item) => item?._id === userName) || null}
                  onChange={(e, value) => {
                    setUserName(value?._id || "");
                  }}
                  options={users || []}
                  getOptionLabel={(option) => option?.firstName || ""}
                  renderInput={(params) => (
                    <TextField
                      name="Select Owner"
                      {...params}
                      label={t("Select Owner")}
                    />
                  )}
                />
              </FormControl>
              {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-outlined-label">
                  Select User
                </InputLabel>
                <Select
                  label="Select Owner"
                  defaultValue=""
                  id="demo-simple-select-outlined"
                  labelId="demo-simple-select-outlined-label"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value as string)}
                >
                  <MenuItem value="">None</MenuItem>
                  {users?.map((item, index) => (
                    <MenuItem key={index} value={item?._id}>
                      {item?.firstName} {item?.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </Grid>
            <Grid item sm={3} xs={12}>
              {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Meeting
                </InputLabel>
                <Select
                  label="Select Meeting"
                  defaultValue=""
                  id="demo-simple-select-outlined"
                  labelId="demo-simple-select-outlined-label"
                  value={meeting}
                  onChange={(e) => setMeeting(e.target.value as string)}
                >
                  {meetings?.map((item: meetingList, index: number) => (
                    <MenuItem key={index} value={item._id}>
                      {item.meetingBasicInfo.meetingTitle}
                     
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <FormControl fullWidth>
                <Autocomplete
                  value={
                    meetings?.find((item) => item?._id === meeting) || null
                  }
                  onChange={(e, value) => {
                    setMeeting(value?._id || "");
                  }}
                  options={meetings || []}
                  getOptionLabel={(option) =>
                    option?.meetingBasicInfo?.meetingTitle
                  }
                  renderInput={(params) => (
                    <TextField
                      name="Select Meeting"
                      {...params}
                      label={t("Select Meeting")}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item sm={3} xs={12}>
              <PickersRange
                startDateRange={startDateRange}
                setStartDateRange={setStartDateRange}
                setEndDateRange={setEndDateRange}
                endDateRange={endDateRange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </Grid>
  );
};

export default MeetingsFilters;
