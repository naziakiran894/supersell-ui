import React from "react";
import {
  Grid,
  FormControl,
  Typography,
  Card,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  useGetAllTeamsQuery,
  useGetAllNumbersQuery,
  useGetUsersListQuery,
} from "../../../../store/services";
import { ITeamList } from "../../../../store/types/team.types";
import { IUserList } from "../../../../store/types/user.types";
import PickersRange from "../../../../@core/components/RangeDatePicker";
import { DateType } from "../../../../@core/components/types/forms/reactDatepickerTypes";
import { useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

interface IProps {
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  startDateRange: DateType;
  setStartDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  endDateRange: DateType;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateType>>;
}

const TableFilters = ({
  teamName,
  setTeamName,
  setUserName,
  userName,
  setNumber,
  number,
  startDateRange,
  setStartDateRange,
  setEndDateRange,
  endDateRange,
}: IProps) => {
  const { data } = useGetAllTeamsQuery("");
  const { data: apiData } = useGetUsersListQuery("");
  const { data: list } = useGetAllNumbersQuery("");

  //@ts-ignore
  const teams: ITeamList[] = data?.data;
  //@ts-ignore
  const users: IUserList[] = apiData?.data;
  //@ts-ignore
  const numberList: any = list?.data;

  const { t } = useTranslation();

  return (
    <Card sx={{ display: "flex", flexDirection: "column", p: 5, mb: 6 }}>
      <Typography variant="h6" color="text.primary">
        <Translations text="Filters" />
      </Typography>
      <Grid container spacing={5} mt={5}>
        <Grid item md={3} sm={6} xs={12}>
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
        <Grid item md={3} sm={6} xs={12}>
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
                  name="Select User"
                  {...params}
                  label={t("Select User")}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-outlined-label">
              <Translations text="Select Number" />
            </InputLabel>
            <Select
              label={t("Select Number")}
              id="demo-simple-select-outlined"
              labelId="demo-simple-select-outlined-label"
              value={number}
              onChange={(e) => setNumber(e.target.value as string)}
            >
              <MenuItem value="">
                {" "}
                <Translations text="None" />
              </MenuItem>
              {numberList?.map((item: any, index: number) => (
                <MenuItem key={index} value={item._id}>
                  <Translations text={item.number} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <PickersRange
            startDateRange={startDateRange}
            setStartDateRange={setStartDateRange}
            setEndDateRange={setEndDateRange}
            endDateRange={endDateRange}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default TableFilters;
