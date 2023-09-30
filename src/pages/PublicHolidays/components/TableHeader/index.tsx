import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  CardHeader,
  TextField,
  Autocomplete,
} from "@mui/material";
import { ITimezone } from "../../../../store/types/timezone.types";
import { useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
}
interface IProps {
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
}

const TableHeader = ({ year, setYear, setCountry, country }: IProps) => {
  const timezoneList = useSelector(
    (state: RootState) => state.timeZones.timezone
  );
  const { t } = useTranslation();

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i.toString());
    }

    return years;
  }

  return (
    <>
      <CardHeader title={t("Filters")} />
      <Box
        sx={{
          pb: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ padding: "15px", width: "55%", maxWidth: "400px" }}>
          <FormControl fullWidth>
            <InputLabel id="Year">
              <Translations text="Select Year" />
            </InputLabel>
            <Select
              fullWidth
              label={t("Select Year")}
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
              }}
              id="Year"
            >
              <MenuItem value="">
                <Translations text="None" />
              </MenuItem>
              {generateYearOptions().map((option) => (
                <MenuItem key={option} value={option}>
                  <Translations text={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ padding: "15px", width: "55%", maxWidth: "400px" }}>
          <FormControl fullWidth>
            <Autocomplete
              options={timezoneList || []}
              getOptionLabel={(option) => option?.countryName}
              value={
                timezoneList?.find((item) => item?._id === country) || null
              }
              onChange={(e, value) => {
                setCountry(value?._id || "");
              }}
              renderInput={(params) => (
                <TextField {...params} label={t("Country")} fullWidth />
              )}
            />
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default TableHeader;
