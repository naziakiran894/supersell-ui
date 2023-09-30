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
import PickersRange from "../../../@core/components/RangeDatePicker";

import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  setStartDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  startDateRange: DateType;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  endDateRange: DateType;
}

const MeetingsFilters = ({
  setEndDateRange,
  endDateRange,
  startDateRange,
  setStartDateRange,
}: IProps) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title=" Filters" />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-outlined-label">
                  <Translations text={"Select Status"} />
                </InputLabel>
                <Select
                  label="Select Team"
                  defaultValue=""
                  id="demo-simple-select-outlined"
                  labelId="demo-simple-select-outlined-label"
                >
                  <MenuItem value={1}>Finnish</MenuItem>
                  <MenuItem value={2}>English</MenuItem>
                  {/* <MenuItem value={3}>French</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
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
