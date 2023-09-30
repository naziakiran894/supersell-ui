import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, {
  AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ITimezone } from "../../../store/types/timezone.types";

interface IProps {
  value: ITimezone | null;
  onChange: any;
}

export default function TimeZonesAutoComplete({ value, onChange }: IProps) {
  const timeZones = useSelector(
    (state: RootState) => state?.timeZones?.timezone
  );

  return (
    <Autocomplete
      id="combo-box-demo"
      value={value}
      onChange={onChange}
      options={timeZones || []}
      getOptionLabel={(option) => {
        return ` ${option.countryName}-${option.timezone}`;
      }}
      renderInput={(params) => <TextField {...params} label="Time Zones" />}
    />
  );
}
